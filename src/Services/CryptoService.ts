import CryptoRepository, { Crypto } from '../Repository/CryptoRepository'
import { PromiseResult } from 'aws-sdk/lib/request'
import { BatchWriteItemOutput, ScanOutput } from 'aws-sdk/clients/dynamodb'
import { AWSError } from 'aws-sdk'
import { getEvolutionPercentage, isTokenAvailable, limitTokenHistory } from '../Utils/tokensHelper'

interface CryptoToken {
  token: string
  created_at: number
  updated_at: number
  history: number[]
}

class CryptoService {
  /**
   * Filters the token list based on those who are already registered
   *
   * @param tokens list of tokens
   * @returns a list of tokens that is not registered yet
   */
  async getUniqueCryptos(tokens: string[]): Promise<string[]> {
    const cryptoRepository = new CryptoRepository()

    const { Items } = await cryptoRepository.getAll()
    if (!Items) {
      return tokens
    }

    let parsedItems = Items.map((item) => item.token) as string[]

    return tokens.filter((token) => parsedItems.indexOf(token) === -1)
  }

  async getAllCryptos() {
    const data: ScanOutput = await new CryptoRepository().getAll()

    if (!data.Items) return []

    const cryptoService = new CryptoService()

    return data.Items.map((token) => {
      const cryptoToken = token as unknown as CryptoToken
      return {
        ...token,
        evolution_rate: cryptoService.getEvolutionRate(cryptoToken),
      }
    })
  }

  async getCryptoById(tokenId: string, historyLimit?: number) {
    const crypto = await new CryptoRepository().get(tokenId.toUpperCase())
    if (!crypto.Item) {
      return null
    }

    const token = crypto.Item as CryptoToken

    if (typeof historyLimit !== 'undefined') {
      token.history = limitTokenHistory(token.history, historyLimit)
    }

    return {
      ...token,
      evolution_history: this.getEvolutionHistory(token),
    }
  }

  getEvolutionRate(crypto: CryptoToken): string {
    if (!crypto.history || crypto.history.length < 2) {
      return '0%'
    }

    const finalValue = crypto.history.at(-1) as number
    const lastButOneValue = crypto.history.at(-2) as number

    return getEvolutionPercentage(lastButOneValue, finalValue)
  }

  getEvolutionHistory(crypto: CryptoToken): string[] {
    if (!crypto.history || crypto.history.length < 2) {
      return []
    }

    const evolutionHistory: string[] = []

    for (let i = 0; i < crypto.history.length; i++) {
      const currentNumber = crypto.history[i]
      const nextNumber = crypto.history[i + 1]

      if (!nextNumber) {
        break
      }

      evolutionHistory.push(getEvolutionPercentage(currentNumber, nextNumber))
    }

    return evolutionHistory
  }

  async createNewCrypto(tokens: string[]): Promise<PromiseResult<BatchWriteItemOutput, AWSError>> {
    const cryptoRepository = new CryptoRepository()
    const tokenList: any = []

    tokens.forEach((token: string) => {
      const tokenName = token.toUpperCase()

      if (!isTokenAvailable(tokenName)) {
        throw new Error(`Invalid token: ${tokenName}`)
      }

      const timestamp = Math.round(Date.now() / 1000)

      const Token: Crypto = {
        token: tokenName,
        created_at: timestamp,
        updated_at: timestamp,
        history: [],
      }

      tokenList.push(Token)
    })

    return cryptoRepository.insert(tokenList)
  }

  async deleteCrypto(tokenId: string) {
    return new CryptoRepository().deleteOne(tokenId.toUpperCase())
  }
}

export default CryptoService
