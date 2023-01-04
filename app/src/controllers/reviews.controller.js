'use strict';

const ReviewsService = require('../services/reviews.service');

class ReviewsController {
  reviewsService = new ReviewsService();

  getReviews = async (req, res, next) => {
    let { orderId, content, score, imageUrl } = req.body;
    const reviews = await this.reviewsService.findAllReviews(orderId, content, score, imageUrl);

    // res.status(200).json({ reviews });
    res.render('./review', {
      data: reviews,
    });
  };

  createtReviews = async (req, res, next) => {
    const { orderId, content, score, imageUrl } = req.body;

    const createReviewsData = await this.reviewsService.createReviews(
      orderId,
      content,
      score,
      imageUrl
    );

    return res.status(201).json({ data: createReviewsData });
  };
}

module.exports = ReviewsController;
