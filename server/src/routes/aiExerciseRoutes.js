import express from 'express'
import multer from 'multer'

import { checkAuth } from '../middlewares/authMiddleware.js'

import {
  startDebate,
  generateDebateResponse,
  finishDebate,
} from '../controllers/ai-exercises/debateController.js'
import {
  startInterview,
  generateInterviewResponse,
  finishInterview,
} from '../controllers/ai-exercises/interviewController.js'
import {
  startIcebreaker,
  generateIcebreakerResponse,
  finishIcebreaker,
} from '../controllers/ai-exercises/icebreakerController.js'
import {
  startTribune,
  responseTribune,
  finishTribune,
} from '../controllers/ai-exercises/tribuneController.js'

const router = express.Router()

// Настройка multer для удержания аудио в оперативной памяти (Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Максимум 10 МБ на реплику
})

//роутеры упражнения Дебаты
router.post('/start-debate', checkAuth, startDebate)
router.post(
  '/response-debate',
  checkAuth,
  upload.single('audio'),
  generateDebateResponse,
)
router.post('/finish-debate', checkAuth, finishDebate)

//роутеры упражнения Интервью
router.post('/start-interview', checkAuth, startInterview)
router.post(
  '/response-interview',
  checkAuth,
  upload.single('audio'),
  generateInterviewResponse,
)
router.post('/finish-interview', checkAuth, finishInterview)

//роутеры упражнения Ледокол
router.post('/start-icebreaker', checkAuth, startIcebreaker)
router.post(
  '/response-icebreaker',
  checkAuth,
  upload.single('audio'),
  generateIcebreakerResponse,
)
router.post('/finish-icebreaker', checkAuth, finishIcebreaker)

//роутеры упражнения Трибуна
router.post('/start-tribune', checkAuth, startTribune)
router.post(
  '/response-tribune',
  checkAuth,
  upload.single('audio'),
  responseTribune,
)
router.post('/finish-tribune', checkAuth, finishTribune)

export default router
