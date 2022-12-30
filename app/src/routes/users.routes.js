'use strict';

const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

router.get('/login', usersController.output_login);

router.post('/register', usersController.createUser);

module.exports = router;
