const path = require('node:path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const swaggerDocument = require(path.join(__dirname, 'resources', 'swagger.json'));
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
app.get('/api-docs.json', (_req, res) => res.json(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
