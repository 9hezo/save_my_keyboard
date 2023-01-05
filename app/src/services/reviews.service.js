'use strict';

const ReviewsRepository = require('../repositories/reviews.repository');
const { Review } = require('../sequelize/models');
// const { Users } = require('../models');

class ReviewsService {
  reviewsRepository = new ReviewsRepository(Review);

  findAllReviews = async () => {
    const allReviews = await this.reviewsRepository.findAllReviews();

    allReviews.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allReviews.map((reviews) => {
      return {
        orderId: reviews.orderId,
        content: reviews.content,
        score: reviews.score,
        imageUrl: reviews.imageUrl,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
      };
    });
  };

  createReviews = async (orderId, content, score, imageUrl) => {
    const createReviewData = await this.reviewsRepository.createReviews(orderId, content, score, imageUrl);

    return { code: 201, message: '리뷰 작성에 성공하였습니다.' };
  };

  deleteReviews = async (reviewId) => {
    const deleteReviewData = await this.reviewsRepository.deleteReviews(reviewId);

    return { code: 201, message: '리뷰 삭제에 성공하였습니다.' };
  };
}

module.exports = ReviewsService;
