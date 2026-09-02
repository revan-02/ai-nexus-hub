'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { mockPermissionOverview } from '@/lib/mock-data/roles-data';

export function PermissionOverviewCard() {
  const stats = [
    { label: 'Total Permissions', value: mockPermissionOverview.totalPermissions },
    { label: 'Assigned Permissions', value: mockPermissionOverview.assignedPermissions },
    { label: 'Unassigned Permissions', value: mockPermissionOverview.unassignedPermissions },
    { label: 'Modules with Access', value: mockPermissionOverview.modulesWithAccess },
    { label: 'Resources with Access', value: mockPermissionOverview.resourcesWithAccess },
  ];

  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-white tracking-tight">Permission Overview</h3>

      <div className="space-y-3 text-xs">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-zinc-400 font-medium">{stat.label}</span>
            <span className="font-mono font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
