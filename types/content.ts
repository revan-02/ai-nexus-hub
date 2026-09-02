export type ContentType =
  | 'Course'
  | 'Article'
  | 'Tutorial'
  | 'Dataset'
  | 'Video'
  | 'Quiz'
  | 'Guide';

export type ContentStatus =
  | 'Published'
  | 'Draft'
  | 'Pending Review'
  | 'Archived'
  | 'Rejected';

export interface AuthorInfo {
  id: string;
  name: string;
  avatar: string;
}

export interface ContentTopic {
  title: string;
  duration: string;
  description?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  subCategory?: string;
  totalDuration?: string;
  topicsCount?: number;
  objectives?: string[];
  expectedOutcome?: string;
  topics?: ContentTopic[];
  author: AuthorInfo;
  status: ContentStatus;
  views: string;
  createdAt: string;
  thumbnailIcon: string;
}

export interface ContentMetricData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend?: 'up' | 'down' | 'flat';
  period: string;
  variant: 'purple' | 'blue' | 'orange' | 'green' | 'red' | 'cyan';
}

export interface TopCategoryData {
  id: string;
  name: string;
  count: number;
  maxCount: number;
}
