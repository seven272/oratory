// models/DailyChallenge.js
import mongoose from 'mongoose'

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: String, unique: true }, // Формат "YYYY-MM-DD"
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyTask' }]
})

export default mongoose.model('DailyChallenge', dailyChallengeSchema)
