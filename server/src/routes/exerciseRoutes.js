import express from 'express';
import { completeExercise , getDailyTasks} from '../controllers/exerciseController.js';

import { checkAuth } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/complete', checkAuth, completeExercise);
router.get('/daily-tasks', checkAuth, getDailyTasks)


export default router;