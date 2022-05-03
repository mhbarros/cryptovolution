import axios, { AxiosInstance } from 'axios'

interface LiveDataOutput {
  success: boolean
  terms: string
  privacy: string
  timestamp: number
  target: string
  rates: {
    [token: string]: number
  }
}

class CoinLayer {
  private BASE_URL = 'http://api.coinlayer.com'
  private coinlayer: AxiosInstance | undefined

  private CURRENCY = process.env.COINLAYER_CURRENCY

  constructor() {
    this.coinlayer = axios.create({
      baseURL: this.BASE_URL,
      params: {
        access_key: process.env.COINLAYER_API_KEY,
      },
    })
  }

  async getLiveData(tokens: string[]) {
    if (!this.coinlayer) return

    try {
      const result = await this.coinlayer.get<LiveDataOutput>('/live', {
        params: {
          symbols: tokens.join(','),
        },
      })
      return result.data
    } catch (e) {
      throw new Error('Unable to get live data.')
    }
  }

  /*async listAvailableTokens(): string[] {
    if (!this.coinlayer) return

    await this.coinlayer.get('')
  }*/
}

export default CoinLayer
