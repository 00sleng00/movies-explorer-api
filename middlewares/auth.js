const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { needAuthorization } = require('../utils/constants');
const AuthorizationError = require('../errors/AuthorizationError');
const { secretKey } = require('../utils/config');

const handleAuthError = (next) => {
  next(new AuthorizationError(needAuthorization));
};

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(next);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey);
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;

  return next();
};
