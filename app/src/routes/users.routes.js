'use strict';

const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

const loginCheckMiddleware = require('../middlewares/loginCheckMiddleware');

router.post('/register', loginCheckMiddleware, usersController.createUser);

router.post('/login', loginCheckMiddleware, usersController.login);

module.exports = router;
