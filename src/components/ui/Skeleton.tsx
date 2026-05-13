/**
 * Skeleton loader component — matches the dark glassmorphism theme.
 * Usage:
 *   <Skeleton className="h-8 w-32" />
 *   <Skeleton.Card lines={3} />
 */
import { cn } from "../../lib/utils"

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/[0.06]",
        className
      )}
    />
  )
}

/** A pre-built skeleton for stat cards. */
function SkeletonStatCard() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

/** A pre-built skeleton for table rows. */
function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

/** Generic card skeleton with text lines. */
function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  )
}

Skeleton.StatCard = SkeletonStatCard
Skeleton.TableRow = SkeletonTableRow
Skeleton.Card = SkeletonCard

export default Skeleton
