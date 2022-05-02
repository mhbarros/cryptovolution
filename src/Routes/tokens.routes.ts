import express from 'express'

import TokensController from '../Controllers/TokensController'
import TokensValidator from '../Validators/TokensValidator'

const TokensRouter = express.Router()

const tokensController = new TokensController()

TokensRouter.get('/', tokensController.index)
TokensRouter.get('/:tokenId', TokensValidator.get(), tokensController.get)
TokensRouter.post('/', TokensValidator.create(), tokensController.create)

export default TokensRouter
