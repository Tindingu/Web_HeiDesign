import { env } from "@/lib/env";

type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(ip: string) {
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const maxTokens = env.RATE_LIMIT_MAX;
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { tokens: maxTokens, lastRefill: now };

  const elapsed = now - bucket.lastRefill;
  if (elapsed > windowMs) {
    bucket.tokens = maxTokens;
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) {
    buckets.set(ip, bucket);
    return { allowed: false, remaining: 0 };
  }

  bucket.tokens -= 1;
  buckets.set(ip, bucket);

  return { allowed: true, remaining: bucket.tokens };
}
