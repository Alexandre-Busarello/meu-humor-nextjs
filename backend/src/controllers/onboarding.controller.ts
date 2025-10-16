import { Request, Response, NextFunction } from 'express';
import { OnboardingService } from '../services/onboarding.service';
import { AppError } from '../middleware/error-handler';

const onboardingService = new OnboardingService();

export class OnboardingController {
  /**
   * GET /api/onboarding/status
   * Get onboarding status
   */
  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const status = await onboardingService.getStatus(req.userId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/onboarding/user-data
   * Get onboarding user data
   */
  async getUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const data = await onboardingService.getUserData(req.userId);
      res.json(data || {});
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * PUT /api/onboarding/user-data
   * Update onboarding user data
   */
  async updateUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const data = await onboardingService.updateUserData(req.userId, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * POST /api/onboarding/steps/:stepId/complete
   * Mark a step as complete
   */
  async completeStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { stepId } = req.params;
      
      if (!stepId) {
        throw new AppError(400, 'stepId is required');
      }
      
      await onboardingService.completeStep(req.userId, stepId);
      
      // Return updated status
      const status = await onboardingService.getStatus(req.userId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/onboarding/steps/:stepId/is-completed
   * Check if a step is completed
   */
  async isStepCompleted(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const { stepId } = req.params;
      
      if (!stepId) {
        throw new AppError(400, 'stepId is required');
      }
      
      const isCompleted = await onboardingService.isStepCompleted(req.userId, stepId);
      res.json({ stepId, isCompleted });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * GET /api/onboarding/is-required-complete
   * Check if required onboarding is complete
   */
  async isRequiredComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      const isComplete = await onboardingService.isRequiredComplete(req.userId);
      res.json({ isComplete });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * POST /api/onboarding/reset
   * Reset onboarding (for testing)
   */
  async resetOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        throw new AppError(401, 'Not authenticated');
      }
      
      await onboardingService.resetOnboarding(req.userId);
      res.json({ message: 'Onboarding reset successfully' });
    } catch (error) {
      next(error);
    }
  }
}

