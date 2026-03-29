'use client'

import { Skeleton } from './skeleton'

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-10 w-10 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-10" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-10 rounded" />
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="border-b border-border p-4 flex items-center gap-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}
