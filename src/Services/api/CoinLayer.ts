import axios, { AxiosInstance } from 'axios'
import { LiveDataOutput } from '../../Interfaces/api/CoinLayer/LiveData'

class CoinLayer {
  private BASE_URL = 'http://api.coinlayer.com'
  private readonly coinlayer: AxiosInstance | undefined

  constructor() {
    this.coinlayer = axios.create({
      baseURL: this.BASE_URL,
      params: {
        access_key: process.env.COINLAYER_API_KEY,
        target: process.env.COINLAYER_CURRENCY,
      },
    })
  }

  /**
   * This method returns the live data from CoinLayer for every given token
   * @param tokens List of tokens to get data
   */
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
}

export default CoinLayer
