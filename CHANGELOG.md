# Changelog

All notable changes to the **AI Learning Operating System** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] - 2026-08-14

### Production v1.0.0 Release - Initial Launch

#### Features & Architecture
- **Database-Driven Dashboard**: Live learner dashboard calculating level, stage progression, active courses, daily streak days, and total XP from PostgreSQL relations.
- **Learning Rooms System**: Database-backed learning rooms supporting 20 task types, prerequisite task locking, auto-advance, and verified completion certificates.
- **Interactive Task Engine**: Server-side answer validation for Reading, Video Lessons, MCQs, True/False, Matching, Ordering, Fill-in-the-Blank, Image Identification, Memory Games, Drag & Drop, and Python Code Labs.
- **XP & Progress Engine**: Backend-calculated idempotent XP rewards awarded strictly on the first pass per task with atomic database transaction safety (`prisma.$transaction`).
- **Anti-Cheat Security**: Automatic stripping of `correctAnswer` and `correctData` from API payloads before client delivery.
- **AI Algorithm Catalog**: 35 seeded algorithms covering Classical ML, Deep Learning, Transformers, Optimization, Generative AI, and Search/Graphs.
- **5-Layer AI Architecture**: Educational categorizations spanning L1 Infrastructure, L2 Data, L3 Frameworks, L4 Models/Algorithms, and L5 Applications.
- **Educational Animations**: Reusable interactive conceptual animation component (`<EducationalAnimation>`) for Forward/Backprop, Gradient Descent, CNNs, Attention, Transformers, Tokenization, Embeddings, RAG, and AI Agents.
- **Educational Games**: Interactive gamified renderers for memory card matching, drag & drop zone placement, classification, and sequence ordering.
- **Video Lessons**: HTML5 video lesson player with playback controls, transcripts, and completion checkpoints.
- **AI Projects Marketplace**: CodeCanyon-style catalog, workspace page with syntax-highlighted codebase file explorer, reviews, and interactive payment gateway checkout simulation.
- **Admin Content Management System**: Dedicated builder interface at `/admin/rooms` for authoring rooms, tasks, questions, validation rules, hints, explanations, and XP rewards.
- **Recommendation Engine**: Dynamic next-content selection based on user stage progression and completed prerequisites.
- **Production Security & Auth**: NextAuth JWT session resolution, server-side Zod validation, role authorization, and safe error handling.
- **Rate Limiting Middleware**: Pluggable `RateLimitStore` supporting process-local memory (`MemoryRateLimitStore`) for single instance and Redis (`RedisRateLimitStore`) for multi-instance deployments with user-aware keying.
- **Observability & Logging**: Structured JSON event logger (`logEvent`) with automatic credential and token sanitization.
- **Health Check Endpoint**: Public health monitoring endpoint at `GET /api/health`.
- **Production Documentation**: Complete operations suite (`docs/PRODUCTION_DEPLOYMENT.md`, `docs/PRODUCTION_SMOKE_TEST.md`, `docs/PRODUCTION_BACKUP_CHECKLIST.md`, `.env.example`).
