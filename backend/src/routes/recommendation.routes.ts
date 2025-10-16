import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const recommendationController = new RecommendationController();

// All routes require authentication
router.use(authenticateToken);

// GET /api/recommendations - Get personalized recommendation
router.get('/', (req, res, next) => 
  recommendationController.getRecommendation(req, res, next)
);

// POST /api/recommendations/refresh - Refresh recommendation
router.post('/refresh', (req, res, next) => 
  recommendationController.refreshRecommendation(req, res, next)
);

export default router;

