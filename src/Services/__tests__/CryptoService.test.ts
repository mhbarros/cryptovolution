import CryptoService from '../CryptoService'
import CryptoRepository from '../../Repository/CryptoRepository'
import { CryptoToken } from '../../Interfaces/CryptoToken'

jest.mock('../../Repository/CryptoRepository')
// jest.mock('../CryptoService')

beforeEach(() => {
  //@ts-ignore
  CryptoRepository.mockClear()

  //@ts-ignore
  // CryptoService.mockClear()
})

describe('Get Unique Tokens', () => {
  it('should return only cryptos not registered', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        getAll: () => {
          return {
            Items: [
              {
                token: 'ETH',
              },
              {
                token: 'ABC',
              },
            ],
          }
        },
      }
    })

    const uniqueCryptos = await new CryptoService().getUniqueCryptos(['BTC', 'ETH', 'SHIB'])

    expect(uniqueCryptos).toEqual(['BTC', 'SHIB'])
  })

  it('should should return all tokens if none registered', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        getAll: () => {
          return {
            Items: null,
          }
        },
      }
    })

    const uniqueCryptos = await new CryptoService().getUniqueCryptos(['BTC', 'ETH', 'SHIB'])

    expect(uniqueCryptos).toEqual(['BTC', 'ETH', 'SHIB'])
  })

  it('should return nothing if all tokens are registered', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        getAll: () => {
          return {
            Items: [
              {
                token: 'BTC',
              },
              {
                token: 'ETH',
              },
            ],
          }
        },
      }
    })

    const uniqueCryptos = await new CryptoService().getUniqueCryptos(['BTC', 'ETH'])

    expect(uniqueCryptos).toEqual([])
  })
})

describe('Get All Cryptos', () => {
  it('should return all cryptos and their evolution rate', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        getAll: () => {
          return {
            Items: [
              {
                token: 'BTC',
                history: [50, 100],
              },
              {
                token: 'ETH',
                history: [50, 150],
              },
            ],
          }
        },
      }
    })

    const tokens = await new CryptoService().getAllCryptos()

    expect(tokens).toEqual([
      {
        token: 'BTC',
        evolution_rate: '+100%',
        history: [50, 100],
      },
      {
        token: 'ETH',
        evolution_rate: '+200%',
        history: [50, 150],
      },
    ])
  })

  it('should return empty array of no tokens registered', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        getAll: () => {
          return {
            Items: null,
          }
        },
      }
    })

    const tokens = await new CryptoService().getAllCryptos()

    expect(tokens).toEqual([])
  })
})

describe('Get Crypto By Id', () => {
  it('should be able to get crypto by id', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        get: (tokenId: string) => {
          return {
            Item: {
              token: tokenId,
              history: [10, 15, 30, 32],
            },
          }
        },
      }
    })

    const token = await new CryptoService().getCryptoById('BTC')
    expect(token).toEqual({
      token: 'BTC',
      history: [10, 15, 30, 32],
      evolution_history: ['+50%', '+100%', '+6.667%'],
    })
  })

  it('should return null if no crypto found', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        get: (tokenId: string) => {
          return {}
        },
      }
    })

    const token = await new CryptoService().getCryptoById('BTC')
    expect(token).toEqual(null)
  })

  it('should limit token history if paramter passed', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        get: (tokenId: string) => {
          return {
            Item: {
              token: tokenId,
              history: [10, 15, 30, 32],
            },
          }
        },
      }
    })

    const token = await new CryptoService().getCryptoById('BTC', 2)
    expect(token).toEqual({
      token: 'BTC',
      history: [30, 32],
      evolution_history: ['+6.667%'],
    })
  })

  it('should not return evolution history if less than 2 history values', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        get: (tokenId: string) => {
          return {
            Item: {
              token: tokenId,
              history: [10],
            },
          }
        },
      }
    })

    const token = await new CryptoService().getCryptoById('BTC')
    expect(token).toEqual({
      token: 'BTC',
      history: [10],
      evolution_history: [],
    })
  })

  it('should not return evolution history if less than 2 history values (limited)', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        get: (tokenId: string) => {
          return {
            Item: {
              token: tokenId,
              history: [10, 20, 30],
            },
          }
        },
      }
    })

    const token = await new CryptoService().getCryptoById('BTC', 1)
    expect(token).toEqual({
      token: 'BTC',
      history: [30],
      evolution_history: [],
    })
  })
})

describe('Get Evolution Rate', () => {
  it('should return the evolution rate', () => {
    const crypto: CryptoToken = {
      token: 'BTC',
      created_at: Date.now(),
      updated_at: Date.now(),
      history: [50, 100],
    }

    const evolutionRate = new CryptoService().getEvolutionRate(crypto)
    expect(evolutionRate).toBe('+100%')
  })

  it('should return 0% if the history has less than 2 values', () => {
    const crypto: CryptoToken = {
      token: 'BTC',
      created_at: Date.now(),
      updated_at: Date.now(),
      history: [50],
    }

    const evolutionRate = new CryptoService().getEvolutionRate(crypto)
    expect(evolutionRate).toBe('0%')
  })
})

describe('Get Evolution History', () => {
  it('should return the token evolution history', () => {
    const crypto: CryptoToken = {
      token: 'BTC',
      created_at: Date.now(),
      updated_at: Date.now(),
      history: [50, 100, 150],
    }

    const evolutionRate = new CryptoService().getEvolutionHistory(crypto)
    expect(evolutionRate).toEqual(['+100%', '+50%'])
  })

  it('should return empty array if the history has less than 2 values', () => {
    const crypto: CryptoToken = {
      token: 'BTC',
      created_at: Date.now(),
      updated_at: Date.now(),
      history: [50],
    }

    const evolutionRate = new CryptoService().getEvolutionHistory(crypto)
    expect(evolutionRate).toEqual([])
  })
})

describe('Create new token', () => {
  it('should not create invalid tokens', async () => {
    const functionCall = async () => {
      await new CryptoService().createNewCrypto(['AAA'])
    }
    await expect(functionCall).rejects.toThrow('Invalid token: AAA')
  })

  it('should register new tokens with correct fields', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        insert: (tokens: string[]) => {
          return tokens
        },
      }
    })

    const newTokens = await new CryptoService().createNewCrypto(['BTC', 'ETH'])
    expect(newTokens).toEqual([
      {
        token: 'BTC',
        created_at: expect.any(Number),
        updated_at: expect.any(Number),
        history: expect.any(Array),
      },
      {
        token: 'ETH',
        created_at: expect.any(Number),
        updated_at: expect.any(Number),
        history: expect.any(Array),
      },
    ])
  })
})

describe('Delete crypto', () => {
  it('should put the crypto id into uppercase and delete it', async () => {
    //@ts-ignore
    CryptoRepository.mockImplementation(() => {
      return {
        deleteOne: (token: string) => token,
      }
    })

    const deletedToken = await new CryptoService().deleteCrypto('btc')
    expect(deletedToken).toEqual('BTC')
  })
})
