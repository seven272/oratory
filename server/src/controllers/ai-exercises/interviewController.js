import gigachatAxiosClient from '../../utils/gigachatAxiosClient.js'
import AiExercise from '../../models/AiExercise.js'
import User from '../../models/User.js'
import { applyAiGamificationProgress } from '../../utils/fnForControllers.js'

const startInterview = async (req, res) => {
  try {
    const userId = req.userId
    const { exerciseData } = req.body

    // Формируем приветсвенное сообщение от ИИ и первый вопрос
    const preview = `Я выступаю в роли ведущего. Тема нашего интервью "${exerciseData.topic}". Ваша роль "${exerciseData.role}". ${exerciseData.context} \И мой первый вопрос...`

    const question = `${exerciseData.firstQuestion}`

    // Создаем сессию в БД
    const newSession = await AiExercise.create({
      userId,
      exerciseType: 'interview',
      status: 'active',
      exerciseData,
      messages: [],
    })

    res.status(201).json({ preview, question })
  } catch (error) {
    console.error('Error in startExercise:', error)
    res.status(500).json({
      message: `Ошибка сервера при старте упражнения Интервью`,
      error: error.message,
    })
  }
}

const generateInterviewResponse = async (req, res) => {
  try {
    const { interviewData, userMessage } = req.body

    // Ищем сессию, созданную при старте дебатов
    let session = await AiExercise.findOne({
      userId: req.userId,
      exerciseType: 'interview',
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
        isInterviewFinished: isLastAttempt,
        isError: true,
      })
    }
    const PROMPT = `Ты — опытный и язвительный ведущий. Берешь интервью у ${interviewData.role} на тему "${interviewData.topic}". Стало известно, что  ${interviewData.context}.
    Пользователь утверждает: "${userMessage}".
    Твоя задача: задай ОДИН провокационный вопрос.
    Вопрос должен быть коротким (2-4 предложения), острым, по теме."`

    // 3. Отправляем в GigaChat
    const response = await gigachatAxiosClient.post(
      '/chat/completions',
      {
        model: 'GigaChat-2',
        messages: [{ role: 'user', content: PROMPT }],
        max_tokens: 300,
      },
    )

    // Логируем для отладки, если данных нет
    if (!response.data || !response.data.choices) {
      console.log(
        'Неожиданный формат ответа:',
        JSON.stringify(response.data),
      )
    }
    // console.log(
    //   'Ответ от GigaChat получен:',
    //   response.data.choices[0].message.content,
    // )

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
      isInterviewFinished: isLastAttempt,
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

const finishInterview = async (req, res) => {
  try {
    const userId = req.userId
    const { isDaily } = req.body

    // 1. Находим активную сессию
    const session = await AiExercise.findOne({
      userId,
      exerciseType: 'interview',
      status: 'active',
    }).sort({ createdAt: -1 })

    if (!session) {
      return res.status(404).json({ message: 'Сессия не найдена' })
    }

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
          toxicity: 0,
          diplomacy: 0,
        },
      }
      await session.save()

      return res.status(200).json({
        message: 'Упражнение завершено без оценки',
        session,
        earnedXp: 0,
        earnedCoins: 0,
        isLevelUp: false,
        newAchievements: [],
        daily_task_update: null,
        stats: null,
      })
    }

    // 2. Формируем историю для анализа
    const chatHistory = session.messages
      .map(
        (m) =>
          `${m.role === 'user' ? 'Пользователь' : 'Ведущий'}: ${m.text}`,
      )
      .join('\n')

    const EVALUATION_PROMPT = `Ты — профессиональный эксперт по антикризисным коммуникациям и психолог-конфликтолог. 
Твоя задача: проанализировать диалог между "Провокационным журналистом" и "Пользователем".

Оцени ответы Пользователя по следующим критериям:
1. "Токсичность" (toxicity): 0 — полное спокойствие, 100 — переход на личности, крик, агрессия.
2. "Дипломатичность" (diplomacy): 0 — уход от ответа или провал, 100 — мастерское владение ситуацией, сохранение лица, четкая аргументация.

Верни ответ СТРОГО в формате JSON без лишнего текста:
{
  "totalScore": <средний балл от 0 до 100>,
  "feedback": "<краткий конструктивный совет на 2-3 предложения>",
  "criteria": {
    "toxicity": <число 0-100>,
    "diplomacy": <число 0-100>
  }
}

Важные правила анализа:
- Если пользователь оправдывается — это снижает дипломатичность.
- Если пользователь встречно атакует журналиста — это повышает токсичность.
- Если пользователь сохраняет иронию и отвечает по существу — это идеальный результат.`

    // 3. Запрос к GigaChat для оценки
    const response = await gigachatAxiosClient.post(
      '/chat/completions',
      {
        model: 'GigaChat-2',
        messages: [
          { role: 'system', content: EVALUATION_PROMPT }, // Тот самый промпт выше
          {
            role: 'user',
            content: `Проанализируй этот диалог:\n${chatHistory}`,
          }, // История диалога
        ],
        max_tokens: 700,
      },
    )

    // Безопасный каскадный парсинг JSON с защитой от крашей сервера
    let evaluation
    try {
      let rawResult = response.data.choices[0].message.content
      rawResult = rawResult
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : rawResult
      evaluation = JSON.parse(jsonString)
    } catch (parseError) {
      console.error(
        'Ошибка парсинга JSON в Интервью:',
        parseError.message,
      )
      evaluation = {
        totalScore: 50,
        feedback:
          'Не удалось разобрать подробную аналитику ИИ из-за сбоя формата, начислены базовые баллы.',
        criteria: { toxicity: 30, diplomacy: 50 },
      }
    }

    // 4. Обновляем сессию в БД
    session.status = 'completed'
    session.score = evaluation.totalScore
    session.result = {
      totalScore: evaluation.totalScore,
      feedback: evaluation.feedback,
      criteria: evaluation.criteria, // Map в схеме подхватит этот объект
    }

    await session.save()

    // 5. Запуск сквозной геймификации, стриков и наград.
    // Передаем точный алиас с опечаткой 'ai-inrerview' для 100% совпадения со SKILLS_MAP!
    // Движок сам положит очки в exerciseStats, что динамически прокачает ветку "коммуникация"
    const gamificationResult = await applyAiGamificationProgress(
      user,
      evaluation.totalScore,
      'ai-inrerview',
      'Интервью с ИИ',
      isDaily,
    )

    // 6. Отдаем клиенту синхронизированный ответ для Redux
    res.status(200).json({
      message: 'Упражнение успешно сохранено',
      session,
      ...gamificationResult,
    })
  } catch (error) {
    console.error('Ошибка финализации:', error)
    res.status(500).json({ message: 'Не удалось завершить упражнение Интервью' })
  }
}

export { startInterview, generateInterviewResponse, finishInterview }
