import express from 'express'

import TokensController from '../Controllers/TokensController'

const TokensRouter = express.Router()

const tokensController = new TokensController()

TokensRouter.get('/', tokensController.index)
TokensRouter.post('/', tokensController.create)

export default TokensRouter
