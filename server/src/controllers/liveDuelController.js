import dayjs from 'dayjs'
import crypto from 'crypto'

import LiveRoom from '../models/LiveRoom.js'
import User from '../models/User.js'
import { getXpThreshold } from '../utils/fnForControllers.js'
import { checkAchievements } from '../utils/achievementService.js'

// Вспомогательный хелпер для получения условий "активного" календарного слота
const getActiveCalendarQuery = (userId) => ({
  user_a: userId,
  creation_type: 'calendar',
  status: 'pending',
  scheduled_at: { $gt: new Date() }, // Слот еще не просрочен
})

// Пул заготовленных тем для дуэлей
const DUEL_TOPICS = [
  {
    title:
      'Искусственный интеллект заменит учителей в школах к 2030 году',
    side_a: 'За',
    side_b: 'Против',
  },
  {
    title:
      'Удаленная работа эффективнее для карьеры, чем работа в офисе',
    side_a: 'За',
    side_b: 'Против',
  },
  {
    title: 'Пицца с ананасами — это кулинарный шедевр',
    side_a: 'За',
    side_b: 'Против',
  },
]

// 1. Инициализация комнаты (для Быстрого поиска, Ссылки или Календаря)
const createRoom = async (req, res) => {
  try {
    const { creation_type, scheduled_at } = req.body
    const userId = req.userId

    // Если создается календарный слот — проверяем лимит
    if (creation_type === 'calendar') {
      const activeSlotsCount = await LiveRoom.countDocuments(
        getActiveCalendarQuery(userId),
      )

      if (activeSlotsCount >= 3) {
        return res.status(400).json({
          success: false,
          message:
            'Вы не можете создать более 3-х активных запланированных слотов одновременно.',
        })
      }
    }

    const randomTopic =
      DUEL_TOPICS[Math.floor(Math.random() * DUEL_TOPICS.length)]

    const roomData = {
      user_a: userId,
      creation_type,
      topic: randomTopic,
      status: 'pending',
    }

    if (creation_type === 'direct_link') {
      roomData.invite_token = crypto.randomBytes(8).toString('hex')
    }

    if (creation_type === 'calendar' && scheduled_at) {
      roomData.scheduled_at = new Date(scheduled_at)
    }

    const room = await LiveRoom.create(roomData)

    return res.status(201).json({ success: true, room })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// 2. Подключение Игрока Б (Вход по ссылке-инвайту или через быстрый поиск)
const joinRoom = async (req, res) => {
  try {
    const { invite_token, room_id } = req.body
    const user_b_id = req.userId

    let room

    if (invite_token) {
      // Ищем комнату по уникальному токену из ссылки
      room = await LiveRoom.findOne({
        invite_token,
        status: 'pending',
      })
    } else if (req.body.room_id) {
      // Добавим явную ветку для пуллинга конкретной комнаты по ID
      room = await LiveRoom.findById(req.body.room_id)
    } else {
      // Вариант Б: Быстрый поиск — атомарно вылавливаем случайную свободную комнату, где создатель не мы
      room = await LiveRoom.findOne({
        creation_type: 'quick_search',
        status: 'pending',
        user_a: { $ne: user_b_id },
      })
    }

    // Проверка 1: Если комната вообще не найдена в базе данных
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена',
      })
    }

    // Проверка 2: Если это ПУЛЛИНГ создателя комнаты (Игрока А)
    if (room.user_a.toString() === user_b_id) {
      // Просто отдаем текущее состояние комнаты (клиент сам увидит смену pending -> active)
      return res.status(200).json({ success: true, room })
    }

    // Проверка 3: Если Игрок Б пытается зайти в уже занятую комнату
    if (room.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message:
          'Эта комната уже занята другим оратором или завершена',
      })
    }

    // Генерируем тестовую ссылку на VK звонок (в проде тут будет вызов VK API)
    const vk_call_link = `https://vk.com/${room._id}`

    room.user_b = user_b_id
    room.status = 'active'
    room.vk_call_link = vk_call_link
    await room.save()

    return res
      .status(200)
      .json({ success: true, message: 'Пара успешно создана', room })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// 3. Фолбэк на ИИ-бота (Вызывается фронтендом, если за 30 сек никто не зашел в быстрый поиск/ссылку)
const fallbackToAi = async (req, res) => {
  try {
    const { room_id } = req.body
    const room = await LiveRoom.findById(room_id)

    if (!room || room.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Невозможно переключить комнату на ИИ',
      })
    }

    room.is_ai_bot = true
    room.status = 'active'
    // Ссылка на VK Звонок не нужна, общение пойдет внутри интерфейса с GigaChat
    room.vk_call_link = ''
    await room.save()

    // Возвращаем стартовую реплику от ИИ-оппонента для разгона дискуссии
    const aiFirstGreeting = `Привет! Я твой ИИ-оппонент на сегодня. Наша тема: "${room.topic.title}". Моя позиция: я "${room.topic.side_b}". Начинай свой монолог, я внимательно слушаю!`

    return res.status(200).json({
      success: true,
      message: 'Подключен ИИ-бот',
      room,
      ai_greeting: aiFirstGreeting,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

const submitRating = async (req, res) => {
  try {
    const { room_id, rating } = req.body
    const userId = req.userId // Используем req.userId из вашего мидлвара checkAuth

    if (!room_id) {
      return res
        .status(400)
        .json({ success: false, message: 'room_id обязателен' })
    }

    // 1. Находим комнату живой дуэли
    const room = await LiveRoom.findById(room_id)
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: 'Комната не найдена' })
    }

    // 2. Если комната еще не завершена, обновляем ее статус и оценку
    if (room.status !== 'completed') {
      room.status = 'completed'
      if (rating) {
        room.rating = rating
      }
      await room.save()
    }

    // 3. Находим пользователя для расчета геймификации
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Пользователь не найден' })
    }

    // 4. Расчет календарного стрика активности (UTC 00:00:00) — Полная копия вашей логики
    const now = new Date()
    const todayMs = new Date(now).setUTCHours(0, 0, 0, 0)
    const lastDate = user.streak.lastCompletedDate
      ? new Date(user.streak.lastCompletedDate).setUTCHours(
          0,
          0,
          0,
          0,
        )
      : null
    const oneDayInMs = 86400000

    if (!lastDate) {
      user.streak.current = 1
    } else if (todayMs === lastDate + oneDayInMs) {
      user.streak.current += 1
    } else if (todayMs > lastDate + oneDayInMs) {
      user.streak.current = 1
    }
    user.streak.lastCompletedDate = now

    // 5. Вычисление множителя опыта за серию дней
    let multiplier = 1
    if (user.streak.current >= 3) multiplier = 1.2
    if (user.streak.current >= 7) multiplier = 1.5

    // Фиксированные базовые награды за живую дуэль
    const baseRewardXp = 250
    const baseRewardCoins = 25

    // Итоговые награды с учетом буста за стрик дней
    const earnedXp = Math.round(baseRewardXp * multiplier)
    const earnedCoins = Math.round(baseRewardCoins * multiplier)

    // 6. Начисление наград в документ пользователя
    user.stats.lifetimeXp += earnedXp
    user.weeklyXp += earnedXp
    user.progression.xp += earnedXp
    user.progression.coins += earnedCoins
    user.stats.totalExercises = (user.stats.totalExercises || 0) + 1

    // 7. Цикл динамического повышения уровней ("Стакан" через while)
    let isLevelUp = false
    while (
      user.progression.xp >= getXpThreshold(user.progression.level)
    ) {
      user.progression.xp -= getXpThreshold(user.progression.level)
      user.progression.level += 1
      isLevelUp = true
    }

    // Запись в историю выполнения конкретного упражнения
    const exAlias = 'live-duel'
    const statIndex = user.stats.exerciseStats.findIndex(
      (ex) => ex.alias === exAlias,
    )
    if (statIndex > -1) {
      user.stats.exerciseStats[statIndex].completionsCount += 1
    } else {
      user.stats.exerciseStats.push({
        alias: exAlias,
        title: 'Живая дуэль',
        totalPoints: 0,
        completionsCount: 1,
      })
    }

    // 8. Проверка сквозных ачивок платформы (передаем алиас 'live_pioneer' для фиксации первой дуэли)
    const newAwards = checkAchievements(
      user,
      false,
      0,
      'live_pioneer',
    )

    if (newAwards && newAwards.length > 0) {
      user.progression.lastAwarded = newAwards
    } else {
      user.progression.lastAwarded = []
    }

    // Сохраняем обновленный профиль в MongoDB
    await user.save()

    // Получаем массив уникальных дат выполненных дейликов для синхронизации Redux
    const completedDays = [
      ...new Set(
        user.dailyProgress
          .filter((item) => item.isCompleted === true)
          .map((item) => item.date),
      ),
    ]

    // 9. Возвращаем клиенту успешный ответ в стандартном формате
    return res.status(200).json({
      success: true,
      message: 'Дуэль успешно завершена, награды начислены',
      room,
      earnedXp,
      earnedCoins,
      isLevelUp,
      newAchievements: newAwards || [],
      daily_task_update: null, // Для живых дуэлей дейлики пока не задействованы
      stats: {
        level: user.progression.level,
        xp: user.progression.xp,
        coins: user.progression.coins,
        streak: user.streak.current,
        completed_days: completedDays,
        nextThreshold: getXpThreshold(user.progression.level),
      },
    })
  } catch (error) {
    console.error('Ошибка в submitRating:', error)
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// Получить список всех запланированных дуэлей (Лента объявлений)
const getCalendarRooms = async (req, res) => {
  try {
    const userId = req.userId // ID текущего юзера

    const rooms = await LiveRoom.find({
      creation_type: 'calendar',
      status: 'pending',
      scheduled_at: { $gte: new Date() }, // Только будущие сессии
      user_a: { $ne: userId }, // Исключаем свои собственные созданные слоты
    })
      .populate('user_a', 'name avatar') // Если нужно подтянуть имя создателя (адаптируйте под вашу схему User)
      .sort({ scheduled_at: 1 }) // Сортируем от ближайших к дальним

    return res.status(200).json({ success: true, rooms })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// 2. ЭНДПОИНТ: Получение личных активных слотов пользователя
const getMyActiveSlots = async (req, res) => {
  try {
    const userId = req.userId
    // Находим только непросроченные, созданные нами слоты в статусе pending
    const slots = await LiveRoom.find(
      getActiveCalendarQuery(userId),
    ).sort({ scheduled_at: 1 })

    return res.status(200).json({ success: true, rooms: slots })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// 3. ЭНДПОИНТ: Изменение даты существующего слота
const updateSlotDate = async (req, res) => {
  try {
    const { room_id, scheduled_at } = req.body
    const userId = req.userId

    if (!scheduled_at) {
      return res
        .status(400)
        .json({ success: false, message: 'Новая дата обязательна' })
    }

    const room = await LiveRoom.findOne({
      _id: room_id,
      user_a: userId,
      status: 'pending',
    })
    if (!room) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'Слот не найден или уже активен/завершен',
        })
    }

    room.scheduled_at = new Date(scheduled_at)
    await room.save()

    return res
      .status(200)
      .json({
        success: true,
        room,
        message: 'Дата слота успешно изменена',
      })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// 4. ЭНДПОИНТ: Удаление слота
const deleteSlot = async (req, res) => {
  try {
    const { room_id } = req.params
    const userId = req.userId

    const room = await LiveRoom.findOneAndDelete({
      _id: room_id,
      user_a: userId,
      status: 'pending',
    })
    if (!room) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'Слот не найден или не может быть удален',
        })
    }

    return res
      .status(200)
      .json({ success: true, message: 'Слот успешно удален' })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

export {
  fallbackToAi,
  createRoom,
  joinRoom,
  submitRating,
  getCalendarRooms,
  getMyActiveSlots, updateSlotDate, deleteSlot
}
