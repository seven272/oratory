import Course from '../models/Course.js'
import UserCourseProgress from '../models/UserCourseProgress.js'
import User from '../models/User.js'
import { checkAchievements } from '../utils/achievementService.js'

const getCourseProgress = async (req, res) => {
  try {
    const { courseCode } = req.params

    const userId = req.userId

    let progress = await UserCourseProgress.findOne({
      userId,
      courseCode,
    })

    // Если прогресса нет, возвращаем дефолтный статус "не начат", чтобы фронтенд показал кнопку "Начать курс"
    if (!progress) {
      return res
        .status(200)
        .json({ status: 'not_started', currentBlockIndex: -1 })
    }

    res.status(200).json({ status: 'active', progress })
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при получении прогресса курса',
      error: error.message,
    })
  }
}

const startCourse = async (req, res) => {
  try {
    const { courseCode } = req.body

    const userId = req.userId

    // Проверяем существование курса

    const course = await Course.findOne({
      courseCode: courseCode,
    })
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' })
    }

    // Проверяем, нет ли уже запущенного трека по этому курсу
    const existingProgress = await UserCourseProgress.findOne({
      userId,
      courseCode,
    })
    if (existingProgress) {
      return res.status(400).json({
        message: 'Курс уже начат или завершен',
        progress: existingProgress,
      })
    }

    // 3. Создаем новую запись прогресса
    const newProgress = new UserCourseProgress({
      userId,
      courseCode,
      currentBlockIndex: 0, // Стартуем с теории
      blocksProgress: {
        theory: { isCompleted: false },
        aiWorkout: { isCompleted: false, completedExercises: [] },
        irlChallenge: { isCompleted: false },
        exam: { isCompleted: false },
      },
    })

    await newProgress.save()

    res.status(201).json({
      message: 'Курс успешно начат',
      progress: newProgress,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при старте курса',
      error: error.message,
    })
  }
}

const submitTheory = async (req, res) => {
  try {
    const { courseCode, answerIndex } = req.body
    const userId = req.userId

    //  Ищем прогресс пользователя по курсу
    const progress = await UserCourseProgress.findOne({
      userId,
      courseCode,
    })
    if (!progress) {
      return res
        .status(404)
        .json({ message: 'Прогресс по данному курсу не найден' })
    }

    if (progress.currentBlockIndex !== 0) {
      return res
        .status(400)
        .json({ message: 'Вы уже прошли этот блок теории' })
    }

    //  Получаем данные квиза из модели курса
    const course = await Course.findOne({ courseCode })
    // Находим блок с типом theory (обычно он нулевой, но ищем надежно)
    const theoryBlock = course.blocks.find(
      (b) => b.blockType === 'theory',
    )

    if (
      !theoryBlock ||
      !theoryBlock.theoryData ||
      !theoryBlock.theoryData.quiz
    ) {
      return res.status(500).json({
        message: 'Данные квиза отсутствуют в структуре курса',
      })
    }

    // Валидация ответа
    const correctIndex =
      theoryBlock.theoryData.quiz.correctAnswerIndex
    if (Number(answerIndex) !== correctIndex) {
      return res.status(400).json({
        success: false,
        message:
          'Неверный ответ. Перечитайте теорию и попробуйте снова!',
      })
    }

    // 4. Обновляем статус блока и переводим на ИИ-тренажеры (индекс 1)
    progress.blocksProgress.theory.isCompleted = true
    progress.currentBlockIndex = 1

    await progress.save()

    res.status(200).json({
      success: true,
      message: 'Тест успешно пройден! Блок теории завершен.',
      progress,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при проверке теории',
      error: error.message,
    })
  }
}

const submitAiWorkout = async (req, res) => {
  try {
    const { courseCode } = req.params
    const { score } = req.body
    const userId = req.userId

    // 1. Параллельно ищем прогресс пользователя и сам курс
    const [progress, course] = await Promise.all([
      UserCourseProgress.findOne({ userId, courseCode }),
      Course.findOne({ courseCode }),
    ])

    if (!progress) {
      return res
        .status(404)
        .json({ message: 'Прогресс по данному интенсиву не найден' })
    }
    if (!course) {
      return res
        .status(404)
        .json({ message: 'Интенсив не найден в базе данных' })
    }

    // 2. Защита: проверяем, что пользователь на этапе ИИ-тренажера
    if (progress.currentBlockIndex !== 1) {
      return res.status(400).json({
        message:
          'Вы не можете пройти ИИ-тренажер на текущем этапе курса',
      })
    }

    // Находим конфигурацию ИИ-блока в модели курса
    const aiBlockConfig = course.blocks.find(
      (block) => block.blockType === 'ai_workout',
    )
    const requiredScore =
      aiBlockConfig?.aiWorkoutData?.requiredScore || 500 // 500 по дефолту

    // 3. Обновляем счетчик сессий и прибавляем набранные очки
    progress.blocksProgress.aiWorkout.sessionsCount += 1
    progress.blocksProgress.aiWorkout.accumulatedScore += score

    // 4. Проверяем, набрал ли пользователь нужную сумму (например, 500 баллов)
    if (
      progress.blocksProgress.aiWorkout.accumulatedScore >=
      requiredScore
    ) {
      // Условие выполнено: закрываем блок и двигаем индекс вперед на IRL-челлендж
      progress.blocksProgress.aiWorkout.isCompleted = true
      progress.currentBlockIndex = 2
    } else {
      // Очков не хватило: блок остается незавершенным, индекс не меняем (остается 1)
      progress.blocksProgress.aiWorkout.isCompleted = false
    }

    // Маркируем вложенное свойство для Mongoose, так как это Mixed/Object тип
    progress.markModified('blocksProgress.aiWorkout')

    // Сохраняем изменения в базе данных
    await progress.save()

    // 5. Возвращаем ответ в Redux
    return res.status(200).json({
      status: progress.status,
      currentBlockIndex: progress.currentBlockIndex,
      progressData: progress,
    })
  } catch (error) {
    console.error('Ошибка в submitAiWorkout:', error)
    return res.status(500).json({
      message:
        'Внутренняя ошибка сервера при фиксации результатов тренажера',
    })
  }
}

const handleCourseAiWorkoutTrigger = async (
  userId,
  exerciseCode,
  earnedScore,
) => {
  // 1. Ищем активный курс пользователя, который сейчас находится на этапе ИИ-тренажеров (индекс 1)
  const progress = await UserCourseProgress.findOne({
    userId,
    currentBlockIndex: 1,
    status: 'active',
  })

  // Если пользователь сейчас не проходит никакой курс на этом этапе, ничего не делаем
  if (!progress) return null

  // 2. Подтягиваем настройки этого курса, чтобы узнать требуемый балл и список доступных упражнений
  const course = await Course.findById(progress.courseId)
  const aiBlock = course.blocks.find(
    (b) =>
      b.blockType === 'exam' ||
      b.aiWorkoutData?.exercises.includes(exerciseCode),
  )
  // На всякий случай ищем блок именно с этим упражнением
  const currentAiBlockData =
    course.blocks[progress.currentBlockIndex].aiWorkoutData

  // Проверяем, входит ли пройденный тренажер в программу курса
  if (!currentAiBlockData.exercises.includes(exerciseCode)) {
    return null // Тренажер пройден вне программы текущего курса
  }

  // 3. Плюсуем баллы в прогресс курса
  progress.blocksProgress.aiWorkout.accumulatedScore += earnedScore
  progress.blocksProgress.aiWorkout.sessionsCount += 1

  // 4. Проверяем, пробит ли порог баллов
  if (
    progress.blocksProgress.aiWorkout.accumulatedScore >=
    currentAiBlockData.requiredScore
  ) {
    progress.blocksProgress.aiWorkout.isCompleted = true
    progress.currentBlockIndex = 2 // Автоматически переводим на Блок 3: IRL-практика!
  }

  await progress.save()
  return progress
}

const submitIrlReport = async (req, res) => {
  try {
    const { courseCode, textReport } = req.body
    const userId = req.userId

    if (!courseCode)
      return res.status(400).json({ message: 'Не указан код курса' })
    if (!textReport || textReport.trim().length < 20) {
      return res
        .status(400)
        .json({
          message: 'Отчет слишком короткий (минимум 20 символов).',
        })
    }

    const progress = await UserCourseProgress.findOne({
      userId,
      courseCode,
    })
    if (!progress)
      return res.status(404).json({ message: 'Прогресс не найден' })
    if (progress.currentBlockIndex < 2) {
      return res
        .status(400)
        .json({ message: 'Вы еще не дошли до IRL-челленджа.' })
    }

    // --- ИМИТАЦИЯ РАБОТЫ ИИ (GigaChat) ---
    // В будущем тут будет запрос к ИИ, который вернет скоринг или флаг одобрения
    const isReportValid =
      textReport.toLowerCase().includes('привет') === false // Пример: баним банальные приветствия

    let aiFeedback = ''
    let isCompleted = false
    let nextBlockIndex = 2 // По умолчанию оставляем на этом же шаге

    if (isReportValid) {
      aiFeedback =
        '🔥 Отличный отчет! Вы детально описали реакцию и сделали верные выводы. Доступ к экзамену открыт.'
      isCompleted = true
    } else {
      aiFeedback =
        '❌ ИИ не принял отчет. Кажется, вы использовали банальное приветствие или отчет не содержит описания реакции. Пожалуйста, перечитайте условия задания и попробуйте снова.'
      isCompleted = false
      nextBlockIndex = 2 // Провал -> оставляем переделывать
    }

    // Обновляем БД
    const updatedProgress = await UserCourseProgress.findOneAndUpdate(
      { userId, courseCode },
      {
        $set: {
          'blocksProgress.irlChallenge.textReport': textReport.trim(),
          'blocksProgress.irlChallenge.aiFeedback': aiFeedback,
          'blocksProgress.irlChallenge.isCompleted': isCompleted,
          currentBlockIndex: nextBlockIndex,
        },
      },
      { new: true },
    )

    return res.status(200).json({
      success: true,
      isReportValid, // Передаем флаг успеха на фронтенд для локальной логики
      progressData: updatedProgress,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Ошибка сервера при проверке отчета.' })
  }
}

const submitExamReport = async (req, res) => {
  try {
    const { courseCode, testMode } = req.body
    const userId = req.userId // Из checkAuth

    if (!courseCode)
      return res.status(400).json({ message: 'Не указан код курса' })

    // 1. Находим прогресс курса
    const progress = await UserCourseProgress.findOne({
      userId,
      courseCode,
    })
    if (!progress)
      return res.status(404).json({ message: 'Прогресс не найден' })

    const currentExamState = progress.blocksProgress.exam

    // 2. Проверка: не завершен ли уже курс (из-за успеха или исчерпания всех 5 попыток)
    if (
      progress.status === 'completed' ||
      currentExamState.attemptsCount >= 5
    ) {
      return res.status(400).json({
        message:
          'Обучение по этому курсу уже завершено. Попыток больше нет.',
      })
    }

    // 3. Проверка на активный таймаут (24 часа)
    if (
      currentExamState.lockedUntil &&
      new Date(currentExamState.lockedUntil) > new Date()
    ) {
      return res.status(423).json({
        message:
          'Экзамен заблокирован. Подождите 24 часа или разблокируйте за монеты.',
      })
    }

    // 4. Мокаем результат от ИИ
    let currentAttemptScore = testMode === 'pass' ? 92 : 64
    let mockAiFeedback =
      testMode === 'pass'
        ? '🔥 Великолепный питч! Экзамен успешно сдан!'
        : '❌ К сожалению, порог в 85 баллов не пройден. Попытка заблокирована.'

    // 5. Расчет новых параметров
    const newAttemptsCount = currentExamState.attemptsCount + 1
    const newBestScore =
      currentAttemptScore > currentExamState.bestScore
        ? currentAttemptScore
        : currentExamState.bestScore

    let isExamCompleted = currentExamState.isCompleted
    let overallCourseStatus = 'active'
    let newLockedUntil = null

    if (currentAttemptScore >= 85) {
      // СЦЕНАРИЙ А: СДАЛ (Баллы >= 85)
      isExamCompleted = true
      overallCourseStatus = 'completed'
    } else {
      // СЦЕНАРИЙ Б: НЕ СДАЛ (Баллы < 85)
      if (newAttemptsCount >= 5) {
        // Израсходованы все 5 попыток -> курс принудительно завершается, блокировок нет, пересдач больше нет
        overallCourseStatus = 'failed'
        mockAiFeedback +=
          ' Вы израсходовали все 5 попыток. Курс завершен.'
      } else {
        // Попытки еще есть -> включаем блокировку на 24 часа
        const lockDate = new Date()
        lockDate.setHours(lockDate.getHours() + 24)
        newLockedUntil = lockDate
      }
    }

    // 6. Обновляем базу данных
    const updatedProgress = await UserCourseProgress.findOneAndUpdate(
      { userId, courseCode },
      {
        $set: {
          status: overallCourseStatus,
          currentBlockIndex: 3,
          'blocksProgress.exam.isCompleted': isExamCompleted,
          'blocksProgress.exam.bestScore': newBestScore,
          'blocksProgress.exam.attemptsCount': newAttemptsCount,
          'blocksProgress.exam.lockedUntil': newLockedUntil,
          'blocksProgress.exam.aiFeedback': mockAiFeedback,
        },
      },
      { new: true },
    )

    return res.status(200).json({
      success: true,
      progressData: updatedProgress,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Ошибка сервера при обработке экзамена.' })
  }
}

const unlockExamWithCoins = async (req, res) => {
  try {
    const { courseCode } = req.body
    const userId = req.userId
    const coinPrice = 50 // Стоимость досрочной разблокировки в монетах

    // 1. Проверяем баланс пользователя
    const user = await User.findById(userId)
    if (!user)
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })

    if (user.coins < coinPrice) {
      return res
        .status(400)
        .json({ message: 'Недостаточно монет для покупки попытки.' })
    }

    // 2. Проверяем состояние прогресса курса
    const progress = await UserCourseProgress.findOne({
      userId,
      courseCode,
    })
    if (!progress)
      return res
        .status(404)
        .json({ message: 'Прогресс курса не найден' })

    const exam = progress.blocksProgress.exam

    // Проверяем, есть ли что разблокировать
    if (
      !exam.lockedUntil ||
      new Date(exam.lockedUntil) <= new Date()
    ) {
      return res
        .status(400)
        .json({ message: 'Экзамен не заблокирован.' })
    }

    if (exam.attemptsCount >= 5) {
      return res
        .status(400)
        .json({
          message:
            'Вы уже использовали максимум (5 попыток). Больше купить нельзя.',
        })
    }

    // 3. Списываем монеты у пользователя
    user.coins -= coinPrice
    await user.save()

    // 4. Сбрасываем блокировку в документе прогресса ($set в null)
    const updatedProgress = await UserCourseProgress.findOneAndUpdate(
      { userId, courseCode },
      {
        $set: {
          'blocksProgress.exam.lockedUntil': null,
          'blocksProgress.exam.aiFeedback': '', // Очищаем старый фидбек, чтобы вернуть форму рекордера
        },
      },
      { new: true },
    )

    return res.status(200).json({
      success: true,
      message: `Попытка успешно куплена! Списано ${coinPrice} монет.`,
      remainingCoins: user.coins,
      progressData: updatedProgress,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Ошибка при покупке попытки за монеты.' })
  }
}


const restartCourse = async (req, res) => {
  try {
    const { courseCode } = req.body
    const userId = req.userId

    const progress = await UserCourseProgress.findOne({ userId, courseCode })
    if (!progress) return res.status(404).json({ message: 'Прогресс не найден' })

    // Проверяем, что курс действительно завершен (успешно или неуспешно)
    if (progress.status === 'active') {
      return res.status(400).json({ message: 'Нельзя перезапустить активный курс' })
    }

    // 1. Формируем архивную запись из текущего состояния
    const archiveRecord = {
      status: progress.status,
      finishedAt: new Date(),
      blocksProgress: JSON.parse(JSON.stringify(progress.blocksProgress)) // глубокое копирование
    }

    // 2. Сбрасываем прогресс до дефолтных значений и пушим старый в history
    const updatedProgress = await UserCourseProgress.findOneAndUpdate(
      { userId, courseCode },
      {
        $set: {
          status: 'active',
          currentBlockIndex: 0,
          'blocksProgress.theory.isCompleted': false,
          'blocksProgress.aiWorkout': { isCompleted: false, accumulatedScore: 0, sessionsCount: 0 },
          'blocksProgress.irlChallenge': { isCompleted: false, textReport: '', aiFeedback: '' },
          'blocksProgress.exam': { isCompleted: false, bestScore: 0, attemptsCount: 0, lockedUntil: null, aiFeedback: '' }
        },
        $push: {
          history: archiveRecord // 💡 Сохраняем в историю
        }
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      progressData: updatedProgress
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ошибка при перезапуске курса' })
  }
}

 const getUserCoursesArchive = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Находим все курсы пользователя, где в массиве history есть хотя бы одна запись
    const archives = await UserCourseProgress.find(
      { userId, 'history.0': { $exists: true } },
      { courseCode: 1, history: 1 } // Берем только код курса и историю
    );

    return res.status(200).json({ success: true, archives });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка при получении архива.' });
  }
};


export {
  getCourseProgress,
  startCourse,
  submitTheory,
  submitAiWorkout,
  handleCourseAiWorkoutTrigger,
  submitIrlReport,
  submitExamReport,
  unlockExamWithCoins,
  restartCourse,
  getUserCoursesArchive
}
