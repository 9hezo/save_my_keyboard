'use strict';

const ReviewsService = require('../services/reviews.service');

class ReviewsController {
  reviewsService = new ReviewsService();

  getReviews = async (req, res) => {
    const reviews = await this.reviewsService.findAllReviews;
    console.log('hi');
    res.status(200).json({ reviews });
  };

  createReviews = async (req, res) => {
    const { orderId, content, score, imageURL } = req.body;
    const createReviewData = await this.reviewsService.createReviews(
      orderId,
      content,
      score,
      imageURL
    );

    res.status(201).json({ data: createReviewData });
  };
}

module.exports = ReviewsController;
