'use strict';

const express = require('express');
const { Model } = require('sequelize');
const router = express.Router();

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();
const loginCheckMiddleware = require('../config/loginCheckMiddleware');
const authMiddleware = require('../config/authMiddleware');

router.get('/', authMiddleware, reviewsController.getReviews);
router.post('/', authMiddleware, reviewsController.createReviews);


router.get('/write', authMiddleware, (_, res) => {
  res.render('reviews/write');
});

module.exports = router;
