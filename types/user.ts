export type UserRole =
  | 'Admin'
  | 'Manager'
  | 'Editor'
  | 'Instructor'
  | 'Analyst'
  | 'Moderator'
  | 'User';

export type UserStatus =
  | 'Active'
  | 'Inactive'
  | 'Pending'
  | 'Suspended'
  | 'Deleted';

export interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  organization: string;
  status: UserStatus;
  emailVerified: boolean;
  lastActive: string;
  createdAt: string;
}

export interface UserMetricData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  period: string;
  variant: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}
