import express from 'express'
import {
  getCourseProgress,
  startCourse,
  submitTheory,
  submitAiWorkout,
  submitIrlReport,
  submitExamReport,
  unlockExamWithCoins,
  restartCourse,
  getUserCoursesArchive
} from '../controllers/courseController.js'

import { checkAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

// 1. Получить актуальный прогресс пользователя по конкретному курсу
router.get('/progress/:courseCode', checkAuth, getCourseProgress)

// 2. Старт курса (Блок 1: создание записи UserCourseProgress)
router.post('/start', checkAuth, startCourse)

// 3. Проверка ответа на квиз (Завершение Блока 1 и переход к Блоку 2)
router.post('/submit-theory', checkAuth, submitTheory)

// 4. Прохождение ИИ тренажеров
router.post(
  '/progress/ai-workout/:courseCode',
  checkAuth,
  submitAiWorkout,
)

// 4. Сдача текстового отчета по реальной практике (Завершение Блока 3 и переход к Блоку 4)
router.post('/submit-irl', checkAuth, submitIrlReport)

// 5 Роут для симуляции сдачи экзамена (принимает { courseCode, testMode })
router.post('/exam/submit', checkAuth, submitExamReport)

// 6 Роут для досрочного выкупа попытки за монеты (принимает { courseCode })
router.post('/exam/unlock', checkAuth, unlockExamWithCoins)

// 7 Роут перезапуск курса
router.post('/restart', checkAuth, restartCourse)

// 7 Роут получения списка пройденных курсов
router.get('/archive', checkAuth, getUserCoursesArchive)

export default router
