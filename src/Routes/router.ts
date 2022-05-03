import express from 'express'
import tokensRoutes from './tokens.routes'
import coinlayerRoutes from './coinlayer.routes'

const Router = express.Router()

Router.use('/tokens', tokensRoutes)
Router.use('/coinlayer', coinlayerRoutes)

export default Router
