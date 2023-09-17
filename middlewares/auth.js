const { SECRET_KEY } = require('../utils/config');

const jwt = require('jsonwebtoken');

const UnautorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new UnautorizedError('Необходима авторизация');
  }
  // записываем пейлоуд в объект запроса
  // next() запрос проходит дальше
  req.user = payload;
  next();
};
