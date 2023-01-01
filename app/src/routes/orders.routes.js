'use strict';

const { Router } = require('express');
const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

router.get('/', ordersController.output_orders);

router.get('/', ordersController.getorders);

router.post('/', ordersController.createOrder);

// router.patch('/:orderId', ordersController.changeOrder);

// router.delete('/:orderId', ordersController.eraseOrder);

module.exports = router;
