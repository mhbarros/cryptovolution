import express from 'express'
import CoinLayerController from '../Controllers/CoinLayerController'

const CoinLayerRouter = express.Router()

const coinLayerController = new CoinLayerController()

CoinLayerRouter.get('/', coinLayerController.get)

export default CoinLayerRouter
