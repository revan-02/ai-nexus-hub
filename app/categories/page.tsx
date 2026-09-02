'use client';

import React, { Suspense } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { CategoryManager } from '@/components/categories/category-manager';

export default function CategoriesPage() {
  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
        <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading categories taxonomy...</div>}>
          <CategoryManager />
        </Suspense>
      </div>
    </AdminShell>
  );
}
