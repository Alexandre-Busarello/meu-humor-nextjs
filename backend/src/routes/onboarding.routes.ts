import { Router } from 'express';
import { OnboardingController } from '../controllers/onboarding.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const onboardingController = new OnboardingController();

// All onboarding routes require authentication
router.use(authenticateToken);

// Onboarding routes
router.get('/status', (req, res, next) => onboardingController.getStatus(req, res, next));
router.get('/user-data', (req, res, next) => onboardingController.getUserData(req, res, next));
router.put('/user-data', (req, res, next) => onboardingController.updateUserData(req, res, next));
router.post('/steps/:stepId/complete', (req, res, next) => onboardingController.completeStep(req, res, next));
router.get('/steps/:stepId/is-completed', (req, res, next) => onboardingController.isStepCompleted(req, res, next));
router.get('/is-required-complete', (req, res, next) => onboardingController.isRequiredComplete(req, res, next));
router.post('/reset', (req, res, next) => onboardingController.resetOnboarding(req, res, next));

export default router;

