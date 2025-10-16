import { Router } from 'express';
import { MoodController } from '../controllers/mood.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const moodController = new MoodController();

// All mood routes require authentication
router.use(authenticateToken);

// Mood entries
router.get('/', (req, res, next) => moodController.getAllEntries(req, res, next));
router.get('/date-range', (req, res, next) => moodController.getEntriesByDateRange(req, res, next));
router.get('/:id', (req, res, next) => moodController.getEntryById(req, res, next));
router.post('/', (req, res, next) => moodController.createEntry(req, res, next));
router.put('/:id', (req, res, next) => moodController.updateEntry(req, res, next));
router.delete('/:id', (req, res, next) => moodController.deleteEntry(req, res, next));

export default router;

