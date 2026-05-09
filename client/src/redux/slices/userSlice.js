import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  vkId: '342939333',
  userId: 'ews4055daQe',
  name: 'Mike',
  avatar: 'dd.jpg',
  level: 1,
  totalPoints: 120,
  currentPoints: 0,
  jobs: ['слесарь', 'программист'],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  // Редьюсеры в слайсах меняют состояние и ничего не возвращают
  reducers: {
    setTotalPoints: (state, action) => {
      const newTotal = state.totalPoints + action.payload
      const newLevel = Math.floor(newTotal / 300) + 1 // Уровень каждые 300 XP
      state.totalPoints = newTotal
      state.level = newLevel
    },
    setCurrentPoints: (state, action) => {
      state.currentPoints = state.currentPoints + action.payload
    },
  },
})

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { setTotalPoints, setCurrentPoints } = userSlice.actions

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default userSlice.reducer
