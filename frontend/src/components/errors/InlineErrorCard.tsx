import { AlertCircle, RefreshCw } from 'lucide-react'
import { getErrorMessage, isConnectionError, isNotFoundError } from '@/lib/api-errors'
import { cn } from '@/lib/utils'

type InlineErrorCardProps = {
  error: unknown
  onRetry?: () => void
  isRetrying?: boolean
  title?: string
  variant?: 'site' | 'admin'
  className?: string
}

export function InlineErrorCard({
  error,
  onRetry,
  isRetrying = false,
  title,
  variant = 'site',
  className,
}: InlineErrorCardProps) {
  const isAdmin = variant === 'admin'
  const resolvedTitle =
    title ||
    (isNotFoundError(error)
      ? 'Not found'
      : isConnectionError(error)
        ? 'Unable to connect'
        : 'Something went wrong')

  const message = isConnectionError(error)
    ? "We're unable to reach the server right now. Please check your internet connection or try again in a few moments."
    : getErrorMessage(error)

  return (
    <div
      className={cn(
        'rounded-2xl border p-6',
        isAdmin ? 'border-rose-100 bg-rose-50/60' : 'border-destructive/20 bg-card',
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-full',
            isAdmin ? 'bg-white text-rose-600' : 'bg-destructive/10 text-primary',
          )}
        >
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={cn('font-semibold', isAdmin ? 'text-zinc-900' : 'text-foreground')}>
            {resolvedTitle}
          </h3>
          <p className={cn('mt-1 text-sm leading-relaxed', isAdmin ? 'text-zinc-600' : 'text-muted-foreground')}>
            {message}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className={cn(
                'mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-60',
                isAdmin ? 'text-zinc-800 hover:text-zinc-950' : 'text-primary hover:opacity-80',
              )}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isRetrying && 'animate-spin')} />
              {isRetrying ? 'Retrying…' : 'Try again'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
