'use strict';

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

const UsersOutputController = require('../controllers/users_output.controller');
const usersOutputController = new UsersOutputController();
const OrdersOutputController = require('../controllers/orders_output.controller');
const ordersOutputController = new OrdersOutputController();

router.get('/register', authMiddleware, usersOutputController.register);
router.get('/login', authMiddleware, usersOutputController.login);
router.get('/mypage', authMiddleware, usersOutputController.mypage);

router.get('/orders/request', authMiddleware, ordersOutputController.request);
// 사장님 윤활 신청 목록 페이지
router.get('/orders/lists', authMiddleware, ordersOutputController.getlists);

router.get('/', authMiddleware, (req, res) => {
  res.render('index', {
    userInfo: res.locals.userInfo ? res.locals.userInfo : null,
  });
});
router.get('/*', (req, res) => res.redirect('/'));

module.exports = router;
