export interface CryptoToken {
  token: string
  created_at: number
  updated_at: number
  history: number[]
  evolution_history?: string[]
}
