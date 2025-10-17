import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCached, invalidateCache } from '@/lib/redis';
import { timestampToDate } from '@/lib/utils/timezone';

// Plan limits for PARCIAL health record generation per month
const PLAN_LIMITS = {
  FREE: 2,
  ESSENTIAL: 2,
  PREMIUM: -1, // unlimited
};

// Minimum new moods required to generate a parcial record
const MIN_NEW_MOODS = 7;

// Lookback period for new moods (in days)
const MOOD_LOOKBACK_DAYS = 5;

export class HealthRecordService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Health record generation will fail.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }
  
  /**
   * Get all PARCIAL health records for a user
   */
  async getRecords(userId: string, limit: number = 10, includeGlobal: boolean = false) {
    const cacheKey = `health-records:${userId}:${limit}:${includeGlobal}`;
    
    return getCached(cacheKey, 600, async () => {
      // Cache for 10 minutes
      const where = includeGlobal 
        ? { userId }
        : { userId, recordType: 'PARCIAL' as const };
      
      return prisma.healthRecord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    });
  }
  
  /**
   * Get the GLOBAL health record for a user
   */
  async getGlobalRecord(userId: string) {
    const cacheKey = `health-record:global:${userId}`;
    
    return getCached(cacheKey, 600, async () => {
      // Cache for 10 minutes
      return prisma.healthRecord.findFirst({
        where: { 
          userId,
          recordType: 'GLOBAL'
        },
        orderBy: { updatedAt: 'desc' },
      });
    });
  }
  
  /**
   * Get a single health record by ID
   */
  async getRecordById(recordId: string, userId: string) {
    const record = await prisma.healthRecord.findFirst({
      where: {
        id: recordId,
        userId,
      },
    });
    
    if (!record) {
      throw new Error('Health record not found');
    }
    
    return record;
  }
  
  /**
   * Get unused mood entries (not used in any PARCIAL record)
   */
  private async getUnusedMoodEntries(userId: string, days: number) {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    // Get all mood entries from the last N days
    const recentMoods = await prisma.moodEntry.findMany({
      where: {
        userId,
        timestamp: {
          gte: BigInt(cutoffTime),
        },
      },
      orderBy: { timestamp: 'asc' },
    });
    
    // Get all mood entry IDs already used in PARCIAL records
    const parcialRecords = await prisma.healthRecord.findMany({
      where: {
        userId,
        recordType: 'PARCIAL',
      },
      select: {
        moodEntryIds: true,
      },
    });
    
    const usedMoodIds = new Set(
      parcialRecords.flatMap(record => record.moodEntryIds)
    );
    
    // Filter out already used moods
    return recentMoods.filter(mood => !usedMoodIds.has(mood.id));
  }
  
  /**
   * Get count of PARCIAL records generated in a specific month
   */
  private async getMonthlyGenerationCount(userId: string, month: string): Promise<number> {
    // Count from GenerationLog instead of HealthRecord to maintain accurate count
    // even when records are deleted by user
    return prisma.generationLog.count({
      where: {
        userId,
        recordType: 'PARCIAL',
        generationMonth: month,
      },
    });
  }
  
  /**
   * Check if user can generate a new PARCIAL health record
   */
  async canGenerateRecord(userId: string): Promise<{
    canGenerate: boolean;
    reason: string;
    isPremium: boolean;
    newMoodsCount: number;
    requiredMoods: number;
    generationsThisMonth: number;
    monthlyLimit: number;
  }> {
    // Get user plan
    const userPlan = await prisma.userPlan.findUnique({
      where: { userId },
    });
    
    const planType = userPlan?.planType || 'FREE';
    const isPremium = planType === 'PREMIUM';
    const monthlyLimit = isPremium ? -1 : (PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.FREE);
    
    // Get current month generation count (always get this for accurate display)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const generationsThisMonth = await this.getMonthlyGenerationCount(userId, currentMonth);
    
    // Get unused mood entries from last N days
    const unusedMoods = await this.getUnusedMoodEntries(userId, MOOD_LOOKBACK_DAYS);
    const newMoodsCount = unusedMoods.length;
    
    // Check if user has enough new moods
    if (newMoodsCount < MIN_NEW_MOODS) {
      return {
        canGenerate: false,
        reason: `Você precisa de pelo menos ${MIN_NEW_MOODS} novos registros de humor nos últimos ${MOOD_LOOKBACK_DAYS} dias. Você tem ${newMoodsCount}.`,
        isPremium,
        newMoodsCount,
        requiredMoods: MIN_NEW_MOODS,
        generationsThisMonth,
        monthlyLimit,
      };
    }
    
    // For non-premium users, check monthly limit
    if (!isPremium) {
      if (generationsThisMonth >= monthlyLimit) {
        return {
          canGenerate: false,
          reason: `Você atingiu o limite de ${monthlyLimit} prontuários por mês. Faça upgrade para Premium para prontuários ilimitados.`,
          isPremium: false,
          newMoodsCount,
          requiredMoods: MIN_NEW_MOODS,
          generationsThisMonth,
          monthlyLimit,
        };
      }
      
      return {
        canGenerate: true,
        reason: `Você pode gerar um novo prontuário (${generationsThisMonth}/${monthlyLimit} este mês)`,
        isPremium: false,
        newMoodsCount,
        requiredMoods: MIN_NEW_MOODS,
        generationsThisMonth,
        monthlyLimit,
      };
    }
    
    // Premium users can generate if they have enough moods
    return {
      canGenerate: true,
      reason: 'Usuário Premium - prontuários ilimitados',
      isPremium: true,
      newMoodsCount,
      requiredMoods: MIN_NEW_MOODS,
      generationsThisMonth,
      monthlyLimit: -1,
    };
  }
  
  /**
   * Generate a new PARCIAL health record using AI
   */
  async generateRecord(userId: string): Promise<any> {
    // Check eligibility
    const eligibility = await this.canGenerateRecord(userId);
    
    if (!eligibility.canGenerate) {
      throw new Error(eligibility.reason);
    }
    
    // Get unused mood entries from last N days
    const unusedMoods = await this.getUnusedMoodEntries(userId, MOOD_LOOKBACK_DAYS);
    
    if (unusedMoods.length < MIN_NEW_MOODS) {
      throw new Error(`Você precisa de pelo menos ${MIN_NEW_MOODS} novos registros de humor. Você tem ${unusedMoods.length}.`);
    }
    
    // Get user's onboarding data for context
    const onboardingData = await prisma.onboardingUserData.findUnique({
      where: { userId },
    });
    
    // Generate content using AI
    const content = await this.generateHealthRecordContent(unusedMoods, onboardingData, 'PARCIAL');
    
    // Get current month for tracking
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Create PARCIAL health record and log the generation
    const record = await prisma.$transaction(async (tx) => {
      // Create the health record
      const newRecord = await tx.healthRecord.create({
        data: {
          userId,
          content,
          timestamp: BigInt(Date.now()),
          recordType: 'PARCIAL',
          moodEntryIds: unusedMoods.map(m => m.id),
          generationMonth: currentMonth,
        },
      });
      
      // Create permanent generation log entry (never deleted)
      await tx.generationLog.create({
        data: {
          userId,
          recordType: 'PARCIAL',
          generationMonth: currentMonth,
          healthRecordId: newRecord.id,
        },
      });
      
      return newRecord;
    });
    
    // Update or create GLOBAL record
    await this.updateGlobalRecord(userId);
    
    // Invalidate cache
    await invalidateCache(`health-records:${userId}*`);
    await invalidateCache(`health-record:global:${userId}`);
    
    return record;
  }
  
  /**
   * Update or create the GLOBAL health record
   */
  async updateGlobalRecord(userId: string): Promise<any> {
    // Get all PARCIAL records for this user
    const parcialRecords = await prisma.healthRecord.findMany({
      where: {
        userId,
        recordType: 'PARCIAL',
      },
      orderBy: { createdAt: 'asc' },
    });
    
    if (parcialRecords.length === 0) {
      // No parcial records, delete global if exists
      await prisma.healthRecord.deleteMany({
        where: {
          userId,
          recordType: 'GLOBAL',
        },
      });
      return null;
    }
    
    // Collect all unique mood entry IDs from all parcial records
    const allMoodIds = Array.from(
      new Set(parcialRecords.flatMap(record => record.moodEntryIds))
    );
    
    // Fetch all mood entries
    const allMoodEntries = await prisma.moodEntry.findMany({
      where: {
        id: { in: allMoodIds },
        userId,
      },
      orderBy: { timestamp: 'asc' },
    });
    
    // Get onboarding data
    const onboardingData = await prisma.onboardingUserData.findUnique({
      where: { userId },
    });
    
    // Generate consolidated content
    const content = await this.generateHealthRecordContent(allMoodEntries, onboardingData, 'GLOBAL');
    
    // Check if global record exists
    const existingGlobal = await prisma.healthRecord.findFirst({
      where: {
        userId,
        recordType: 'GLOBAL',
      },
    });
    
    if (existingGlobal) {
      // Update existing global
      return prisma.healthRecord.update({
        where: { id: existingGlobal.id },
        data: {
          content,
          timestamp: BigInt(Date.now()),
          moodEntryIds: allMoodIds,
        },
      });
    } else {
      // Create new global
      return prisma.healthRecord.create({
        data: {
          userId,
          content,
          timestamp: BigInt(Date.now()),
          recordType: 'GLOBAL',
          moodEntryIds: allMoodIds,
        },
      });
    }
  }
  
  /**
   * Delete a PARCIAL health record and update GLOBAL
   */
  async deleteParcialRecord(recordId: string, userId: string): Promise<void> {
    // Get the record and verify it's PARCIAL
    const record = await this.getRecordById(recordId, userId);
    
    if (record.recordType !== 'PARCIAL') {
      throw new Error('Apenas prontuários parciais podem ser deletados.');
    }
    
    // Delete the record
    await prisma.healthRecord.delete({
      where: { id: recordId },
    });
    
    // Update global record
    await this.updateGlobalRecord(userId);
    
    // Invalidate cache
    await invalidateCache(`health-records:${userId}*`);
    await invalidateCache(`health-record:global:${userId}`);
  }
  
  /**
   * Regenerate an existing health record
   */
  async regenerateRecord(recordId: string, userId: string): Promise<any> {
    // Verify ownership
    const existingRecord = await this.getRecordById(recordId, userId);
    
    // Get mood entries from the period when the record was created (30 days before)
    const recordDate = existingRecord.createdAt.getTime();
    const thirtyDaysBeforeRecord = recordDate - (30 * 24 * 60 * 60 * 1000);
    
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId,
        timestamp: {
          gte: BigInt(thirtyDaysBeforeRecord),
          lte: BigInt(recordDate),
        },
      },
      orderBy: { timestamp: 'asc' },
    });
    
    if (moodEntries.length === 0) {
      throw new Error('Not enough mood data for regeneration.');
    }
    
    // Get onboarding data
    const onboardingData = await prisma.onboardingUserData.findUnique({
      where: { userId },
    });
    
    // Generate new content
    const content = await this.generateHealthRecordContent(moodEntries, onboardingData);
    
    // Update record
    const updatedRecord = await prisma.healthRecord.update({
      where: { id: recordId },
      data: {
        content,
        timestamp: BigInt(Date.now()),
      },
    });
    
    // Invalidate cache
    await invalidateCache(`health-records:${userId}*`);
    
    return updatedRecord;
  }
  
  /**
   * Generate health record content using Google Gemini AI
   */
  private async generateHealthRecordContent(
    moodEntries: any[],
    onboardingData: any,
    recordType: 'PARCIAL' | 'GLOBAL' = 'PARCIAL'
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      
      // Prepare mood data summary
      const moodSummary = this.prepareMoodSummary(moodEntries);
      
      // Prepare onboarding context
      const onboardingContext = onboardingData
        ? this.prepareOnboardingContext(onboardingData.data)
        : 'Sem contexto adicional disponível.';
      
      // Create prompt based on record type
      const prompt = recordType === 'GLOBAL' ? `
Você é um psicólogo clínico experiente. Analise os dados de humor consolidados do usuário abaixo e gere um PRONTUÁRIO GLOBAL DE ACOMPANHAMENTO detalhado e abrangente.

**Este é um Prontuário Global que consolida TODOS os registros de humor já analisados em prontuários parciais anteriores.**

**Dados de Humor Consolidados:**
${moodSummary}

**Contexto Adicional do Usuário:**
${onboardingContext}

**Instruções para Prontuário GLOBAL:**
1. Este é um documento consolidado que representa uma visão abrangente de TODA a jornada emocional registrada
2. Inclua: resumo executivo geral, evolução temporal dos padrões emocionais, marcos importantes, tendências de longo prazo
3. Analise a progressão e mudanças ao longo do tempo
4. Identifique padrões recorrentes e ciclos emocionais
5. Destaque melhorias, desafios persistentes e pontos de atenção contínuos
6. Forneça recomendações estratégicas de longo prazo
7. Use linguagem técnica mas acessível e empática
8. Formate em seções claras com markdown: Visão Geral, Evolução Temporal, Padrões Globais, Análise Consolidada, Recomendações Estratégicas
9. NÃO inclua campos para assinatura profissional - este é um relatório pessoal
10. Se houver dados pessoais (nome, idade), personalize o prontuário
11. Limite: 1200-1500 palavras (este é um documento mais abrangente)

Gere o prontuário GLOBAL de acompanhamento:
` : `
Você é um psicólogo clínico experiente. Analise os dados de humor do usuário abaixo e gere um prontuário PARCIAL de acompanhamento detalhado.

**Dados de Humor do Período Recente:**
${moodSummary}

**Contexto Adicional do Usuário:**
${onboardingContext}

**Instruções para Prontuário PARCIAL:**
1. Este é um prontuário de período específico que será consolidado posteriormente
2. Foque nos registros deste período específico
3. Inclua: resumo do período, análise de padrões emocionais, pontos de atenção, fatores de risco (se houver), recomendações de bem-estar
4. Use linguagem técnica mas acessível e empática
5. Seja construtivo e encorajador
6. Identifique tendências, padrões e possíveis gatilhos emocionais específicos deste período
7. Formate em seções claras com markdown: Resumo do Período, Análise de Humor, Padrões Identificados, Pontos de Atenção, Recomendações
8. NÃO inclua campos para assinatura profissional - este é um relatório pessoal
9. Considere as análises de IA dos registros quando disponíveis
10. Se houver dados pessoais (nome, idade), personalize o prontuário
11. Limite: 800-1000 palavras

Gere o prontuário PARCIAL de acompanhamento:
`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Error generating health record with AI:', error);
      
      // Fallback: generate a basic summary without AI
      return this.generateFallbackHealthRecord(moodEntries, recordType);
    }
  }
  
  /**
   * Prepare mood data summary for AI prompt
   */
  private prepareMoodSummary(moodEntries: any[]): string {
    const scores = moodEntries.map(e => e.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const lowestScore = Math.min(...scores);
    const highestScore = Math.max(...scores);
    
    let summary = `Total de registros: ${moodEntries.length}\n`;
    summary += `Humor médio: ${averageScore.toFixed(2)}/5\n`;
    summary += `Menor humor: ${lowestScore}/5\n`;
    summary += `Maior humor: ${highestScore}/5\n\n`;
    summary += `Registros detalhados:\n`;
    
    moodEntries.slice(0, 20).forEach((entry, index) => {
      const date = timestampToDate(Number(entry.timestamp));
      summary += `${index + 1}. ${date.toLocaleDateString('pt-BR')}: Humor ${entry.score}/5`;
      
      // Include note if available
      if (entry.note && entry.note.trim()) {
        summary += ` - Nota: "${entry.note.substring(0, 100)}${entry.note.length > 100 ? '...' : ''}"`;
      }
      
      // Include AI analysis if available
      if (entry.aiAnalysis && entry.aiAnalysis.trim()) {
        summary += `\n   [Análise IA]: ${entry.aiAnalysis.substring(0, 500)}${entry.aiAnalysis.length > 500 ? '...' : ''}`;
      }
      
      summary += '\n';
    });
    
    if (moodEntries.length > 20) {
      summary += `... e mais ${moodEntries.length - 20} registros\n`;
    }
    
    return summary;
  }
  
  /**
   * Prepare onboarding context for AI prompt
   */
  private prepareOnboardingContext(data: any): string {
    if (!data) return 'Sem contexto adicional.';
    
    let context = '';
    
    // Personal information
    context += '**Dados Pessoais:**\n';
    if (data.name) {
      context += `Nome: ${data.name}\n`;
    }
    if (data.age) {
      context += `Idade: ${data.age} anos\n`;
    } else if (data.ageRange) {
      context += `Faixa etária: ${data.ageRange}\n`;
    }
    if (data.gender) {
      context += `Gênero: ${data.gender}\n`;
    }
    if (data.location) {
      context += `Localização: ${data.location}\n`;
    } else if (data.region) {
      context += `Região: ${data.region}\n`;
    }
    context += '\n';
    
    // Motivation and goals
    if (data.motivation || data.goals) {
      context += '**Motivação e Objetivos:**\n';
      if (data.motivation) {
        context += `Motivação principal: ${data.motivation}\n`;
      }
      if (data.goals && data.goals.length > 0) {
        context += `Objetivos: ${data.goals.join(', ')}\n`;
      }
      if (data.motivationOther) {
        context += `Outras motivações: ${data.motivationOther}\n`;
      }
      context += '\n';
    }
    
    // Mental health assessments
    let hasAssessments = false;
    if (data.depressionScore !== undefined || data.anxietyScore !== undefined) {
      context += '**Avaliações de Saúde Mental:**\n';
      hasAssessments = true;
    }
    
    if (data.depressionScore !== undefined) {
      context += `Score de depressão (PHQ-9): ${data.depressionScore}/27\n`;
    }
    
    if (data.anxietyScore !== undefined) {
      context += `Score de ansiedade (GAD-7): ${data.anxietyScore}/21\n`;
    }
    
    if (hasAssessments) {
      context += '\n';
    }
    
    // Treatment and conditions
    if (data.hasMentalHealthCondition || data.isReceivingTreatment) {
      context += '**Histórico e Tratamento:**\n';
      
      if (data.hasMentalHealthCondition) {
        context += `Histórico de condições de saúde mental: Sim\n`;
        if (data.mentalHealthConditionDetails) {
          context += `Detalhes: ${data.mentalHealthConditionDetails}\n`;
        }
      }
      
      if (data.isReceivingTreatment) {
        context += `Em tratamento atual: Sim\n`;
        if (data.treatmentDetails) {
          context += `Detalhes do tratamento: ${data.treatmentDetails}\n`;
        }
      }
      
      if (data.psychiatricMedications) {
        context += `Medicações psiquiátricas: ${data.psychiatricMedications}\n`;
      }
      
      context += '\n';
    }
    
    // Sleep and support
    if (data.sleepQuality || data.hasSupportSystem) {
      context += '**Sono e Suporte Social:**\n';
      
      if (data.sleepQuality) {
        context += `Qualidade do sono: ${data.sleepQuality}\n`;
        if (data.sleepHoursPerNight) {
          context += `Horas de sono por noite: ${data.sleepHoursPerNight}h\n`;
        }
      }
      
      if (data.hasSupportSystem !== undefined) {
        context += `Sistema de suporte: ${data.hasSupportSystem ? 'Sim' : 'Não'}\n`;
        if (data.supportSystemDetails && data.supportSystemDetails.length > 0) {
          context += `Tipos de suporte: ${data.supportSystemDetails.join(', ')}\n`;
        }
      }
      
      context += '\n';
    }
    
    // Additional info
    if (data.additionalInfo) {
      context += '**Informações Adicionais:**\n';
      context += `${data.additionalInfo}\n`;
    }
    
    return context || 'Sem contexto adicional.';
  }
  
  /**
   * Generate fallback health record without AI
   */
  private generateFallbackHealthRecord(moodEntries: any[], recordType: 'PARCIAL' | 'GLOBAL' = 'PARCIAL'): string {
    const scores = moodEntries.map(e => e.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    const title = recordType === 'GLOBAL' ? 'Prontuário Global de Saúde Mental' : 'Prontuário Parcial de Saúde Mental';
    const periodText = recordType === 'GLOBAL' 
      ? `Análise consolidada de ${moodEntries.length} registros de humor ao longo de toda a jornada.`
      : `Período analisado: Últimos ${moodEntries.length} registros de humor.`;
    
    return `
# ${title}

## Resumo Executivo

${periodText}

**Humor médio**: ${averageScore.toFixed(2)}/5

## Análise de Humor

Durante o período analisado, foram registrados ${moodEntries.length} entradas de humor.

A pontuação média foi de ${averageScore.toFixed(2)} em uma escala de 0 a 5.

## Padrões Identificados

${averageScore < 2.5 ? '⚠️ Humor consistentemente baixo detectado.' : ''}
${averageScore >= 2.5 && averageScore < 3.5 ? 'Humor moderado com variações.' : ''}
${averageScore >= 3.5 ? 'Humor geralmente positivo.' : ''}

## Recomendações

1. Continue registrando seu humor diariamente
2. Considere consultar um profissional de saúde mental
3. Mantenha hábitos saudáveis de sono e exercícios

---

*Este é um relatório gerado automaticamente. Para análise mais detalhada, considere atualizar para o plano Premium.*
`;
  }
}

