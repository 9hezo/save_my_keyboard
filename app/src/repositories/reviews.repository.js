'use strict';

// const { Reviews } = require('../models');

class ReviewsRepository {
  constructor(reviewsModel) {
    this.reviewsModel = reviewsModel;
  }

  findAllReviews = async (orderId, content, score, imageUrl) => {
    return await this.reviewsModel.findAll({ where: orderId, content, score, imageUrl });
  };

  createReviews = async (orderId, content, score, imageUrl) => {
    const createReviewData = await this.reviewsModel.create({ orderId, content, score, imageUrl });

    return createReviewData;
  };
}

module.exports = ReviewsRepository;
