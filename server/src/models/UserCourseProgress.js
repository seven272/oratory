import mongoose from 'mongoose'

// подсхема для архивных записей
const ArchiveRecordSchema = new mongoose.Schema(
  {
    status: String, // 'completed' (сдал) или 'failed' (завалил все попытки)
    finishedAt: { type: Date, default: Date.now },
    blocksProgress: {
      theory: { isCompleted: Boolean },
      aiWorkout: {
        isCompleted: Boolean,
        accumulatedScore: Number,
        sessionsCount: Number,
      },
      irlChallenge: {
        isCompleted: Boolean,
        textReport: String,
        aiFeedback: String,
      },
      exam: {
        isCompleted: Boolean,
        bestScore: Number,
        attemptsCount: Number,
        aiFeedback: String,
      },
    },
  },
  { _id: true },
)

const UserCourseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'failed'],
      default: 'active',
    },
    currentBlockIndex: { type: Number, default: 0 }, // 0: Теория, 1: ИИ, 2: IRL, 3: Экзамен
    // Состояния прохождения блоков
    blocksProgress: {
      theory: { isCompleted: { type: Boolean, default: false } },
      aiWorkout: {
        isCompleted: { type: Boolean, default: false },
        accumulatedScore: { type: Number, default: 0 }, // Сколько баллов СУММАРНО набрано внутри этого курса
        sessionsCount: { type: Number, default: 0 }, // Сколько попыток совершено (для аналитики)
        currentSession: {
          status: { type: String, default: 'active' },
          exerciseData: mongoose.Schema.Types.Mixed,
          messages: { type: Array, default: [] },
          createdAt: { type: Date, default: Date.now },
        },
      },
      irlChallenge: {
        isCompleted: { type: Boolean, default: false },
        textReport: String,
        aiFeedback: String,
      },
      exam: {
        isCompleted: { type: Boolean, default: false },
        bestScore: { type: Number, default: 0 },
        attemptsCount: { type: Number, default: 0 },
        lastAttemptScore: { type: Number, default: 0 },
        lockedUntil: { type: Date, default: null },
        aiFeedback: String,
      },
    },
    history: [ArchiveRecordSchema], 
  },
  { timestamps: true },
)

// Уникальный индекс, чтобы юзер не мог начать один курс дважды
UserCourseProgressSchema.index(
  { userId: 1, courseCode: 1 },
  { unique: true },
)

export default mongoose.model(
  'UserCourseProgress',
  UserCourseProgressSchema,
)
