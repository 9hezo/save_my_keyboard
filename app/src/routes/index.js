'use strict';

const express = require('express');
const router = express.Router();

const usersRouter = require('./users.routes');
const ordersRouter = require('./orders.routes');
router.use('/users', usersRouter);
router.use('/orders', ordersRouter);


module.exports = router;
