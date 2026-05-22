import { configureStore } from '@reduxjs/toolkit'

import authSlice from './slices/authSlice'
import aiExerciseSlice from './slices/aiExerciseSlice'
import exerciseSlice from './slices/exerciseSlice'
import profileSlice from './slices/profileSlice'
import dailySlice from './slices/dailySlice'
import leaderboardSlice from './slices/leaderboardSlice'
import shopSlice from './slices/shopSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    aiExercise: aiExerciseSlice,
    exercise: exerciseSlice,
    daily: dailySlice,
    leaderboard: leaderboardSlice,
    shop: shopSlice
  },
})

export default store
