import { Request, Response } from 'express'
import CryptoService from '../Services/CryptoService'
import CryptoRepository from '../Repository/CryptoRepository'
import { ScanOutput } from 'aws-sdk/clients/dynamodb'

export default class TokensController {
  async index(request: Request, response: Response) {
    const data: ScanOutput = await new CryptoRepository().getAll()

    return response.json(data.Items)
  }

  async create(request: Request, response: Response) {
    const { tokens } = request.body

    const cryptoService = new CryptoService()
    await cryptoService.createNewCrypto(tokens)

    return response.json({ ok: true, tokens })
  }
}
