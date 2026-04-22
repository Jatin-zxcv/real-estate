const bucket = new Map();

export function isRateLimited({ key, max, windowMs }) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const current = bucket.get(key) || [];
  const recent = current.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= max) {
    bucket.set(key, recent);
    return true;
  }

  recent.push(now);
  bucket.set(key, recent);
  return false;
}
