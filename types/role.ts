export type RoleType = 'System' | 'Custom';
export type RoleStatus = 'Active' | 'Inactive';

export interface RoleItem {
  id: string;
  name: string;
  type: RoleType;
  usersCount: number;
  userPercentage: number;
  permissionsCount: number;
  description: string;
  status: RoleStatus;
  iconName: string;
  iconBg: string;
  iconColor: string;
  isProtected?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleMetricData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend?: 'up' | 'down' | 'flat';
  period: string;
  variant: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}

export interface PermissionModule {
  id: string;
  name: string;
  description: string;
  permissions: {
    id: string;
    label: string;
    granted: boolean;
  }[];
}
