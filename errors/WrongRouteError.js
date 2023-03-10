const { ERROR_CODE_404 } = require('../utils/constants');

class WrongRouteError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_404;
  }
}

module.exports = WrongRouteError;
