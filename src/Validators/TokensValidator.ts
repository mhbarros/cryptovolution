import { body, param } from 'express-validator'

class TokensValidator {
  private static MAX_TOKEN_SIZE = 6

  static get() {
    return [
      param('tokenId', 'Invalid token ID')
        .isString()
        .isLength({ max: this.MAX_TOKEN_SIZE }),
    ]
  }

  static create() {
    return [
      body('tokens', 'At least 1 token must be passed').isArray({ min: 1 }),
    ]
  }

  static delete() {
    return [
      param('tokenId', 'Invalid token ID')
        .isString()
        .isLength({ max: this.MAX_TOKEN_SIZE }),
    ]
  }
}

export default TokensValidator
