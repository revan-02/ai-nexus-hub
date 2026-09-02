import { MetricCardData, SystemStatusItem, ResourceUsageData, ActivityItem, PendingApprovalItem, AIModelUsageItem, AlertItem, QuickActionItem, SubscriptionData } from '@/types/admin';
export type { MetricCardData, SystemStatusItem, ResourceUsageData, ActivityItem, PendingApprovalItem, AIModelUsageItem, AlertItem, QuickActionItem, SubscriptionData };


// 1. KPI Metrics
export const mockKPIMetrics: MetricCardData[] = [
  {
    id: 'total-users',
    title: 'Total Users',
    value: '12,458',
    change: '12.5%',
    trend: 'up',
    period: 'vs last 7 days',
    variant: 'purple',
  },
  {
    id: 'active-users',
    title: 'Active Users',
    value: '8,742',
    change: '8.1%',
    trend: 'up',
    period: 'vs last 7 days',
    variant: 'blue',
  },
  {
    id: 'new-users',
    title: 'New Users',
    value: '1,213',
    change: '15.3%',
    trend: 'up',
    period: 'vs last 7 days',
    variant: 'green',
  },
  {
    id: 'active-projects',
    title: 'Active Projects',
    value: '342',
    change: '7.8%',
    trend: 'up',
    period: 'vs last 7 days',
    variant: 'orange',
  },
  {
    id: 'ai-requests',
    title: 'AI Requests',
    value: '2.34M',
    change: '18.6%',
    trend: 'up',
    period: 'vs last 7 days',
    variant: 'purple',
  },
  {
    id: 'system-health',
    title: 'System Health',
    value: '99.9%',
    change: 'Healthy',
    trend: 'up',
    period: 'All services optimal',
    variant: 'green',
  },
];

// 2. Analytics Dataset
export const mockAnalyticsDataset = {
  Users: [
    { date: 'May 12', active: 6200, new: 850 },
    { date: 'May 13', active: 6800, new: 920 },
    { date: 'May 14', active: 7400, new: 1050 },
    { date: 'May 15', active: 7900, new: 1100 },
    { date: 'May 16', active: 8200, new: 1140 },
    { date: 'May 17', active: 8500, new: 1180 },
    { date: 'May 18', active: 8742, new: 1213 },
  ],
  'AI Requests': [
    { date: 'May 12', active: 1.8, new: 0.3 },
    { date: 'May 13', active: 1.9, new: 0.4 },
    { date: 'May 14', active: 2.0, new: 0.4 },
    { date: 'May 15', active: 2.1, new: 0.5 },
    { date: 'May 16', active: 2.2, new: 0.5 },
    { date: 'May 17', active: 2.3, new: 0.6 },
    { date: 'May 18', active: 2.34, new: 0.65 },
  ],
  Projects: [
    { date: 'May 12', active: 290, new: 12 },
    { date: 'May 13', active: 305, new: 15 },
    { date: 'May 14', active: 315, new: 10 },
    { date: 'May 15', active: 324, new: 9 },
    { date: 'May 16', active: 330, new: 6 },
    { date: 'May 17', active: 338, new: 8 },
    { date: 'May 18', active: 342, new: 4 },
  ],
  Revenue: [
    { date: 'May 12', active: 42000, new: 5000 },
    { date: 'May 13', active: 45000, new: 6200 },
    { date: 'May 14', active: 48000, new: 7100 },
    { date: 'May 15', active: 51000, new: 8000 },
    { date: 'May 16', active: 54000, new: 8900 },
    { date: 'May 17', active: 57000, new: 9400 },
    { date: 'May 18', active: 61200, new: 10500 },
  ],
};

// 3. System Status Services
export const mockSystemServices: SystemStatusItem[] = [
  { id: 'api', name: 'API Services', status: 'Healthy', latency: '24ms' },
  { id: 'db', name: 'Database', status: 'Healthy', latency: '12ms' },
  { id: 'ai', name: 'AI Service', status: 'Healthy', latency: '45ms' },
  { id: 'storage', name: 'Storage', status: 'Healthy', latency: '18ms' },
  { id: 'auth', name: 'Authentication', status: 'Healthy', latency: '15ms' },
  { id: 'email', name: 'Email Service', status: 'Healthy', latency: '32ms' },
  { id: 'ws', name: 'WebSocket', status: 'Healthy', latency: '8ms' },
];

// 4. Resource Usage
export const mockResourceUsage: ResourceUsageData = {
  cpu: 34,
  memory: 62,
  storage: 71,
  totalStorage: '2.45 TB',
  usedStorage: '1.74 TB',
  aiTokenUsage: '2.34M',
  maxAiTokens: '10M',
  bandwidth: '842.7 GB',
};

// 5. Recent Activities
export const mockRecentActivities: ActivityItem[] = [
  {
    id: '1',
    user: 'John Doe',
    action: 'created a new user',
    target: '',
    time: '2 minutes ago',
    type: 'user',
  },
  {
    id: '2',
    user: 'System Admin',
    action: "AI model 'GPT-4o' configuration updated",
    target: '',
    time: '15 minutes ago',
    type: 'ai',
  },
  {
    id: '3',
    user: 'Sarah Chen',
    action: "New dataset 'ML_Research_2025.csv' uploaded",
    target: '',
    time: '32 minutes ago',
    type: 'dataset',
  },
  {
    id: '4',
    user: 'Alex Rivera',
    action: "Course 'Deep Learning Fundamentals' published",
    target: '',
    time: '1 hour ago',
    type: 'course',
  },
  {
    id: '5',
    user: 'Security Sentinel',
    action: "User 'emma.johnson@example.com' suspended",
    target: '',
    time: '2 hours ago',
    type: 'security',
  },
];

// 6. Pending Approvals
export const mockPendingApprovals: PendingApprovalItem[] = [
  { id: 'users', category: 'New user registrations', count: 5 },
  { id: 'content', category: 'Content submissions', count: 2 },
  { id: 'datasets', category: 'Dataset uploads', count: 1 },
  { id: 'projects', category: 'Project submissions', count: 0 },
  { id: 'ai-tools', category: 'AI tool access requests', count: 0 },
];

// 7. Top AI Models
export const mockAIModels: AIModelUsageItem[] = [
  { name: 'GPT-4o', percentage: 45.2, requests: '1.05M', color: '#8b5cf6' },
  { name: 'Claude 3.5', percentage: 22.8, requests: '533K', color: '#3b82f6' },
  { name: 'Gemini 1.5 Pro', percentage: 15.7, requests: '367K', color: '#22c55e' },
  { name: 'Llama 3 70B', percentage: 9.3, requests: '217K', color: '#f59e0b' },
  { name: 'Others', percentage: 7.0, requests: '163K', color: '#ec4899' },
];

// 8. Alerts & Notifications
export const mockAlerts: AlertItem[] = [
  {
    id: 'a1',
    title: 'High memory usage detected',
    details: 'Server: AI-SERVER-02',
    time: '5m ago',
    type: 'warning',
  },
  {
    id: 'a2',
    title: 'New version available',
    details: 'AI Service v2.4.1',
    time: '1h ago',
    type: 'info',
  },
  {
    id: 'a3',
    title: 'Failed login attempts',
    details: '12 attempts detected',
    time: '2h ago',
    type: 'error',
  },
  {
    id: 'a4',
    title: 'Scheduled maintenance',
    details: 'May 20, 02:00 - 04:00 AM',
    time: '1d ago',
    type: 'info',
  },
];

// 9. Quick Actions
export const mockQuickActions: QuickActionItem[] = [
  { id: 'add-user', label: 'Add User', iconName: 'UserPlus', actionUrl: '#', shortcut: 'A' },
  { id: 'create-role', label: 'Create Role', iconName: 'ShieldPlus', actionUrl: '#', shortcut: 'R' },
  { id: 'upload-content', label: 'Upload Content', iconName: 'Upload', actionUrl: '#', shortcut: 'C' },
  { id: 'config-ai', label: 'Configure AI', iconName: 'Sliders', actionUrl: '#', shortcut: 'I' },
  { id: 'system-settings', label: 'System Settings', iconName: 'Settings', actionUrl: '#', shortcut: 'S' },
  { id: 'view-reports', label: 'View Reports', iconName: 'FileText', actionUrl: '#', shortcut: 'V' },
];

// 10. Subscription Data
export const mockSubscription: SubscriptionData = {
  planName: 'Pro Enterprise Plan',
  status: 'Active',
  expiryDate: 'Jun 20, 2025',
  usersUsed: 12458,
  usersLimit: 25000,
  requestsUsed: '2.34M',
  requestsLimit: '10M',
  storageUsed: 1.74,
  storageLimit: 3.0,
};
