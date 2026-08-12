module.exports = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  adminUsername: process.env.ADMIN_USERNAME || 'fisioterapeuta',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
};
