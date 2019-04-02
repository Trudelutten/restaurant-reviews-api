var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var pool = require('../queries/userQueries');
const userAuth = require('../auth/userAuth');
const db = require('../queries/connection');
const bcrypt = require('bcryptjs');

//TRY TO MAKE POST WORK
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())

/* GET users listing. */
router.get('/', pool.getUsers)

//Validate user
router.get('/validate', userAuth.verifyToken, (req, res) => {
	console.log('validate')
	jwt.verify(req.token, 'topSecret', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		}
		else {
			res.status(200).json(authData);
		}
	});
})

//Get user by user_id
router.get('/:id', pool.getUserById)

//Update user by user_id
router.put('/update', pool.updateUser)

//Delete user by user_id, by setting active to 0
router.put('/delete', pool.deleteUser)

//Create new user
router.post('/create', pool.createUser)

// Login user
router.post('/login', (request, response) => {
	const { username, password } = request.body;
	if (username && password) {
		db.one('SELECT * FROM users WHERE UPPER(username) LIKE UPPER($1)', [username])
			.then(data => {
				console.log(data);
				bcrypt.compare(password, data.password)
					.then(res => {
						const user = {
							user_id: data.user_id,
							username: username,
							email: data.email,
							role: data.role,
							created_at: data.created_at,
							updated_at: data.updated_at
						};

						jwt.sign(user, 'topSecret', { expiresIn: '1d' }, (err, token) => {
							if (err) response.json(err);
							
							response.status(200).json({
								message: 'Login successful',
								token
							});
						});
					})
					.catch(err => {
						console.log(err)
						res.status(403).json(error);
					});
			})
			.catch(error => {
				console.log('error');
				console.log(error);
				res.json(error);
			});
	}
})



module.exports = router;
