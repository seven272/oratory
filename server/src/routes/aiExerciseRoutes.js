import express from 'express'

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

//роутеры упражнения Дебаты
router.post('/start-debate', checkAuth, startDebate)
router.post('/response-debate', checkAuth, generateDebateResponse)
router.post('/finish-debate', checkAuth, finishDebate)

//роутеры упражнения Интервью
router.post('/start-interview', checkAuth, startInterview)
router.post(
  '/response-interview',
  checkAuth,
  generateInterviewResponse,
)
router.post('/finish-interview', checkAuth, finishInterview)

//роутеры упражнения Ледокол
router.post('/start-icebreaker', checkAuth, startIcebreaker)
router.post(
  '/response-icebreaker',
  checkAuth,
  generateIcebreakerResponse,
)
router.post('/finish-icebreaker', checkAuth, finishIcebreaker)

//роутеры упражнения Трибуна
router.post('/start-tribune', checkAuth, startTribune)
router.post('/response-tribune', checkAuth, responseTribune)
router.post('/finish-tribune', checkAuth, finishTribune)

export default router
