import request from 'supertest'
import app from '../../app'

import CoinLayerService from '../../Services/CoinLayerService'

jest.mock('../../Services/CoinLayerService')

describe('GET', () => {
  beforeEach(() => {
    //@ts-ignore
    CoinLayerService.mockClear()
  })

  it('should return live data', async () => {
    //@ts-ignore
    CoinLayerService.mockImplementation(() => {
      return {
        updateLiveData: () => {
          return true
        },
      }
    })

    const response = await request(app).get('/coinlayer')

    expect(response.status).toBe(200)
  })

  it('should return 400 if a exception is thrown', async () => {
    //@ts-ignore
    CoinLayerService.mockImplementation(() => {
      return {
        updateLiveData: () => {
          throw new Error('Unable to get live data')
        },
      }
    })

    const response = await request(app).get('/coinlayer')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Unable to get live data' })
  })
})
