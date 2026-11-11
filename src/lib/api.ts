import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError, isAppError } from '@/lib/utils/errors'

export function jsonError(error: unknown) {
  if (error instanceof ZodError) {
    const fields = Object.fromEntries(error.issues.map((issue) => [issue.path.join('.') || 'form', issue.message]))
    return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid request', code: 'VALIDATION_ERROR', fields }, { status: 422 })
  }
  if (isAppError(error)) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode })
  }
  if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === '23505') {
    return NextResponse.json({ error: 'This record already exists', code: 'CONFLICT' }, { status: 409 })
  }
  console.error(error)
  return NextResponse.json({ error: 'Something went wrong. Please try again.', code: 'INTERNAL_ERROR' }, { status: 500 })
}

export function requireUser(user: { id: string } | null) {
  if (!user) throw new AppError('Authentication required', 401, 'AUTH_REQUIRED')
  return user
}

export function boundedPage(value: string | null, fallback: number, maximum: number) {
  const parsed = Number(value ?? fallback)
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback
}
