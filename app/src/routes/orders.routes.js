'use strict';

const express = require('express');
const router = express.Router();
require('dotenv').config();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const UploadManager = require('../config/UploadManager');
const uploadManager = new UploadManager(process.env.MULTER_PATH_UPLOADS_ORDERS);

const authMiddleware = require('../config/authMiddleware');

router.get('/', authMiddleware, ordersController.output_orders);
// router.get('/', ordersController.output_orderlists);

router.post(
  '/',
  authMiddleware,
  uploadManager.multer({ storage: uploadManager.storage }).array('files'),
  ordersController.createOrder
);

// 사장님 전체 목록 조회
router.get('/lists', authMiddleware, ordersController.getlists);
router.get('/mylists', authMiddleware, ordersController.getorders);

module.exports = router;
