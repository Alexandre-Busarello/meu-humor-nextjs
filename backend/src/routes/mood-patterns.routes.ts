import { Router } from 'express';
import { MoodController } from '../controllers/mood.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const moodController = new MoodController();

// All routes require authentication
router.use(authenticateToken);

// Pattern analysis routes
router.get('/daily-average', (req, res, next) => moodController.getDailyAverage(req, res, next));
router.get('/concerning', (req, res, next) => moodController.hasConcerningPattern(req, res, next));

export default router;

