import request from 'supertest'

import app from '../../app'

import CryptoService from '../../Services/CryptoService'
import CoinLayerService from '../../Services/CoinLayerService'

jest.mock('../../Services/CryptoService')
jest.mock('../../Services/CoinLayerService')

beforeEach(() => {
  //@ts-ignore
  CryptoService.mockClear()
  //@ts-ignore
  CoinLayerService.mockClear()
})

describe('INDEX', () => {
  it('should return all available tokens', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        getAllCryptos: () => {
          return [
            {
              token: 'BTC',
            },
          ]
        },
      }
    })

    const response = await request(app).get('/tokens')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ tokens: [{ token: 'BTC' }] })
  })
})

describe('GET', () => {
  it('should not be able to get a token with invalid token id (invalid max length)', async () => {
    const response = await request(app).get('/tokens/BTCBTCB')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'params',
          msg: expect.any(String),
          param: 'tokenId',
          value: 'BTCBTCB',
        },
      ],
    })
  })

  it('should not be able to get a token with a negative limit', async () => {
    const response = await request(app).get('/tokens/BTC').query({ limit: -1 })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'query',
          msg: expect.any(String),
          param: 'limit',
          value: '-1',
        },
      ],
    })
  })

  it('should not be able to get a token with a string limit', async () => {
    const response = await request(app).get('/tokens/BTC').query({ limit: 'two' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'query',
          msg: expect.any(String),
          param: 'limit',
          value: 'two',
        },
      ],
    })
  })

  it('should not be able to get a token if an exception is thrown', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        getCryptoById: (tokenId: string, limit: number) => {
          throw new Error('Invalid crypto id')
        },
      }
    })

    const response = await request(app).get('/tokens/BTC').query({ limit: 3 })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid crypto id' })
  })

  it('should be able to get crypto by id', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        getCryptoById: (tokenId: string, limit: number) => {
          return { tokenId, limit }
        },
      }
    })

    const response = await request(app).get('/tokens/BTC').query({ limit: 3 })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ tokenId: 'BTC', limit: 3 })
  })
})

describe('CREATE', () => {
  it('should not be possible to create a token without passing it into body', async () => {
    const response = await request(app).post('/tokens')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'body',
          msg: expect.any(String),
          param: 'tokens',
        },
      ],
    })
  })

  it('should not be able to create a token with a invalid list of tokens', async () => {
    const response = await request(app).post('/tokens').send({ tokens: 'BTC' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'body',
          msg: expect.any(String),
          param: 'tokens',
          value: 'BTC',
        },
      ],
    })
  })

  it('should not be able to create a token with a empty list of tokens', async () => {
    const response = await request(app).post('/tokens').send({ tokens: [] })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'body',
          msg: expect.any(String),
          param: 'tokens',
          value: [],
        },
      ],
    })
  })

  it('should not be able to create a new token if getUniqueCrypto throw error', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        getUniqueCryptos: (tokens: string[]) => {
          throw new Error('Could not get unique cryptos. Please, try again.')
        },
        createNewCrypto: (tokens: string[]) => {
          return { tokens }
        },
      }
    })

    const response = await request(app)
      .post('/tokens')
      .send({ tokens: ['BTC'] })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Could not get unique cryptos. Please, try again.' })
  })

  it('should not be able to create a new token if createNewCrypto throw error', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        getUniqueCryptos: (tokens: string[]) => {
          return { tokens }
        },
        createNewCrypto: (tokens: string[]) => {
          throw new Error('Could not create new crypto. Please, try again.')
        },
      }
    })

    const response = await request(app)
      .post('/tokens')
      .send({ tokens: ['BTC'] })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Could not create new crypto. Please, try again.' })
  })

  it('should not be able to create a new token if updateLiveData throw error', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        getUniqueCryptos: (tokens: string[]) => {
          return { tokens }
        },
        createNewCrypto: (tokens: string[]) => {
          return { tokens }
        },
      }
    })

    //@ts-ignore
    CoinLayerService.mockImplementation(() => {
      return {
        updateLiveData: () => {
          throw new Error('Could not update live data.')
        },
      }
    })

    const response = await request(app)
      .post('/tokens')
      .send({ tokens: ['BTC'] })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Could not update live data.' })
  })

  it('should be able to create a new token', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        getUniqueCryptos: (tokens: string[]) => {
          return { tokens }
        },
        createNewCrypto: (tokens: string[]) => {
          return { tokens }
        },
      }
    })

    //@ts-ignore
    CoinLayerService.mockImplementation(() => {
      return {
        updateLiveData: () => {},
      }
    })

    const response = await request(app)
      .post('/tokens')
      .send({ tokens: ['BTC'] })

    expect(response.status).toBe(201)
  })
})

describe('DELETE', () => {
  it('should not be able to delete token with invalid tokenId (invalid length)', async () => {
    const response = await request(app).delete('/tokens/BTCBTCB')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'params',
          msg: expect.any(String),
          param: 'tokenId',
          value: 'BTCBTCB',
        },
      ],
    })
  })

  it('should be not able to delete a token if a exception is thrown', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        deleteCrypto: (tokenId: string) => {
          throw new Error('Unable to delete token')
        },
      }
    })

    const response = await request(app).delete('/tokens/BTC')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Unable to delete token' })
  })

  it('should not be able to delete a token if it has a invalid token length', async () => {
    const response = await request(app).delete('/tokens/BTCBTCB')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      errors: [
        {
          location: 'params',
          msg: expect.any(String),
          param: 'tokenId',
          value: 'BTCBTCB',
        },
      ],
    })
  })

  it('should not be able to delete a token if it is not available', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        deleteCrypto: (tokenId: string) => {
          throw new Error('Invalid token')
        },
      }
    })

    const response = await request(app).delete('/tokens/AAA')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid token' })
  })

  it('should be able to delete a token', async () => {
    //@ts-ignore
    CryptoService.mockImplementation(() => {
      return {
        deleteCrypto: (tokenId: string) => {
          return true
        },
      }
    })

    const response = await request(app).delete('/tokens/BTC')

    expect(response.status).toBe(200)
  })
})
