import express from 'express'
import {
  startDebate,
  generateDebateResponse,
  finishDebate,
  startInterView,
  generateInterviewResponse,
  finishInterview,
  startIcebreaker,
  generateIcebreakerResponse,
  finishIcebreaker,
  startTribune,
  responseTribune,
  finishTribune
} from '../controllers/aiExerciseController.js'

const router = express.Router()
//роутеры упражнения Дебаты
//@route   POST /api/ai/start
//@desc    Инициализация  тренажера дебаты
router.post('/start-debate', startDebate)
//@route   POST /api/ai/user-response
//@desc    Отправка сообщения пользователя и получение ответа от ИИ дебаты
router.post('/response-debate', generateDebateResponse)
//@route   POST /api/ai/finish-debate
//@desc    Завершение дебатов и получение оценки от ИИ
router.post('/finish-debate', finishDebate)

//роутеры упражнения Интервью
router.post('/start-interview', startInterView)
router.post('/response-interview', generateInterviewResponse)
router.post('/finish-interview', finishInterview)

//роутеры упражнения Ледокол
router.post('/start-icebreaker', startIcebreaker)
router.post('/response-icebreaker', generateIcebreakerResponse)
router.post('/finish-icebreaker', finishIcebreaker)

//роутеры упражнения Трибуна
router.post('/start-tribune', startTribune)
router.post('/response-tribune', responseTribune)
router.post('/finish-tribune', finishTribune)

export default router
