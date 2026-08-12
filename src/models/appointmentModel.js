const { randomUUID } = require('node:crypto');

class AppointmentModel {
  constructor() { this.appointments = []; }

  create({ patientId, date, time }) {
    const appointment = {
      id: randomUUID(), patientId, date, time, status: 'scheduled', createdAt: new Date().toISOString()
    };
    this.appointments.push(appointment);
    return appointment;
  }

  findByDateAndTime(date, time) {
    return this.appointments.find((item) => item.date === date && item.time === time);
  }

  findByPatientId(patientId) {
    return this.appointments.filter((item) => item.patientId === patientId);
  }

  findAll() { return [...this.appointments]; }
  clear() { this.appointments.length = 0; }
}

module.exports = new AppointmentModel();
