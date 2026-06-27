import { QueryClient } from '@tanstack/react-query'
import { shouldRetryQuery } from '@/lib/api-errors'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
        staleTime: 30_000,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
