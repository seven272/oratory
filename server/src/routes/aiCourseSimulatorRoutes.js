import express from 'express'
import multer from 'multer'
import { checkAuth } from '../middlewares/authMiddleware.js'

import {
  startPitchTrainer,
  generatePitchResponse,
  finishPitchTrainer,
} from '../controllers/ai-courses-simulators/pitch-master/pitch/pitchController.js'

import {
  finishObjectionTrainer,
  generateObjectionResponse,
  startObjectionTrainer,
} from '../controllers/ai-courses-simulators/pitch-master/objection/objectionController.js'

const aiCourseSimulatorRouter = express.Router()

// Настройка multer для аудио
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

/* ==========================================================================
   🎯 КУРС "ПИТЧ НА МИЛЛИОН" (pitch_master),
   ========================================================================== */

// тренажер Питч с Инвестором

// Старт сессии тренажера Питч с инвестором
aiCourseSimulatorRouter.post(
  '/pitch-master/pitch/start',
  checkAuth,
  startPitchTrainer,
)
// Обработка ответа (тренажера Питч с инвестором)
aiCourseSimulatorRouter.post(
  '/pitch-master/pitch/respond',
  checkAuth,
  upload.single('file'),
  generatePitchResponse,
)
// Финализация и вердикт тренажера Питч с инвестором
aiCourseSimulatorRouter.post(
  '/pitch-master/pitch/finish',
  checkAuth,
  finishPitchTrainer,
)

// тренажер Обработка возвражений

// Старт сессии тренажера Обработка возвражений
aiCourseSimulatorRouter.post(
  '/pitch-master/objection/start',
  checkAuth,
  startObjectionTrainer,
)
// Обработка ответа тренажера Обработка возвражений
aiCourseSimulatorRouter.post(
  '/pitch-master/objection/respond',
  checkAuth,
  upload.single('file'),
  generateObjectionResponse,
)
// Финализация и вердикт тренажера Обработка возвражений
aiCourseSimulatorRouter.post(
  '/pitch-master/objection/finish',
  checkAuth,
  finishObjectionTrainer,
)


/* ==========================================================================
   🤝 БУДУЩИЕ КУРСЫ (Добавляются сюда одной строчкой)
   ========================================================================== */
// aiCourseSimulatorRouter.post('/negotiations/start', checkAuth, startNegotiationTrainer);

export default aiCourseSimulatorRouter
