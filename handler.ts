import serverless from 'serverless-http'

import App from './src/app'
import CoinLayerService from './src/Services/CoinLayerService'

export const handler = serverless(App)
export const updateCryptoValues = new CoinLayerService().updateLiveData
