const express = require('express');
const router = express.Router();
const { check, body} = require('express-validator');
const userController = require('../controllers/user');
const { verifyToken } = require('../helpers/auth');

router.get('/', [verifyToken], userController.getAll);
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('mobile', 'Mobile is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
], [verifyToken], userController.create);
router.get('/:userId', [verifyToken], userController.getUserById);
router.put('/', [
    check('_id', 'User id is required').notEmpty(),
], [verifyToken], userController.update);
router.delete('/:userId', [verifyToken], userController.deleteUser);

module.exports = router;