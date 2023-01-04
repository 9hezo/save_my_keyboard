'use strict';

// const { Reviews } = require('../models');

class ReviewsRepository {
  constructor(reviewsModel) {
    this.reviewsModel = reviewsModel;
  }

  findAllReviews = async (orderId, content, score, imageUrl) => {
    return await this.reviewsModel.findAll({ where: orderId, content, score, imageUrl });
  };

  

  // findReviewById = async (ownerId) => {
  //   const reviews = await this.reviewsModel.findAll({ where: { ownerId: ownerId } });

  //   return reviews;
  // };

  createReviews = async (orderId, content, score, imageUrl) => {
    const createReviewData = await this.reviewsModel.create({ orderId, content, score, imageUrl });

    return createReviewData;
  };
}

module.exports = ReviewsRepository;
