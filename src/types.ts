export type VerificationStatus = 'verdadeiro' | 'falso' | 'duvidoso'
export type QueryType = 'url' | 'text'

export interface VerificationResult {
  query: string
  queryType: QueryType
  status: VerificationStatus
  confidence: number
  analysis: string
  checkedAt: number
}

export interface HistoryEntry extends VerificationResult {
  id: string
}
