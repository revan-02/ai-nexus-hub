#!/usr/bin/env python3
"""
Compiles all 27 courses in lib/mock-data/courses-data.ts with complete Udemy-style curriculums.
"""

import re
import json

# Read current courses file
with open("/Users/amithks/ai-webapp/lib/mock-data/courses-data.ts", "r") as f:
    text = f.read()

# Generate curriculum sections
def generate_curriculum(c_id, title, cat, level, th):
    return [
        {
            "id": f"{c_id}-sec-1",
            "sectionNumber": 1,
            "title": f"Introduction & Core Foundations of {cat}",
            "totalTime": "3h 45m",
            "lectures": [
                {"id": f"{c_id}-lec-1-1", "title": f"Course Overview & Key Milestones: {title}", "duration": "08:15", "type": "video", "isPreview": True},
                {"id": f"{c_id}-lec-1-2", "title": f"Core Principles & Historical Foundations", "duration": "14:30", "type": "video", "isPreview": True},
                {"id": f"{c_id}-lec-1-3", "title": "Mathematical Derivations & Theoretical Bounds", "duration": "22:45", "type": "video"},
                {"id": f"{c_id}-lec-1-4", "title": "GPU Environment & Toolchain Setup", "duration": "16:20", "type": "video"},
                {"id": f"{c_id}-lec-1-5", "title": "Quiz 1: Core Foundations Checkpoint", "duration": "15:00", "type": "quiz"},
                {"id": f"{c_id}-lec-1-6", "title": "Hands-on Lab: First Python Implementation", "duration": "35:00", "type": "coding_lab"}
            ]
        },
        {
            "id": f"{c_id}-sec-2",
            "sectionNumber": 2,
            "title": "Deep Architecture & Algorithmic Implementation",
            "totalTime": "5h 30m",
            "lectures": [
                {"id": f"{c_id}-lec-2-1", "title": "Deep Architecture & Mathematical Representation", "duration": "28:10", "type": "video", "isPreview": True},
                {"id": f"{c_id}-lec-2-2", "title": "Loss Surface Geometry & Gradient Propagation", "duration": "32:40", "type": "video"},
                {"id": f"{c_id}-lec-2-3", "title": "Vectorized Batch Operations & Memory Profiling", "duration": "24:15", "type": "video"},
                {"id": f"{c_id}-lec-2-4", "title": "Coding Lab: Building the Core Engine from Scratch", "duration": "55:00", "type": "coding_lab"}
            ]
        },
        {
            "id": f"{c_id}-sec-3",
            "sectionNumber": 3,
            "title": "Optimization, Fine-Tuning & Error Analysis",
            "totalTime": "4h 45m",
            "lectures": [
                {"id": f"{c_id}-lec-3-1", "title": "Hyperparameter Optimization & Cross-Validation", "duration": "25:30", "type": "video"},
                {"id": f"{c_id}-lec-3-2", "title": "Regularization, Dropout & Preventing Overfitting", "duration": "29:15", "type": "video"},
                {"id": f"{c_id}-lec-3-3", "title": "Inference Latency & Quantization Benchmarks", "duration": "34:20", "type": "video"},
                {"id": f"{c_id}-lec-3-4", "title": "Lab: Model Performance Profiling", "duration": "45:00", "type": "coding_lab"}
            ]
        },
        {
            "id": f"{c_id}-sec-4",
            "sectionNumber": 4,
            "title": "Production Deployment & Capstone Milestone",
            "totalTime": "6h 15m",
            "lectures": [
                {"id": f"{c_id}-lec-4-1", "title": "Packaging FastAPI Streaming Microservice", "duration": "34:20", "type": "video"},
                {"id": f"{c_id}-lec-4-2", "title": "Docker Containerization & Kubernetes Staging", "duration": "38:40", "type": "video"},
                {"id": f"{c_id}-lec-4-3", "title": "Capstone Project: End-to-End Enterprise Solution", "duration": "85:00", "type": "coding_lab"},
                {"id": f"{c_id}-lec-4-4", "title": "Final Proctored Certification Exam", "duration": "45:00", "type": "quiz"}
            ]
        }
    ]

# Find all course objects
# Let's write a clean TypeScript mockCoursesList replacement that contains all courses with full metadata
print("Processing course objects in Python...")
