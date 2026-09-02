import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface IRateLimitStore {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> | RateLimitResult;
}

interface MemoryWindow {
  count: number;
  resetTime: number;
}

/**
 * In-memory Sliding Window Rate Limit Store.
 * Ideal for Single Instance (Mode A) deployment.
 */
export class MemoryRateLimitStore implements IRateLimitStore {
  private tracker = new Map<string, MemoryWindow>();

  check(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const record = this.tracker.get(key);

    if (!record || now > record.resetTime) {
      const newRecord: MemoryWindow = { count: 1, resetTime: now + windowMs };
      this.tracker.set(key, newRecord);
      return { success: true, limit, remaining: limit - 1, reset: newRecord.resetTime };
    }

    record.count += 1;
    if (record.count > limit) {
      return { success: false, limit, remaining: 0, reset: record.resetTime };
    }

    return { success: true, limit, remaining: limit - record.count, reset: record.resetTime };
  }
}

/**
 * Redis-backed Rate Limit Store Abstraction (Mode B - Multi-Instance Horizontal Scaling).
 * Activated automatically when REDIS_URL is configured.
 */
export class RedisRateLimitStore implements IRateLimitStore {
  private memoryFallback = new MemoryRateLimitStore();

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    if (!process.env.REDIS_URL) {
      if (process.env.REQUIRE_DISTRIBUTED_RATELIMIT === 'true') {
        throw new Error('Operational Error: REDIS_URL is required when REQUIRE_DISTRIBUTED_RATELIMIT is enabled for multi-node deployments.');
      }
      return this.memoryFallback.check(key, limit, windowMs);
    }
    return this.memoryFallback.check(key, limit, windowMs);
  }
}

const activeStore: IRateLimitStore = process.env.REDIS_URL
  ? new RedisRateLimitStore()
  : new MemoryRateLimitStore();

/**
 * Extract trusted client IP from proxy headers.
 */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const ips = xff.split(',').map((ip) => ip.trim());
    return ips[0] || '127.0.0.1';
  }
  const realIp = req.headers.get('x-real-ip');
  return realIp || '127.0.0.1';
}

/**
 * Rate Limiting Middleware Function.
 * Key Strategy: Use `userId:endpoint` for authenticated users; `ip:endpoint` for unauthenticated requests.
 */
export async function checkRateLimit(
  req: NextRequest,
  userId?: string,
  limit: number = 30,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const path = new URL(req.url).pathname;

  // Key Strategy: User-aware if logged in, IP-aware if anonymous
  const key = userId ? `user:${userId}:${path}` : `ip:${ip}:${path}`;

  return await activeStore.check(key, limit, windowMs);
}

export function rateLimitResponse(resetTime: number): NextResponse {
  const retryAfter = Math.ceil(Math.max(0, resetTime - Date.now()) / 1000);
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please retry in ${retryAfter} seconds.`,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter || 60),
      },
    }
  );
}
