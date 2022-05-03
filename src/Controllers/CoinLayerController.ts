import { Request, Response } from 'express'
import CoinLayerService from '../Services/CoinLayerService'

class CoinLayerController {
  async get(request: Request, response: Response) {
    try {
      const data = await new CoinLayerService().getLiveData()
      response.json(data)
    } catch (e: any) {
      response.status(400).json({ error: e.message })
    }
  }
}

export default CoinLayerController
