import { 
  MoodEntry, 
  HealthRecord, 
  OnBoardingUserData, 
  OnBoardingStatus,
  AuthResponse,
  ApiError,
  CanGenerateRecordResponse
} from '@/types';

// API URL - usa URL absoluta no servidor, relativa no cliente
const getApiUrl = () => {
  // Se estiver no servidor (Node.js), usa URL absoluta
  if (typeof window === 'undefined') {
    return process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api`
      : 'http://localhost:3000/api';
  }
  // Se estiver no cliente (browser), usa URL relativa
  return '/api';
};

const API_URL = getApiUrl();

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

// API request wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  // Add auth token if available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Request failed',
        statusCode: response.status,
      }));
      
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }
    
    // Handle 204 No Content responses (like DELETE)
    if (response.status === 204) {
      return undefined as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  async register(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth-legacy/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth-legacy/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token after successful login
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },
  
  async me(): Promise<AuthResponse['user']> {
    return apiRequest<AuthResponse['user']>('/auth-legacy/me');
  },
  
  async verifyToken(token: string): Promise<{ valid: boolean; user?: AuthResponse['user'] }> {
    return apiRequest<{ valid: boolean; user?: AuthResponse['user'] }>('/auth-legacy/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

// Mood Entries API
export const moodAPI = {
  async getAll(): Promise<MoodEntry[]> {
    return apiRequest<MoodEntry[]>('/mood-entries');
  },
  
  async getById(id: string): Promise<MoodEntry> {
    return apiRequest<MoodEntry>(`/mood-entries/${id}`);
  },
  
  async getByDateRange(startDate: number, endDate: number): Promise<MoodEntry[]> {
    return apiRequest<MoodEntry[]>(
      `/mood-entries/date-range?startDate=${startDate}&endDate=${endDate}`
    );
  },
  
  async create(entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>): Promise<MoodEntry> {
    return apiRequest<MoodEntry>('/mood-entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },
  
  async update(id: string, entry: Partial<MoodEntry>): Promise<MoodEntry> {
    return apiRequest<MoodEntry>(`/mood-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  },
  
  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/mood-entries/${id}`, {
      method: 'DELETE',
    });
  },
};

// Mood Patterns API
export const moodPatternsAPI = {
  async getDailyAverage(date: string): Promise<{ average: number | null; count: number }> {
    return apiRequest<{ average: number | null; count: number }>(
      `/mood-patterns/daily-average?date=${date}`
    );
  },
  
  async checkConcerningPattern(days: number = 7): Promise<{ hasConcerningPattern: boolean; reason?: string }> {
    return apiRequest<{ hasConcerningPattern: boolean; reason?: string }>(
      `/mood-patterns/concerning?days=${days}`
    );
  },
};

// Health Records API
export const healthRecordsAPI = {
  async getAll(limit: number = 10): Promise<HealthRecord[]> {
    return apiRequest<HealthRecord[]>(`/health-records?limit=${limit}`);
  },
  
  async getAllParcial(limit: number = 10): Promise<HealthRecord[]> {
    return apiRequest<HealthRecord[]>(`/health-records?limit=${limit}`);
  },
  
  async getGlobal(): Promise<HealthRecord | null> {
    return apiRequest<HealthRecord | null>('/health-records/global');
  },
  
  async getById(id: string): Promise<HealthRecord> {
    return apiRequest<HealthRecord>(`/health-records/${id}`);
  },
  
  async canGenerate(): Promise<CanGenerateRecordResponse> {
    return apiRequest<CanGenerateRecordResponse>('/health-records/can-generate');
  },
  
  async generate(): Promise<HealthRecord> {
    return apiRequest<HealthRecord>('/health-records', {
      method: 'POST',
    });
  },
  
  async regenerate(id: string): Promise<HealthRecord> {
    return apiRequest<HealthRecord>(`/health-records/${id}`, {
      method: 'PUT',
    });
  },
  
  async deleteParcial(id: string): Promise<void> {
    return apiRequest<void>(`/health-records/${id}`, {
      method: 'DELETE',
    });
  },
};

// Onboarding API
export const onboardingAPI = {
  async getStatus(): Promise<OnBoardingStatus> {
    return apiRequest<OnBoardingStatus>('/onboarding/status');
  },
  
  async getUserData(): Promise<OnBoardingUserData | null> {
    return apiRequest<OnBoardingUserData | null>('/onboarding/user-data');
  },
  
  async updateUserData(data: Partial<OnBoardingUserData>): Promise<OnBoardingUserData> {
    return apiRequest<OnBoardingUserData>('/onboarding/user-data', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async completeStep(stepId: string): Promise<OnBoardingStatus> {
    return apiRequest<OnBoardingStatus>(`/onboarding/steps/${stepId}/complete`, {
      method: 'POST',
    });
  },
  
  async isStepCompleted(stepId: string): Promise<{ stepId: string; isCompleted: boolean }> {
    return apiRequest<{ stepId: string; isCompleted: boolean }>(
      `/onboarding/steps/${stepId}/is-completed`
    );
  },
  
  async isRequiredComplete(): Promise<{ isComplete: boolean }> {
    return apiRequest<{ isComplete: boolean }>('/onboarding/is-required-complete');
  },
  
  async reset(): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/onboarding/reset', {
      method: 'POST',
    });
  },
};

// Recommendations API
export const recommendationsAPI = {
  async get(): Promise<{ recommendation: string }> {
    return apiRequest<{ recommendation: string }>('/recommendations');
  },
  
  async refresh(): Promise<{ recommendation: string }> {
    return apiRequest<{ recommendation: string }>('/recommendations/refresh', {
      method: 'POST',
    });
  },
};

// Export all APIs
const apiClient = {
  auth: authAPI,
  mood: moodAPI,
  moodPatterns: moodPatternsAPI,
  healthRecords: healthRecordsAPI,
  onboarding: onboardingAPI,
  recommendations: recommendationsAPI,
};

export default apiClient;

