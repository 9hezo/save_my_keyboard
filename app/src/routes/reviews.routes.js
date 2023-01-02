'use strict';

const express = require('express');
const router = express.Router();

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

router.get('/', reviewsController.getReviews);

router.post('/1', reviewsController.createReviews);

// app.get('/list', (req, res) => {
//   db.collection('post')
//     .find()
//     .toArray(function (err, result) {
//       console.log(result);
//       res.render('list.ejs', { posts: result });
//     });
// });

// models.User.create({
//   email: 'abcd@naver.com',
//   password: '1234',
//   name: 'kwon',
//   phone: '123-456',
//   address: 'incheon',
//   point: 100000,
//   admin: 0,
// }).then((_) => console.log('Data is created!'));

// models.Order.create({
//   ownerId: 1,
//   kinds: '커세어 K70',
//   details: 'text',
//   status: 0,
//   pickup: Date.now(),
//   imageURL: '1315',
// });

// models.Reviews.create({
//   orderId: '1',
//   content: '윤활이 잘되어 있고 타건감이 좋아졌습니다.',
//   score: 5,
//   imageUrl: '',
// }).then((_) => console.log('Data is created!'));

// models.User.findOne({ where: { id: '1' } }).then((user) => {
//   if (user) {
//     user.update({ name: 'Kim' }).then((r) => console.log('Data is updated!'));
//   }
// });

// models.User.destroy({ where: { name: 'Kim' } }).then((_) => console.log('Data was deleted!'));

// models.User.findAll().then(console.log);

module.exports = router;
