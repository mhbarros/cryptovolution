import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

import CryptoService from '../Services/CryptoService'
import CoinLayerService from '../Services/CoinLayerService'

export default class TokensController {
  async index(request: Request, response: Response) {
    const cryptos = await new CryptoService().getAllCryptos()

    return response.json({ tokens: cryptos })
  }

  async get(request: Request, response: Response) {
    const { tokenId } = request.params
    let { limit } = request.query as { limit: any }

    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    if (limit) {
      limit = Number(limit)
    }

    try {
      const registeredToken = await new CryptoService().getCryptoById(tokenId, limit)
      if (!registeredToken) {
        return response.status(400).json({ error: 'Token not found' })
      }

      return response.json(registeredToken)
    } catch (e: any) {
      response.status(400).json({ error: e.message }).send()
    }
  }

  async create(request: Request, response: Response) {
    const { tokens } = request.body
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    const cryptoService = new CryptoService()

    try {
      const uniqueTokens = await cryptoService.getUniqueCryptos(tokens)
      await cryptoService.createNewCrypto(uniqueTokens)

      await new CoinLayerService().updateLiveData()

      return response.status(201).send()
    } catch (e: any) {
      return response.status(400).json({ error: e.message })
    }
  }

  async delete(request: Request, response: Response) {
    const { tokenId } = request.params
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    try {
      await new CryptoService().deleteCrypto(tokenId)
      return response.send()
    } catch (e: any) {
      return response.status(500).json({ error: e.message })
    }
  }
}
