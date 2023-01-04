'use strict';

const express = require('express');
const { Model } = require('sequelize');
const router = express.Router();

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();
const loginCheckMiddleware = require('../config/loginCheckMiddleware');
const authMiddleware = require('../config/authMiddleware');

// 리뷰 페이지 불러오기
router.get('/', authMiddleware, reviewsController.getReviews);

// 본인 리뷰 조회
// router.get('/myreviews', authMiddleware, reviewsController.getMyReviews);
// 리뷰 작성
router.post('/', authMiddleware, reviewsController.createReviews);

router.get('/write', authMiddleware, (_, res) => {
  res.render('reviews/write');
});

// router.get('/edit/:id', authMiddleware, reviewsController.editReviews);

router.delete('/delete', authMiddleware, reviewsController.deleteReviews);

module.exports = router;
