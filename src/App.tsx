import { useState, useEffect, useId } from 'react'
import type { VerificationResult, HistoryEntry } from './types'
import { verifyQuery, detectQueryType } from './services/verificationService'
import { loadHistory, saveToHistory, addHistoryEntry, clearHistory } from './services/historyService'
import { ResultCard } from './components/ResultCard'
import { ResultSkeleton } from './components/Skeleton'
import { HistoryPanel } from './components/HistoryPanel'
import { OfflineBanner } from './components/OfflineBanner'

const MIN_TEXT_LENGTH = 10

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export default function App() {
  const [query, setQuery] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const inputId = useId()
  const errorId = useId()

  useEffect(() => {
    setHistory(loadHistory())
    
    // Check if API key is configured
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      setInputError('Chave do Groq nao configurada. Adicione VITE_GROQ_API_KEY ao arquivo .env')
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  function validateInput(value: string): string | null {
    const trimmed = value.trim()
    if (!trimmed) return 'Digite um link ou uma pergunta para verificar.'
    if (trimmed.length < MIN_TEXT_LENGTH) return `Texto muito curto. Digite pelo menos ${MIN_TEXT_LENGTH} caracteres.`
    return null
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setQuery(e.target.value)
    if (inputError) setInputError(null)
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()

    const error = validateInput(query)
    if (error) {
      setInputError(error)
      return
    }

    if (!isOnline) {
      setInputError('Sem conexão. Conecte-se à internet para verificar.')
      return
    }

    setInputError(null)
    setResult(null)
    setIsLoading(true)

    try {
      const res = await verifyQuery(query.trim())
      setResult(res)

      const entry: HistoryEntry = { ...res, id: generateId() }
      const updated = addHistoryEntry(entry, history)
      setHistory(updated)
      saveToHistory(updated)
      setQuery('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao verificar. Tente novamente.'
      setInputError(message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSelectHistory(selectedQuery: string) {
    setQuery(selectedQuery)
    setResult(null)
    setInputError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="min-h-dvh flex items-start justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <header className="text-center pt-4 space-y-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-600/20 border border-white/10 mb-3 shadow-lg shadow-sky-500/10">
            <span className="text-2xl" role="img" aria-label="Lupa">🔍</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Fato ou Fake
          </h1>
          <p className="text-slate-400 text-sm">
            Cole um link ou faça uma pergunta para verificar
          </p>
        </header>

        {/* Offline banner */}
        <OfflineBanner show={!isOnline} />

        {/* Search form */}
        <section aria-label="Verificar link ou pergunta">
          <form onSubmit={handleVerify} noValidate className="glass-card p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
                  Link ou pergunta
                </label>
                {query.trim().length > 0 && (
                  <span className="text-xs text-slate-500">
                    {detectQueryType(query) === 'url' ? '🔗 Link detectado' : '💬 Texto detectado'}
                  </span>
                )}
              </div>
              <textarea
                id={inputId}
                rows={3}
                value={query}
                onChange={handleInputChange}
                placeholder={'Cole um link: https://exemplo.com/noticia\n\nOu faça uma pergunta: "A Terra é plana?"'}
                className={`glass-input w-full px-4 py-3 text-sm resize-none ${
                  inputError ? 'border-red-500/50 focus:ring-red-500/40 focus:border-red-500/50' : ''
                }`}
                aria-describedby={inputError ? errorId : undefined}
                aria-invalid={inputError !== null}
                disabled={isLoading}
                spellCheck={false}
              />
              {inputError && (
                <p id={errorId} role="alert" className="text-red-400 text-xs pl-1 animate-fade-in">
                  {inputError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="btn-primary w-full py-3 text-sm"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analisando...
                </span>
              ) : (
                'Verificar'
              )}
            </button>
          </form>
        </section>

        {/* Loading skeleton */}
        {isLoading && <ResultSkeleton />}

        {/* Result */}
        {!isLoading && result && (
          <section aria-label="Resultado da verificação">
            <ResultCard result={result} />
          </section>
        )}

        {/* History */}
        <HistoryPanel
          entries={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
        />

        {/* Footer */}
        <footer className="text-center pb-6">
          <p className="text-slate-700 text-xs">Fato ou Fake • Caos nas Galáxias • 9º ano A •  Lídia Cruz</p>
        </footer>
      </div>
    </div>
  )
}
