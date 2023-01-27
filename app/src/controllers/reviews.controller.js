'use strict';

const ReviewsService = require('../services/reviews.service');

class ReviewsController {
  reviewsService = new ReviewsService();
}

module.exports = ReviewsController;
