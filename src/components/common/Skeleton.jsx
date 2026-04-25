import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonMaker = ({ type }) => {
  if (type === 'search') {
    return <Skeleton className="h-4 w-full bg-skeletons-bg" />
  }

  if (type === 'stockDetails') {
    return (
      <>
        {/* Company info card */}
        <div className="glass-card p-4 rounded-2xl my-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40 rounded-lg bg-skeletons-bg" />
            <Skeleton className="h-4 w-28 rounded-lg bg-skeletons-bg" />
          </div>
          <Skeleton className="h-3 w-full rounded-lg bg-skeletons-bg" />
          <Skeleton className="h-3 w-[90%] rounded-lg bg-skeletons-bg" />
          <Skeleton className="h-3 w-16 rounded-lg bg-skeletons-bg" />
        </div>

        {/* Peer companies card */}
        <div className="glass-card p-4 rounded-2xl my-4 space-y-3">
          <Skeleton className="h-5 w-32 rounded-lg bg-skeletons-bg" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-16 w-16 rounded-full bg-skeletons-bg" />
                <Skeleton className="h-3 w-14 rounded-lg bg-skeletons-bg" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart placeholder */}
        <div className="glass-card p-4 rounded-2xl my-4 space-y-3">
          <Skeleton className="h-5 w-44 rounded-lg bg-skeletons-bg" />
          <Skeleton className="h-56 w-full rounded-xl bg-skeletons-bg" />
        </div>

        {/* News placeholder */}
        <div className="glass-card p-4 rounded-2xl my-4 space-y-3">
          <Skeleton className="h-5 w-28 rounded-lg bg-skeletons-bg" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-xl bg-skeletons-bg" />
                <Skeleton className="h-3 w-full rounded-lg bg-skeletons-bg" />
                <Skeleton className="h-3 w-[80%] rounded-lg bg-skeletons-bg" />
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  return <div>Skeleton</div>
}

export default SkeletonMaker
