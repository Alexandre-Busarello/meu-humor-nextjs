// Core Types
export interface MoodEntry {
  id: string;
  timestamp: number;
  score: number;
  note: string;
  ai_analysis?: string;
  user_id?: string;
  created_at?: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  content: string;
  timestamp: number;
  recordType: 'GLOBAL' | 'PARCIAL';
  moodEntryIds: string[];
  generationMonth?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPlan {
  id: string;
  userId: string;
  planType: 'FREE' | 'ESSENTIAL' | 'PREMIUM';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// OnBoarding Types
export interface OnBoardingStatus {
  hasSeenOnBoarding: boolean;
  completedSteps: string[];
  lastCompletedStep?: string;
  lastUpdated: number;
  isComplete: boolean;
}

export interface OnBoardingUserData {
  // Personal info (Step 1)
  name?: string;
  phone?: string;
  isAnonymous?: boolean;
  recoveryEmail?: string;
  
  // Demographics (Step 2)
  age?: number;
  ageRange?: string;
  gender?: 'masculino' | 'feminino' | 'nao-binario' | 'prefiro-nao-informar' | string;
  location?: string;
  region?: string;
  
  // Motivation (Step 3)
  motivation?: 'melhorar-humor' | 'gerenciar-estresse' | 'acompanhar-emocoes' | 'recomendacao-profissional' | 'curiosidade' | 'outro';
  motivationOther?: string;
  
  // Current mood (Step 4)
  currentMood?: number;
  moodNote?: string;
  
  // Depression screening (Step 5)
  phq2_interest?: 'nunca' | 'raramente' | 'as-vezes' | 'frequentemente' | 'sempre';
  phq2_depressed?: 'nunca' | 'raramente' | 'as-vezes' | 'frequentemente' | 'sempre';
  depressionScreening?: Record<string, number>;
  depressionScore?: number;
  
  // Anxiety screening (Step 6)
  gad2_nervous?: 'nunca' | 'raramente' | 'as-vezes' | 'frequentemente' | 'sempre';
  gad2_worry?: 'nunca' | 'raramente' | 'as-vezes' | 'frequentemente' | 'sempre';
  anxietyScreening?: Record<string, number>;
  anxietyScore?: number;
  
  // Mental health history (Step 7)
  hasMentalHealthCondition?: boolean;
  mentalHealthConditionDetails?: string;
  
  // Current treatment (Step 8)
  isReceivingTreatment?: boolean;
  treatmentDetails?: string;
  psychiatricMedications?: string;
  
  // Sleep quality (Step 9)
  sleepQuality?: 'ruim' | 'razoavel' | 'boa' | 'excelente';
  sleepHoursPerNight?: number;
  sleepIssues?: string[];
  
  // Social support (Step 10)
  hasSupportSystem?: boolean;
  supportSystemDetails?: string[];
  
  // Additional info (Step 11)
  additionalInfo?: string;
  goals?: string[];
  
  // Metadata
  createdAt?: number;
  updatedAt?: number;
}

export interface OnBoardingStep {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
}

// Weekly Summary Type
export interface WeeklySummary {
  averageMood: number;
  bestDay: {
    date: string;
    score: number;
  };
  worstDay: {
    date: string;
    score: number;
  };
  recommendation: string;
}

// Chart Data Type
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }[];
}

// API Response Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

export interface CanGenerateRecordResponse {
  canGenerate: boolean;
  reason: string;
  isPremium: boolean;
  newMoodsCount: number;
  requiredMoods: number;
  generationsThisMonth: number;
  monthlyLimit: number;
}
