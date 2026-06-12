import mongoose from 'mongoose'

const liveRoomSchema = new mongoose.Schema({
  // Кто создал комнату / Инициатор
  user_a: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Второй участник: реальный ObjectId, либо null (пока ищем), либо специальный ID для ИИ
  user_b: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Флаг, указывающий, что оппонентом в итоге стал робот
  is_ai_bot: {
    type: Boolean,
    default: false,
  },
  // Тип создания комнаты
  creation_type: {
    type: String,
    enum: ['quick_search', 'direct_link', 'calendar'],
    required: true,
  },
  // Выбранная тема дискуссии
  topic: {
    title: { type: String, required: true },
    side_a: { type: String, required: true }, // Позиция Первого
    side_b: { type: String, required: true }, // Позиция Второго
  },
  // Специфические поля для разных механик
  invite_token: { type: String, unique: true, sparse: true }, // Для Механики 4 (ссылка)
  scheduled_at: { type: Date, index: true }, // Для Механики 2 (календарь)

  // Ссылка на VK Звонок (генерируется при коннекте двух реальных людей)
  vk_call_link: { type: String, default: '' },

  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'canceled'],
    default: 'pending',
    index: true,
  },

  // Лог раундов (для ИИ-заглушки или сохранения текстовых логов)
  turns_log: [
    {
      sender: { type: String, enum: ['user_a', 'user_b'] },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],

  created_at: { type: Date, default: Date.now, expires: 86400 }, // Автоудаление через 24 часа
})

export default mongoose.model('LiveRoom', liveRoomSchema)
