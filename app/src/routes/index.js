'use strict';

const express = require('express');
const router = express.Router();

const authMiddleware = require('../config/authMiddleware');
const usersRouter = require('./users.routes');
const ordersRouter = require('./orders.routes');
const reviewsRouter = require('./reviews.routes');
router.use('/users', usersRouter);
router.use('/reviews', reviewsRouter)
router.use('/orders', ordersRouter);

router.use('/', authMiddleware, (req, res) => {
  if (res.locals.userInfo) {
    const userInfo = res.locals.userInfo;
    res.render('index', { userInfo: { name: userInfo.name, point: userInfo.point, admin: userInfo.admin } });
  } else {
    res.render('index');
  }
});

module.exports = router;
