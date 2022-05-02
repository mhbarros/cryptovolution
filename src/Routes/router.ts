import express from 'express'
import tokensRoutes from './tokens.routes'

const Router = express.Router()
Router.use('/tokens', tokensRoutes)

export default Router
