'use strict';

const express = require('express');
const router = express.Router();

const UsersOutputController = require('../controllers/users_output.controller');
const usersOutputController = new UsersOutputController();
const OrdersOutputController = require('../controllers/orders_output.controller');
const ordersOutputController = new OrdersOutputController();

const outputMiddleware = require('../middlewares/output.middleware');

router.get('/register', outputMiddleware, usersOutputController.register);
router.get('/login', outputMiddleware, usersOutputController.login);
router.get('/mypage', outputMiddleware, usersOutputController.mypage);

router.get('/orders/request', outputMiddleware, ordersOutputController.request);
router.get('/orders/list', outputMiddleware, ordersOutputController.list);

router.get('/', outputMiddleware, (req, res) => {
  res.render('index', {
    userInfo: res.locals.userInfo ?? null,
  });
});

router.get('/*', (req, res) => res.redirect('/'));

module.exports = router;
