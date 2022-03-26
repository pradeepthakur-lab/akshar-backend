const express = require('express');
const router = express.Router();
const { check, body} = require('express-validator');
const jobController = require('../controllers/job');

const { verifyToken } = require('../helpers/auth');

router.get('/', [verifyToken], jobController.getAll);
router.post('/', [verifyToken], jobController.create);
router.get('/:jobId', [verifyToken], jobController.getJobById);
router.put('/', [verifyToken], jobController.update);
router.get('/payment/:jobId', [verifyToken], jobController.jobPaymentById);
// router.delete('/:jobId', [verifyToken], jobController.deleteJob);

router.get('/video/stream', jobController.video);

module.exports = router;