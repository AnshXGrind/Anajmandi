import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError, isAppError } from '@/lib/utils/errors'

export function jsonError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid request', code: 'VALIDATION_ERROR' }, { status: 422 })
  }
  if (isAppError(error)) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode })
  }
  console.error(error)
  return NextResponse.json({ error: 'Something went wrong. Please try again.', code: 'INTERNAL_ERROR' }, { status: 500 })
}

export function requireUser(user: { id: string } | null) {
  if (!user) throw new AppError('Authentication required', 401, 'AUTH_REQUIRED')
  return user
}
