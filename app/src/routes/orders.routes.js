'use strict';

const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const authMiddleware = require('../config/authMiddleware');


router.get('/', ordersController.output_orders);

router.get('/', authMiddleware, ordersController.getorders);
router.post('/', authMiddleware, ordersController.createOrder);

// router.patch('/:orderId', ordersController.changeOrder);
// router.delete('/:orderId', ordersController.eraseOrder);

module.exports = router;
