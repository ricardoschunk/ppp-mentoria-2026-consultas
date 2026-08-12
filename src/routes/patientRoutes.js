const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();
router.post('/', patientController.register);

module.exports = router;
