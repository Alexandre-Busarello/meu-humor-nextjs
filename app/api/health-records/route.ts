import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { HealthRecordService } from '@/services/health-record.service';

const healthRecordService = new HealthRecordService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    const records = await healthRecordService.getRecords(user.id, limit, false);

    // Convert BigInt to number for JSON serialization
    const serialized = records.map((record) => ({
      ...record,
      timestamp: Number(record.timestamp),
    }));

    return Response.json(serialized);
  } catch (error) {
    console.error('Get health records error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get health records';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const record = await healthRecordService.generateRecord(user.id);

    return Response.json(
      {
        ...record,
        timestamp: Number(record.timestamp),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generate health record error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to generate health record';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return Response.json({ error: message }, { status });
  }
}

