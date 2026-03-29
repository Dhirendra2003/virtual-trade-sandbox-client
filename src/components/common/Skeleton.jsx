import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonMaker = ({ type }) => {
  if (type === 'search') {
    return <Skeleton className="h-4 w-full bg-slate-200" />
  }
  return <div>Skeleton</div>
}

export default SkeletonMaker
