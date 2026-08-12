const appointmentService = require('../services/appointmentService');

function available(req, res, next) {
  try {
    const times = appointmentService.listAvailable(req.query.date);
    res.json({ data: { date: req.query.date, times } });
  } catch (error) { next(error); }
}

function schedule(req, res, next) {
  try {
    const appointment = appointmentService.schedule(req.auth.id, req.body || {});
    res.status(201).json({ data: appointment });
  } catch (error) { next(error); }
}

function mine(req, res, next) {
  try {
    res.json({ data: appointmentService.listForPatient(req.auth.id) });
  } catch (error) { next(error); }
}

function all(_req, res, next) {
  try {
    res.json({ data: appointmentService.listAll() });
  } catch (error) { next(error); }
}

module.exports = { available, schedule, mine, all };
