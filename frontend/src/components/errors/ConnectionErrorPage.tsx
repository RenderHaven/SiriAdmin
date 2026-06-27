import { Link } from 'react-router-dom'
import { RefreshCw, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type ConnectionErrorPageProps = {
  onRetry?: () => void
  isRetrying?: boolean
  showHome?: boolean
  homeHref?: string
  variant?: 'site' | 'admin'
  className?: string
}

export function ConnectionErrorPage({
  onRetry,
  isRetrying = false,
  showHome = true,
  homeHref = '/',
  variant = 'site',
  className,
}: ConnectionErrorPageProps) {
  const isAdmin = variant === 'admin'

  return (
    <div
      className={cn(
        'flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center',
        isAdmin ? 'bg-zinc-50 text-zinc-900' : 'bg-background text-foreground',
        className,
      )}
    >
      <div
        className={cn(
          'mb-6 grid h-20 w-20 place-items-center rounded-full',
          isAdmin ? 'bg-zinc-100 text-zinc-500' : 'border border-white/10 bg-card text-primary',
        )}
      >
        <WifiOff className="h-9 w-9" />
      </div>

      <h1 className={cn('text-2xl font-bold tracking-tight md:text-3xl', !isAdmin && 'font-display')}>
        Unable to connect
      </h1>
      <p
        className={cn(
          'mt-3 max-w-md text-sm leading-relaxed',
          isAdmin ? 'text-zinc-500' : 'text-muted-foreground',
        )}
      >
        We&apos;re unable to reach the server right now. Please check your internet connection or try
        again in a few moments.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors disabled:opacity-60',
              isAdmin
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-primary text-primary-foreground hover:opacity-90',
            )}
          >
            <RefreshCw className={cn('h-4 w-4', isRetrying && 'animate-spin')} />
            {isRetrying ? 'Retrying…' : 'Try again'}
          </button>
        )}
        {showHome && (
          <Link
            to={homeHref}
            className={cn(
              'inline-flex items-center rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
              isAdmin
                ? 'border-zinc-300 text-zinc-700 hover:bg-white'
                : 'border-border text-foreground hover:border-primary hover:text-primary',
            )}
          >
            Go Home
          </Link>
        )}
      </div>
    </div>
  )
}
