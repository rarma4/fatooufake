import type { VerificationResult } from '../types'
import { STATUS_CONFIG, StatusBadge } from './StatusBadge'

interface ResultCardProps {
  result: VerificationResult
  compact?: boolean
}

function formatQuery(result: VerificationResult): string {
  const q = result.query ?? (result as unknown as Record<string, string>)['url'] ?? ''
  const type = result.queryType ?? 'url'
  if (type === 'url') {
    try {
      const parsed = new URL(q)
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname.slice(0, 30) + '…' : '')
    } catch {
      return q.slice(0, 40) + (q.length > 40 ? '…' : '')
    }
  }
  return q.length > 60 ? q.slice(0, 60) + '…' : q
}

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(ts))
}

export function ResultCard({ result, compact = false }: ResultCardProps) {
  const cfg = STATUS_CONFIG[result.status]

  return (
    <div
      className={`bg-gradient-to-br ${cfg.bgGradient} border ${cfg.border} rounded-2xl p-5 space-y-4 animate-slide-up shadow-xl ${cfg.glow}`}
      role="region"
      aria-label={`Resultado: ${cfg.label}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${cfg.badgeBg}`}>
          <span className={cfg.textColor}>{cfg.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${cfg.textColor}`}>
            {(result.queryType ?? 'url') === 'url' ? 'Link verificado' : 'Afirmação verificada'}
          </p>
          <p className="text-slate-400 text-xs truncate" title={result.query ?? ''}>
            {formatQuery(result)}
          </p>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {/* Analysis */}
      {!compact && (
        <p className="text-slate-300 text-sm leading-relaxed">{result.analysis}</p>
      )}

      {/* Confidence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Confiança na análise</span>
          <span className={`font-semibold ${cfg.textColor}`}>{result.confidence}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${cfg.barColor}`}
            style={{ width: `${result.confidence}%` }}
            role="progressbar"
            aria-valuenow={result.confidence}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {compact && (
        <p className="text-slate-500 text-xs">{formatDate(result.checkedAt)}</p>
      )}
    </div>
  )
}
