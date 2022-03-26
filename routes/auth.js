const express = require('express');
const router = express.Router();
const { check, body} = require('express-validator');
const authController = require('../controllers/auth');
const { verifyToken } = require('../helpers/auth');

router.post('/login', [
    check('email', 'Email is required').notEmpty(),
    check('password', 'password is required').notEmpty(),
], authController.login);
router.post('/register', authController.register);
router.post('/logout', [verifyToken], authController.logout);

module.exports = router;