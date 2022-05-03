import CryptoRepository, { Crypto } from '../Repository/CryptoRepository'
import { PromiseResult } from 'aws-sdk/lib/request'
import { BatchWriteItemOutput } from 'aws-sdk/clients/dynamodb'
import { AWSError } from 'aws-sdk'
import { isTokenAvailable } from '../Utils/availableTokens'

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

  async createNewCrypto(tokens: string[]): Promise<PromiseResult<BatchWriteItemOutput, AWSError>> {
    const cryptoRepository = new CryptoRepository()
    const tokenList: Crypto[] = []

    tokens.forEach((token: string) => {
      if (!isTokenAvailable(token)) {
        return
      }

      const timestamp = Math.round(Date.now() / 1000)

      const Token: Crypto = {
        token: token.toUpperCase(),
        created_at: timestamp,
        updated_at: timestamp,
        history: [],
      }

      tokenList.push(Token)
    })

    return await cryptoRepository.insert(tokenList)
  }
}

export default CryptoService
