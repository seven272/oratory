import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axiosInstance'
import buildPitchCases from './ai-courses-reducers/pitchReducer.js'
import buildObjectionCases from './ai-courses-reducers/objectionReducer.js'

// 1. Инициализация прогресса по курсу
const fetchCourseProgress = createAsyncThunk(
  'course/fetchCourseProgress',
  async (courseCode, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/courses/progress/${courseCode}`,
      )
      return res.data // Возвращает { status: 'active'|'not_started', progress: {...} }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

// 2. Старт курса
const fetchStartCourse = createAsyncThunk(
  'course/fetchStartCourse',
  async (courseCode, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/courses/start', {
        courseCode,
      })
      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

// 3. Сдача квиза по теории
const fetchSubmitTheoryQuiz = createAsyncThunk(
  'course/fetchSubmitTheoryQuiz',
  async ({ courseCode, answerIndex }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/courses/submit-theory', {
        courseCode,
        answerIndex,
      })
      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

// 4. Отправка результатов ИИ-тренажера
const fetchSubmitAiWorkout = createAsyncThunk(
  'course/fetchSubmitAiWorkout',
  async ({ courseCode, score }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/courses/progress/ai-workout/${courseCode}`,
        { score },
      )
      console.log(res.data)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)
// 5. Отправка результатов реального челленджа
const fetchSubmitIrlReport = createAsyncThunk(
  'course/fetchSubmitIrlReport',
  async ({ courseCode, textReport }, { rejectWithValue }) => {
    try {
      // Отправляем POST-запрос на созданный роут
      const res = await axiosInstance.post('/courses/submit-irl', {
        courseCode,
        textReport,
      })

      // Возвращаем данные, которые прислал бэкенд (progressData)
      return res.data
    } catch (error) {
      // Ловим ошибку от бэкенда (например, "Отчет слишком короткий")
      const errorMessage =
        error.response?.data?.message || 'Не удалось отправить отчет'
      return rejectWithValue(errorMessage)
    }
  },
)
// 6. Экшен отправки экзамена на оценку
const fetchSubmitExam = createAsyncThunk(
  'course/fetchSubmitExam',
  async ({ formData }, { rejectWithValue }) => {
    try {
      // Отправляем FormData, axios сам выставит нужные boundary в заголовках
      const res = await axiosInstance.post(
        '/courses/exam/submit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return res.data // Возвращает { success, user_transcript, progressData }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Не удалось отправить экзамен на проверку ИИ'
      return rejectWithValue(errorMessage)
    }
  },
)

// 7. Экшен покупки попытки за монеты
const fetchUnlockExamWithCoins = createAsyncThunk(
  'course/fetchUnlockExamWithCoins',
  async ({ courseCode }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/courses/exam/unlock', {
        courseCode,
      })
      return res.data // Возвращает { success, message, remainingCoins, progressData }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Не удалось разблокировать экзамен'
      return rejectWithValue(errorMessage)
    }
  },
)

const fetchRestartCourse = createAsyncThunk(
  'course/fetchRestartCourse',
  async (courseCode, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/courses/restart', {
        courseCode,
      })
      return res.data // Вернет { success: true, progressData: ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Ошибка при перезапуске',
      )
    }
  },
)

const fetchGetArchiveCourses = createAsyncThunk(
  'course/fetchGetArchiveCourses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/courses/archive')
      return res.data // Вернет { success: true, archives: ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          'Ошибка при получении архива пройденных курсов',
      )
    }
  },
)
const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courseStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    status: 'not_started', // 'not_started' | 'active' | 'completed'
    examSubmittingStatus: 'idle', // 💡 ДОБАВИТЬ СЮДА: 'idle' | 'loading' | 'succeeded' | 'failed'
    currentBlockIndex: -1, // 0: теория, 1: ИИ, 2: IRL, 3: экзамен
    progressData: null,
    archives: [],
    error: null,
    aiChat: {
      preview: null,
      messages: [], // { role: 'assistant' | 'user', text: string }
      chatStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' (для крутилок)
      aiStatus: 'idle', // 'idle' | 'active' | 'ready_to_finish' | 'finished' (для экранов)
      verdict: null, // { totalScore, feedback, criteria }
      error: null,
    },
  },
  reducers: {
    updateAiScoreLocal: (state, action) => {
      if (state.progressData?.blocksProgress?.aiWorkout) {
        state.progressData.blocksProgress.aiWorkout.accumulatedScore +=
          action.payload
      }
    },
    clearCourseError: (state) => {
      state.error = null
    },
    nextBlock: (state) => {
      // Проверяем верхнеуровневый индекс
      if (
        state.currentBlockIndex >= 0 &&
        state.currentBlockIndex < 3
      ) {
        state.currentBlockIndex += 1

        // Синхронно обновляем индекс внутри объекта прогресса, если он загружен
        if (state.progressData) {
          state.progressData.currentBlockIndex =
            state.currentBlockIndex
        }
      }
    },
    resetAiChat: (state) => {
      state.aiChat = {
        preview: null,
        messages: [],
        chatStatus: 'idle',
        aiStatus: 'idle',
        verdict: null,
        error: null,
      }
    },
    // Экшен для ручной смены статуса ИИ, если потребуется
    setAiChatStatus(state, action) {
      state.aiChat.aiStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      /* ==========================================
         1. FETCH COURSE PROGRESS
         ========================================== */
      .addCase(fetchCourseProgress.pending, (state) => {
        state.courseStatus = 'loading'
        state.error = null
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.courseStatus = 'succeeded'
        state.status = action.payload.status
        if (action.payload.status === 'active') {
          state.progressData = action.payload.progress
          state.currentBlockIndex =
            action.payload.progress.currentBlockIndex
        }
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error =
          action.payload?.message || 'Не удалось загрузить прогресс'
      })

      /* ==========================================
         2. FETCH START COURSE
         ========================================== */
      .addCase(fetchStartCourse.pending, (state) => {
        state.courseStatus = 'loading'
        state.error = null
      })
      .addCase(fetchStartCourse.fulfilled, (state, action) => {
        state.courseStatus = 'succeeded'
        state.status = 'active'
        state.progressData = action.payload.progress
        state.currentBlockIndex =
          action.payload.progress.currentBlockIndex
      })
      .addCase(fetchStartCourse.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error =
          action.payload?.message || 'Не удалось начать курс'
      })

      /* ==========================================
         3. FETCH SUBMIT THEORY QUIZ
         ========================================== */
      .addCase(fetchSubmitTheoryQuiz.pending, (state) => {
        state.courseStatus = 'loading'
        state.error = null
      })
      .addCase(fetchSubmitTheoryQuiz.fulfilled, (state, action) => {
        state.courseStatus = 'succeeded'
        state.status = 'active'
        state.progressData = action.payload.progress
        state.currentBlockIndex =
          action.payload.progress.currentBlockIndex
      })
      .addCase(fetchSubmitTheoryQuiz.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error =
          action.payload?.message || 'Ошибка при отправке квиза'
      })

      /* ==========================================
         4. FETCH SUBMIT AI WORKOUT
         ========================================== */
      .addCase(fetchSubmitAiWorkout.pending, (state) => {
        state.courseStatus = 'loading'
        state.error = null
      })
      .addCase(fetchSubmitAiWorkout.fulfilled, (state, action) => {
        state.courseStatus = 'succeeded'
        state.status = action.payload.status || 'active'
        // Обратите внимание: здесь бэкенд возвращает progressData вместо progress
        state.progressData = action.payload.progressData
        state.currentBlockIndex = action.payload.currentBlockIndex
      })
      .addCase(fetchSubmitAiWorkout.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error =
          action.payload?.message ||
          'Ошибка сохранения результатов ИИ'
      })
      /* ==========================================
         5. FETCH  SUBMIT IRL CHALLENGE REPORT
         ========================================== */
      .addCase(fetchSubmitIrlReport.pending, (state) => {
        state.courseStatus = 'loading'
        state.error = null
      })
      .addCase(fetchSubmitIrlReport.fulfilled, (state, action) => {
        state.courseStatus = 'succeeded'

        // Записываем актуальный объект прогресса из БД
        state.progressData = action.payload.progressData

        // Синхронизируем верхнеуровневый индекс (он останется равен 2)
        if (action.payload.progressData) {
          state.currentBlockIndex =
            action.payload.progressData.currentBlockIndex
        }

        state.error = null
      })
      .addCase(fetchSubmitIrlReport.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error = action.payload
      })

      // --- SUBMIT EXAM REPORT ---
      .addCase(fetchSubmitExam.pending, (state) => {
        state.examSubmittingStatus = 'loading'
        state.error = null
      })
      .addCase(fetchSubmitExam.fulfilled, (state, action) => {
        state.examSubmittingStatus = 'succeeded'
        // Обновляем прогресс актуальными данными из БД
        state.progressData = action.payload.progressData

        // Синхронизируем статус курса ('active' или 'completed')
        if (action.payload.progressData) {
          state.status = action.payload.progressData.status
        }
        state.error = null
      })
      .addCase(fetchSubmitExam.rejected, (state, action) => {
        state.examSubmittingStatus = 'failed'
        state.error = action.payload // Записываем ошибку, чтобы показать юзеру
      })

      // --- UNLOCK EXAM WITH COINS ---
      .addCase(fetchUnlockExamWithCoins.pending, (state) => {
        state.courseStatus = 'loading'
        state.error = null
      })
      .addCase(
        fetchUnlockExamWithCoins.fulfilled,
        (state, action) => {
          state.courseStatus = 'succeeded'
          // Сервер сбросил lockedUntil в null, сохраняем обновленное состояние
          state.progressData = action.payload.progressData

          // Опционально: если вы храните баланс пользователя в этом же слайсе,
          // можно обновить его здесь через action.payload.remainingCoins

          state.error = null
          // Небольшой лайфхак: можно выводить успешный алерт о покупке,
          // либо обрабатывать это локально в компоненте через unwrap()
        },
      )
      .addCase(fetchUnlockExamWithCoins.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error = action.payload // Сюда прилетит "Недостаточно монет"
      })
      // --- RESTART COURSE ---
      .addCase(fetchRestartCourse.pending, (state) => {
        state.courseStatus = 'loading'
      })
      .addCase(fetchRestartCourse.fulfilled, (state, action) => {
        state.courseStatus = 'succeeded'
        state.progressData = action.payload.progressData
        state.status = action.payload.progressData.status // станет 'active'
        state.currentBlockIndex =
          action.payload.progressData.currentBlockIndex // станет 0
        state.error = null
      })
      .addCase(fetchRestartCourse.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error = action.payload
      })
      // --- GET ARCHIVES COURSES ---
      .addCase(fetchGetArchiveCourses.pending, (state) => {
        state.courseStatus = 'loading'
      })
      .addCase(fetchGetArchiveCourses.fulfilled, (state, action) => {
        state.courseStatus = 'succeeded'

        state.archives = action.payload.archives
        state.error = null
      })
      .addCase(fetchGetArchiveCourses.rejected, (state, action) => {
        state.courseStatus = 'failed'
        state.error = action.payload
      }) //точка с запятой обязательно

    /* ==========================================================================
       🔥 ИНТЕГРАЦИЯ ИИ-ТРЕНАЖЕРОВ
       ========================================================================== */
    // Передаем инстанс builder во внешний строитель кейсов для курса "Питч на миллион"
    buildPitchCases(builder)
    buildObjectionCases(builder)

    // Будущие курсы будут дописываться сюда ниже аналогично одной строчкой:
    // buildNegotiationCases(builder);
  },
})

export const {
  updateAiScoreLocal,
  clearCourseError,
  nextBlock,
  resetAiChat,
  setAiChatStatus,
} = courseSlice.actions
export {
  fetchCourseProgress,
  fetchStartCourse,
  fetchSubmitTheoryQuiz,
  fetchSubmitAiWorkout,
  fetchSubmitIrlReport,
  fetchSubmitExam,
  fetchUnlockExamWithCoins,
  fetchRestartCourse,
  fetchGetArchiveCourses,
}
export default courseSlice.reducer
