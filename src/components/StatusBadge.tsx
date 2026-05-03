import type { VerificationStatus } from '../types'

interface StatusConfig {
  label: string
  icon: string
  bgGradient: string
  border: string
  textColor: string
  badgeBg: string
  barColor: string
  glow: string
}

export const STATUS_CONFIG: Record<VerificationStatus, StatusConfig> = {
  verdadeiro: {
    label: 'Verdadeiro',
    icon: '✓',
    bgGradient: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    glow: 'shadow-emerald-500/20',
  },
  falso: {
    label: 'Falso',
    icon: '✕',
    bgGradient: 'from-red-500/10 to-rose-500/5',
    border: 'border-red-500/30',
    textColor: 'text-red-400',
    badgeBg: 'bg-red-500/20 text-red-300 border border-red-500/30',
    barColor: 'bg-gradient-to-r from-red-500 to-rose-400',
    glow: 'shadow-red-500/20',
  },
  duvidoso: {
    label: 'Duvidoso',
    icon: '?',
    bgGradient: 'from-amber-500/10 to-yellow-500/5',
    border: 'border-amber-500/30',
    textColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    barColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    glow: 'shadow-amber-500/20',
  },
}

interface StatusBadgeProps {
  status: VerificationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.badgeBg}`}>
      {cfg.label}
    </span>
  )
}
