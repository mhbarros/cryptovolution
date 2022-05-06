/**
 * Define routes only for /tokens
 */

import express from 'express'

import TokensController from '../Controllers/TokensController'
import TokensValidator from '../Validators/TokensValidator'

const TokensRouter = express.Router()

const tokensController = new TokensController()

TokensRouter.get('/', tokensController.index)
TokensRouter.get('/list-tokens', tokensController.listAvailableTokens)
TokensRouter.get('/:tokenId', TokensValidator.get(), tokensController.get)
TokensRouter.post('/', TokensValidator.create(), tokensController.create)
TokensRouter.delete('/:tokenId', TokensValidator.delete(), tokensController.delete)

export default TokensRouter
