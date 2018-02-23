const express = require('express');
const userController = require('./user.controller');
const auth = require('../../utilis/auth');
const validate = require('express-validation');
const paramValidation = require('../../../config/param-validation');

const router = express.Router();

/**
 * add/list user
 */
router.route('/')
	.post(userController.create)
	.get(auth.jwt,auth.admin,userController.list)
router.route('/:id')
	.get(auth.jwt,auth.admin,userController.getById)
	.put(auth.jwt,auth.admin,userController.update)
/**
 * login auth
 */
router.route('/login')
	.post(validate(paramValidation.createOrLoginUser), userController.login);

router.route('/jwttest').get(auth.jwt, (req, res) => {
	res.send('jwt wworks!');
});


module.exports = router;