const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(authenticate, authorize('patient'));
router.get('/available', appointmentController.available);
router.post('/', appointmentController.schedule);
router.get('/mine', appointmentController.mine);

module.exports = router;
