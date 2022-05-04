import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import CryptoService from '../Services/CryptoService'
import CryptoRepository from '../Repository/CryptoRepository'
import CoinLayerService from '../Services/CoinLayerService'
import * as Crypto from 'crypto'

export default class TokensController {
  async index(request: Request, response: Response) {
    const cryptos = await new CryptoService().getAllCryptos()

    return response.json({ tokens: cryptos })
  }

  async get(request: Request, response: Response) {
    const { tokenId } = request.params
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    try {
      const registeredToken = await new CryptoService().getCryptoById(tokenId)
      response.json(registeredToken)
    } catch (e) {
      response.status(500).json({ error: 'Internal Server Error' }).send()
    }
  }

  async create(request: Request, response: Response) {
    const { tokens } = request.body
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    const cryptoService = new CryptoService()
    const uniqueTokens = await cryptoService.getUniqueCryptos(tokens)

    try {
      await cryptoService.createNewCrypto(uniqueTokens)
      await new CoinLayerService().updateLiveData()

      return response.send()
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
    } catch (e) {
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}