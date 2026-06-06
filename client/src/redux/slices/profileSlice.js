import {
  createSlice,
  createAsyncThunk,
  isAnyOf,
} from '@reduxjs/toolkit'

import axiosInstance from '../../utils/axiosInstance'

import { fetchSubmitChallengeReport } from './challengeSlice'
// Импортируем Thunk обычного тренажера
import { fetchCompleteExercise } from './exerciseSlice'
// Импортируем Thunk-экшены завершения ИИ-тренажеров
import { fetchFinishDebate } from './ai-exercises/debateSlice'
import { fetchFinishIcebreaker } from './ai-exercises/icebreakerSlice'
import { fetchFinishInterview } from './ai-exercises/interviewSlice'
import { fetchFinishTribune } from './ai-exercises/tribuneSlice'


// Один универсальный запрос для получения всех данных профиля и дашборда
const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        '/user/get-data-profile',
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
    xp: 0,
    lifetimeXp: 0,
    achievements: [],
    inventory: [],
    levelProgressPercent: 57,
    completed_days: ['2026-05-18', '2026-05-17', '2026-05-19'],
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
  recentActivity: [], //последние 5 сделанных упражнений
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
    setTotalPoints: (state, action) => {
      if (state.user) state.user.xp = action.payload
    },
    clearLastAwarded: (state) => {
      state.lastAwarded = null
    },
    updateCoinsAndInventory: (state, action) => {
      if (state.user) {
        state.user.coins = action.payload.coins
        state.user.inventory = action.payload.inventory
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //подписка на завершения челленджа
      .addCase(
        fetchSubmitChallengeReport.fulfilled,
        (state, action) => {
          // Проверяем структуру вашего стейта профиля (ориентируемся на user или profile)
          if (state.user) {
            state.user.coins = action.payload.data.user.coins
            state.user.level = action.payload.data.user.level
            state.user.xp = action.payload.data.user.xp
            state.user.lifetimeXp =
              action.payload.data.user.lifetimeXp
            // 🔥 Записываем новые ачивки в стейт профиля.
            if (
              action.payload.data.user.newAchievements?.length > 0
            ) {
              state.lastAwarded =
                action.payload.data.user.newAchievements[0]
            }
          }
        },
      )
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
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
       // Глобальный слушатель для ЛЮБОГО успешно завершенного тренажера
      .addMatcher(
        isAnyOf(
          fetchCompleteExercise.fulfilled,
          fetchFinishDebate.fulfilled,
          fetchFinishInterview.fulfilled,
          fetchFinishIcebreaker.fulfilled,
          fetchFinishTribune.fulfilled
        ),
        (state, action) => {
          // Защита: если сессия завершилась без оценки, stats будет отсутствовать
          if (!action.payload || !action.payload.stats) return

          if (state.user) {
            // Атомарно обновляем показатели профиля
            state.user.level = action.payload.stats.level
            state.user.xp = action.payload.stats.xp
            state.user.coins = action.payload.stats.coins
            state.user.streak = action.payload.stats.streak
            state.user.completed_days =
              action.payload.stats.completed_days

            // ЛОГИКА АЧИВОК (Поздравляем строго с ОДНИМ достижением)
            if (
              action.payload.newAchievements &&
              action.payload.newAchievements.length > 0
            ) {
              // берем только самую первую ачивку из массива
              state.lastAwarded = action.payload.newAchievements[0]

              if (!state.user.achievements) {
                state.user.achievements = []
              }
              state.user.achievements.push(
                ...action.payload.newAchievements,
              )
            }
          }

          // Помечаем данные как "устаревшие" для обновления радарной карты
          state.isStale = true
        },
      )

  },
})

export const {
  updateCoins,
  clearLastAwarded,
  updateCoinsAndInventory,
  setTotalPoints,
} = profileSlice.actions
export { fetchProfileData }
export default profileSlice.reducer
