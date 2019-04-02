const db = require('./connection');
const getCurrentDateTime = require('../helpers/dateTimeFormatter');

//RESTAURANT QUARIES//

/*List all restaurants */
const getRestaurants = (request, response) => {
    db.any('SELECT * FROM restaurants WHERE active = 1 ORDER BY restaurant_id ASC') 
    .then(data => {      
      response.send(data);      
    })
    .catch(error => {
      response.send(error);
    });
  }

/*Select one restaurant by restaurant_id*/
const getRestaurantById = (request, response) => {
    const id = parseInt(request.params.id)  
    db.one('SELECT * FROM restaurants WHERE restaurant_id = $1', [id])
      .then(data => { 
        console.log(data);       
        response.status(200).send(data);          
      })
      .catch(error => {
        response.status(404).json(error);
      });
  }

  /*Create restaurant - NEED TO IMPLEMENT THAT ONLY OWNER CAN CREATE*/
const createRestaurant = (request, response) => {
    const { name, address, category, description, user_id } = request.body  
    db.one('INSERT INTO restaurants (name, address, category, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING restaurant_id', [name, address, category, description, user_id]) 
      .then(data => {
        const msg = 'Restaurant with id: ' + data.restaurant_id + ' was created.';
        response.status(201).json({
          message: msg
        });
      })
      .catch(error => {
        response.send(error);
      });
  }

//END RESTAURANT QUARIES
/*Update restaurant by restaurant_id */
const updateRestaurant = (request, response) => {
    const {restaurant_id, name, description, category, user_id } = request.body
  
    db.none(
      'UPDATE restaurants SET name = $1, description= $2, category = $3, updated_at = $4, user_id = $5 WHERE restaurant_id = $6',
      [ name, description, category, getCurrentDateTime(), user_id, restaurant_id]) //active means 1
        .then(data => {
          const msg = 'Restaurant with id: ' + restaurant_id + ' was updated';
          response.status(201).json({
            message: msg
          });
        })
        .catch(error => {
          response.send(error);
        });
  }

/*Delete restaurant by restaurant_id by setting active yo 0 */
const deleteRestaurant = (request, response) => {
    const {restaurant_id} = request.body
  
    db.none(
      'UPDATE restaurants SET active = 0, updated_at = $1 WHERE restaurant_id = $2',
      [getCurrentDateTime(), restaurant_id]) //active means 1, 0 means inactive=>deleted
        .then(data => {
          const msg = 'Restaurant with id: ' + restaurant_id + ' was set to inactive.';
          response.status(201).json({
            message: msg
          });
        })
        .catch(error => {
          response.send(error);
        });
  }

  


  //END RESTAURANT QUARIES

  module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
}