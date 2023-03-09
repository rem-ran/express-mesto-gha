const jwt = require('jsonwebtoken');

const { ERROR_CODE_401 } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(ERROR_CODE_401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'someKey');
  } catch (err) {
    return res
      .status(ERROR_CODE_401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
