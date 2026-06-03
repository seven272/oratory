import gigachatAxiosClient from '../../utils/gigachatAxiosClient.js'
import AiExercise from '../../models/AiExercise.js'
import User from '../../models/User.js'
import { applyAiGamificationProgress } from '../../utils/fnForControllers.js'

const startDebate = async (req, res) => {
  try {
    const userId = req.userId
    const { exerciseData } = req.body

    //  Формируем приветсвенное сообщение от ИИ
    let answer = `Тема "${exerciseData.topic}". Ваша позиция "${exerciseData.position}". Отлично. Я буду вашим оппонентом. \Жду ваших аргументов.`

    // Создаем сессию в БД
    await AiExercise.create({
      userId,
      exerciseType: 'debate',
      status: 'active', // Сессия сразу активна
      exerciseData,
      messages: [],
    })

    res.status(201).json({ answer })
  } catch (error) {
    console.error('Error in startExercise:', error)
    res.status(500).json({
      message: `Ошибка сервера при старте упражнения Дебаты`,
      error: error.message,
    })
  }
}

const generateDebateResponse = async (req, res) => {
  try {
    const { topic, position, userMessage } = req.body

    // Ищем сессию, созданную при старте дебатов
    let session = await AiExercise.findOne({
      userId: req.userId,
      status: 'active',
    }).sort({ createdAt: -1 })

    if (!session) {
      return res.status(400).json({
        message: 'Активная сессия не найдена. Начните сначала.',
      })
    }

    // Считаем, сколько раз пользователь УЖЕ что-то отправлял (любое сообщение)
    const attemptsCount = session.messages.filter(
      (m) => m.role === 'user',
    ).length
    const isLastAttempt = attemptsCount >= 2 // Если это 3-й раз

    // 2. Если ответ ПУСТОЙ
    if (!userMessage || userMessage.includes('нечего сказать')) {
      // СОХРАНЯЕМ пустую строку, чтобы зафиксировать ход в истории
      session.messages.push({
        role: 'user',
        text: 'Пользователь промолчал',
      })
      await session.save()

      return res.status(200).json({
        answer: 'Вы ничего не сказали. Ход засчитан как пропущенный.',
        isDebateFinished: isLastAttempt,
        isError: true,
      })
    }
    const PROMPT = `Ты — опытный и язвительный оппонент в дебатах на тему: "${topic}".
Пользователь утверждает: "${userMessage}".
Твоя задача: приведи ОДИН сильный контраргумент или задай провокационный вопрос. 
Ответ должен быть коротким (2-4 предложения), живым и без вступлений вроде "Как опытный оппонент..."`

    // 3. Отправляем в GigaChat
    const response = await gigachatAxiosClient.post(
      '/chat/completions',
      {
        model: 'GigaChat-2',
        messages: [{ role: 'user', content: PROMPT }],
        max_tokens: 300, // Увеличил, чтобы не обрывал фразы
      },
    )

    // Логируем для отладки, если данных нет
    if (!response.data || !response.data.choices) {
      console.log(
        'Неожиданный формат ответа:',
        JSON.stringify(response.data),
      )
    }

    const aiAnswer = response.data.choices[0].message.content
    // 3. Создаем объект для нового сообщения пользователя
    const newUserMessage = {
      role: 'user',
      text: userMessage,
    }
    // 4. Создаем объект для ответа ИИ
    const newAiMessage = {
      role: 'assistant',
      text: aiAnswer,
    }

    // 4. Сохраняем в БД оба сообщения
    session.messages.push(newUserMessage)
    session.messages.push(newAiMessage)

    await session.save()

    // 1. Создаем инструмент для паузы (в самом верху файла)
    const sleep = (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    // 2. Внутри контроллера используем его
    const randomDelay =
      Math.floor(Math.random() * (3000 - 1500 + 1)) + 1500

    await sleep(randomDelay) // Код просто подождет здесь

    res.json({
      answer: aiAnswer,
      isDebateFinished: isLastAttempt,
    })
  } catch (error) {
    console.error(
      'Ошибка при вызове GigaChat из sendUserResponse:',
      error.response?.data || error.message,
    )
    // Если API недоступен, возвращаем вежливое сообщение вместо краша
    const fallbackAnswer =
      'Извини, сейчас я немного задумался. Давай попробуем еще раз.'

    res.status(503).json({ answer: fallbackAnswer })
  }
}

const finishDebate = async (req, res) => {
  try {
    const userId = req.userId
    const { isDaily } = req.body

    // 1. Находим активную сессию
    const session = await AiExercise.findOne({
      userId,
      exerciseType: 'debate',
      status: 'active',
    }).sort({ createdAt: -1 })

    if (!session) {
      return res.status(404).json({ message: 'Сессия не найдена' })
    }

    // Загружаем документ пользователя
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })
    }

    // Считаем только "живые" сообщения
    const meaningfulMessages = session.messages.filter(
      (m) => m.role === 'user' && m.text !== 'Пользователь промолчал',
    )

    if (meaningfulMessages.length < 2) {
      // Возвращаем результат "без оценки" (как в прошлом сообщении)
      session.status = 'completed'
      session.score = 0
      session.result = {
        totalScore: 0,
        feedback:
          'Слишком много пустых ответов, оценить дискуссию не получится',
        criteria: {
          logic: 0,
          convincingness: 0,
          counterargumentation: 0,
        },
      }
      await session.save()

      return res.status(201).json({
        message: 'Упражнение завершено без оценки',
        session,
        earnedXp: 0,
        earnedCoins: 0,
        isLevelUp: false,
        newAchievements: [],
        stats: null, // Защита для profileSlice
      })
    }

    // 2. Формируем историю для анализа
    const chatHistory = session.messages
      .map(
        (m) =>
          `${m.role === 'user' ? 'Пользователь' : 'Оппонент'}: ${m.text}`,
      )
      .join('\n')

    const EVALUATION_PROMPT = `Проанализируй дебаты на тему: "${session.exerciseData.topic}".
    История диалога: ${chatHistory}

    Твоя задача: выступить в роли судьи. Оцени выступление Пользователя по следующим критериям:
    1. "Logic" (Логика): 0 — полное отсутсвие логики в ответе, 100 — последовательные структурированные ответы без эмоций с логическими доказательствами.
    2. "Convincingness" (Убедительность): 0 — уход от ответа или провал, 100 — сильные доводы построенные на фактах и статистике, примеры из практики.
    3. "Counterargumentation" (Контраргументация): 0 — ответы не по существу вопроса, никак не опровергает оппонета, общие рассуждения, 100 — в ответе есть анализ и подчеркнуты противоречия в аргументах собеседника.
    Верни строго JSON объект (без лишнего текста) со следующей структурой:
    {
      "totalScore": число от 1 до 100,
      "feedback": "текст общего фидбека на 2-3 предложения",
      "criteria": {
        "logic": <число 0-100>,
        "convincingness": <число 0-100>,
        "counterargumentation":<число 0-100>,
      }
    }`

    // 3. Запрос к GigaChat для оценки
    const response = await gigachatAxiosClient.post(
      '/chat/completions',
      {
        model: 'GigaChat-2',
        messages: [
          { role: 'system', content: EVALUATION_PROMPT },
          {
            role: 'user',
            content: `Проанализируй этот диалог:\n${chatHistory}`,
          },
        ],
        max_tokens: 700,
      },
    )

    const rawResult = response.data.choices[0].message.content
    // Пытаемся распарсить JSON (GigaChat иногда может добавить лишний текст, стоит подстраховаться)
    const jsonMatch = rawResult.match(/\{[\s\S]*\}/)
    const jsonString = jsonMatch ? jsonMatch[0] : rawResult
    const evaluation = JSON.parse(jsonString)
    // 4. Обновляем сессию в БД
    session.status = 'completed'
    session.score = evaluation.totalScore
    session.result = {
      totalScore: evaluation.totalScore,
      feedback: evaluation.feedback,
      criteria: evaluation.criteria, // Map в схеме подхватит этот объект
    }

    await session.save()

    // 6. Передаем управление общему движку геймификации.
    // Он САМ обновит user.stats.exerciseStats для 'ai-debate', что прокачает ветку "убедительность" в SKILLS_MAP!
    const gamificationResult = await applyAiGamificationProgress(
      user,
      evaluation.totalScore,
      'ai-debate',
      'Дебаты с ИИ',
      isDaily, // Передаем состояние квеста дня
    )

    res.status(200).json({
      message: 'Упражнение успешно сохранено',
      session,
      ...gamificationResult,
    })
  } catch (error) {
    console.error('Ошибка финализации:', error)
    res.status(500).json({ message: 'Не удалось завершить дебаты' })
  }
}

export { startDebate, generateDebateResponse, finishDebate }
