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

import {
  startVipCloseTrainer,
  generateVipCloseResponse,
  finishVipCloseTrainer,
} from '../controllers/ai-courses-simulators/self-pitch-pro/vip-client-close/vipClientCloseController.js'

import {
  startNetworkingTrainer,
  generateNetworkingResponse,
  finishNetworkingTrainer,
} from '../controllers/ai-courses-simulators/self-pitch-pro/networking-expert/networkingExpertController.js'

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
aiCourseSimulatorRouter.post(
  '/pitch-master/pitch/start',
  checkAuth,
  startPitchTrainer,
)
aiCourseSimulatorRouter.post(
  '/pitch-master/pitch/respond',
  checkAuth,
  upload.single('file'),
  generatePitchResponse,
)
aiCourseSimulatorRouter.post(
  '/pitch-master/pitch/finish',
  checkAuth,
  finishPitchTrainer,
)

// тренажер Обработка возвражений
aiCourseSimulatorRouter.post(
  '/pitch-master/objection/start',
  checkAuth,
  startObjectionTrainer,
)

aiCourseSimulatorRouter.post(
  '/pitch-master/objection/respond',
  checkAuth,
  upload.single('file'),
  generateObjectionResponse,
)
aiCourseSimulatorRouter.post(
  '/pitch-master/objection/finish',
  checkAuth,
  finishObjectionTrainer,
)

/* ==========================================================================
   🤝 Курс Личный бренд: Самопрезентация на миллион
   ========================================================================== */
// тренажер Встреча на миллион: Закрытие VIP-клиента
aiCourseSimulatorRouter.post(
  '/self-pitch-pro/vip-client-close/start',
  checkAuth,
  startVipCloseTrainer,
)

aiCourseSimulatorRouter.post(
  '/self-pitch-pro/vip-client-close/respond',
  checkAuth,
  upload.single('file'),
  generateVipCloseResponse,
)

aiCourseSimulatorRouter.post(
  '/self-pitch-pro/vip-client-close/finish',
  checkAuth,
  finishVipCloseTrainer,
)

// --- ТРЕНАЖЕР 2: Нетворкинг-мастер: Бизнес-знакомство ---
aiCourseSimulatorRouter.post(
  '/self-pitch-pro/networking-expert/start',
  checkAuth,
  startNetworkingTrainer,
)

aiCourseSimulatorRouter.post(
  '/self-pitch-pro/networking-expert/respond',
  checkAuth,
  upload.single('file'), // Перехват аудиозаписи
  generateNetworkingResponse,
)

aiCourseSimulatorRouter.post(
  '/self-pitch-pro/networking-expert/finish',
  checkAuth,
  finishNetworkingTrainer,
)

export default aiCourseSimulatorRouter
