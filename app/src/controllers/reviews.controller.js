'use strict';

const ReviewsService = require('../services/reviews.service');

class ReviewsController {
  reviewsService = new ReviewsService();

  getReviews = async (req, res, next) => {
    let { orderId, content, score, imageUrl } = req.body;
    const reviews = await this.reviewsService.findAllReviews(orderId, content, score, imageUrl);

    // res.status(200).json({ reviews });
    res.render('./reviews/review', {
      data: reviews,
    });
  };

  // getMyReviews = async (req, res) => {
  //   const userInfo = res.locals.userInfo;
  //   const ownerId = userInfo.id;

  //   const review = await this.reviewsService.findReviewById(ownerId);

  //   res.render('reviews/myreviews', { data: review });
  // };

  createReviews = async (req, res, next) => {
    const userInfo = res.locals.userInfo;
    const orderId = userInfo.id;

    const { content, score, imageUrl } = req.body;

    const createReviewsData = await this.reviewsService.createReviews(orderId, content, score, imageUrl);

    return res.status(201).json({ data: createReviewsData });
  };

  deleteReviews = async (req, res) => {
    console.log(req.body);

    const deleteReviews = await this.reviewsService.deleteReviews(req.body);

    return res.status(201).json({ data: deleteReviews });
  };
}

module.exports = ReviewsController;
