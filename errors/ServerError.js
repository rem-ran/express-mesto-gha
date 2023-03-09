const { ERROR_CODE_500 } = require('../utils/constants');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_500;
  }
}

module.exports = ServerError;