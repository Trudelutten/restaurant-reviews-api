const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userQueries = require('../queries/userQueries');
const db = require('../queries/connection');



const login = (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    db.one('SELECT * FROM users WHERE username = $1', [username])
      .then(data => {
        const user = {
          user_id: data.user_id,
          username: data.username,
          email: data.email,
          created_at: data.created_at,
          updated_at: data.updated_at,
          role: data.role,
          active: data.active
        };
        jwt.sign({user}, 'secretKey', { expiresIn: '1d' }, (err, token) => {
          res.json({token});
        });
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        res.json(error);
      });
  }
}

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = {
  login,
  verifyToken
};