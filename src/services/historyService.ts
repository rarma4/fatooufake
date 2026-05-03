import type { HistoryEntry } from '../types'

const STORAGE_KEY = 'fatooufake_history'
const MAX_ENTRIES = 3

/** Migrates old entries that used `url` field instead of `query`/`queryType` */
function migrateEntry(raw: Record<string, unknown>): HistoryEntry {
  if (!raw.query && raw.url) {
    return {
      ...raw,
      query: raw.url as string,
      queryType: 'url',
    } as HistoryEntry
  }
  return raw as unknown as HistoryEntry
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((e: Record<string, unknown>) => migrateEntry(e))
  } catch {
    return []
  }
}

export function saveToHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
  } catch {
    // Storage may be unavailable in some private browsing modes
  }
}

export function addHistoryEntry(entry: HistoryEntry, current: HistoryEntry[]): HistoryEntry[] {
  const filtered = current.filter((e) => e.query !== entry.query)
  return [entry, ...filtered].slice(0, MAX_ENTRIES)
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
