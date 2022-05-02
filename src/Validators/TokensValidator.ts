import { body, param } from 'express-validator'

class TokensValidator {
  static get() {
    return [
      param('tokenId', 'Invalid token ID').isString().isLength({ max: 3 }),
    ]
  }

  static create() {
    return [
      body('tokens', 'At least 1 token must be passed').isArray({ min: 1 }),
    ]
  }
}

export default TokensValidator
