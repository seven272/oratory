import express from 'express'
import {
  createRoom,
  joinRoom,
  checkRoomStatus,
  fallbackToAi,
  submitRating,
  getCalendarRooms,
  getMyActiveSlots,
  updateSlotDate,
  deleteSlot,
  checkInviteToken,
  checkRatingStatus
} from '../controllers/liveDuelController.js'

import { checkAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/create-room', checkAuth, createRoom)
router.post('/join-room', checkAuth, joinRoom)
router.post('/check-status', checkAuth, checkRoomStatus)
router.post('/fallback-ai', checkAuth, fallbackToAi)
router.post('/submit-rating', checkAuth, submitRating)
router.get('/calendar-rooms', checkAuth, getCalendarRooms)
router.get('/my-slots', checkAuth, getMyActiveSlots) 
router.get('/check-invite/:token', checkAuth, checkInviteToken) 
router.get('/rating-status/:roomId', checkAuth, checkRatingStatus)
router.put('/update-slot', checkAuth, updateSlotDate) 
router.delete('/delete-slot/:roomId', checkAuth, deleteSlot)

export default router
