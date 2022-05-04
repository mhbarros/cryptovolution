import {
  getAvailableTokens,
  getEvolutionPercentage,
  getFormattedTokenValue,
  isTokenAvailable,
  limitTokenHistory,
} from '../tokensHelper'

describe('Token Availability tests', () => {
  it('should return the list of available tokens', () => {
    const availableTokens = getAvailableTokens()

    expect(Array.isArray(availableTokens)).toBe(true)
    expect(availableTokens.length > 0).toBe(true)
    expect(availableTokens).toEqual(expect.arrayContaining([expect.any(String)]))
  })

  it('should return false if a token is not available', () => {
    const isAvailable = isTokenAvailable('AAA')
    expect(isAvailable).toBe(false)
  })

  it('should return false if no token is provided', () => {
    const isAvailable = isTokenAvailable('')
    expect(isAvailable).toBe(false)
  })

  it('should return true if a token is available', () => {
    const isAvailable = isTokenAvailable('BTC')
    expect(isAvailable).toBe(true)
  })
})

describe('Token value formatting', () => {
  it('should return same number if number has less than 2 decimal digits', () => {
    const formattedValue = getFormattedTokenValue(192.1)
    expect(formattedValue).toBe(192.1)
  })

  it('should return 2 decimal digits if the number is bigger than 1', () => {
    const formattedValue = getFormattedTokenValue(192.16801)
    expect(formattedValue).toBe(192.17) // round up in this case
  })

  it('should return same amount of decimal digits if the number is less than 1', () => {
    const formattedValue = getFormattedTokenValue(0.65743)
    expect(formattedValue).toBe(0.65743)
  })
})

describe('Token evolution percentage', () => {
  it('should return correct evolution percentage if initial value is zero and final is positive', () => {
    const evolution = getEvolutionPercentage(0, 100)
    expect(evolution).toBe('+100%')
  })

  it('should return correct evolution percentage if initial value is zero and final is negative', () => {
    const evolution = getEvolutionPercentage(0, -100)
    expect(evolution).toBe('-100%')
  })

  it('should return correct evolution percentage if initial and final value is zero', () => {
    const evolution = getEvolutionPercentage(0, 0)
    expect(evolution).toBe('0%')
  })

  it('should return a positive evolution', () => {
    const evolution = getEvolutionPercentage(50, 100)
    expect(evolution).toBe('+100%')
  })

  it('should return a negative evolution', () => {
    const evolution = getEvolutionPercentage(100, 50)
    expect(evolution).toBe('-50%')
  })

  it('should return zero evolution', () => {
    const evolution = getEvolutionPercentage(100, 100)
    expect(evolution).toBe('0%')
  })
})

describe('Limit token history', () => {
  it('should limit the token history in descending order', () => {
    const historyLimited = limitTokenHistory([1, 2, 3, 4, 5], 2)
    expect(historyLimited).toEqual([4, 5])
  })

  it('should return empty list if the limit is zero', () => {
    const historyLimited = limitTokenHistory([1, 2, 3, 4, 5], 0)
    expect(historyLimited).toEqual([])
  })

  it('should return empty list if the limit is below zero', () => {
    const historyLimited = limitTokenHistory([1, 2, 3, 4, 5], -50)
    expect(historyLimited).toEqual([])
  })

  it('should return full list if limit is NaN', () => {
    const historyLimited = limitTokenHistory([1, 2, 3, 4, 5], NaN)
    expect(historyLimited).toEqual([1, 2, 3, 4, 5])
  })
})
