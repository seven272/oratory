import { configureStore } from '@reduxjs/toolkit'

import userSlice from './slices/userSlice'
import authSlice from './slices/authSlice'
import aiExerciseSlice from './slices/aiExerciseSlice'
import exerciseSlice from './slices/exerciseSlice'
import profileSlice from './slices/profileSlice'
import dailySlice from './slices/dailySlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    profile: profileSlice,
    aiExercise: aiExerciseSlice,
    exercise: exerciseSlice,
    daily: dailySlice,
  },
})

export default store
