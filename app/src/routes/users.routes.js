'use strict';

const express = require('express');
const router = express.Router();

const loginCheckMiddleware = require('../middlewares/loginCheckMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

router.post('/register', loginCheckMiddleware, usersController.createUser);

router.post('/login', loginCheckMiddleware, usersController.login);

router.get('/logout', usersController.logout);

router.get('/order', authMiddleware, usersController.getOrdersDoing);

router.get('/mypage', authMiddleware, usersController.getOrdersDone);

module.exports = router;
