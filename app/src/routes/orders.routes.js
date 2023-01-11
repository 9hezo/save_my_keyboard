'use strict';

const express = require('express');
const router = express.Router();
require('dotenv').config();

const UploadManager = require('../config/UploadManager');
const uploadManager = new UploadManager(process.env.MULTER_PATH_UPLOADS_ORDERS);
const authMiddleware = require('../config/authMiddleware');

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

router.post(
  '/',
  authMiddleware,
  uploadManager.multer({ storage: uploadManager.storage }).array('files'),
  ordersController.createOrder
);

// 주문 상태 변경
router.patch('/:orderId', authMiddleware, ordersController.updateStatus);

// 윤활 신청 목록 페이지
router.get('/lists', authMiddleware, ordersController.getorderlists);

// 상태 업데이트
router.put('/mypage2/:ownerId', authMiddleware, ordersController.statusupdate);
 
// 사장 마이페이지
router.get('/admin', authMiddleware, ordersController.orderlist);

module.exports = router;
