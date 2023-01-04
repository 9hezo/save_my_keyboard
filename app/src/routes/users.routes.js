'use strict';

const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();
const loginCheckMiddleware = require('../config/loginCheckMiddleware');
const authMiddleware = require('../config/authMiddleware');

router.get('/register', authMiddleware, usersController.output_register);
router.get('/login', authMiddleware, usersController.output_login);
router.get('/mypage-user', authMiddleware, usersController.output_mypage);
router.get('/admin', authMiddleware, usersController.output_admin);

router.post('/register', loginCheckMiddleware, usersController.createUser);
router.post('/login', loginCheckMiddleware, usersController.login);

router.get('/logout', usersController.logout);
router.get('/order', authMiddleware, usersController.getOrderStatusZeroToThree);
router.get('/mypage', authMiddleware, usersController.getOrdersStatusEnd);

module.exports = router;
