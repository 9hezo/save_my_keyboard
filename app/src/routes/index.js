'use strict';

const express = require('express');
const router = express.Router();

const usersRouter = require('./users.routes');
router.use('/users', usersRouter);

router.use('/', (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!refreshToken || !accessToken) {
    return res.render('index');
  }
  res.render('index', { userInfo: { name: '테스터', point: 500000 } });
});

module.exports = router;
