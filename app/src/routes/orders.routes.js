'use strict';

const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const authMiddleware = require('../config/authMiddleware');


router.get('/', ordersController.output_orders);

router.get('/lists', authMiddleware, ordersController.getlists);
router.get('/mylist', authMiddleware, ordersController.getorders);
router.post('/', authMiddleware, ordersController.createOrder);


module.exports = router;
