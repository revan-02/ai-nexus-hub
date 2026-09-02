#!/usr/bin/env python3
"""
Full Udemy Curriculum Generator for all 27 courses (crs-0 to crs-26) in courses-data.ts
"""

import re

# Template for generating high-quality curriculum per course
def get_curriculum_for_course(c_id, title, desc, cat, level, tier):
    hours_map = {
        "Beginner": ("14.5 Hours", 36),
        "Intermediate": ("22.5 Hours", 48),
        "Advanced": ("32.0 Hours", 64)
    }
    th, tl = hours_map.get(level, ("20.0 Hours", 42))

    return {
        "totalHours": th,
        "totalLectures": tl,
        "rating": 4.9 if level == "Advanced" else 4.8,
        "ratingsCount": f"{int(tl * 115):,} ratings",
        "objectives": [
            f"Master theoretical principles and real-world implementation of {title}",
            "Understand underlying mathematical formulations, loss functions, and proofs",
            "Build production-grade pipelines in Python, PyTorch, and modern AI frameworks",
            "Benchmark latency, GPU memory utilization, and algorithmic performance",
            "Deploy working AI microservices to cloud container registries with CI/CD",
            "Earn a verifiable ISO/IEC 17024 Accredited Certificate of Competence"
        ],
        "expectedOutcomes": [
            f"End-to-end {cat} portfolio project with unit tests and documentation",
            "Production-ready deployment template with Docker & FastAPI",
            "Open Badges 3.0 verifiable credential added to your resume and LinkedIn",
            "Comprehensive preparation for top AI/ML engineering technical interviews"
        ],
        "prerequisites": [
            "Basic Python programming syntax (loops, functions, dictionaries)",
            "High-school mathematics (algebra, basic functions)",
            "An eager mindset to learn cutting-edge AI technologies"
        ],
        "includes": {
            "hoursVideo": f"{th} on-demand video",
            "articles": int(tl * 0.5),
            "codingExercises": int(tl * 0.4),
            "downloadableResources": int(tl * 0.6),
            "certificate": True,
            "lifetimeAccess": True
        },
        "curriculum": [
            {
                "id": f"{c_id}-sec-1",
                "sectionNumber": 1,
                "title": f"Foundations & Fundamentals of {cat}",
                "totalTime": "3h 45m",
                "lectures": [
                    {"id": f"{c_id}-lec-1-1", "title": "Course Introduction & Setup", "duration": "08:15", "type": "video", "isPreview": True},
                    {"id": f"{c_id}-lec-1-2", "title": f"Core Concepts: {title}", "duration": "14:30", "type": "video", "isPreview": True},
                    {"id": f"{c_id}-lec-1-3", "title": "Mathematical Formulations & Derivations", "duration": "22:45", "type": "video"},
                    {"id": f"{c_id}-lec-1-4", "title": "Environment & Dependencies Configuration", "duration": "16:20", "type": "video"},
                    {"id": f"{c_id}-lec-1-5", "title": "Quiz 1: Fundamentals Checkpoint", "duration": "15:00", "type": "quiz"},
                    {"id": f"{c_id}-lec-1-6", "title": "Lab 1: First Hands-on Implementation", "duration": "35:00", "type": "coding_lab"}
                ]
            },
            {
                "id": f"{c_id}-sec-2",
                "sectionNumber": 2,
                "title": "Deep Architecture & Algorithmic Design",
                "totalTime": "5h 30m",
                "lectures": [
                    {"id": f"{c_id}-lec-2-1", "title": "Model Architecture & Parameter Design", "duration": "28:10", "type": "video", "isPreview": True},
                    {"id": f"{c_id}-lec-2-2", "title": "Loss Surfaces, Gradients & Backpropagation", "duration": "32:40", "type": "video"},
                    {"id": f"{c_id}-lec-2-3", "title": "Vectorized Batch Operations & GPU Acceleration", "duration": "24:15", "type": "video"},
                    {"id": f"{c_id}-lec-2-4", "title": "Coding Lab: Building the Core Engine from Scratch", "duration": "55:00", "type": "coding_lab"}
                ]
            },
            {
                "id": f"{c_id}-sec-3",
                "sectionNumber": 3,
                "title": "Optimization, Fine-Tuning & Error Analysis",
                "totalTime": "4h 45m",
                "lectures": [
                    {"id": f"{c_id}-lec-3-1", "title": "Hyperparameter Tuning with Optuna & Cross-Validation", "duration": "25:30", "type": "video"},
                    {"id": f"{c_id}-lec-3-2", "title": "Mitigating Overfitting & Regularization Techniques", "duration": "29:15", "type": "video"},
                    {"id": f"{c_id}-lec-3-3", "title": "Inference Latency & Quantization Benchmarks", "duration": "34:20", "type": "video"},
                    {"id": f"{c_id}-lec-3-4", "title": "Lab: Model Optimization & Profiling", "duration": "45:00", "type": "coding_lab"}
                ]
            },
            {
                "id": f"{c_id}-sec-4",
                "sectionNumber": 4,
                "title": "Production Deployment & Capstone Milestone",
                "totalTime": "6h 15m",
                "lectures": [
                    {"id": f"{c_id}-lec-4-1", "title": "Packaging FastAPI Streaming Microservice", "duration": "34:20", "type": "video"},
                    {"id": f"{c_id}-lec-4-2", "title": "Docker Containerization & Kubernetes Deployment", "duration": "38:40", "type": "video"},
                    {"id": f"{c_id}-lec-4-3", "title": "Capstone Project: End-to-End Enterprise Solution", "duration": "85:00", "type": "coding_lab"},
                    {"id": f"{c_id}-lec-4-4", "title": "Final Proctored Certification Exam", "duration": "45:00", "type": "quiz"}
                ]
            }
        ]
    }

print("Generator script prepared!")
