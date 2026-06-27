import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { ConnectionErrorPage } from '@/components/errors/ConnectionErrorPage'
import { InlineErrorCard } from '@/components/errors/InlineErrorCard'
import { NotFoundPage } from '@/components/errors/NotFoundPage'
import { SectionSkeleton } from '@/components/errors/LoadingSkeleton'
import { isConnectionError, isNotFoundError } from '@/lib/api-errors'

type QuerySectionProps<T> = {
  query: UseQueryResult<T, unknown>
  children: (data: T) => ReactNode
  skeleton?: ReactNode
  variant?: 'site' | 'admin'
  fullPageOnError?: boolean
  notFoundMode?: 'inline' | 'page'
  homeHref?: string
  className?: string
}

export function QuerySection<T>({
  query,
  children,
  skeleton,
  variant = 'site',
  fullPageOnError = false,
  notFoundMode = 'inline',
  homeHref = '/',
  className,
}: QuerySectionProps<T>) {
  const { data, isLoading, isError, error, refetch, isFetching } = query

  if (isLoading) {
    return <>{skeleton ?? <SectionSkeleton />}</>
  }

  if (isError) {
    if (isNotFoundError(error) && notFoundMode === 'page') {
      return (
        <NotFoundPage
          variant={variant}
          homeHref={homeHref}
          title="Not found"
          message="The item you're looking for doesn't exist or is no longer available."
        />
      )
    }

    if (fullPageOnError && isConnectionError(error)) {
      return (
        <ConnectionErrorPage
          variant={variant}
          homeHref={homeHref}
          onRetry={() => refetch()}
          isRetrying={isFetching}
          className={className}
        />
      )
    }

    return (
      <InlineErrorCard
        error={error}
        variant={variant}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        className={className}
      />
    )
  }

  if (data === undefined) {
    return <>{skeleton ?? <SectionSkeleton />}</>
  }

  return <>{children(data)}</>
}
