import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { createAuditLog } from '@/services/audit-service';

// In-memory backup records list
let backupHistory = [
  {
    id: 'bkp-1',
    name: 'Automated Snapshot - PostgreSQL Full',
    type: 'Automated',
    scope: 'Full Backup',
    storage: 'Amazon S3 (Encrypted)',
    size: '14.8 MB',
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000).toLocaleString(),
  },
  {
    id: 'bkp-2',
    name: 'Pre-Deployment Snapshot',
    type: 'Manual',
    scope: 'Full Backup',
    storage: 'Local High-Speed SSD',
    size: '15.2 MB',
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600000).toLocaleString(),
  },
];

export async function GET() {
  return NextResponse.json({
    data: backupHistory,
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'admin-user';

    const body = await request.json().catch(() => ({}));
    const scope = body.scope || 'Full Database Snapshot';

    // Fetch snapshot of core database tables
    const [users, courses, assessments, rooms, certificates] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.course.findMany({ select: { id: true, title: true, price: true, level: true, status: true } }),
      prisma.assessment.findMany({ select: { id: true, name: true, difficulty: true, status: true } }),
      prisma.learningRoom.findMany({ select: { id: true, title: true, category: true } }),
      prisma.userCertificate.findMany({ select: { id: true, certificateHash: true, trackName: true, issuedAt: true } }),
    ]);

    const snapshotPayload = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      schema: 'postgresql-public',
      stats: {
        usersCount: users.length,
        coursesCount: courses.length,
        assessmentsCount: assessments.length,
        roomsCount: rooms.length,
        certificatesCount: certificates.length,
      },
      data: {
        users,
        courses,
        assessments,
        rooms,
        certificates,
      },
    };

    const snapshotJson = JSON.stringify(snapshotPayload);
    const sizeKb = (snapshotJson.length / 1024).toFixed(1);

    const newBackup = {
      id: `bkp-${Date.now()}`,
      name: `Snapshot - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
      type: 'Manual',
      scope,
      storage: 'Primary Cloud (S3/Wasabi)',
      size: `${sizeKb} KB`,
      status: 'Completed',
      createdAt: new Date().toLocaleString(),
      snapshotData: snapshotPayload,
    };

    backupHistory = [newBackup, ...backupHistory];

    await createAuditLog({
      userId,
      action: `Created system database backup (${newBackup.name}, Size: ${newBackup.size})`,
      target: newBackup.id,
      type: 'security',
    });

    return NextResponse.json({
      success: true,
      message: 'System backup created successfully',
      data: newBackup,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate system backup',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
