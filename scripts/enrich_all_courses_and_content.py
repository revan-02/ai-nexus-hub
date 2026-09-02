#!/usr/bin/env python3
"""
Full Udemy-Grade Enrichment for all Courses & Content items
Injects:
- Total Hours & Total Lectures
- Star Rating & Ratings Count
- Objectives ("What you'll learn")
- Expected Outcomes & Real-World Projects
- Prerequisites
- Section-by-Section Curriculum with Topic Durations (MM:SS)
- Includes checklist (video hours, coding labs, articles, ISO 17024 certificate)
"""

import os
import re

print("Compiling Udemy Curriculum for all Courses...")

# Read courses-data.ts
with open("/Users/amithks/ai-webapp/lib/mock-data/courses-data.ts", "r") as f:
    courses_code = f.read()

# Ensure types are imported and exported
interfaces = """export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Published' | 'Draft' | 'In Review' | 'Archived';
export type CourseAcademicTier = 'Young Explorer' | 'Junior Innovator' | 'Pre-University' | 'Undergraduate' | 'Postgraduate' | 'Industry Professional' | 'PhD & Research';

export interface CourseLecture {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'coding_lab' | 'reading';
  isPreview?: boolean;
}

export interface CourseSection {
  id: string;
  sectionNumber: number;
  title: string;
  totalTime: string;
  lectures: CourseLecture[];
}

export interface CourseIncludes {
  hoursVideo: string;
  articles: number;
  codingExercises: number;
  downloadableResources: number;
  certificate: boolean;
  lifetimeAccess: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  academicTier?: CourseAcademicTier;
  totalHours?: string;
  totalLectures?: number;
  rating?: number;
  ratingsCount?: string;
  objectives?: string[];
  expectedOutcomes?: string[];
  prerequisites?: string[];
  includes?: CourseIncludes;
  curriculum?: CourseSection[];
  instructor: {
    id?: string;
    name: string;
    avatar: string;
  };
  price: string;
  students: string;
  status: CourseStatus;
  updatedAt: string;
  thumbnailIcon: string;
}"""

# Replace top interface in courses-data.ts
pattern = r"export type CourseLevel.*?(?=export const mockCoursesMetrics)"
courses_code_updated = re.sub(pattern, interfaces + "\n\n", courses_code, flags=re.DOTALL)

with open("/Users/amithks/ai-webapp/lib/mock-data/courses-data.ts", "w") as f:
    f.write(courses_code_updated)

print("Updated lib/mock-data/courses-data.ts with Udemy course interfaces!")
