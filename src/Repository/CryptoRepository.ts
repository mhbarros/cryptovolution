import Database from '../Database/database'

interface CryptoHistory {
  timestamp: Date
  value: number
}

export interface Crypto {
  token: string
  created_at: number
  updated_at: number
  history: CryptoHistory[]
}

class CryptoRepository {
  private TABLE_NAME = 'crypto2'

  async getAll() {
    return Database.scan({
      TableName: this.TABLE_NAME,
    }).promise()
  }

  async get(tokenId: string) {
    return Database.get({
      TableName: this.TABLE_NAME,
      Key: {
        token: tokenId,
      },
    }).promise()
  }

  async insert(tokens: Crypto[] | Crypto) {
    const request: any[] = []

    if (Array.isArray(tokens)) {
      tokens.forEach((token) => {
        request.push({
          PutRequest: {
            Item: token,
          },
        })
      })
    }

    return Database.batchWrite({
      RequestItems: {
        [this.TABLE_NAME]: request,
      },
    }).promise()
  }

  async deleteOne(tokenId: string) {
    return Database.delete({
      TableName: this.TABLE_NAME,
      Key: {
        token: tokenId,
      },
    }).promise()
  }
}

export default CryptoRepository
