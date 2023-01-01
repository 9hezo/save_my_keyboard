'use strict';

const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();
const loginCheckMiddleware = require('../config/loginCheckMiddleware');

router.get('/register', usersController.output_register);
router.get('/login', usersController.output_login);

router.post('/register', loginCheckMiddleware, usersController.createUser);
router.post('/login', loginCheckMiddleware, usersController.login);
router.get('/logout', usersController.logout);

module.exports = router;
