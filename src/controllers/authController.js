const authService = require('../services/authService');

function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    const token = authService.loginAdmin(username, password);
    res.json({ data: { token, tokenType: 'Bearer', role: 'physiotherapist' } });
  } catch (error) { next(error); }
}

module.exports = { login };
