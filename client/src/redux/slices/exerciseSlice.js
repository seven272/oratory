import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from '../../utils/axiosInstance'

// Экшен для отправки результата упражнения
const fetchCompleteExercise = createAsyncThunk(
  'exercise/complete',
  async ({ exAlias, score }, { rejectWithValue }) => {
    
    try {
      // Отправляем ID упражнения и набранные очки
      const res = await axiosInstance.post(
        '/exercises/complete',
        {
          exAlias,
          score,
        },
      )
      return res.data // Ждем { earnedXp, isLevelUp, level, coins, ... }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка сохранения',
      )
    }
  },
)
const initialState = {
  activeExercise: '',
  lastResult: null,
  isSubmitting: false,
  error: null,
}

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    clearLastResult: (state) => {
      state.lastResult = null
    },
  },
  extraReducers: (builder) => {
    //complete exercise
    builder
      .addCase(fetchCompleteExercise.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(fetchCompleteExercise.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.lastResult = action.payload // Сохраняем, чтобы показать модалку успеха
      })
      .addCase(fetchCompleteExercise.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload
      })
  },
})

export const { clearLastResult } = exerciseSlice.actions
export { fetchCompleteExercise }
export default exerciseSlice.reducer
