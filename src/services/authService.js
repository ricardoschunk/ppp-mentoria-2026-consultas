const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/appError');

function signToken(subject, role) {
  return jwt.sign({ role }, config.jwtSecret, { subject, expiresIn: config.jwtExpiresIn });
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function loginAdmin(username, password) {
  if (!safeEqual(username, config.adminUsername) || !safeEqual(password, config.adminPassword)) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Usuário ou senha inválidos.');
  }
  return signToken(config.adminUsername, 'physiotherapist');
}

module.exports = { signToken, loginAdmin };
