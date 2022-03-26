const express = require('express');
const router = express.Router();
const { check, body} = require('express-validator');
const customerController = require('../controllers/customer');
const { verifyToken } = require('../helpers/auth');

router.get('/', [verifyToken], customerController.getAll);
router.get('/get-all-customers', [verifyToken], customerController.getAllCustomer);
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('mobile', 'Mobile is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
], [verifyToken], customerController.create);
router.get('/:customerId', [verifyToken], customerController.getCustomerById);
router.put('/', [
    check('_id', 'Customer id is required').notEmpty(),
], [verifyToken], customerController.update);
router.delete('/:customerId', [verifyToken], customerController.deleteCustomer);

module.exports = router;