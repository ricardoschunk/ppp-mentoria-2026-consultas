const appointmentModel = require('../models/appointmentModel');
const patientModel = require('../models/patientModel');
const AppError = require('../utils/appError');

const AVAILABLE_TIMES = Array.from({ length: 12 }, (_, index) => `${String(index + 7).padStart(2, '0')}:00`);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateDate(date) {
  if (!DATE_PATTERN.test(date || '')) {
    throw new AppError(400, 'VALIDATION_ERROR', 'A data deve estar no formato YYYY-MM-DD.');
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new AppError(400, 'VALIDATION_ERROR', 'A data informada não existe.');
  }
}

function listAvailable(date) {
  validateDate(date);
  const booked = new Set(appointmentModel.findAll().filter((item) => item.date === date).map((item) => item.time));
  return AVAILABLE_TIMES.filter((time) => !booked.has(time));
}

function schedule(patientId, { date, time }) {
  validateDate(date);
  if (!AVAILABLE_TIMES.includes(time)) {
    throw new AppError(400, 'INVALID_TIME', 'O horário deve ser uma hora cheia entre 07:00 e 18:00.');
  }
  if (!patientModel.findById(patientId)) {
    throw new AppError(404, 'PATIENT_NOT_FOUND', 'Paciente não encontrado.');
  }
  if (appointmentModel.findByDateAndTime(date, time)) {
    throw new AppError(409, 'TIME_UNAVAILABLE', 'Este horário não está disponível.');
  }
  return appointmentModel.create({ patientId, date, time });
}

function withPatient(appointment) {
  return { ...appointment, patient: patientModel.findById(appointment.patientId) };
}

function listForPatient(patientId) { return appointmentModel.findByPatientId(patientId).map(withPatient); }
function listAll() { return appointmentModel.findAll().map(withPatient); }

module.exports = { listAvailable, schedule, listForPatient, listAll, AVAILABLE_TIMES };
