'use strict';

const ReviewsService = require('../services/reviews.service');

class ReviewsController {
  reviewsService = new ReviewsService();

  getReviews = async (req, res, next) => {
    let { kinds, content, score, imageUrl } = req.body;
    const reviews = await this.reviewsService.findAllReviews(kinds, content, score, imageUrl);

    // res.status(200).json({ reviews });
    res.render('./reviews/review', {
      data: reviews,
    });
  };

  createReviews = async (req, res, next) => {
    
    const { kinds, content, score, imageUrl } = req.body;

    const createReviewsData = await this.reviewsService.createReviews(
      kinds,
      content,
      score,
      imageUrl
    );

    return res.status(201).json({ data: createReviewsData });
  };

 
}

module.exports = ReviewsController;
