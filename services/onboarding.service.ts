import { prisma } from '@/lib/prisma';
import { getCached, invalidateCache } from '@/lib/redis';

export interface OnboardingStatus {
  hasSeenOnBoarding: boolean;
  completedSteps: string[];
  lastCompletedStep?: string;
  lastUpdated: number;
  isComplete: boolean;
}

export interface OnboardingUserData {
  // Personal info
  name?: string;
  phone?: string;
  isAnonymous?: boolean;
  recoveryEmail?: string;
  
  // Demographics
  age?: number;
  ageRange?: string;
  gender?: string;
  location?: string;
  region?: string;
  
  // Motivation
  motivation?: string;
  motivationOther?: string;
  
  // Current mood
  currentMood?: number;
  moodNote?: string;
  
  // Depression screening
  phq2_interest?: string;
  phq2_depressed?: string;
  depressionScreening?: Record<string, number>;
  depressionScore?: number;
  
  // Anxiety screening
  gad2_nervous?: string;
  gad2_worry?: string;
  anxietyScreening?: Record<string, number>;
  anxietyScore?: number;
  
  // Mental health history
  hasMentalHealthCondition?: boolean;
  mentalHealthConditionDetails?: string;
  
  // Current treatment
  isReceivingTreatment?: boolean;
  treatmentDetails?: string;
  psychiatricMedications?: string;
  
  // Sleep quality
  sleepQuality?: string;
  sleepHoursPerNight?: number;
  sleepIssues?: string[];
  
  // Social support
  hasSupportSystem?: boolean;
  supportSystemDetails?: string[];
  
  // Additional info
  additionalInfo?: string;
  goals?: string[];
  
  // Metadata
  createdAt?: number;
  updatedAt?: number;
}

// Required steps for minimum onboarding
const REQUIRED_STEPS = [
  'personal-info',
  'demographics',
  'motivation',
  'current-mood',
];

export class OnboardingService {
  /**
   * Get onboarding status for a user
   */
  async getStatus(userId: string): Promise<OnboardingStatus> {
    const cacheKey = `onboarding:status:${userId}`;
    
    return getCached(cacheKey, 900, async () => {
      const data = await prisma.onboardingUserData.findUnique({
        where: { userId },
      });
      
      if (!data) {
        return {
          hasSeenOnBoarding: false,
          completedSteps: [],
          lastUpdated: Date.now(),
          isComplete: false,
        };
      }
      
      return {
        hasSeenOnBoarding: true,
        completedSteps: data.completedSteps,
        lastCompletedStep: data.completedSteps[data.completedSteps.length - 1],
        lastUpdated: data.updatedAt.getTime(),
        isComplete: data.isComplete,
      };
    });
  }
  
  /**
   * Get onboarding user data
   */
  async getUserData(userId: string): Promise<OnboardingUserData | null> {
    const cacheKey = `onboarding:data:${userId}`;
    
    return getCached(cacheKey, 900, async () => {
      const data = await prisma.onboardingUserData.findUnique({
        where: { userId },
      });
      
      if (!data) {
        return null;
      }
      
      return data.data as OnboardingUserData;
    });
  }
  
  /**
   * Update onboarding user data
   */
  async updateUserData(
    userId: string,
    newData: Partial<OnboardingUserData>
  ): Promise<OnboardingUserData> {
    // Get existing data
    const existing = await prisma.onboardingUserData.findUnique({
      where: { userId },
    });
    
    // Merge data
    const currentData = (existing?.data as OnboardingUserData) || {};
    const updatedData = {
      ...currentData,
      ...newData,
      updatedAt: Date.now(),
    };
    
    // Upsert data
    const result = await prisma.onboardingUserData.upsert({
      where: { userId },
      create: {
        userId,
        data: updatedData,
        completedSteps: existing?.completedSteps || [],
        isComplete: false,
      },
      update: {
        data: updatedData,
      },
    });
    
    // Invalidate cache
    await this.invalidateUserCache(userId);
    
    return result.data as OnboardingUserData;
  }
  
  /**
   * Mark a step as complete
   */
  async completeStep(userId: string, stepId: string): Promise<void> {
    const existing = await prisma.onboardingUserData.findUnique({
      where: { userId },
    });
    
    const currentSteps = existing?.completedSteps || [];
    
    // Add step if not already completed
    if (!currentSteps.includes(stepId)) {
      currentSteps.push(stepId);
    }
    
    // Check if all required steps are complete
    const isComplete = REQUIRED_STEPS.every(step => currentSteps.includes(step));
    
    // Update
    const updated = await prisma.onboardingUserData.upsert({
      where: { userId },
      create: {
        userId,
        data: existing?.data || {},
        completedSteps: currentSteps,
        isComplete,
      },
      update: {
        completedSteps: currentSteps,
        isComplete,
      },
    });
    
    // If this is the current-mood step, create a MoodEntry
    // Use the updated data to ensure we have the latest currentMood
    if (stepId === 'current-mood') {
      const userData = updated.data as OnboardingUserData;
      if (userData.currentMood !== undefined) {
        try {
          await prisma.moodEntry.create({
            data: {
              userId,
              timestamp: BigInt(Date.now()),
              score: userData.currentMood,
              note: userData.moodNote || '',
            },
          });
          console.log('✅ MoodEntry created from onboarding:', {
            userId,
            score: userData.currentMood,
            note: userData.moodNote,
          });
        } catch (error) {
          console.error('❌ Error creating mood entry from onboarding:', error);
          // Don't throw - onboarding should continue even if mood entry fails
        }
      } else {
        console.warn('⚠️ No currentMood found in onboarding data when completing current-mood step');
      }
    }
    
    // Invalidate cache
    await this.invalidateUserCache(userId);
  }
  
  /**
   * Check if a specific step is completed
   */
  async isStepCompleted(userId: string, stepId: string): Promise<boolean> {
    const status = await this.getStatus(userId);
    return status.completedSteps.includes(stepId);
  }
  
  /**
   * Check if required onboarding is complete
   */
  async isRequiredComplete(userId: string): Promise<boolean> {
    const status = await this.getStatus(userId);
    return REQUIRED_STEPS.every(step => status.completedSteps.includes(step));
  }
  
  /**
   * Reset onboarding (for testing or re-onboarding)
   */
  async resetOnboarding(userId: string): Promise<void> {
    await prisma.onboardingUserData.update({
      where: { userId },
      data: {
        completedSteps: [],
        isComplete: false,
      },
    });
    
    await this.invalidateUserCache(userId);
  }
  
  /**
   * Invalidate cache for a user
   */
  private async invalidateUserCache(userId: string) {
    await invalidateCache(`onboarding:*:${userId}*`);
  }
}

