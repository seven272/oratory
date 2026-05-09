import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axiosInstance'

// Асинхронный запрос для получения заданий дня
const fetchDailyTasks = createAsyncThunk(
  'daily/fetchDailyTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/exercises/daily-tasks')
      return res.data // { date: "...", tasks: [...] }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  },
)

const dailySlice = createSlice({
  name: 'daily',
  initialState: {
    tasks: [],
    date: null,
    status: 'idle', // 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Локальное обновление прогресса после выполнения упражнения
    updateTaskProgress: (state, action) => {
      const { alias, isCompleted, currentValue } = action.payload
      const task = state.tasks.find((t) => t.alias === alias)
      if (task) {
        task.isCompleted = isCompleted
        task.currentValue = currentValue
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyTasks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchDailyTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.tasks = action.payload.tasks
        state.date = action.payload.date
      })
      .addCase(fetchDailyTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { updateTaskProgress } = dailySlice.actions
export { fetchDailyTasks }
export default dailySlice.reducer
