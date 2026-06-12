import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axiosInstance'

// Асинхронный экшен: Создание комнаты (Поиск, Ссылка, Календарь)
const fetchCreateLiveRoom = createAsyncThunk(
  'liveDuel/fetchCreateLiveRoom',
  async (room_payload, { rejectWithValue }) => {
    try {
      // room_payload содержит { creation_type, scheduled_at }
      const res = await axiosInstance.post('/live/create-room', room_payload)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка при создании комнаты'
      )
    }
  }
)

//Асинхронный экшен: Подключение к комнате (Поиск пары или по ссылке)
const fetchJoinLiveRoom = createAsyncThunk(
  'liveDuel/fetchJoinLiveRoom',
  async (join_payload, { rejectWithValue }) => {
    try {
      // join_payload содержит { invite_token } или пустой объект для быстрого поиска
      const response = await axiosInstance.post('/live/join-room', join_payload)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка при подключении к комнате'
      )
    }
  }
)

// Асинхронный экшен: Фолбэк на ИИ-бота при тайм-ауте
const fetchFallbackToAiBot = createAsyncThunk(
  'liveDuel/fetchFallbackToAiBot',
  async (room_payload, { rejectWithValue }) => {
    try {
      // room_payload содержит { room_id }
      const response = await axiosInstance.post('/live/fallback-ai', room_payload)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка при подключении ИИ-бота'
      )
    }
  }
)

// Начальное состояние стейта
const initialState = {
  current_room: null,         // Данные активной комнаты из базы данных
  ai_greeting: '',           // Стартовая приветственная реплика ИИ (если сработал фолбэк)
  search_status: 'idle',     // Статусы: 'idle' | 'searching' | 'active' | 'failed'
  loading: false,            // Глобальный лоадер запросов
  error: null,               // Текст ошибки с бэкенда
}

const liveDuelSlice = createSlice({
  name: 'liveDuel',
  initialState,
  reducers: {
    // Сброс состояния дуэли при выходе из комнаты
    resetLiveDuelState: (state) => {
      state.current_room = null
      state.ai_greeting = ''
      state.search_status = 'idle'
      state.loading = false
      state.error = null
    },
    // Возможность вручную переключить статус поиска (например, для локальных анимаций)
    setSearchStatus: (state, action) => {
      state.search_status = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Создание комнаты ---
      .addCase(fetchCreateLiveRoom.pending, (state) => {
        state.loading = true
        state.error = null
        state.search_status = 'searching'
      })
      .addCase(fetchCreateLiveRoom.fulfilled, (state, action) => {
        state.loading = false
        state.current_room = action.payload.room
        // Если создали быструю ссылку или календарь — статус остается searching/idle до коннекта
        if (action.payload.room.creation_type === 'quick_search') {
          state.search_status = 'searching'
        }
      })
      .addCase(fetchCreateLiveRoom.rejected, (state, action) => {
        state.loading = false
        state.search_status = 'failed'
        state.error = action.payload
      })

      // --- Подключение к комнате ---
      .addCase(fetchJoinLiveRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJoinLiveRoom.fulfilled, (state, action) => {
        state.loading = false
        state.current_room = action.payload.room
        state.search_status = 'active' // Пару успешно нашли / подключились по ссылке
      })
      .addCase(fetchJoinLiveRoom.rejected, (state, action) => {
        state.loading = false
        state.search_status = 'failed'
        state.error = action.payload
      })

      // --- Переключение на ИИ-бота ---
      .addCase(fetchFallbackToAiBot.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFallbackToAiBot.fulfilled, (state, action) => {
        state.loading = false
        state.current_room = action.payload.room
        state.ai_greeting = action.payload.ai_greeting
        state.search_status = 'active' // Перешли в активную фазу тренировки с ИИ
      })
      .addCase(fetchFallbackToAiBot.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { resetLiveDuelState, setSearchStatus } = liveDuelSlice.actions
export {fetchCreateLiveRoom, fetchJoinLiveRoom, fetchFallbackToAiBot}
export default liveDuelSlice.reducer
