import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx('skeleton', className)} aria-hidden="true" />
}

export function ResultSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in" role="status" aria-label="Analisando link...">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <p className="text-slate-500 text-xs text-center animate-pulse-slow">Consultando Groq IA para analise...</p>
    </div>
  )
}
