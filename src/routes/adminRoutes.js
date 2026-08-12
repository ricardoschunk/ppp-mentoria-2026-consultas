const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authenticate, authorize('physiotherapist'));
router.get('/appointments', appointmentController.all);

module.exports = router;
