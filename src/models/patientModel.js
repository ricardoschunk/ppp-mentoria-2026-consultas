const { randomUUID } = require('node:crypto');

class PatientModel {
  constructor() { this.patients = []; }

  create({ fullName, phone }) {
    const patient = { id: randomUUID(), fullName, phone, createdAt: new Date().toISOString() };
    this.patients.push(patient);
    return patient;
  }

  findById(id) { return this.patients.find((patient) => patient.id === id); }
  findByPhone(phone) { return this.patients.find((patient) => patient.phone === phone); }
  clear() { this.patients.length = 0; }
}

module.exports = new PatientModel();
