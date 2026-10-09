'use client';

import React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { RevBodhContentCMS } from '@/components/admin/revbodh-content-cms';

export default function AdminCoursesCMSPage() {
  return (
    <AdminShell>
      <div className="max-w-[1700px] mx-auto pb-12">
        <RevBodhContentCMS />
      </div>
    </AdminShell>
  );
}
