import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true }, // e.g., 'pitch_master'
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetSkill: { type: String, required: true }, // 'убедительность'
    priceCoins: { type: Number, default: 0 }, // 0 - бесплатно, или цена в коинах

    // Массив из 4 жестких блоков
    blocks: [
      {
        blockType: {
          type: String,
          enum: ['theory', 'ai_workout', 'irl_challenge', 'exam'],
          required: true,
        },
        title: { type: String, required: true },

        // Специфичные данные для каждого типа блока
        theoryData: {
          slides: [{ title: String, text: String }],
          quiz: {
            question: String,
            options: [String],
            correctAnswerIndex: Number,
          },
        },
        aiWorkoutData: {
          exercises: [String], // например, ['science-translator', 'logic-chain']
          requiredScore: { type: Number, default: 500 }, // Нужно суммарно накопить 500 баллов
        },
        irlChallengeData: {
          challengeCode: String, // связь с глобальной моделью Challenge
          instructions: String,
        },
        examData: {
          systemPrompt: String, // Специфичный промпт для GigaChat ("Ты строгий инвестор...")
          minScoreToPass: { type: Number, default: 85 },
        },
      },
    ],

    reward: {
      xp: { type: Number, default: 500 },
      achievementCode: { type: String }, // e.g., 'pitch_hero'
    },
  },
  { timestamps: true },
)

export default mongoose.model('Course', CourseSchema)
