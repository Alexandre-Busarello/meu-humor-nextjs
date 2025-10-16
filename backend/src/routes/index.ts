import { Router } from 'express';
import authRoutes from './auth.routes';
import moodRoutes from './mood.routes';
import moodPatternsRoutes from './mood-patterns.routes';
import healthRecordsRoutes from './health-records.routes';
import onboardingRoutes from './onboarding.routes';
import recommendationRoutes from './recommendation.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/mood-entries', moodRoutes);
router.use('/mood-patterns', moodPatternsRoutes);
router.use('/health-records', healthRecordsRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/recommendations', recommendationRoutes);

export default router;

