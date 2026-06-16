import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axiosInstance'

// Асинхронный экшен: Создание комнаты (Поиск, Ссылка, Календарь)
const fetchCreateLiveRoom = createAsyncThunk(
  'liveDuel/fetchCreateLiveRoom',
  async (roomPayload, { rejectWithValue }) => {
    try {
      // room_payload содержит { creation_type, scheduled_at }
      const res = await axiosInstance.post('/live/create-room', {
        creation_type: roomPayload.creationType,
        scheduled_at: roomPayload.scheduledAt,
      })
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Ошибка при создании комнаты',
      )
    }
  },
)

//Асинхронный экшен: Подключение к комнате (Поиск пары или по ссылке)
const fetchJoinLiveRoom = createAsyncThunk(
  'liveDuel/fetchJoinLiveRoom',
  async (joinPayload, { rejectWithValue }) => {
    try {
      // joinPayload содержит { invite_token } или пустой объект для быстрого поиска
      const res = await axiosInstance.post('/live/join-room', {
        invite_token: joinPayload.inviteToken,
        room_id: joinPayload.roomId,
      })
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Ошибка при подключении к комнате',
      )
    }
  },
)

// Асинхронный экшен: Фолбэк на ИИ-бота при тайм-ауте
const fetchFallbackToAiBot = createAsyncThunk(
  'liveDuel/fetchFallbackToAiBot',
  async (roomPayload, { rejectWithValue }) => {
    try {
      // roomPayload содержит { room_id }
      const response = await axiosInstance.post('/live/fallback-ai', {
        room_id: roomPayload.roomId,
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Ошибка при подключении ИИ-бота',
      )
    }
  },
)

const fetchCheckRoomStatus = createAsyncThunk(
  'liveDuel/fetchCheckRoomStatus',
  async ({ roomId }, { rejectWithValue }) => {
    try {
      // Мы можем использовать тот же роут joinRoom, но передавать roomId,
      // чтобы бэкенд понимал, какую именно комнату мы проверяем
      const res = await axiosInstance.post('/live/join-room', {
        room_id: roomId,
      })
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка проверки статуса',
      )
    }
  },
)

const fetchSubmitLiveRating = createAsyncThunk(
  'liveDuel/fetchSubmitLiveRating',
  async ({ roomId, rating }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/live/submit-rating', {
        room_id: roomId,
        rating: rating,
      })
      return res.data // Здесь приходят: success, room, earnedXp, earnedCoins, isLevelUp, stats и т.д.
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Ошибка при сохранении рейтинга',
      )
    }
  },
)

const fetchGetCalendarRooms = createAsyncThunk(
  'liveDuel/fetchGetCalendarRooms',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/live/calendar-rooms')
      return res.data // { success: true, rooms: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка загрузки календаря',
      )
    }
  },
)

//  Получить личные слоты
const fetchGetMyActiveSlots = createAsyncThunk(
  'liveDuel/fetchGetMyActiveSlots',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/live/my-slots')
      return res.data // { success: true, rooms: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Ошибка загрузки ваших слотов',
      )
    }
  },
)

//  Обновить дату слота
const fetchUpdateLiveRoomDate = createAsyncThunk(
  'liveDuel/fetchUpdateLiveRoomDate',
  async ({ roomId, scheduledAt }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/live/update-slot', {
        room_id: roomId,
        scheduled_at: scheduledAt,
      })
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Ошибка изменения даты слота',
      )
    }
  },
)

// 3. Удалить слот
const fetchDeleteLiveRoom = createAsyncThunk(
  'liveDuel/fetchDeleteLiveRoom',
  async ({ roomId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/live/delete-slot/${roomId}`,
      )
      return { roomId, ...res.data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка при удалении слота',
      )
    }
  },
)

// Начальное состояние стейта
const initialState = {
  currentRoom: null, // Данные активной комнаты из базы данных
  calendarRooms: [],
  myActiveSlots: [],
  aiGreeting: '', // Стартовая приветственная реплика ИИ (если сработал фолбэк)
  searchStatus: 'idle', // Статусы: 'idle' | 'searching' | 'active' | 'failed'
  loading: false, // Глобальный лоадер запросов
  error: null, // Текст ошибки с бэкенда
}

const liveDuelSlice = createSlice({
  name: 'liveDuel',
  initialState,
  reducers: {
    // Сброс состояния дуэли при выходе из комнаты
    resetLiveDuelState: (state) => {
      state.currentRoom = null
      state.calendarRooms = []
      state.myActiveSlots = []
      state.aiGreeting = ''
      state.searchStatus = 'idle'
      state.loading = false
      state.error = null
    },
    // Возможность вручную переключить статус поиска (например, для локальных анимаций)
    setSearchStatus: (state, action) => {
      state.searchStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Создание комнаты ---
      .addCase(fetchCreateLiveRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCreateLiveRoom.fulfilled, (state, action) => {
        state.loading = false
        state.currentRoom = action.payload.room
        // Если это календарь — НЕ включаем статус поиска (экран 'searching' не нужен)
        if (action.payload.room.creation_type !== 'calendar') {
          state.searchStatus = 'searching'
        }
      })
      .addCase(fetchCreateLiveRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // --- Подключение к комнате ---
      .addCase(fetchJoinLiveRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJoinLiveRoom.fulfilled, (state, action) => {
        state.loading = false
        state.currentRoom = action.payload.room
        state.searchStatus = 'active' // Пару успешно нашли / подключились по ссылке
      })
      .addCase(fetchJoinLiveRoom.rejected, (state, action) => {
        state.loading = false
        state.searchStatus = 'failed'
        state.error = action.payload
      })

      // --- Переключение на ИИ-бота ---
      .addCase(fetchFallbackToAiBot.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFallbackToAiBot.fulfilled, (state, action) => {
        state.loading = false
        state.currentRoom = action.payload.room
        state.aiGreeting = action.payload.ai_greeting
        state.searchStatus = 'active' // Перешли в активную фазу тренировки с ИИ
      })
      .addCase(fetchFallbackToAiBot.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // --- проверка статуса ссылки-приглашения ---
      .addCase(fetchCheckRoomStatus.fulfilled, (state, action) => {
        state.currentRoom = action.payload.room
        if (action.payload.room?.status === 'active') {
          state.searchStatus = 'active'
        }
      })
      // --- завершение дуэли ---
      .addCase(fetchSubmitLiveRating.fulfilled, (state, action) => {
        state.currentRoom = action.payload.room
      })
      // --- получение календаря дуэлей ---
      .addCase(fetchGetCalendarRooms.fulfilled, (state, action) => {
        state.calendarRooms = action.payload.rooms
      })
      // Обработка получения личных слотов
      .addCase(fetchGetMyActiveSlots.fulfilled, (state, action) => {
        state.myActiveSlots = action.payload.rooms
      })
      // Обработка удаления слота на уровне стейта
      .addCase(fetchDeleteLiveRoom.fulfilled, (state, action) => {
        state.myActiveSlots = state.myActiveSlots.filter(
          (room) => room._id !== action.payload.roomId,
        )
      })
      // Обработка обновления слота на уровне стейта
      .addCase(fetchUpdateLiveRoomDate.fulfilled, (state, action) => {
        const index = state.myActiveSlots.findIndex(
          (room) => room._id === action.payload.room._id,
        )
        if (index !== -1) {
          state.myActiveSlots[index] = action.payload.room
        }
      })
  },
})

export const { resetLiveDuelState, setSearchStatus } =
  liveDuelSlice.actions
export {
  fetchCreateLiveRoom,
  fetchJoinLiveRoom,
  fetchFallbackToAiBot,
  fetchCheckRoomStatus,
  fetchSubmitLiveRating,
  fetchGetCalendarRooms,
  fetchGetMyActiveSlots,
  fetchDeleteLiveRoom,
  fetchUpdateLiveRoomDate,
}
export default liveDuelSlice.reducer
