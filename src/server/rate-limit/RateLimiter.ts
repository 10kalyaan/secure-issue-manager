import { RateLimitError } from "@/server/errors/ApiError";

type Bucket = { count: number; resetAt: number };

export class RateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(private limit: number, private windowMs: number) {}

  consume(key: string) {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      const fresh: Bucket = { count: 1, resetAt: now + this.windowMs };
      this.buckets.set(key, fresh);
      return this.buildResult(fresh);
    }

    bucket.count += 1;
    this.buckets.set(key, bucket);

    if (bucket.count > this.limit) {
      throw new RateLimitError();
    }

    return this.buildResult(bucket);
  }

  private buildResult(bucket: Bucket) {
    const remaining = Math.max(0, this.limit - bucket.count);
    const resetSeconds = Math.ceil(bucket.resetAt / 1000);

    return {
      limit: this.limit,
      remaining,
      reset: resetSeconds,
      headers: {
        "X-RateLimit-Limit": String(this.limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(resetSeconds),
      } as Record<string, string>,
    };
  }
}
