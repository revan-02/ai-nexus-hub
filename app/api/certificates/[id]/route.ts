import { NextRequest, NextResponse } from 'next/server';
import { CertificateService } from '@/services';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cert = await CertificateService.getCertificateById(id);
    return NextResponse.json({ data: cert });
  } catch (error) {
    return NextResponse.json(
      { error: 'Certificate not found', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 404 }
    );
  }
}
