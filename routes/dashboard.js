const express = require('express');
const router = express.Router();
const { check, body} = require('express-validator');
const { verifyToken } = require('../helpers/auth');
const dashboardController = require('../controllers/dashboard');


router.get('/', [verifyToken], dashboardController.getJobsCount);

module.exports = router;