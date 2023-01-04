'use strict';

// const { Reviews } = require('../models');

class ReviewsRepository {
  constructor(reviewsModel) {
    this.reviewsModel = reviewsModel;
  }

  findAllReviews = async (kinds, content, score, imageUrl) => {
    return await this.reviewsModel.findAll({ where: kinds, content, score, imageUrl });
  };

  createReviews = async (kinds, content, score, imageUrl) => {
    const createReviewData = await this.reviewsModel.create({ kinds, content, score, imageUrl });

    return createReviewData;
  };
}

module.exports = ReviewsRepository;
