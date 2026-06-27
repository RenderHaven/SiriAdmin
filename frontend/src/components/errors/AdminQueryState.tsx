import type { ReactNode } from 'react'
import { ConnectionErrorPage } from '@/components/errors/ConnectionErrorPage'
import { InlineErrorCard } from '@/components/errors/InlineErrorCard'
import { isConnectionError } from '@/lib/api-errors'

type AdminQueryStateProps = {
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  isFetching?: boolean
  skeleton: ReactNode
  children: ReactNode
}

export function AdminQueryState({
  isLoading,
  isError,
  error,
  onRetry,
  isFetching = false,
  skeleton,
  children,
}: AdminQueryStateProps) {
  if (isLoading) return <>{skeleton}</>

  if (isError) {
    if (isConnectionError(error)) {
      return (
        <ConnectionErrorPage
          variant="admin"
          homeHref="/admin/dashboard"
          onRetry={onRetry}
          isRetrying={isFetching}
        />
      )
    }

    return (
      <InlineErrorCard
        error={error}
        variant="admin"
        onRetry={onRetry}
        isRetrying={isFetching}
      />
    )
  }

  return <>{children}</>
}
