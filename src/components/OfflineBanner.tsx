interface OfflineBannerProps {
  show: boolean
}

export function OfflineBanner({ show }: OfflineBannerProps) {
  if (!show) return null
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm animate-fade-in"
    >
      <span aria-hidden="true">⚡</span>
      <span>Sem conexão com a internet. Verifique sua rede para analisar novos links.</span>
    </div>
  )
}
