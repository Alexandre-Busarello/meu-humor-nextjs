import { prisma } from '@/lib/prisma';
import { getCached, invalidateCache } from '@/lib/redis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { timestampToDate } from '@/lib/utils/timezone';

export class RecommendationService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Recommendations will use fallback.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }
  
  /**
   * Generate AI-powered recommendation for user based on recent mood data
   */
  async generateRecommendation(userId: string): Promise<string> {
    const cacheKey = `recommendation:${userId}`;
    
    return getCached(cacheKey, 86400, async () => {
      // Cache for 24 hours
      try {
        // Get last 14 days of mood entries
        const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        
        const entries = await prisma.moodEntry.findMany({
          where: {
            userId,
            timestamp: {
              gte: BigInt(fourteenDaysAgo),
            },
          },
          orderBy: { timestamp: 'asc' },
        });
        
        // If less than 7 entries, return static recommendation
        if (entries.length < 7) {
          return this.getStaticRecommendation(entries.length);
        }
        
        // Get onboarding data for context
        const onboardingData = await prisma.onboardingUserData.findUnique({
          where: { userId },
        });
        
        // Generate AI recommendation
        return await this.generateAIRecommendation(entries, onboardingData);
      } catch (error) {
        console.error('Error generating recommendation:', error);
        return 'Continue registrando seu humor diariamente para receber recomendações personalizadas.';
      }
    });
  }
  
  /**
   * Manually refresh recommendation (invalidates cache)
   */
  async refreshRecommendation(userId: string): Promise<string> {
    await invalidateCache(`recommendation:${userId}`);
    return this.generateRecommendation(userId);
  }
  
  /**
   * Generate AI-powered recommendation using Gemini
   */
  private async generateAIRecommendation(
    entries: any[],
    onboardingData: any
  ): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return this.getStaticRecommendation(entries.length);
      }
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
      
      // Prepare mood summary
      const scores = entries.map(e => e.score);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const lowestScore = Math.min(...scores);
      const highestScore = Math.max(...scores);
      
      let moodSummary = `Últimos ${entries.length} registros de humor:\n`;
      moodSummary += `Humor médio: ${averageScore.toFixed(2)}/5\n`;
      moodSummary += `Menor humor: ${lowestScore}/5\n`;
      moodSummary += `Maior humor: ${highestScore}/5\n\n`;
      
      // Add recent entries (last 7)
      const recentEntries = entries.slice(-7);
      moodSummary += 'Registros recentes:\n';
      recentEntries.forEach((entry, idx) => {
        const date = timestampToDate(Number(entry.timestamp));
        const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const note = entry.note ? ` - "${entry.note.substring(0, 50)}${entry.note.length > 50 ? '...' : ''}"` : '';
        moodSummary += `${dayOfWeek}: ${entry.score}/5${note}\n`;
      });
      
      // Prepare onboarding context
      let context = '';
      if (onboardingData?.data) {
        const data = onboardingData.data;
        if (data.motivation) context += `Motivação: ${data.motivation}\n`;
        if (data.depressionScore !== undefined) context += `Score depressão (PHQ-9): ${data.depressionScore}\n`;
        if (data.anxietyScore !== undefined) context += `Score ansiedade (GAD-7): ${data.anxietyScore}\n`;
        if (data.sleepQuality) context += `Qualidade do sono: ${data.sleepQuality}\n`;
      }
      
      const prompt = `Você é um psicólogo experiente e empático. Analise os dados de humor do paciente e forneça uma recomendação personalizada e encorajadora.

**Dados de Humor:**
${moodSummary}

${context ? `**Contexto Adicional:**\n${context}\n` : ''}

**Instruções:**
1. Dê uma recomendação prática e acionável (máximo 150 palavras)
2. Use tom empático e encorajador
3. Seja específico baseado nos padrões observados
4. Sugira uma ação concreta que o usuário possa tomar
5. Escreva em segunda pessoa (você)
6. NÃO use markdown ou formatação

Gere a recomendação:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const recommendation = response.text();
      
      return recommendation.trim();
    } catch (error) {
      console.error('Error generating AI recommendation:', error);
      return this.getFallbackRecommendation(entries);
    }
  }
  
  /**
   * Get static recommendation for users with insufficient data
   */
  private getStaticRecommendation(entryCount: number): string {
    if (entryCount === 0) {
      return 'Comece a registrar seu humor diariamente para receber recomendações personalizadas e insights sobre seu bem-estar emocional.';
    } else if (entryCount < 3) {
      return 'Você está no caminho certo! Continue registrando seu humor para que possamos fornecer recomendações mais personalizadas.';
    } else {
      return 'Continue registrando seu humor regularmente. Com mais dados, poderemos oferecer recomendações cada vez mais personalizadas para seu bem-estar.';
    }
  }
  
  /**
   * Get fallback recommendation based on mood data without AI
   */
  private getFallbackRecommendation(entries: any[]): string {
    const scores = entries.map(e => e.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (averageScore < 2) {
      return 'Notamos que sua semana foi desafiadora. Considere praticar técnicas de respiração profunda, fazer uma caminhada ao ar livre, ou conversar com alguém de confiança. Pequenos passos podem fazer diferença.';
    } else if (averageScore < 3) {
      return 'Seu humor tem oscilado. Tente incluir momentos de autocuidado na sua rotina: uma caminhada de 15 minutos, ouvir sua música favorita, ou praticar gratidão escrevendo 3 coisas boas do seu dia.';
    } else if (averageScore < 4) {
      return 'Você está indo bem! Para fortalecer ainda mais seu bem-estar, considere estabelecer uma rotina de sono regular, praticar mindfulness por 5 minutos ao dia, e manter contato com pessoas queridas.';
    } else {
      return 'Excelente! Você está em um ótimo momento. Aproveite para consolidar hábitos saudáveis, compartilhar sua energia positiva com outros, e continuar as práticas que têm funcionado para você.';
    }
  }
}

