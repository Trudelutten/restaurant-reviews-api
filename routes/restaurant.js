var express = require('express');
var router = express.Router();
var pool = require('../queries/restaurantQueries');

//TRY TO MAKE POST WORK
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())


/* GET restaurants listing. */
router.get('/', pool.getRestaurants)

/*GET Spesific restaurant*/
router.get('/:id', pool.getRestaurantById)

//CREATE RESTAURANT - Need to implement that only restuarant owner can create & CATEGORY
router.post('/create', pool.createRestaurant)

//UPDATE RESTAURANTS Need to implement that only restuarant owner can UPDATE & CATEGORY
router.put('/update', pool.updateRestaurant)

//Delete resatuarnt by setting active to 0
router.put('/delete', pool.deleteRestaurant)


module.exports = router;