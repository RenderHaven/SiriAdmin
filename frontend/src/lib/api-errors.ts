export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'server'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'invalid_response'
  | 'unknown'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly cause?: unknown

  constructor(kind: ApiErrorKind, message: string, options?: { status?: number; cause?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = options?.status
    this.cause = options?.cause
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isConnectionError(error: unknown): boolean {
  if (!isApiError(error)) return false
  return error.kind === 'network' || error.kind === 'timeout' || error.kind === 'server'
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.kind === 'not_found'
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isApiError(error)) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function classifyHttpStatus(status: number, message?: string): ApiError {
  if (status === 401) {
    return new ApiError('unauthorized', message || 'Your session has expired. Please sign in again.', { status })
  }
  if (status === 403) {
    return new ApiError('forbidden', message || 'You do not have permission to access this resource.', { status })
  }
  if (status === 404) {
    return new ApiError('not_found', message || 'The requested resource was not found.', { status })
  }
  if (status >= 500) {
    return new ApiError('server', message || 'The server encountered an error. Please try again.', { status })
  }
  return new ApiError('unknown', message || `Request failed with status ${status}.`, { status })
}

export function classifyFetchError(error: unknown, status?: number, message?: string): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('timeout', 'The request timed out. Please try again.', { cause: error })
  }

  if (error instanceof TypeError) {
    return new ApiError(
      'network',
      "We're unable to reach the server right now. Please check your internet connection or try again in a few moments.",
      { cause: error },
    )
  }

  if (typeof status === 'number') {
    return classifyHttpStatus(status, message)
  }

  return new ApiError('unknown', message || getErrorMessage(error), { cause: error })
}

export function isCancelledRequest(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false

  const maybeAxios = error as { code?: string; name?: string; message?: string }
  if (maybeAxios.code === 'ERR_CANCELED' || maybeAxios.name === 'CanceledError') return true

  if (error instanceof DOMException && error.name === 'AbortError') return true

  return false
}

export function classifyAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (isCancelledRequest(error)) {
    return new ApiError('unknown', 'Request was cancelled.', { cause: error })
  }

  if (typeof error === 'object' && error !== null && 'isAxiosError' in error && (error as { isAxiosError?: boolean }).isAxiosError) {
    const axiosError = error as {
      code?: string
      message?: string
      response?: { status?: number; data?: { message?: string; detail?: string } }
    }

    const responseMessage =
      axiosError.response?.data?.message ||
      (typeof axiosError.response?.data?.detail === 'string' ? axiosError.response.data.detail : undefined)

    if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
      return new ApiError('timeout', 'The request timed out. Please try again.', { cause: error })
    }

    if (!axiosError.response) {
      return new ApiError(
        'network',
        "We're unable to reach the server right now. Please check your internet connection or try again in a few moments.",
        { cause: error },
      )
    }

    const status = axiosError.response.status
    if (status === 401 || status === 403 || status === 404 || (status && status >= 500)) {
      return classifyHttpStatus(status, responseMessage)
    }

    if (axiosError.response.data && axiosError.response.data.message === undefined && axiosError.response.data.detail === undefined) {
      return new ApiError('invalid_response', 'Received an unexpected response from the server.', { status, cause: error })
    }

    return classifyHttpStatus(status ?? 0, responseMessage || axiosError.message)
  }

  return classifyFetchError(error)
}

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (isCancelledRequest(error)) return false
  if (!isApiError(error)) return failureCount < 1
  if (['not_found', 'unauthorized', 'forbidden', 'invalid_response'].includes(error.kind)) return false
  // Serverless cold starts (Vercel + DB wake-up) can take several seconds — retry a bit longer
  if (isConnectionError(error)) return failureCount < 4
  return failureCount < 2
}

export function getRetryDelayMs(failureCount: number, error: unknown): number {
  if (isConnectionError(error)) {
    return Math.min(1500 * 2 ** failureCount, 12_000)
  }
  return Math.min(1000 * 2 ** failureCount, 30_000)
}
