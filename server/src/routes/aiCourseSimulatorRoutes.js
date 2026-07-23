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

import {
  startHrScreenerTrainer,
  generateHrScreenerResponse,
  finishHrScreenerTrainer,
} from '../controllers/ai-courses-simulators/hr-storm/hr-screener/hrScreenerController.js'

import {
  startStressInterviewTrainer,
  generateStressResponse,
  finishStressInterviewTrainer,
} from '../controllers/ai-courses-simulators/hr-storm/stress-interview/stressInterviewController.js'

import {
  startBarSmallTalkTrainer,
  generateBarSmallTalkResponse,
  finishBarSmallTalkTrainer,
} from '../controllers/ai-courses-simulators/party-charisma/bar-small-talk/barSmallTalkController.js'

import {
  startVipAfterpartyTrainer,
  generateVipAfterpartyResponse,
  finishVipAfterpartyTrainer,
} from '../controllers/ai-courses-simulators/party-charisma/vip-afterparty/vipAfterpartyController.js'

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
// Тренажер первичное собеседование
aiCourseSimulatorRouter.post(
  '/hr-storm/hr-screener/start',
  checkAuth,
  startHrScreenerTrainer,
)

// Обработка аудио-ответов и генерация реплик рекрутера
aiCourseSimulatorRouter.post(
  '/hr-storm/hr-screener/respond',
  checkAuth,
  upload.single('file'), // Перехват аудиофайла через thunk-ключ 'file'
  generateHrScreenerResponse,
)

// Финализация интервью, ИИ-анализ софт-скиллов по STAR и начисление баллов
aiCourseSimulatorRouter.post(
  '/hr-storm/hr-screener/finish',
  checkAuth,
  finishHrScreenerTrainer,
)

// Стресс-интервью с будущим боссом
aiCourseSimulatorRouter.post(
  '/hr-storm/stress-interview/start',
  checkAuth,
  startStressInterviewTrainer,
)

aiCourseSimulatorRouter.post(
  '/hr-storm/stress-interview/respond',
  checkAuth,
  upload.single('file'), // Перехват аудиофайла через thunk-ключ 'file'
  generateStressResponse,
)

aiCourseSimulatorRouter.post(
  '/hr-storm/stress-interview/finish',
  checkAuth,
  finishStressInterviewTrainer,
)

/* ==========================================================================
   🥂 КУРС: Харизма нетворкинга: Свой в любой компании (party_charisma)
   ========================================================================== */

// --- ТРЕНАЖЕР 1: Разговор у барной стойки (bar_small_talk) ---
// Инициализация сессии Small Talk у бара
aiCourseSimulatorRouter.post(
  '/party-charisma/bar-small-talk/start',
  checkAuth,
  startBarSmallTalkTrainer,
)

// Обработка аудио-ответов и генерация реплик собеседника у бара
aiCourseSimulatorRouter.post(
  '/party-charisma/bar-small-talk/respond',
  checkAuth,
  upload.single('file'), // Перехват аудиозаписи через thunk-ключ 'file'
  generateBarSmallTalkResponse,
)

// Финализация Small Talk, ИИ-анализ по критериям и начисление баллов
aiCourseSimulatorRouter.post(
  '/party-charisma/bar-small-talk/finish',
  checkAuth,
  finishBarSmallTalkTrainer,
)

// --- ТРЕНАЖЕР 2: Закрытое афтерпати лидеров (vip_afterparty) ---
// Инициализация беседы на VIP-афтерпати
aiCourseSimulatorRouter.post(
  '/party-charisma/vip-afterparty/start',
  checkAuth,
  startVipAfterpartyTrainer,
)

// Обработка ответов на афтерпати и генерация реплик VIP-гостя
aiCourseSimulatorRouter.post(
  '/party-charisma/vip-afterparty/respond',
  checkAuth,
  upload.single('file'), // Перехват аудиозаписи через thunk-ключ 'file'
  generateVipAfterpartyResponse,
)

// Финализация VIP-встречи, ИИ-анализ статуса и экологичного выхода
aiCourseSimulatorRouter.post(
  '/party-charisma/vip-afterparty/finish',
  checkAuth,
  finishVipAfterpartyTrainer,
)

export default aiCourseSimulatorRouter
