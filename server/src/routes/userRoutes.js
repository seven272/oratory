import { Router } from "express";
import { login, register, logout, getMe, getUserDashboard } from "../controllers/userController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = new Router()

// localhost:5020/api/user/register
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', checkAuth, getMe)
router.get('/user-statistics', checkAuth, getUserDashboard)




export default router