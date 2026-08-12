const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/appError');

function authenticate(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'TOKEN_REQUIRED', 'Token de autenticação não informado.'));
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.auth = { id: payload.sub, role: payload.role };
    return next();
  } catch (_error) {
    return next(new AppError(401, 'INVALID_TOKEN', 'Token inválido ou expirado.'));
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.auth.role)) {
      return next(new AppError(403, 'FORBIDDEN', 'Você não tem permissão para acessar este recurso.'));
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
