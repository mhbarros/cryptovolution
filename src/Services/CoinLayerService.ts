import CryptoRepository from '../Repository/CryptoRepository'
import CoinLayer from './api/CoinLayer'
import { getFormattedTokenValue } from '../Utils/tokensHelper'
import { LiveDataOutput } from '../Interfaces/api/CoinLayer/LiveData'

class CoinLayerService {
  /**
   * Updates the history of values of every crypto registered in database
   * @returns Promise<LiveDataOutput>
   */
  async updateLiveData(): Promise<LiveDataOutput> {
    const { Items } = await new CryptoRepository().getAll()
    if (!Items || Items.length === 0) {
      throw new Error('You need to specify tokens to get live data')
    }

    const currentItems = Items.map((token) => token.token) as string[]

    try {
      const liveData: LiveDataOutput = await new CoinLayer().getLiveData(currentItems)

      if (!liveData || !liveData.rates) {
        const liveDataError = liveData as any
        throw new Error(`Unable to get live data with following message: ${liveDataError?.error?.info}.`)
      }

      const liveDataRates: [string, number][] = Object.entries(liveData.rates)

      for (const [token, currentPrice] of liveDataRates) {
        const formattedPrice = getFormattedTokenValue(currentPrice)

        await new CryptoRepository().appendTokenHistory(token, [formattedPrice])
      }

      return liveData
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}

export default CoinLayerService
