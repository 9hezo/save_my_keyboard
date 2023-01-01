'use strict';

const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

router.get('/', ordersController.output_orders);

router.post('/', ordersController.createOrder);

// router.patch('/:orderId', ordersController.changeOrder);

// router.delete('/:orderId', ordersController.eraseOrder);

module.exports = router;
