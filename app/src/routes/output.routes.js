'use strict';

const express = require('express');
const router = express.Router();

const authMiddleware = require('../config/authMiddleware');

const UsersOutputController = require('../controllers/users_output.controller');
const usersOutputController = new UsersOutputController();
const OrdersOutputController = require('../controllers/orders_output.controller');
const ordersOutputController = new OrdersOutputController();

router.get('/register', authMiddleware, usersOutputController.register);
router.get('/login', authMiddleware, usersOutputController.login);
router.get('/mypage_user', authMiddleware, usersOutputController.mypage_user);
router.get('/admin', authMiddleware, usersOutputController.admin);

router.get('/orders/request', authMiddleware, ordersOutputController.request);
// 사장님 윤활 신청 목록 페이지
router.get('/orders/lists', authMiddleware, ordersOutputController.getlists);

router.use('/', authMiddleware, (req, res) => {
  if (res.locals.userInfo) {
    const userInfo = res.locals.userInfo;
    res.render('index', { userInfo });
  } else {
    res.render('index');
  }
});

module.exports = router;
