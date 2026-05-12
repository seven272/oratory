import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from '../../utils/axiosInstance'
import { fetchCompleteExercise } from './exerciseSlice'

// Один универсальный запрос для получения всех данных профиля и дашборда
const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        '/user/user-statistics',
      )
      return response.data // Ждем объект { user, skills, weakPoint, recentActivity, totalExercises }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки профиля',
      )
    }
  },
)

const initialState = {
  user: {
    displayName: 'Tom',
    level: 3,
    coins: 23,
    streak: 3,
    achievements: [],
    levelProgressPercent: 57,
    isPremium: true,
  },
  skills: [
    { subject: 'Дикция', A: 80, fullMark: 100 },
    { subject: 'Лаконичность', A: 65, fullMark: 100 },
    { subject: 'Убедительность', A: 90, fullMark: 100 },
    { subject: 'Чистота речи', A: 45, fullMark: 100 },
    { subject: 'Эмоциональность', A: 70, fullMark: 100 },
    { subject: 'Small Talk', A: 55, fullMark: 100 },
  ],
  weakPoint: {
    skill: 'Small Talk',
    score: 55,
    recommendation: `Твой навык "Small Talk" требует внимания. Попробуй улучшить его!`,
  },
  recentActivity: [],
  totalExercises: 0,
  lastAwarded: null, // Сюда кладем новую ачивку для триггера модалки
  isStale: false,
  loading: false,
  error: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Можно добавить экшен для локального обновления монет после покупки
    updateCoins: (state, action) => {
      if (state.user) state.user.coins = action.payload
    },
    clearLastAwarded: (state) => {
      state.lastAwarded = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ПОДПИСКА НА ЗАВЕРШЕНИЕ УПРАЖНЕНИЯ
      .addCase(fetchCompleteExercise.fulfilled, (state, action) => {
        // action.payload — это то, что прислал бэкенд (res.status(200).json)
        // В твоем контроллере это объект с earnedXp, isLevelUp и объектом stats
        if (state.user) {
          // Обновляем основные показатели профиля
          state.user.level = action.payload.stats.level
          state.user.xp = action.payload.stats.xp
          state.user.coins = action.payload.stats.coins
          state.user.streak = action.payload.stats.streak

          // ЛОГИКА АЧИВОК
          if (
            action.payload.newAchievements &&
            action.payload.newAchievements.length > 0
          ) {
            // 1. Сохраняем в lastAwarded для всплывающего окна
            // Если ачивок несколько, берем первую (или можно передать весь массив)
            state.lastAwarded = action.payload.newAchievements[0]

            // 2. Добавляем в общий список в профиле, чтобы они сразу появились в Dashboard
            if (!state.user.achievements) {
              state.user.achievements = []
            }
            state.user.achievements.push(
              ...action.payload.newAchievements,
            )
          }
        }

        // Помечаем данные как "устаревшие", чтобы при переходе на страницу
        // Dashboard мы знали, что нужно обновить паутинку (skillsData)
        state.isStale = true
      })
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        console.log(action.payload)
        state.loading = false
        state.user = action.payload.user
        state.skills = action.payload.skills
        state.weakPoint = action.payload.weakPoint
        state.recentActivity = action.payload.recentActivity
        state.totalExercises = action.payload.totalExercises
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { updateCoins, clearLastAwarded } = profileSlice.actions
export { fetchProfileData }
export default profileSlice.reducer
