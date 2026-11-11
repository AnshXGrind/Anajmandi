import { AppError } from '@/lib/utils/errors'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function enforceRateLimit(request: Request, key: string, limit = 10, windowMs = 15 * 60 * 1000) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const address = forwardedFor || request.headers.get('x-real-ip') || 'unknown'
  const bucketKey = `${key}:${address}`
  const now = Date.now()
  const current = buckets.get(bucketKey)

  if (!current || current.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return
  }

  if (current.count >= limit) {
    throw new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMITED')
  }

  current.count += 1
}
