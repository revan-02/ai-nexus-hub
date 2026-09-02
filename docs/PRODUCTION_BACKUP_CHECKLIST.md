# Production Database Backup & Disaster Recovery Checklist

## 1. Provider Status
```
STATUS: Production database provider must be configured externally.
```
The application repository uses standard Prisma ORM (`prisma-client-js`) with PostgreSQL. Production backup, snapshot, and Point-In-Time Recovery (PITR) policies must be configured on the managed cloud database host (e.g. AWS RDS, Neon, Supabase, GCP Cloud SQL).

---

## 2. Mandatory Backup Policies

| Requirement | Policy Specification | Verification Method |
|---|---|---|
| **Automated Daily Backups** | Execution every 24 hours at low-traffic window (02:00 UTC). | Verify Cloud Database Console backup log. |
| **Snapshot Retention** | Minimum 30-day retention for daily snapshots. | Verify lifecycle rule in storage policy. |
| **Point-In-Time Recovery (PITR)** | Continuous WAL archiving enabling recovery to any second within 7 days. | Verify WAL archiving status in DB provider settings. |
| **Pre-Migration Snapshot** | Take an immediate manual snapshot before running `npx prisma migrate deploy`. | Execute manual snapshot via provider CLI/API. |

---

## 3. Staging Database Restore Testing Procedure

To test restore procedures without affecting production data:

1. Provision a isolated staging PostgreSQL instance (e.g. `ai_nexus_staging`).
2. Export selected production backup snapshot via cloud provider console.
3. Restore snapshot to the staging database instance.
4. Update staging `.env` with staging `DATABASE_URL`.
5. Execute verification commands:
   ```bash
   npx prisma migrate status
   npm run test
   ```
6. Verify data records (`users`, `learning_rooms`, `learning_tasks`, `user_task_progress`).

> [!CAUTION]
> **CRITICAL RULE**: NEVER perform destructive restore testing against the active production database.

---

## 4. Migration Rollback & Disaster Recovery

### Safe Rollback Procedure
If a database migration causes errors post-deployment:
1. Immediately stop the web application instances to prevent invalid writes.
2. If down-migration SQL scripts exist, execute them via Prisma CLI:
   ```bash
   npx prisma db execute --file ./prisma/migrations/rollback.sql
   ```
3. If structural data corruption occurred, restore database to pre-deployment PITR timestamp.
4. Point application `.env` to restored database timestamp and verify via `GET /api/health`.
