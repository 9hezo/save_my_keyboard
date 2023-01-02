'use strict';

const express = require('express');
const router = express.Router();

const authMiddleware = require('../config/authMiddleware');
const usersRouter = require('./users.routes');
router.use('/users', usersRouter);

router.use('/', authMiddleware, (req, res) => {
  if (res.locals.userInfo) {
    const userInfo = res.locals.userInfo;
    res.render('index', { userInfo: { name: userInfo.name, point: userInfo.point } });
  } else {
    res.render('index');
  }
});

module.exports = router;
