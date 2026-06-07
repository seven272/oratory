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

import {
  startAlibi,
  generateAlibiResponse,
  finishAlibi,
} from '../controllers/ai-exercises/alibiController.js'

import {
  startBargain,
  generateBargainResponse,
  finishBargain,
} from '../controllers/ai-exercises/bargainController.js'

import {
  startKnockout,
  generateKnockoutResponse,
  finishKnockout,
} from '../controllers/ai-exercises/knockoutController.js'

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

//роутеры упражнения Алиби
router.post('/start-alibi', checkAuth, startAlibi)
router.post(
  '/response-alibi',
  checkAuth,
  upload.single('audio'),
  generateAlibiResponse,
)
router.post('/finish-alibi', checkAuth, finishAlibi)

//роутеры упражнения Торг уместен
router.post('/start-bargain', checkAuth, startBargain)
router.post(
  '/response-bargain',
  checkAuth,
  upload.single('audio'),
  generateBargainResponse,
)
router.post('/finish-bargain', checkAuth, finishBargain)

//роутеры упражнения Остроумный нокаут
router.post('/start-knockout', checkAuth, startKnockout)
router.post(
  '/response-knockout',
  checkAuth,
  upload.single('audio'),
  generateKnockoutResponse,
)
router.post('/finish-knockout', checkAuth, finishKnockout)

export default router
