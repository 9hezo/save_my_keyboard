'use strict';

const express = require('express');
const router = express.Router();

const usersRouter = require('./users.routes');
router.use('/users', usersRouter);

module.exports = router;
