import express from 'express'
import {
  createRoom,
  joinRoom,
  fallbackToAi,
  submitRating,
  getCalendarRooms,
  getMyActiveSlots,
  updateSlotDate,
  deleteSlot,
} from '../controllers/liveDuelController.js'

import { checkAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/create-room', checkAuth, createRoom)
router.post('/join-room', checkAuth, joinRoom)
router.post('/fallback-ai', checkAuth, fallbackToAi)
router.post('/submit-rating', checkAuth, submitRating)
router.get('/calendar-rooms', checkAuth, getCalendarRooms)
router.get('/my-slots', checkAuth, getMyActiveSlots) 
router.put('/update-slot', checkAuth, updateSlotDate) 
router.delete('/delete-slot/:room_id', checkAuth, deleteSlot)

export default router
