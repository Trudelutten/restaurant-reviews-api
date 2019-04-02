var express = require('express');
var router = express.Router();
var queries = require('../queries/reviewQueries');

/* GET reviews listing. */
router.get('/latest', queries.getLatestReview);

/* Get reviews by restaurant id */
router.get('/restaurant/:id', queries.getReviewByRestaurantId);

/* Create a review */
router.post('/create', queries.createReview);

/* Update a review */
router.post('/update', queries.updateReview);

/*Get top rated restaurants - multiple reviews get averaged */
router.get('/top', queries.getTopRatedRestaurantsByReviews);

/*Get alle reviews from one user*/
router.get('/:id', queries.getReviewByUserId);

module.exports = router;