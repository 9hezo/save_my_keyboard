'use strict';

const express = require('express');
const router = express.Router();

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

const loginCheckMiddleware = require('../middlewares/loginCheckMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

module.exports = router;
