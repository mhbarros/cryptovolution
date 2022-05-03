import CryptoRepository from '../Repository/CryptoRepository'
import CoinLayer from './api/CoinLayer'

class CoinLayerService {
  async getLiveData() {
    const { Items } = await new CryptoRepository().getAll()
    if (!Items || Items.length === 0) {
      throw new Error('You need to specify tokens to get live data')
    }

    const currentItems = Items.map((token) => token.token) as string[]

    return new CoinLayer().getLiveData(currentItems)
  }
}

export default CoinLayerService
