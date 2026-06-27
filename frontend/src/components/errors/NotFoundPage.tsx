import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { cn } from '@/lib/utils'

type NotFoundPageProps = {
  title?: string
  message?: string
  homeHref?: string
  variant?: 'site' | 'admin'
  className?: string
}

export function NotFoundPage({
  title = 'Page not found',
  message = "The page you're looking for doesn't exist or may have been moved.",
  homeHref = '/',
  variant = 'site',
  className,
}: NotFoundPageProps) {
  const isAdmin = variant === 'admin'

  return (
    <div
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center',
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
        <FileQuestion className="h-9 w-9" />
      </div>
      <h1 className={cn('text-3xl font-bold tracking-tight md:text-5xl', !isAdmin && 'font-display')}>
        404
      </h1>
      <h2 className="mt-3 text-lg font-semibold">{title}</h2>
      <p className={cn('mt-2 max-w-md text-sm', isAdmin ? 'text-zinc-500' : 'text-muted-foreground')}>
        {message}
      </p>
      <Link
        to={homeHref}
        className={cn(
          'mt-8 inline-flex items-center rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
          isAdmin
            ? 'bg-zinc-900 text-white hover:bg-zinc-800'
            : 'bg-primary text-primary-foreground hover:opacity-90',
        )}
      >
        Go Home
      </Link>
    </div>
  )
}
