'use strict';

const { Reviews } = require('../sequelize/models/reviews');

class ReviewsRepository {
  findAllReviews = async () => {
    const reviews = await Reviews.findAll();
    return reviews;
  };

  createReviews = async (orderId, content, score, imageURL) => {
    const createReviewData = await Reviews.create({ orderId, content, score, imageURL });

    return createReviewData;
  };
}

module.exports = ReviewsRepository;
