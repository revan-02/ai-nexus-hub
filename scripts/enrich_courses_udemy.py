#!/usr/bin/env python3
"""
Comprehensive Udemy-Grade Course Enrichment Script
Updates lib/mock-data/courses-data.ts with Total Hours, Multi-Section Curriculums, Lecture Times (MM:SS), Objectives ("What you'll learn"), Expected Outcomes, and Prerequisites for all 26 courses.
"""

import json
import re

# Read current courses-data.ts
with open("/Users/amithks/ai-webapp/lib/mock-data/courses-data.ts", "r") as f:
    content = f.read()

# Define the TypeScript interface additions
ts_interface_header = """export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Published' | 'Draft' | 'In Review' | 'Archived';
export type CourseAcademicTier = 'Young Explorer' | 'Junior Innovator' | 'Pre-University' | 'Undergraduate' | 'Postgraduate' | 'Industry Professional' | 'PhD & Research';

export interface CourseLecture {
  id: string;
  title: string;
  duration: string; // e.g. "14:20"
  type: 'video' | 'quiz' | 'coding_lab' | 'reading';
  isPreview?: boolean;
}

export interface CourseSection {
  id: string;
  sectionNumber: number;
  title: string;
  totalTime: string; // e.g. "2h 45m"
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
  totalHours: string;
  totalLectures: number;
  rating: number;
  ratingsCount: string;
  objectives: string[];
  expectedOutcomes: string[];
  prerequisites: string[];
  includes: CourseIncludes;
  curriculum: CourseSection[];
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

print("Preparing rich Udemy-style course schemas...")
