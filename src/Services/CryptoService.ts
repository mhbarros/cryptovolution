import CryptoRepository, { Crypto } from '../Repository/CryptoRepository'
import { PromiseResult } from 'aws-sdk/lib/request'
import { BatchWriteItemOutput, ScanOutput } from 'aws-sdk/clients/dynamodb'
import { AWSError } from 'aws-sdk'
import { getEvolutionPercentage, isTokenAvailable, limitTokenHistory } from '../Utils/tokensHelper'
import { CryptoToken } from '../Interfaces/CryptoToken'

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

    const _this = this

    return data.Items.map((token) => {
      const cryptoToken = token as unknown as CryptoToken
      const tokenEvolutionRate = _this.getEvolutionRate(cryptoToken)

      return {
        ...token,
        evolution_rate: tokenEvolutionRate,
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

    const tokenEvolutionHistory = this.getEvolutionHistory(token)

    return {
      ...token,
      evolution_history: tokenEvolutionHistory,
    }
  }

  getEvolutionRate(crypto: CryptoToken): string {
    if (!crypto.history || crypto.history.length < 2) {
      return '0%'
    }

    const finalValue = crypto.history[crypto.history.length - 1] as number
    const lastButOneValue = crypto.history[crypto.history.length - 2] as number

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

  async createNewCrypto(tokens: string[]) {
    const cryptoRepository = new CryptoRepository()
    const tokenList: any = []

    tokens.forEach((token: string) => {
      const tokenName = token.toUpperCase()

      if (!isTokenAvailable(tokenName)) {
        throw new Error(`Invalid token: ${tokenName}`)
      }

      const timestamp = Math.round(Date.now() / 1000)

      const Token: CryptoToken = {
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
    const tokenName = tokenId.toUpperCase()
    return new CryptoRepository().deleteOne(tokenName)
  }
}

export default CryptoService
