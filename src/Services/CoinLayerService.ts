import CryptoRepository from '../Repository/CryptoRepository'
import CoinLayer from './api/CoinLayer'

class CoinLayerService {
  async updateLiveData() {
    const { Items } = await new CryptoRepository().getAll()
    if (!Items || Items.length === 0) {
      throw new Error('You need to specify tokens to get live data')
    }

    const currentItems = Items.map((token) => token.token) as string[]

    try {
      const liveData = await new CoinLayer().getLiveData(currentItems)
      if (!liveData) {
        return false
      }

      const liveDataRates = Object.entries(liveData.rates)

      for (const [token, currentPrice] of liveDataRates) {
        await new CryptoRepository().appendTokenHistory(token, [currentPrice])
      }

      return liveData
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}

export default CoinLayerService
