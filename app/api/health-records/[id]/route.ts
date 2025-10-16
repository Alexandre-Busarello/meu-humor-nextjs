import { NextRequest } from 'next/server';
import { getUserFromRequest, createAuthErrorResponse } from '@/lib/api-auth';
import { HealthRecordService } from '@/services/health-record.service';

const healthRecordService = new HealthRecordService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id } = await params;

    const record = await healthRecordService.getRecordById(id, user.id);

    return Response.json({
      ...record,
      timestamp: Number(record.timestamp),
    });
  } catch (error) {
    console.error('Get health record error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get health record';
    
    if (message === 'Health record not found') {
      return Response.json({ error: message }, { status: 404 });
    }
    
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    return createAuthErrorResponse(message, status);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id } = await params;

    const record = await healthRecordService.regenerateRecord(id, user.id);

    return Response.json({
      ...record,
      timestamp: Number(record.timestamp),
    });
  } catch (error) {
    console.error('Regenerate health record error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to regenerate health record';
    
    if (message === 'Health record not found') {
      return Response.json({ error: message }, { status: 404 });
    }
    
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    return Response.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    const { id } = await params;

    await healthRecordService.deleteParcialRecord(id, user.id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete health record error:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to delete health record';
    
    if (message === 'Health record not found' || message.includes('parciais')) {
      return Response.json({ error: message }, { status: message === 'Health record not found' ? 404 : 400 });
    }
    
    const status = message.includes('token') || message.includes('Authentication') ? 401 : 500;
    return Response.json({ error: message }, { status });
  }
}

