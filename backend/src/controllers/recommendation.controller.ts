import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { AppError } from '../middleware/error-handler';

const recommendationService = new RecommendationService();

export class RecommendationController {
  /**
   * GET /api/recommendations
   * Get personalized recommendation for the authenticated user
   */
  async getRecommendation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const recommendation = await recommendationService.generateRecommendation(req.userId);
      
      res.json({ recommendation });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * POST /api/recommendations/refresh
   * Refresh recommendation (invalidate cache and generate new one)
   */
  async refreshRecommendation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const recommendation = await recommendationService.refreshRecommendation(req.userId);
      
      res.json({ recommendation });
    } catch (error) {
      next(error);
    }
  }
}

