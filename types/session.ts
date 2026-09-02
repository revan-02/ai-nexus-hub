export type SessionStatus = 'Active' | 'Idle' | 'Flagged' | 'Revoked';

export interface SessionUserInfo {
  id?: string;
  name: string;
  email: string;
  avatar: string;
}

export interface SessionItem {
  id: string;
  userId: string;
  user: SessionUserInfo;
  ip: string;
  location: string;
  device: string;
  authMethod: string;
  duration: string;
  status: SessionStatus;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionMetricData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
}
