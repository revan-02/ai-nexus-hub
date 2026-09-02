'use client';

import React, { Suspense } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { PaymentReportView } from '@/components/reports/payment-report-view';

export default function PaymentReportsPage() {
  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
        <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading payment reports...</div>}>
          <PaymentReportView />
        </Suspense>
      </div>
    </AdminShell>
  );
}
