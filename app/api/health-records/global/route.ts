import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { HealthRecordService } from '@/services/health-record.service';

const healthRecordService = new HealthRecordService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const record = await healthRecordService.getGlobalRecord(user.id);

    if (!record) {
      return Response.json(null);
    }

    return Response.json({
      ...record,
      timestamp: Number(record.timestamp),
    });
  } catch (error) {
    console.error('Get global health record error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get global health record';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

