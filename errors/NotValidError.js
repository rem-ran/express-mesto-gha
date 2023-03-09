const { ERROR_CODE_400 } = require('../utils/constants');

class NotValidError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_400;
  }
}

module.exports = NotValidError;