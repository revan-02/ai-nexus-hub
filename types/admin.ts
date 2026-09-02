export type MetricCardData = {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  period: string;
  variant: 'purple' | 'blue' | 'green' | 'orange';
};

export type SystemStatusItem = {
  id: string;
  name: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  latency: string;
};

export type ResourceUsageData = {
  cpu: number;
  memory: number;
  storage: number;
  totalStorage: string;
  usedStorage: string;
  aiTokenUsage: string;
  maxAiTokens: string;
  bandwidth: string;
};

export type ActivityItem = {
  id: string;
  user: string;
  avatar?: string;
  action: string;
  target: string;
  time: string;
  type: 'user' | 'ai' | 'dataset' | 'course' | 'security';
};

export type PendingApprovalItem = {
  id: string;
  category: string;
  count: number;
};

export type AIModelUsageItem = {
  name: string;
  percentage: number;
  requests: string;
  color: string;
};

export type AlertItem = {
  id: string;
  title: string;
  details: string;
  time: string;
  type: 'warning' | 'info' | 'error';
};

export type QuickActionItem = {
  id: string;
  label: string;
  iconName: string;
  actionUrl: string;
  shortcut?: string;
};

export type SubscriptionData = {
  planName: string;
  status: string;
  expiryDate: string;
  usersUsed: number;
  usersLimit: number;
  requestsUsed: string;
  requestsLimit: string;
  storageUsed: number;
  storageLimit: number;
};
