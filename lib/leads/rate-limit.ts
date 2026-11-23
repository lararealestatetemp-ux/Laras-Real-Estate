const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 10 * 60 * 1000;

type RateLimitEntry = {
  count: number;
  windowStartedAt: number;
};

type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
  now?: number;
};

const entries = new Map<string, RateLimitEntry>();

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export function assertRateLimit(
  key: string,
  options: RateLimitOptions = {},
): void {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = options.now ?? Date.now();
  const existing = entries.get(key);

  if (!existing || now - existing.windowStartedAt >= windowMs) {
    entries.set(key, { count: 1, windowStartedAt: now });
    return;
  }

  if (existing.count >= limit) {
    throw new RateLimitError();
  }

  existing.count += 1;
}

export function resetRateLimits(): void {
  entries.clear();
}
