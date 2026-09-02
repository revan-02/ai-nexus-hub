# Production v1.0 Smoke Test Checklist

Execute this checklist immediately following every production deployment to verify system health, authentication, database integrity, task execution, and admin workflows.

---

## 1. Post-Deployment Verification Matrix

| # | Test | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| 1 | **Application URL** | Base domain (e.g. `https://your-domain.com`) loads without DNS errors or web server misconfiguration. | `[ ] PASS / [ ] FAIL` | Check initial response code is 200 OK. |
| 2 | **HTTPS Verification** | Valid SSL/TLS certificate, HSTS header present, HTTP automatically redirects to HTTPS. | `[ ] PASS / [ ] FAIL` | No mixed-content warnings in browser console. |
| 3 | **Login** | User submits valid credentials at `/login` and receives a valid NextAuth JWT session. | `[ ] PASS / [ ] FAIL` | User redirected to `/dashboard`. |
| 4 | **Logout** | Clicking Logout terminates session cookies and revokes client state. | `[ ] PASS / [ ] FAIL` | Accessing protected routes redirects back to `/login`. |
| 5 | **Dashboard** | Learner dashboard at `/dashboard` renders database-calculated level, stage, streak, and XP. | `[ ] PASS / [ ] FAIL` | Verify no fallback demo numbers appear. |
| 6 | **Learning Room** | Opening `/learn/[roomId]` fetches dynamic room details, tasks, tier, and level from PostgreSQL. | `[ ] PASS / [ ] FAIL` | Verify no `"0 of 0 Tasks"` error message. |
| 7 | **Task Completion** | Submitting a correct task answer displays success feedback and updates progress in DB. | `[ ] PASS / [ ] FAIL` | POST `/api/rooms/:id/tasks/:taskId/submit` returns `isCorrect: true`. |
| 8 | **Incorrect Answer** | Submitting a wrong task answer displays explanation feedback, hint toggle, and increments attempt count. | `[ ] PASS / [ ] FAIL` | Returned `isCorrect: false`, XP awarded remains 0. |
| 9 | **Retry** | Clicking Retry on a failed task allows immediate re-attempt without locking the UI. | `[ ] PASS / [ ] FAIL` | Input fields re-enabled cleanly. |
| 10 | **XP Verification** | Completing an unpassed task awards task XP (`+50 XP`) and updates user total XP in DB. | `[ ] PASS / [ ] FAIL` | Database record in `user_task_progress` reflects `xpEarned`. |
| 11 | **Duplicate Submission** | Re-submitting a correct answer to an already passed task returns `xpEarned: 0` and `alreadyCompleted: true`. | `[ ] PASS / [ ] FAIL` | Idempotent XP protection prevents double-reward exploit. |
| 12 | **Progress Verification** | Room progress bar percentage matches `(completedRequiredTasks / totalRequiredTasks) * 100`. | `[ ] PASS / [ ] FAIL` | UI progress updates dynamically. |
| 13 | **Recommendation Verification** | Next recommended stage and courses in dashboard reflect the learner's actual stage and completed content. | `[ ] PASS / [ ] FAIL` | Recommends eligible uncompleted topics. |
| 14 | **Game Execution** | Interactive games (memory, matching, drag & drop, ordering) finish, score, and persist results. | `[ ] PASS / [ ] FAIL` | Game score validated on backend. |
| 15 | **Video Playback** | Video lesson tasks render HTML5 video player with controls, transcript, and completion checkpoint. | `[ ] PASS / [ ] FAIL` | Video plays smoothly without CORS errors. |
| 16 | **Project Access** | `/projects/[id]` workspace opens codebase explorer, deliverables checklist, reviews, and payment checkout modal. | `[ ] PASS / [ ] FAIL` | Codebase files display with syntax highlighting. |
| 17 | **Admin Login** | User with Admin role logs in and accesses `/admin/rooms` CMS interface. | `[ ] PASS / [ ] FAIL` | Non-admin users blocked with HTTP 403. |
| 18 | **Admin Content Creation** | Admin creates a new Room and Task in `/admin/rooms` builder. | `[ ] PASS / [ ] FAIL` | Record persisted in `learning_rooms` & `learning_tasks`. |
| 19 | **Admin → Learner Verification** | Published admin task immediately appears in learner `/learn/[roomId]` without code deployment. | `[ ] PASS / [ ] FAIL` | Learner completes newly authored task. |
| 20 | **API Health** | `GET /api/health` returns HTTP 200 OK with `{"status":"ok","services":{"application":"healthy","database":{"status":"healthy"}}}`. | `[ ] PASS / [ ] FAIL` | Check database query latency in response payload. |
| 21 | **Database Connectivity** | Prisma client successfully queries PostgreSQL tables without pool timeouts or connection errors. | `[ ] PASS / [ ] FAIL` | Verify connection pool count in logs. |
| 22 | **Error Handling** | Navigating to non-existent route or simulating 404/500 renders user-friendly error page without stack traces. | `[ ] PASS / [ ] FAIL` | No internal file paths exposed to client. |
| 23 | **Mobile Viewport** | Testing dashboard, learning room, and games on mobile viewport (375px) shows zero horizontal overflow. | `[ ] PASS / [ ] FAIL` | Touch targets and controls fully accessible. |
| 24 | **Production Logs** | Structured JSON logs contain timestamp, level, event, and route while stripping passwords and tokens. | `[ ] PASS / [ ] FAIL` | Search logs for sensitive credential fields. |
| 25 | **Backup Verification** | Automated daily snapshot and Point-In-Time Recovery (PITR) verified active on cloud database host. | `[ ] PASS / [ ] FAIL` | Verify last snapshot timestamp in database cloud console. |

---

## 2. Automated Rollback Decision Gate

> [!CAUTION]
> **CRITICAL RULE**: If **ANY** of the following core criteria fail during the smoke test, the deployment is classified as **FAILED** and MUST be rolled back immediately.

### Rollback Trigger Checklist
- [ ] **Authentication Failure**: Users cannot log in or session cookies fail to issue.
- [ ] **Database Connectivity Failure**: Database queries error out or latency exceeds 5000ms.
- [ ] **Data Integrity Violation**: User progress, attempt records, or task states corrupt.
- [ ] **XP Duplication Exploit**: Re-submitting a task awards duplicate XP.
- [ ] **Authorization Bypass**: Unauthenticated users can access admin routes or another learner's private data.
- [ ] **Payment Security Violation** (If real payments enabled): Client-side payload can manipulate course or project pricing.

---

## 3. Rollback Execution Procedure

If a rollback is triggered:
1. Re-route DNS / Load Balancer traffic to the previous known-good deployment container image.
2. If database migrations were executed, run rollback migration scripts or restore pre-deployment database snapshot.
3. Notify the engineering team and inspect production error logs via `GET /api/health` and structured log logs.
