import type { HistoryEntry } from '../types'
import { ResultCard } from './ResultCard'

interface HistoryPanelProps {
  entries: HistoryEntry[]
  onSelect: (query: string) => void
  onClear: () => void
}

export function HistoryPanel({ entries, onSelect, onClear }: HistoryPanelProps) {
  if (entries.length === 0) return null

  return (
    <section aria-labelledby="history-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="history-heading" className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Verificações recentes
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors focus:outline-none focus:underline"
          aria-label="Limpar histórico"
        >
          Limpar
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.query)}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-sky-500/50 rounded-2xl"
            aria-label={`Ver resultado para ${entry.query}`}
          >
            <ResultCard result={entry} compact />
          </button>
        ))}
      </div>
    </section>
  )
}
