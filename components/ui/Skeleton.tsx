import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />
}

export function AlbumCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: 'var(--gold-border)', background: 'var(--surface)' }}
    >
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function NewsCardSkeleton() {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ borderColor: 'var(--gold-border)', background: 'var(--surface)' }}
    >
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-5 w-full mb-1" />
      <Skeleton className="h-5 w-4/5 mb-3" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  )
}

export function PerformanceSkeleton() {
  return (
    <div
      className="rounded-xl p-5 border flex gap-5 items-center"
      style={{ borderColor: 'var(--gold-border)', background: 'var(--surface)' }}
    >
      <Skeleton className="w-14 h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="w-20 h-9 rounded-lg flex-shrink-0" />
    </div>
  )
}
