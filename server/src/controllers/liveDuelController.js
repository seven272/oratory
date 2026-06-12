import LiveRoom from '../models/LiveRoom.js'
import User from '../models/User.js'
import crypto from 'crypto'

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
    const userId = req.userId // Из мидлвара авторизации

    // Рандомно выбираем тему дискуссии
    const randomTopic =
      DUEL_TOPICS[Math.floor(Math.random() * DUEL_TOPICS.length)]

    const roomData = {
      user_a: userId,
      creation_type,
      topic: randomTopic,
      status: 'pending',
    }

    // Если это создание прямой ссылки для шеринга в чат
    if (creation_type === 'direct_link') {
      roomData.invite_token = crypto.randomBytes(8).toString('hex')
    }

    // Если это бронирование слота в календаре
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
    } else {
      // Вариант Б: Быстрый поиск — атомарно вылавливаем случайную свободную комнату, где создатель не мы
      room = await LiveRoom.findOne({
        creation_type: 'quick_search',
        status: 'pending',
        user_a: { $ne: user_b_id },
      })
    }

    if (!room || room.status !== 'pending') {
      return res.status(404).json({
        success: false,
        message: 'Комната не найдена или уже занята',
      })
    }

    if (room.user_a.toString() === user_b_id) {
      return res.status(400).json({
        success: false,
        message: 'Вы не можете играть с самим собой',
      })
    }

    // Генерируем тестовую ссылку на VK звонок (в проде тут будет вызов VK API)
    const vk_call_link = `https://vk.com${room._id}`

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

export { fallbackToAi, createRoom, joinRoom }
