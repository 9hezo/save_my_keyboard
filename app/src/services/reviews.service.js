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

  // findReview = async () => {
  //   const Review = await this.reviewsRepository.findReview();

  //   return Review.map((reviews) => {
  //     return {
  //       orderId: reviews.orderId,
  //       content: reviews.content,
  //       score: reviews.score,
  //       imageUrl: reviews.imageUrl,
  //       createdAt: reviews.createdAt,
  //       updatedAt: reviews.updatedAt,
  //     };
  //   });
  // };
  

  // findReviewById = async (ownerId) => {
  //   const allordersById = await this.reviewsRepository.findReviewById(ownerId);

  //   allordersById.sort((a, b) => {
  //     return b.createdAt - a.createdAt;
  //   });

  //   return allordersById.map((orders) => {
  //     return {
  //       ownerId: orders.ownerId,
  //       orderId: orders.orderId,
  //       details: orders.details,
  //       status: orders.status,
  //       pickup: orders.pickup,
  //       imageUrl: orders.imageUrl,
  //       createdAt: orders.createdAt,
  //       updatedAt: orders.updatedAt,
  //     };
  //   });
  // };

  createReviews = async (orderId, content, score, imageUrl) => {
    const createReviewData = await this.reviewsRepository.createReviews(
      orderId,
      content,
      score,
      imageUrl
    );

    return { code: 201, message: '리뷰 작성에 성공하였습니다.' };
  };

 
}

module.exports = ReviewsService;
