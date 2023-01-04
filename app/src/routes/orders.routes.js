'use strict';

const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();
const authMiddleware = require('../config/authMiddleware');

// 페이지 불러오기
router.get('/', ordersController.output_orders);

// 사장님 전체 목록 조회
router.get('/lists', authMiddleware, ordersController.getlists);

// 손님 본인 목록 조회
router.get('/mylists', authMiddleware, ordersController.getorders);

// 윤활 신청
router.post('/', authMiddleware, ordersController.createOrder);

module.exports = router;
