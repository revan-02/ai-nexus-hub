# Production v1.0 Deployment & Operations Guide

This guide details the deployment procedures, environment configuration, database management, and operations for the **AI Learning Operating System**.

---

## 1. Deployment Modes

### Mode A: Single Instance Deployment (Default)
Ideal for initial launch, staging, or single-node deployments.
- **Node.js**: Next.js App Router on single instance.
- **Database**: PostgreSQL.
- **Rate Limiting**: Process-local sliding window memory store (`MemoryRateLimitStore`).

```
Next.js Instance ──> PostgreSQL
```

### Mode B: Horizontal Multi-Instance Scaling
Required when running behind a load balancer with multiple application nodes.
- **Load Balancer**: AWS ALB / NGINX / Cloudflare.
- **Node.js Cluster**: Multiple stateless Next.js app containers.
- **Shared Cache & Rate Limiting**: Redis (`RedisRateLimitStore` activated via `REDIS_URL`).
- **Database**: PostgreSQL with connection pooling.

```
                  ┌──> App Node 1 ──┐
Load Balancer ───┼──> App Node 2 ──┼──> Redis (Rate Limiter)
                  └──> App Node 3 ──┘
                            │
                            ▼
                        PostgreSQL
```

---

## 2. Required Environment Variables

Configure these variables in your deployment host environment (e.g. AWS ECS, Vercel, Railway, Kubernetes Secrets). **Never expose secrets via `NEXT_PUBLIC_*`**.

```env
# Required Core Configuration
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
NEXTAUTH_SECRET="min-32-char-random-generated-secret"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"

# Optional: Mode B Multi-Instance Scaling
REDIS_URL="redis://user:pass@redis-host:6379"
```

---

## 3. Node.js & Build Commands

- **Node.js Version**: `v18.x` or `v20.x` LTS.
- **Package Manager**: `npm`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

---

## 4. Database Migration & Safety Rules

### Migration Procedure
Use Prisma schema migrations for production deployments. **NEVER use `prisma db push --force-reset` or `db push` on production**.

```bash
# 1. Run database schema migrations
npx prisma migrate deploy

# 2. Verify migration status
npx prisma migrate status
```

---

## 5. Backup & Disaster Recovery

### Database Provider
- Configured via cloud PostgreSQL provider (e.g. AWS RDS, Neon, Supabase, GCP Cloud SQL).
- If no provider is configured, report: `DATABASE PROVIDER NOT CONFIGURED/UNKNOWN`.

### Recommended Backup Policy
1. **Daily Automated Snapshots**: Retained for 30 days.
2. **Point-In-Time Recovery (PITR)**: Enabled for transaction log recovery up to 7 days.
3. **Pre-Deployment Backup**: Take an automated snapshot immediately prior to running `npx prisma migrate deploy`.

### Restore Procedure
1. Provision a isolated staging database instance.
2. Restore selected point-in-time snapshot.
3. Run `npx prisma migrate status` to verify schema alignment.
4. Execute application verification tests before updating `DATABASE_URL`.

---

## 6. Health Checks & Monitoring

- **Health Endpoint**: `GET /api/health`
- **Behavior**: Returns HTTP `200 OK` when healthy and HTTP `503 Service Unavailable` if database connectivity fails.
- **Payload Example**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-08-14T16:00:00.000Z",
    "services": {
      "application": "healthy",
      "database": { "status": "healthy", "latencyMs": 8 }
    }
  }
  ```

---

## 7. Rate Limiting & Proxy Configuration

- **Keying Strategy**: Authenticated requests use `user:{userId}:{endpoint}`; anonymous requests use `ip:{clientIp}:{endpoint}`.
- **Trusted Proxy**: When behind NGINX or Cloudflare, ensure `x-forwarded-for` headers are passed securely from trusted proxies only.

---

## 8. Rollback Procedure

If a deployment fails:
1. Revert container image / commit build tag to previous version.
2. Re-point load balancer to active previous deployment.
3. If database schema was altered, apply down-migration scripts or restore pre-deployment database snapshot.
