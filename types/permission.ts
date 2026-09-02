export type PermissionState = 'granted' | 'denied' | 'not-set';
export type PermissionType = 'System' | 'Custom';

export interface RoleColumnHeader {
  id: string;
  name: string;
  type: 'System' | 'Custom';
}

export interface PermissionRowItem {
  id: string;
  resource: string;
  resourceDesc: string;
  action: string;
  actionDesc: string;
  roleStates: Record<string, PermissionState>;
}

export interface PermissionModuleGroup {
  id: string;
  name: string;
  iconName: string;
  resourceCount: number;
  isExpanded?: boolean;
  roleAggregates: Record<
    string,
    { granted: number; denied: number; notSet: number }
  >;
  rows: PermissionRowItem[];
}

export interface PermissionMetricData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend?: 'up' | 'down' | 'flat';
  period: string;
  variant: 'purple' | 'blue' | 'green' | 'orange';
}

export interface SinglePermission {
  id: string;
  key: string;
  name: string;
  module: string;
  resource: string;
  action: string;
  type: PermissionType;
  rolesUsing: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}
