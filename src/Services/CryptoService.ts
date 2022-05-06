import CryptoRepository from '../Repository/CryptoRepository'
import { ScanOutput } from 'aws-sdk/clients/dynamodb'

import { getEvolutionPercentage, isTokenAvailable, limitTokenHistory } from '../Utils/tokensHelper'
import { CryptoToken } from '../Interfaces/CryptoToken'

interface CryptoEvolution extends CryptoToken {
  evolution_rate: string
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

  /**
   * Get all registered cryptos and format them, also adding the evolution rate
   *
   * @return a list of crypto tokens and their respectives evolution rates
   */
  async getAllCryptos(): Promise<CryptoEvolution[]> {
    const data: ScanOutput = await new CryptoRepository().getAll()

    if (!data.Items) return []

    const _this = this

    return data.Items.map((token) => {
      const cryptoToken = token as unknown as CryptoToken
      const tokenEvolutionRate = _this.getEvolutionRate(cryptoToken)

      const cryptoEvolution: CryptoEvolution = {
        token: cryptoToken.token,
        created_at: cryptoToken.created_at,
        updated_at: cryptoToken.updated_at,
        history: cryptoToken.history,
        evolution_rate: tokenEvolutionRate,
      }

      return cryptoEvolution
    })
  }

  /**
   * Returns a crypto by its id and all its evolution history
   *
   * @param tokenId
   * @param historyLimit
   */
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

  /**
   * Returns the last evolution rate of token
   *
   * @param crypto Token to get evolution rate
   */
  getEvolutionRate(crypto: CryptoToken): string {
    if (!crypto.history || crypto.history.length < 2) {
      return '0%'
    }

    const finalValue = crypto.history[crypto.history.length - 1] as number
    const lastButOneValue = crypto.history[crypto.history.length - 2] as number

    return getEvolutionPercentage(lastButOneValue, finalValue)
  }

  /**
   * Returns all evolution rates from token
   *
   * @param crypto Token to get evolution history
   */
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

  /**
   * Create a list of tokens, adding his necessary fields
   *
   * @param tokens List of tokens to be created
   */
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

  /**
   * Delete a crypto
   *
   * @param tokenId Token ID to be deleted
   */
  async deleteCrypto(tokenId: string) {
    const tokenName = tokenId.toUpperCase()
    return new CryptoRepository().deleteOne(tokenName)
  }
}

export default CryptoService
