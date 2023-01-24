'use strict';

const ReviewsRepository = require('../repositories/reviews.repository');
const { Review } = require('../sequelize/models');

class ReviewsService {
  reviewsRepository = new ReviewsRepository(Review);

}

module.exports = ReviewsService;
