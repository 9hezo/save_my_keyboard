'use strict';

require('dotenv').config();
const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

const UploadManager = require('../utils/UploadManager');
const uploadManager = new UploadManager(process.env.MULTER_PATH_UPLOADS_ORDERS);

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/waiting', authMiddleware, ordersController.getOrdersWaiting);
router.get('/doing', authMiddleware, ordersController.getOrdersDoing);
router.get('/done', authMiddleware, ordersController.getOrdersDone);

router.post(
  '/',
  authMiddleware,
  uploadManager.multer({ storage: uploadManager.storage }).array('files'),
  ordersController.createOrder
);

router.put('/:orderId', authMiddleware, ordersController.takeOrder);

router.patch('/:orderId', authMiddleware, ordersController.updateStatus);

module.exports = router;
