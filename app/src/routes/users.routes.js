'use strict';

const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

const authMiddleware = require('../middlewares/authMiddleware');
const loginCheckMiddleware = require('../middlewares/loginCheckMiddleware');

router.post('/register', loginCheckMiddleware, usersController.createUser);

router.post('/login', loginCheckMiddleware, usersController.login);

router.get('/logout', usersController.logout);

router.get('/order', authMiddleware, usersController.getOrdersDoing);

router.get('/mypage', authMiddleware, usersController.getOrdersDone);

module.exports = router;
