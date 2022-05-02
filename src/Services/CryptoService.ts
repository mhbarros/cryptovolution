import CryptoRepository, { Crypto } from '../Repository/CryptoRepository'

class CryptoService {
  async createNewCrypto(tokens: string[]) {
    const cryptoRepository = new CryptoRepository()
    const tokenList: Crypto[] = []

    tokens.forEach((token) => {
      const Token: Crypto = {
        token,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      tokenList.push(Token)
    })

    await cryptoRepository.insert(tokenList)
  }
}

export default CryptoService
