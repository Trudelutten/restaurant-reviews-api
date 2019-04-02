const db = require('./connection');

const getCurrentDatetime = require('../helpers/dateTimeFormatter');

// REVIEW QUERIES

// Returns latest five reviews
const getLatestReview = (request, response) => {
  db.any('SELECT users.username, reviews.user_id, reviews.review_id, reviews.restaurant_id, reviews.review_text, reviews.rating, restaurants.name FROM reviews LEFT JOIN restaurants ON reviews.restaurant_id = restaurants.restaurant_id LEFT JOIN users ON reviews.user_id = users.user_id WHERE reviews.active = 1 GROUP BY users.username, reviews.user_id, reviews.review_id, reviews.restaurant_id, reviews.review_text, reviews.rating, restaurants.name ORDER BY reviews.review_id DESC LIMIT 5;')
    .then(data => {
      response.status(200).json(data);
    })
    .catch(error => {
      response.status(400).json(error);
    });
}

// Returns a review by restaurant_id
const getReviewByRestaurantId = (request, response) => {
  const id = request.params.id;
  db.any('SELECT users.username, reviews.user_id, reviews.restaurant_id, reviews.review_text, reviews.rating, reviews.created_at FROM reviews LEFT JOIN users ON reviews.user_id = users.user_id WHERE reviews.restaurant_id = $1 AND reviews.active = 1;', [id])
    .then(data => {
      response.status(200).json(data);
    })
    .catch(error => {
      response.send(error);
    });
}

// Returns a review by user_id
const getReviewByUserId = (request, response) => {
  const id = request.params.id;
  db.any('SELECT restaurants.name, reviews.user_id, reviews.review_id, reviews.restaurant_id, reviews.review_text, reviews.rating, reviews.created_at, reviews.active FROM reviews LEFT JOIN restaurants ON reviews.restaurant_id = restaurants.restaurant_id WHERE reviews.user_id = $1;', [id])
    .then(data => {
      response.status(200).json(data);
    })
    .catch(error => {
      response.send(error);
    });
}


// Create a new entity in review table
const createReview = (request, response) => {
  const { restaurant_id, user_id, rating, reviewText } = request.body;
  db.one('INSERT INTO reviews (restaurant_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING review_id;', [restaurant_id, user_id, rating, reviewText])
    .then(data => {
      const msg = 'Review with id ' + data.review_id + ' has been created.';
      response.status(201).json({
        message: msg
      });
    })
    .catch(error => {
      response.status(400).json(error);
    });
}

// Update existing review
const updateReview = (request, response) => {
  const { review_id, user_id, restaurant_id, rating, reviewText } = request.body;
  db.none('UPDATE reviews SET rating = $1, review_text = $2, updated_at = $3 WHERE review_id = $4;', [rating, reviewText, getCurrentDatetime(), review_id])
    .then(data => {
      const msg = 'Review with id ' + review_id + ' has been updated.';
      response.status(201).json({
        message: msg
      });
    })
    .catch(error => {
      response.status(400).json(error);
    });
}

/*Get the average rating for all restaurants as a list in descending order*/
const getTopRatedRestaurantsByReviews = (request, response) => {
  db.any('SELECT reviews.restaurant_id, ROUND(AVG(rating)::numeric, 1) as average, restaurants.name, restaurants.address, reviews.review_text FROM reviews LEFT JOIN restaurants ON reviews.restaurant_id = restaurants.restaurant_id WHERE reviews.active=1 AND restaurants.active=1 GROUP BY reviews.restaurant_id, restaurants.name, restaurants.address, reviews.review_text ORDER BY average DESC, reviews.restaurant_id LIMIT 5;') 
  .then(data => {
    //var res1 = alasql('SELECT * FROM ? ORDER BY avg',[data]);
    response.status(201).json(data);
  })
  .catch(error => {
    response.send(error);
  });
}
// END REVIEW QUERIES

module.exports = {
  getLatestReview,
  getReviewByRestaurantId,
  createReview,
  updateReview,
  getTopRatedRestaurantsByReviews,
  getReviewByUserId,
}