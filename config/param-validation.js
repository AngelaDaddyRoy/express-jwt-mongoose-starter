const joi = require('joi');

module.exports = {
	createOrLoginUser: {
		body: {
			username: joi.string().required(),
			password:joi.string().required()
		}
	},
	updateUser: {
		body: {
			username: joi.string().required(),
			password: joi.string().required()
		},
		params:{
			userId: joi.string().hex().required()
		}
	}
}