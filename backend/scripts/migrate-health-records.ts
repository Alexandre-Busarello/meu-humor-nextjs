/**
 * Migration Script: Convert existing health records to new PARCIAL/GLOBAL system
 * 
 * This script:
 * 1. Marks all existing records as PARCIAL
 * 2. Sets generationMonth based on createdAt
 * 3. Creates a GLOBAL record for each user with PARCIAL records
 */

import { prisma } from '../src/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function migrateHealthRecords() {
  console.log('🚀 Starting health records migration...\n');

  try {
    // Step 1: Get all existing records
    console.log('📊 Fetching existing health records...');
    const existingRecords = await prisma.healthRecord.findMany({
      include: {
        user: true,
      },
    });
    console.log(`   Found ${existingRecords.length} records\n`);

    if (existingRecords.length === 0) {
      console.log('✅ No records to migrate. Migration complete!');
      return;
    }

    // Step 2: Update existing records to PARCIAL with generationMonth
    console.log('🔄 Updating existing records to PARCIAL...');
    let updatedCount = 0;

    for (const record of existingRecords) {
      const generationMonth = new Date(record.createdAt).toISOString().slice(0, 7); // YYYY-MM

      await prisma.healthRecord.update({
        where: { id: record.id },
        data: {
          recordType: 'PARCIAL',
          generationMonth,
          moodEntryIds: [], // Old records don't have mood tracking
        },
      });

      updatedCount++;
      
      if (updatedCount % 10 === 0) {
        console.log(`   Updated ${updatedCount}/${existingRecords.length} records...`);
      }
    }
    console.log(`   ✓ Updated ${updatedCount} records to PARCIAL\n`);

    // Step 3: Group records by user
    console.log('👥 Grouping records by user...');
    const userRecordsMap = new Map<string, typeof existingRecords>();
    
    for (const record of existingRecords) {
      if (!userRecordsMap.has(record.userId)) {
        userRecordsMap.set(record.userId, []);
      }
      userRecordsMap.get(record.userId)!.push(record);
    }
    console.log(`   Found ${userRecordsMap.size} users with records\n`);

    // Step 4: Create GLOBAL records for each user
    console.log('🌍 Creating GLOBAL records...');
    let globalCreatedCount = 0;

    for (const [userId, userRecords] of userRecordsMap.entries()) {
      console.log(`   Processing user ${userId}...`);

      // Get all mood entries for this user (if any are referenced)
      const allMoodIds = userRecords.flatMap(r => r.moodEntryIds);
      
      // For old records without mood tracking, try to get recent moods
      let moodEntries = [];
      if (allMoodIds.length === 0) {
        // Get mood entries from the time period of the records
        const oldestRecord = userRecords.reduce((a, b) => 
          a.createdAt < b.createdAt ? a : b
        );
        const newestRecord = userRecords.reduce((a, b) => 
          a.createdAt > b.createdAt ? a : b
        );

        moodEntries = await prisma.moodEntry.findMany({
          where: {
            userId,
            timestamp: {
              gte: BigInt(oldestRecord.createdAt.getTime()),
              lte: BigInt(newestRecord.createdAt.getTime()),
            },
          },
          orderBy: { timestamp: 'asc' },
        });
      } else {
        moodEntries = await prisma.moodEntry.findMany({
          where: {
            id: { in: allMoodIds },
            userId,
          },
          orderBy: { timestamp: 'asc' },
        });
      }

      // Generate a simple consolidated content
      const consolidatedContent = generateConsolidatedContent(userRecords, moodEntries);

      // Create GLOBAL record
      await prisma.healthRecord.create({
        data: {
          userId,
          content: consolidatedContent,
          timestamp: BigInt(Date.now()),
          recordType: 'GLOBAL',
          moodEntryIds: moodEntries.map(m => m.id),
        },
      });

      globalCreatedCount++;
      console.log(`   ✓ Created GLOBAL record for user ${userId}`);
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   - Updated: ${updatedCount} PARCIAL records`);
    console.log(`   - Created: ${globalCreatedCount} GLOBAL records`);
    console.log(`   - Total users: ${userRecordsMap.size}\n`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function generateConsolidatedContent(records: any[], moodEntries: any[]): string {
  const totalRecords = records.length;
  const dateRange = records.length > 0 ? {
    start: new Date(Math.min(...records.map(r => r.createdAt.getTime()))),
    end: new Date(Math.max(...records.map(r => r.createdAt.getTime()))),
  } : null;

  const scores = moodEntries.map(e => e.score);
  const averageScore = scores.length > 0 
    ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length 
    : 0;

  return `# Prontuário Global de Saúde Mental

## Visão Geral

Este é um prontuário global consolidado que reúne ${totalRecords} prontuário(s) parcial(is) gerado(s) anteriormente.

${dateRange ? `**Período analisado:** ${dateRange.start.toLocaleDateString('pt-BR')} até ${dateRange.end.toLocaleDateString('pt-BR')}` : ''}

${moodEntries.length > 0 ? `**Total de registros de humor:** ${moodEntries.length}` : '**Nota:** Este prontuário foi migrado do sistema antigo e pode não ter todos os registros de humor associados.'}

${scores.length > 0 ? `**Humor médio do período:** ${averageScore.toFixed(2)}/5` : ''}

## Evolução Temporal

Este prontuário consolida múltiplos registros ao longo do tempo, representando sua jornada de acompanhamento emocional.

${totalRecords === 1 ? 'Você possui 1 prontuário parcial registrado.' : `Você possui ${totalRecords} prontuários parciais registrados.`}

## Análise Consolidada

${scores.length > 0 ? `
Durante o período analisado, foram registrados ${moodEntries.length} entradas de humor.

${averageScore < 2.5 ? '⚠️ O período apresentou humor consistentemente baixo. Considere buscar apoio profissional.' : ''}
${averageScore >= 2.5 && averageScore < 3.5 ? 'O período apresentou humor moderado com variações.' : ''}
${averageScore >= 3.5 ? 'O período apresentou humor geralmente positivo.' : ''}
` : 'Este prontuário foi migrado do sistema anterior. Para uma análise mais detalhada, continue registrando seus humores e gere novos prontuários parciais.'}

## Recomendações Estratégicas

1. **Continue o acompanhamento:** Registre seu humor diariamente para manter o histórico atualizado
2. **Gere novos prontuários:** À medida que registra novos humores, gere prontuários parciais para atualizar este consolidado
3. **Busque apoio:** Se necessário, compartilhe este prontuário com profissionais de saúde mental

---

*Este prontuário global foi gerado automaticamente durante a migração do sistema. Ele será atualizado automaticamente conforme você gera novos prontuários parciais.*
`;
}

// Run migration
migrateHealthRecords()
  .then(() => {
    console.log('🎉 Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });

