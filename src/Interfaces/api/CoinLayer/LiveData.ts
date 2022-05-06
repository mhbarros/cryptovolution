export interface LiveDataOutput {
  success: boolean
  terms: string
  privacy: string
  timestamp: number
  target: string
  rates: {
    [token: string]: number
  }
}
