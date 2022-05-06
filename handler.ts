/**
 * The main file from the express framework. This is the place that the functions are defined.
 */
import serverless from 'serverless-http'

import App from './src/app'
import CoinLayerService from './src/Services/CoinLayerService'

export const handler = serverless(App)
export const updateCryptoValues = new CoinLayerService().updateLiveData
