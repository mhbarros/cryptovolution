import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import CryptoService from '../Services/CryptoService'
import CryptoRepository from '../Repository/CryptoRepository'
import { ScanOutput } from 'aws-sdk/clients/dynamodb'

export default class TokensController {
  async index(request: Request, response: Response) {
    const data: ScanOutput = await new CryptoRepository().getAll()

    return response.json({ token: data.Items })
  }

  async get(request: Request, response: Response) {
    const { tokenId } = request.params
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    try {
      const registeredToken = await new CryptoRepository().get(tokenId)
      response.json({ token: registeredToken.Item })
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
    } catch (e) {
      return response.status(400).json({ error: 'Error on inserting tokens. Please, try again.' })
    }

    return response.send()
  }

  async delete(request: Request, response: Response) {
    const { tokenId } = request.params

    try {
      await new CryptoRepository().deleteOne(tokenId)
      return response.send()
    } catch (e) {
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
