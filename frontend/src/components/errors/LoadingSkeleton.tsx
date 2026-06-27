import { cn } from '@/lib/utils'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted/60', className)} />
}

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 py-8">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 md:pt-40">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-16 w-full max-w-xl" />
      <SectionSkeleton rows={6} />
    </div>
  )
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-xl border border-zinc-200 bg-zinc-50 animate-pulse" />
      ))}
    </div>
  )
}

export function AdminCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 rounded-2xl border border-zinc-200 bg-white animate-pulse" />
      ))}
    </div>
  )
}
