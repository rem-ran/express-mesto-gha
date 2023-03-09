const { ERROR_CODE_401 } = require('../utils/constants');

class WrongMailOrPassError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_401;
  }
}

module.exports = WrongMailOrPassError;