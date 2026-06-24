import dayjs from 'dayjs'
import crypto from 'crypto'

import LiveRoom from '../models/LiveRoom.js'
import User from '../models/User.js'
import { getXpThreshold } from '../utils/fnForControllers.js'
import { checkAchievements } from '../utils/achievementService.js'

// Вспомогательный хелпер для получения условий "активного" календарного слота
const getActiveCalendarQuery = (userId) => ({
  userA: userId,
  creationType: 'calendar',
  status: 'pending',
  scheduledAt: { $gt: new Date() }, // Слот еще не просрочен
})

// Пул заготовленных тем для дуэлей
const DUEL_TOPICS = [
  {
    title:
      'Искусственный интеллект заменит учителей в школах к 2030 году',
    sideA: 'За',
    sideB: 'Против',
  },
  {
    title:
      'Удаленная работа эффективнее для карьеры, чем работа в офисе',
    sideA: 'За',
    sideB: 'Против',
  },
  {
    title: 'Пицца с ананасами — это кулинарный шедевр',
    sideA: 'За',
    sideB: 'Против',
  },
]

// Инициализация комнаты (для Быстрого поиска, Ссылки или Календаря)
const createRoom = async (req, res) => {
  try {
    // Принимаем параметры в формате camelCase из измененного слайса
    const { creationType, scheduledAt } = req.body
    const userId = req.userId

    // Если создается календарный слот — проверяем лимит
    if (creationType === 'calendar') {
      const activeSlotsCount = await LiveRoom.countDocuments(
        getActiveCalendarQuery(userId),
      )

      if (activeSlotsCount >= 3) {
        return res.status(400).json({
          success: false,
          message:
            'Вы не можете создать более 3-х active запланированных слотов одновременно.',
        })
      }
    }

    const randomTopic =
      DUEL_TOPICS[Math.floor(Math.random() * DUEL_TOPICS.length)]

    // Собираем объект roomData строго под новую Mongoose-схему
    const roomData = {
      userA: userId,
      creationType,
      topic: randomTopic,
      status: 'pending',
    }

    if (creationType === 'direct_link') {
      roomData.inviteToken = crypto.randomBytes(8).toString('hex')
    }

    if (creationType === 'calendar' && scheduledAt) {
      roomData.scheduledAt = new Date(scheduledAt)
    }

    const room = await LiveRoom.create(roomData)

    return res.status(201).json({ success: true, room })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

//  Подключение Игрока Б (Вход по ссылке-инвайту или через быстрый поиск)
const joinRoom = async (req, res) => {
  try {
    const { inviteToken, roomId } = req.body
    const userBId = req.userId

    let room

    // 1. Поиск комнаты в зависимости от сценария входных данных
    if (inviteToken) {
      room = await LiveRoom.findOne({
        inviteToken,
        status: 'pending',
      })
    } else if (roomId) {
      room = await LiveRoom.findById(roomId)
    } else {
      // Быстрый поиск: ищем любую свободную комнату, где создатель НЕ текущий пользователь
      room = await LiveRoom.findOne({
        creationType: 'quick_search',
        status: 'pending',
        userA: { $ne: userBId },
      })
    }

    // 2. Если комната для быстрого поиска не найдена — отдаем пустой room (фронтенд поймет, что нужно создать новую комнату)
    if (!room && !inviteToken && !roomId) {
      return res.status(200).json({ success: true, room: null })
    }

    // 3. Для инвайтов и конкретных ID отсутствие комнаты — это критическая ошибка
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена или была удалена',
      })
    }

    // 4. ЗАЩИТА: Если Создатель (Игрок А) случайно вызвал joinRoom вместо пуллинга
    if (room.userA.toString() === userBId.toString()) {
      return res.status(200).json({
        success: true,
        message: 'Вы уже являетесь создателем этой комнаты',
        room,
      })
    }

    // 5. ЗАЩИТА: Если Игрок Б пытается зайти в комнату, которая уже занята кем-то другим
    if (room.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message:
          'Эта комната уже занята другим оратором или завершена',
      })
    }

    // 6. УСПЕШНОЕ СОЕДИНЕНИЕ: Заполняем данные Игрока Б и активируем комнату
    const vkCallLink = `https://vk.com/${room._id}` // Генерация ссылки на звонок

    room.userB = userBId
    room.status = 'active'
    room.vkCallLink = vkCallLink

    await room.save()

    return res.status(200).json({
      success: true,
      message: 'Пара успешно создана, игра начинается',
      room,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// Новый чистый контроллер только для ПУЛЛИНГА
const checkRoomStatus = async (req, res) => {
  try {
    const { roomId } = req.body // Получаем ID комнаты

    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: 'ID комнаты не передан' })
    }

    const room = await LiveRoom.findById(roomId)

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: 'Комната не найдена' })
    }

    // Просто отдаем комнату в ее текущем состоянии (pending, active, etc.)
    return res.status(200).json({ success: true, room })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

//  Фолбэк на ИИ-бота (Вызывается фронтендом, если за 30 сек никто не зашел в быстрый поиск/ссылку)
const fallbackToAi = async (req, res) => {
  try {
    // Принимаем параметр в формате camelCase из измененного слайса
    const { roomId } = req.body
    const room = await LiveRoom.findById(roomId)

    if (!room || room.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Невозможно переключить комнату на ИИ',
      })
    }

    // Записываем свойства строго под новую Mongoose-схему
    room.isAiBot = true
    room.status = 'active'
    room.vkCallLink = ''
    await room.save()

    // Возвращаем стартовую реплику от ИИ-оппонента (используем sideB вместо side_b)
    const aiFirstGreeting = `Привет! Я твой ИИ-оппонент на сегодня. Наша тема: "${room.topic.title}". Моя позиция: я "${room.topic.sideB}". Начинай свой монолог, я внимательно слушаю!`

    return res.status(200).json({
      success: true,
      message: 'Подключен ИИ-бот',
      room,
      aiGreeting: aiFirstGreeting, // Ключ изменен под extraReducers слайса
    })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

const submitRating = async (req, res) => {
  try {
    // Принимаем параметры в формате camelCase из измененного слайса
    const { roomId, rating } = req.body
    const userId = req.userId // Используем req.userId из вашего мидлвара checkAuth
    if (!roomId) {
      return res
        .status(400)
        .json({ success: false, message: 'roomId обязателен' })
    }

    // 1. Находим комнату живой дуэли
    const room = await LiveRoom.findById(roomId)
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: 'Комната не найдена' })
    }

    // 2. ВЗАИМНОЕ ОЦЕНИВАНИЕ И ЗАЩИТА ОТ НАКРУТКИ НАГРАД
    // Переводим статус комнаты в completed (дуэль завершена)
    room.status = 'completed'

    // Проверяем роль текущего пользователя и записываем оценку в нужное поле
    if (room.userA.toString() === userId.toString()) {
      // Если оценка уже была им выставлена, значит он вызывает эндпоинт повторно
      if (room.ratingFromA !== null) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Вы уже получили награду за эту дуэль',
          })
      }
      if (rating) room.ratingFromA = rating
    } else if (
      room.userB &&
      room.userB.toString() === userId.toString()
    ) {
      // То же самое для пользователя B
      if (room.ratingFromB !== null) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Вы уже получили награду за эту дуэль',
          })
      }
      if (rating) room.ratingFromB = rating
    } else {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Вы не являетесь участником этой комнаты',
        })
    }

    // Сохраняем состояние комнаты (новые поля оценок и статус)
    await room.save()

    // 3. Находим пользователя для расчета геймификации
    const user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Пользователь не найден' })
    }

    // 4. Расчет календарного стрика активности (UTC 00:00:00)
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

    // 8. Проверка сквозных ачивок платформы (алиас 'live_pioneer' для фиксации первой дуэли)
    const newAwards = checkAchievements(
      user,
      false,
      earnedXp,
      exAlias,
    )

    if (newAwards && newAwards.length > 0) {
      user.progression.lastAwarded = newAwards
    } else {
      user.progression.lastAwarded = []
    }

    // Сохраняем обновленный профиль в MongoDB
    await user.save()

    // Получаем массив уникальных дат выполненных дейликов
    const completedDays = [
      ...new Set(
        user.dailyProgress
          .filter((item) => item.isCompleted === true)
          .map((item) => item.date),
      ),
    ]

    // 9. Возвращаем клиенту успешный ответ (ключи переведены на camelCase)
    return res.status(200).json({
      success: true,
      message: 'Дуэль успешно завершена, награды начислены',
      room,
      earnedXp,
      earnedCoins,
      isLevelUp,
      newAchievements: newAwards || [],
      dailyTaskUpdate: null,
      stats: {
        level: user.progression.level,
        xp: user.progression.xp,
        coins: user.progression.coins,
        streak: user.streak.current,
        completedDays: completedDays,
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
      creationType: 'calendar',
      status: 'pending',
      scheduledAt: { $gte: new Date() }, // Только будущие сессии
      userA: { $ne: userId }, // Исключаем свои собственные созданные слоты
    })
      .populate('userA', 'displayName avatar') // Подтягиваем имя и аватар создателя
      .sort({ scheduledAt: 1 }) // Сортируем от ближайших к дальним

    return res.status(200).json({ success: true, rooms })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// Получение личных активных слотов пользователя
const getMyActiveSlots = async (req, res) => {
  try {
    const userId = req.userId

    const slots = await LiveRoom.find({
      creationType: 'calendar',
      scheduledAt: { $gte: new Date() }, // Только будущие
      $or: [
        // Вариант 1: Слот создан мной (и pending, и active)
        { userA: userId, status: { $in: ['pending', 'active'] } },
        // Вариант 2: Я присоединился к чужому слоту (только active)
        { userB: userId, status: 'active' },
      ],
    })
      .populate('userA', 'displayName avatar') // Подтягиваем имя и аватар Игрока А
      .populate('userB', 'displayName avatar') // Подтягиваем имя и аватар Игрока Б
      .sort({ scheduledAt: 1 })

    return res.status(200).json({ success: true, rooms: slots })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

const updateSlotDate = async (req, res) => {
  try {
    // Принимаем параметры в формате camelCase из измененного слайса
    const { roomId, scheduledAt } = req.body
    const userId = req.userId

    if (!scheduledAt) {
      return res
        .status(400)
        .json({ success: false, message: 'Новая дата обязательна' })
    }

    // Ищем строго под новые ключи userA
    const room = await LiveRoom.findOne({
      _id: roomId,
      userA: userId,
      status: 'pending',
    })
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Слот не найден или уже активен/завершен',
      })
    }

    // Записываем новую дату в camelCase поле scheduledAt
    room.scheduledAt = new Date(scheduledAt)
    await room.save()

    return res.status(200).json({
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

const deleteSlot = async (req, res) => {
  try {
    // Параметр из URL (req.params) считываем как roomId
    const { roomId } = req.params
    const userId = req.userId

    // Атомарно находим и удаляем запись с учетом ключа userA
    const room = await LiveRoom.findOneAndDelete({
      _id: roomId,
      userA: userId,
      status: 'pending',
    })
    if (!room) {
      return res.status(404).json({
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

// Контроллер для предварительной проверки ссылки
const checkInviteToken = async (req, res) => {
  try {
    const { token } = req.params

    // Ищем активную комнату, которая создана по ссылке и еще ждет игрока
    const room = await LiveRoom.findOne({
      inviteToken: token,
      status: 'pending',
    }).populate('userA', 'displayName avatar') // подтянем данные Создателя, чтобы показать Гостю на экране входа

    if (!room) {
      return res.status(404).json({
        success: false,
        message:
          'Ссылка недействительна, комната уже занята или удалена.',
      })
    }

    return res.status(200).json({ success: true, room })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message })
  }
}

// Контроллер для проверки статуса выставления оценок после завершения дуэли
const checkRatingStatus = async (req, res) => {
  try {
    const { roomId } = req.params
    const currentUserId = req.userId

    const room = await LiveRoom.findById(roomId)
    if (!room) {
     
      return res.status(404).json({ success: false, message: 'Комната не найдена' })
    }
 

    let yourRatingToOpponent = null
    let opponentRatingToYou = null

    // Разделяем оценки в зависимости от того, кто спрашивает
    if (room.userA.toString() === currentUserId.toString()) {
      yourRatingToOpponent = room.ratingFromA
      opponentRatingToYou = room.ratingFromB
    } else if (room.userB && room.userB.toString() === currentUserId.toString()) {
      yourRatingToOpponent = room.ratingFromB
      opponentRatingToYou = room.ratingFromA
    } else {
      return res.status(403).json({ success: false, message: 'Доступ запрещен' })
    }

    res.json({
      success: true,
      data: {
        yourRatingToOpponent, // null или число
        opponentRatingToYou,   // null или число (фронтенд ждет, пока тут появится не null)
        isAiBot: room.isAiBot
      }
    })
  } catch (error) {
    console.error('Ошибка в checkRatingStatus:', error)
    res.status(500).json({ success: false, message: 'Ошибка сервера' })
  }
}

export {
  fallbackToAi,
  createRoom,
  joinRoom,
  checkRoomStatus,
  submitRating,
  getCalendarRooms,
  getMyActiveSlots,
  updateSlotDate,
  deleteSlot,
  checkInviteToken,
  checkRatingStatus
}
