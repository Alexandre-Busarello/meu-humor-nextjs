import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { HealthRecordService } from '@/services/health-record.service';

const healthRecordService = new HealthRecordService();

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const result = await healthRecordService.canGenerateRecord(user.id);

    return Response.json(result);
  } catch (error) {
    console.error('Check can generate error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to check generation eligibility';
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    
    return createAuthErrorResponse(message, status);
  }
}

