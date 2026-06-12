import express from 'express'
import {
  createRoom,
  joinRoom,
  fallbackToAi,
} from '../controllers/liveDuelController.js'

import { checkAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/create-room', checkAuth, createRoom)
router.post('/join-room', checkAuth, joinRoom)
router.post('/fallback-ai', checkAuth, fallbackToAi)

export default router
