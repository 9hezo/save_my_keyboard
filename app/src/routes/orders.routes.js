'use strict';

const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const authMiddleware = require('../config/authMiddleware');

const WorkersController = require('../controllers/workers.controllers');
const workersController = new WorkersController();

// 페이지 불러오기
router.get('/', ordersController.output_orders);

// 사장님 윤활 신청 목록 페이지
router.get('/lists', authMiddleware, ordersController.getlists);

// 손님 마이페이지
router.get('/mylists', authMiddleware, ordersController.getorders);

// 사장님 마이페이지
router.get('/mypage2', authMiddleware, workersController.getorderlists);

// 윤활 신청
router.post('/', authMiddleware, ordersController.createOrder);

module.exports = router;
