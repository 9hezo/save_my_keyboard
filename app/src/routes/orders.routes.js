'use strict';

require('dotenv').config();
const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

const UploadManager = require('../utils/UploadManager');
const uploadManager = new UploadManager(process.env.MULTER_PATH_UPLOADS_ORDERS);

const apiMiddleware = require('../middlewares/api.middleware');

router.get('/waiting', apiMiddleware, ordersController.getOrdersWaiting);
router.get('/doing', apiMiddleware, ordersController.getOrdersDoing);
router.get('/done', apiMiddleware, ordersController.getOrdersDone);

router.post(
  '/',
  apiMiddleware,
  uploadManager.multer({ storage: uploadManager.storage }).array('files'),
  ordersController.createOrder
);

router.put('/:orderId', apiMiddleware, ordersController.takeOrder);

router.patch('/:orderId', apiMiddleware, ordersController.updateStatus);

module.exports = router;
