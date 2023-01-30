'use strict';

const express = require('express');
const router = express.Router();

const usersRouter = require('./users.routes');
const ordersRouter = require('./orders.routes');
const ourputRouter = require('./output.routes');

router.use('/api/users', usersRouter);
router.use('/api/orders', ordersRouter);
router.use('/', ourputRouter);

module.exports = router;
