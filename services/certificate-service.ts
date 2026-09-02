import prisma from '@/lib/db/prisma';
import { createAuditLog } from './audit-service';

export async function getCertificateById(id: string) {
  const cert = await prisma.userCertificate.findFirst({
    where: {
      OR: [{ id }, { certificateHash: id }],
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  if (!cert) {
    throw new Error(`Certificate with ID ${id} not found`);
  }

  return cert;
}

export async function generateCertificate(userId: string, trackName: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`User with ID ${userId} not found`);

  const hash = `NEXUS-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

  const cert = await prisma.userCertificate.create({
    data: {
      userId,
      trackName,
      certificateHash: hash,
      scorePercent: 100,
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  await createAuditLog({
    userId,
    action: `Issued completion certificate for '${trackName}' (${hash})`,
    target: cert.id,
    type: 'course',
  });

  return cert;
}
