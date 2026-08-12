const patientModel = require('../models/patientModel');
const AppError = require('../utils/appError');
const { signToken } = require('./authService');

const PHONE_PATTERN = /^\+?[0-9 ()-]{8,20}$/;

function register({ fullName, phone }) {
  const normalizedName = typeof fullName === 'string' ? fullName.trim() : '';
  const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
  if (normalizedName.length < 3 || !PHONE_PATTERN.test(normalizedPhone)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Informe nome completo e telefone válido.');
  }
  if (patientModel.findByPhone(normalizedPhone)) {
    throw new AppError(409, 'PHONE_ALREADY_REGISTERED', 'Telefone já cadastrado.');
  }
  const patient = patientModel.create({ fullName: normalizedName, phone: normalizedPhone });
  return { patient, token: signToken(patient.id, 'patient') };
}

module.exports = { register };
