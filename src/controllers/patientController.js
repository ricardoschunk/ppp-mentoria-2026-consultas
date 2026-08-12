const patientService = require('../services/patientService');

function register(req, res, next) {
  try {
    const result = patientService.register(req.body || {});
    res.status(201).json({ data: result });
  } catch (error) { next(error); }
}

module.exports = { register };
