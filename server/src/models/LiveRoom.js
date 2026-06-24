import mongoose from 'mongoose'

const liveRoomSchema = new mongoose.Schema({
  // Кто создал комнату / Инициатор
  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Второй участник: реальный ObjectId, либо null (пока ищем), либо специальный ID для ИИ
  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Флаг, указывающий, что оппонентом в итоге стал робот
  isAiBot: {
    type: Boolean,
    default: false,
  },
  // Тип создания комнаты
  creationType: {
    type: String,
    enum: ['quick_search', 'direct_link', 'calendar'], // Значения enum оставляем как в БД
    required: true,
  },
  // Выбранная тема дискуссии
  topic: {
    title: { type: String, required: true },
    sideA: { type: String, required: true }, // Позиция Первого
    sideB: { type: String, required: true }, // Позиция Второго
  },
  // Специфические поля для разных механик
  inviteToken: { type: String, unique: true, sparse: true }, // Для Механики 4 (ссылка)
  scheduledAt: { type: Date, index: true }, // Для Механики 2 (календарь)

  // Ссылка на VK Звонок (генерируется при коннекте двух реальных людей)
  vkCallLink: { type: String, default: '' },

  ratingFromA: {
    type: Number,
    min: 1,
    max: 5,
    default: null, // Игрок А еще не оценил Игрока Б
  },
  ratingFromB: {
    type: Number,
    min: 1,
    max: 5,
    default: null, // Игрок Б еще не оценил Игрока А
  },

  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'canceled'],
    default: 'pending',
    index: true,
  },

  // Лог раундов (для ИИ-заглушки или сохранения текстовых логов)
  turnsLog: [
    {
      sender: { type: String, enum: ['userA', 'userB'] },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now }, 
})

export default mongoose.model('LiveRoom', liveRoomSchema)
