'use strict';

const express = require('express');
const router = express.Router();
require('dotenv').config();

const UploadManager = require('../config/UploadManager');
const uploadManager = new UploadManager(process.env.MULTER_PATH_UPLOADS_ORDERS);
const authMiddleware = require('../middlewares/authMiddleware');

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

router.post(
  '/',
  authMiddleware,
  uploadManager.multer({ storage: uploadManager.storage }).array('files'),
  ordersController.createOrder
);

router.patch('/:orderId', authMiddleware, ordersController.updateStatus);

// 사장님 마이페이지
router.get('/mypage2', authMiddleware, ordersController.getorderlists);

router.put('/mypage2/:ownerId', authMiddleware, ordersController.statusupdate);

router.get('/aa', authMiddleware, ordersController.orderlist);

module.exports = router;
