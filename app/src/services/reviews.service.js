'use strict';

const ReviewsRepository = require('../repositories/reviews.repository');
// const { Users } = require('../models');

class ReviewsService {
  reviewsRepository = new ReviewsRepository();

  findAllReviews = async () => {
    console.log('hihi');
    const allReviews = await this.reviewsRepository.findAllReviews();
    console.log('hihi');

    return allReviews.map((reviews) => {
      return {
        orderId: reviews.orderId,
        content: reviews.content,
        score: reviews.score,
        imageURL: reviews.imageURL,
      };
    });
  };

  createReviews = async (orderId, content, score, imageURL) => {
    const createReviewData = await this.reviewsRepository.createReivew(
      orderId,
      content,
      score,
      imageURL
    );

    return {
      orderId: createReviewData.orderId,
      content: createReviewData.content,
      score: createReviewData.score,
      imageURL: createReviewData.imageURL,
    };
  };
}

module.exports = ReviewsService;
