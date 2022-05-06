import express, { Request, Response } from 'express'
import tokensRoutes from './tokens.routes'

const Router = express.Router()

Router.all('/', (request: Request, response: Response) => {
  response.send('<h1>Hello from <u>cryptovolution</u>🚀</h1>')
})
Router.use('/tokens', tokensRoutes)

export default Router
