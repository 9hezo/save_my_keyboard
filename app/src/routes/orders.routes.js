'use strict';

const express = require('express');
const router = express.Router();
require('dotenv').config();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const UploadManager = require('../config/UploadManager');
const uploadManager = new UploadManager(process.env.MULTER_PATH_UPLOADS_ORDERS);

const authMiddleware = require('../config/authMiddleware');

const WorkersController = require('../controllers/workers.controllers');
const workersController = new WorkersController();

// 윤활 주문
router.get('/request', authMiddleware, ordersController.output_request);

router.post(
  '/',
  authMiddleware,
  uploadManager.multer({ storage: uploadManager.storage }).array('files'),
  ordersController.createOrder
);

// 사장님 윤활 신청 목록 페이지
router.get('/lists', authMiddleware, ordersController.getlists);

// 사장님 마이페이지
router.get('/mypage2', authMiddleware, workersController.getorderlists);
router.get('/lists', authMiddleware, workersController.getOrderStatusZeroToThree);
router.get('/mypage2', authMiddleware, workersController.getOrdersStatusEnd);

router.put('/status/:ownerId', authMiddleware, ordersController.statusupdate);

module.exports = router;
