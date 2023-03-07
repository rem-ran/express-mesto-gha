// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { ERROR_CODE_401 } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(ERROR_CODE_401)
      .send({ message: 'Необходима авторизация 1' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'someKey');
  } catch (err) {
    return res
      .status(ERROR_CODE_401)
      .send({ message: 'Необходима авторизация 2' });
  }

  req.user = payload;

  return next();
};
