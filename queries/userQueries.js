const db = require('./connection');
const jwt = require('jsonwebtoken');

const getCurrentDateTime = require('../helpers/dateTimeFormatter');

//USER QUARIES

/*Get all users */
const getUsers = (request, response) => {
    db.any('SELECT * FROM users WHERE active = 1 ORDER BY user_id ASC ') 
      .then(data => {
        response.status(200).json(data);
      })
      .catch(error => {
        response.status(400).json(error);
      });
  }


/*Select one user by user_id*/
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)  
    db.one('SELECT * FROM users WHERE user_id = $1', [id])
      .then(data => {
        response.status(200).json(data);
      })
      .catch(error => {
        response.status(400).json(error);
      });
  }

/*Update user by user_id */
const updateUser = (request, response) => {
    const {user_id, username, email, password, role } = request.body
  
    db.none(
      'UPDATE users SET username = $1, email = $2, password = $3, role = $4, updated_at = $5, active = $6 WHERE user_id = $7',
      [username, email, password, role, getCurrentDateTime(), 1, user_id]) //active means 1
      .then(data => {
        const msg = 'User with id: ' + user_id + ' was updated.';
        response.status(200).json({
          message: msg
        });
      })
      .catch(error => {
        response.status(400).json(error);
      });
  }

/*Create new user */
const createUser = (request, response) => {
    const { username, email, password, role } = request.body
  
    db.one('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, created_at, updated_at', [username, email, password, role])
    .then(data => {
      const msg = 'User with id: ' + data.user_id + ' was created';
      const user = {
        user_id: data.user_id,
        username: username,
        email: email,
        role: role,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      jwt.sign(user, 'topSecret', {expiresIn: '1d'}, (err, token) => {
        response.status(201).json({
          message: msg,
          token
        });
      });
    })
    .catch(error => {
      response.status(400).json(error);
    });
  }

const deleteUser = (request, response) => {
    const {user_id} = request.body
  
    db.none(
      'UPDATE users SET active = 0, updated_at = $1 WHERE user_id = $2',
      [getCurrentDateTime(), user_id]) //active means 1, 0 means inactive=>deleted
      .then(data => {
        const msg = 'User with id: '+ user_id + ' was set to inactive' ;
        response.status(200).json({
          message: msg
        });
      })
      .catch(error => {
        response.status(400).json(error);
      });
  }
//END USER QUARIES//
//----------------//

const validate = (request, response) => {
  response.json({msg: 'test'});
}

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    createUser,
    deleteUser,
    validate
}