import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

import User from '../models/User.js'
import createToken from '../utils/createToken.js'
import { SKILLS_MAP } from '../constants/skills.js'
import { getXpThreshold } from '../utils/fnForControllers.js'

dotenv.config()

// Регистрация пользователя
const register = async (req, res) => {
  // Простой список вопросов для проверки
  const BOT_PROTECTION = [
    {
      question: 'Сколько гласных букв в слове "Голос"?',
      answer: '2',
    },
    {
      question:
        'Противоположность слову "Громко" (наречие, 4 буквы)?',
      answer: 'тихо',
    },
    { question: '2 + 3 * 3 = ?', answer: '11' },
  ]

  const { email, password, displayName, botAnswer, questionIndex } =
    req.body

  //  Защита от ботов
  const check = BOT_PROTECTION[questionIndex]
  if (
    !check ||
    botAnswer?.toString().toLowerCase().trim() !== check.answer
  ) {
    return res.status(403).json({
      message:
        'Защита от ботов: неверный ответ на проверочный вопрос.',
    })
  }

  try {
    // Проверка по email (ключевое поле для этого типа входа)
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(402).json({
        message: 'Пользователь с таким email уже существует',
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const newUser = await User.create({
      email,
      displayName: displayName || email.split('@')[0], // Дефолтное имя из email
      password: hashedPassword,
      // Остальные поля (progression, streak) создадутся по дефолту из схемы
    })

    createToken(res, newUser._id)

    // Не отправляем пароль на фронтенд
    const userResponse = newUser.toObject()
    delete userResponse.password

    res.json({
      user: userResponse,
      message: 'Регистрация прошла успешно',
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Ошибка при регистрации пользователя' })
  }
}
// Вход пользователя
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Ищем по email
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })
    }

    // Проверяем наличие пароля (на случай, если аккаунт создан через ВК без пароля)
    if (!user.password) {
      return res.status(400).json({
        message:
          'Для этого аккаунта не установлен пароль. Войдите через соцсети',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Неверный пароль' })
    }

    createToken(res, user._id)

    // Удаляем пароль из объекта перед отправкой
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      user: userResponse,
      message: 'Вы вошли в систему',
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Ошибка сервера при авторизации' })
  }
}
const logout = async (req, res) => {
  // Название куки должно совпадать с тем, что в createToken
  res.cookie('jwt-oratory', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  return res.status(201).json({ message: 'Вы вышли из системы' })
}
//get me
const getMe = async (req, res) => {
  try {
    // Пароль вообще не достаем из базы
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Нет доступа' })
  }
}

const getUserProfile = async (req, res) => {
  const userId = req.userId
  try {
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })
    }

    // Рассчитываем прогресс текущего уровня в процентах для фронтенда
    const nextThreshold = getXpThreshold(user.progression.level)
    const levelProgressPercent = Math.round(
      (user.progression.xp / nextThreshold) * 100,
    )

    // Подготавливаем данные для Radar Chart (Паутинка навыков)
    // Расчет данных для Radar Chart (Паутинка)
    const skillsData = Object.entries(SKILLS_MAP).map(
      ([skillName, aliases]) => {
        // Фильтруем статистику по текущему навыку
        const relevantStats = user.stats.exerciseStats.filter((s) =>
          aliases.includes(s.alias),
        )
        let average = 0
        if (relevantStats.length > 0) {
          // 1. Считаем общую сумму очков по всем упражнениям навыка
          const sumPoints = relevantStats.reduce(
            (sum, item) => sum + item.totalPoints,
            0,
          )
          // 2. Считаем общее количество попыток во всех упражнениях навыка
          const sumAttempts = relevantStats.reduce(
            (sum, item) => sum + item.completionsCount,
            0,
          )
          // 3. Вычисляем средний балл за одну попытку (0-100)
          average =
            sumAttempts > 0 ? Math.round(sumPoints / sumAttempts) : 0
        }

        return {
          subject: skillName,
          A: average, // Теперь здесь будет число от 0 до 100
          fullMark: 100,
        }
      },
    )
    // Определение Зоны роста (минимальный средний балл среди начатых)
    const startedSkills = Array.isArray(skillsData)
      ? skillsData.filter((s) => s.A > 0)
      : []
    let weakPoint = null
    if (startedSkills.length > 0) {
      // Находим самый низкий результат (создаем копию через [...], чтобы не испортить основной массив)
      const sorted = [...startedSkills].sort((a, b) => a.A - b.A)
      const weakest = sorted[0]
      // Формируем объект в том формате, который ожидает фронтенд
      weakPoint = {
        skill: weakest.subject,
        score: weakest.A,
        recommendation: `Твой навык "${weakest.subject}" требует внимания. Попробуй улучшить его!`,
      }
    }
    //Отслеживания прогресса выполнения ежедневных заданий
    // Собираем только уникальные даты, где есть выполненные ежедневные задачи
    const completedDays = [
      ...new Set(
        user.dailyProgress
          .filter((item) => item.isCompleted === true)
          .map((item) => item.date), // достаем строки "YYYY-MM-DD"
      ),
    ]
    res.status(200).json({
      user: {
        displayName: user.displayName,
        level: user.progression.level,
        xp: user.progression.xp,
        lifetimeXp: user.stats.lifetimeXp,
        coins: user.progression.coins,
        streak: user.streak.current,
        levelProgressPercent,
        nextThreshold,
        completed_days: completedDays,
      },
      skills: skillsData,
      weakPoint,
      recentActivity: user.stats.exerciseStats.slice(-5).reverse(), // Последние 5
      totalExercises: user.stats.totalExercises,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: 'Ошибка при получении данных дашборда' })
  }
}

export { register, login, logout, getMe, getUserProfile }
