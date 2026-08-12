const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const patientModel = require('../src/models/patientModel');
const appointmentModel = require('../src/models/appointmentModel');

const server = app.listen(0);
const baseUrl = `http://127.0.0.1:${server.address().port}`;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
  return { status: response.status, body: await response.json() };
}

async function register(fullName = 'Maria da Silva', phone = '11999999999') {
  return request('/api/patients', { method: 'POST', body: JSON.stringify({ fullName, phone }) });
}

beforeEach(() => { patientModel.clear(); appointmentModel.clear(); });
after(() => server.close());

test('cadastro emite token e rejeita telefone duplicado', async () => {
  const created = await register();
  assert.equal(created.status, 201);
  assert.ok(created.body.data.token);
  assert.equal((await register()).status, 409);
});

test('paciente agenda e consulta somente seus agendamentos', async () => {
  const patient = await register();
  const token = patient.body.data.token;
  const headers = { authorization: `Bearer ${token}` };
  const scheduled = await request('/api/appointments', {
    method: 'POST', headers, body: JSON.stringify({ date: '2026-08-10', time: '07:00' })
  });
  assert.equal(scheduled.status, 201);
  const mine = await request('/api/appointments/mine', { headers });
  assert.equal(mine.body.data.length, 1);
  const available = await request('/api/appointments/available?date=2026-08-10', { headers });
  assert.equal(available.body.data.times.includes('07:00'), false);
  assert.equal(available.body.data.times.includes('18:00'), true);
});

test('impede conflito, horários fora da faixa e acesso entre perfis', async () => {
  const first = await register('Paciente Um', '11911111111');
  const second = await register('Paciente Dois', '11922222222');
  const firstHeaders = { authorization: `Bearer ${first.body.data.token}` };
  const secondHeaders = { authorization: `Bearer ${second.body.data.token}` };
  await request('/api/appointments', { method: 'POST', headers: firstHeaders, body: JSON.stringify({ date: '2026-09-01', time: '18:00' }) });
  assert.equal((await request('/api/appointments', { method: 'POST', headers: secondHeaders, body: JSON.stringify({ date: '2026-09-01', time: '18:00' }) })).status, 409);
  assert.equal((await request('/api/appointments', { method: 'POST', headers: firstHeaders, body: JSON.stringify({ date: '2026-09-01', time: '19:00' }) })).status, 400);
  assert.equal((await request('/api/admin/appointments', { headers: firstHeaders })).status, 403);
});

test('fisioterapeuta autenticado visualiza todos os agendamentos', async () => {
  const patient = await register();
  await request('/api/appointments', { method: 'POST', headers: { authorization: `Bearer ${patient.body.data.token}` }, body: JSON.stringify({ date: '2026-10-10', time: '10:00' }) });
  const login = await request('/api/admin/login', { method: 'POST', body: JSON.stringify({ username: 'fisioterapeuta', password: 'admin123' }) });
  assert.equal(login.status, 200);
  const all = await request('/api/admin/appointments', { headers: { authorization: `Bearer ${login.body.data.token}` } });
  assert.equal(all.status, 200);
  assert.equal(all.body.data[0].patient.fullName, 'Maria da Silva');
  assert.equal((await request('/api/appointments/mine', { headers: { authorization: `Bearer ${login.body.data.token}` } })).status, 403);
});

test('rotas protegidas exigem JWT e Swagger é renderizado', async () => {
  assert.equal((await request('/api/appointments/mine')).status, 401);
  const docs = await fetch(`${baseUrl}/api-docs/`);
  assert.equal(docs.status, 200);
  assert.match(await docs.text(), /Swagger UI/);
});
