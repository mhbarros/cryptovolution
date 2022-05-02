import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import CryptoService from '../Services/CryptoService'
import CryptoRepository from '../Repository/CryptoRepository'
import { ScanOutput } from 'aws-sdk/clients/dynamodb'

export default class TokensController {
  async index(request: Request, response: Response) {
    const data: ScanOutput = await new CryptoRepository().getAll()

    return response.json({ tokens: data.Items })
  }

  async get(request: Request, response: Response) {
    const { tokenId } = request.params
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    response.json({ ok: true, token: tokenId })
  }

  async create(request: Request, response: Response) {
    const { tokens } = request.body
    const validation = validationResult(request)

    if (!validation.isEmpty()) {
      return response.status(400).json({ errors: validation.array() })
    }

    const cryptoService = new CryptoService()
    await cryptoService.createNewCrypto(tokens)

    return response.json({ ok: true, tokens })
  }
}
