import express, { Request, Response } from 'express'
import routes from './Routes/router'

const App = express()

App.use(express.json())

App.use(routes)

export default App
