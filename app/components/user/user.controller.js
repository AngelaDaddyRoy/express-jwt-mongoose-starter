/*
 * @Author: AngelaDaddy 
 * @Date: 2018-02-21 16:42:21 
 * @Last Modified by: AngelaDaddy
 * @Last Modified time: 2018-02-23 09:10:24
 * @Description: User controller
  */
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const APIError = require('../../utilis/APIError');
const config = require('../../../config/config');

function create(req, res, next) {
	const user = new User({
		username: req.body.username,
		password: req.body.password
	});

	user.save()
		.then(savedUser => res.json(savedUser))
		.catch(e => next(e));
}
function login(req, res, next) {
	User.getByUsername(req.body.username).then((user) => {
		if (user) {
			if (user.authenticate(req.body.password)) {
				const token = jwt.sign({
					username: user.username,
					role: user.role
				}, config.JWT_SECRET);
				return res.json({
					token,
					user
				});
			}
			return next(new APIError('密码错误'));
		}
	}).catch((err) => {
		return next(err);
	});
}
function list(req, res) {
	User.list({}).then(result => {
		res.send(result);
	})
}
function getById(req, res) {
	User.getById(req.params.id).then(result => {
		res.send(result);
	})
}
function update(req, res, next) {
	User.getById(req.params.id).then(result => {
		if (result) {
			result.username = req.body.username;
			result.password = req.body.password;
			result.email = req.body.email;
			result.realname = req.body.realname;
			result.role = req.body.role;
			result.save()
				.then(savedUser => res.json(savedUser))
				.catch(e => next(e));
		}
		else {
			next(new APIError('用户不存在'));
		}
	})
}
module.exports = { create, login, list, getById, update };
