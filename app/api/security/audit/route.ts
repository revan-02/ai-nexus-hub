import { NextRequest, NextResponse } from 'next/server';
import {
  performHash,
  performSymmetricCipher,
  performRsaOperation,
  performHmac,
  runFullSecurityAudit
} from '@/services/crypto-security-service';

export async function GET(req: NextRequest) {
  try {
    const report = runFullSecurityAudit();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, text, algorithm, key, keyBits, operation } = body;

    if (action === 'hash') {
      const result = performHash(text || 'AI Nexus Platform 2026', algorithm || 'SHA-256');
      return NextResponse.json({ success: true, result });
    }

    if (action === 'symmetric') {
      const result = performSymmetricCipher(
        text || 'Secret Payload Data',
        key || 'MasterKey_99182',
        algorithm || 'AES-256-GCM'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'rsa') {
      const result = performRsaOperation(
        text || 'Payload for Asymmetric Encryption',
        keyBits || 2048,
        operation || 'encrypt_oaep'
      );
      return NextResponse.json({ success: true, result });
    }

    if (action === 'hmac') {
      const result = performHmac(text || 'API Request Payload', key || 'Secret_API_Key_44');
      return NextResponse.json({ success: true, result });
    }

    const report = runFullSecurityAudit();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
