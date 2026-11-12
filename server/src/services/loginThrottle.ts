/**
 * In-process attempt limiter for authentication endpoints.
 *
 * This is a first line of defence against online guessing (per credential and
 * per client address). A single-process deployment is accurate; behind several
 * instances this becomes per-instance, so persistent per-account lockout
 * counters (see User.failedLoginAttempts / lockedUntil) remain the backstop.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface AttemptResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function consumeAttempt(key: string, limit: number, windowMs: number): AttemptResult {
  const now = Date.now();
  prune(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearAttempts(key: string): void {
  buckets.delete(key);
}
