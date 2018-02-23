'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const APIError = require('../../utilis/APIError');
const httpStatus = require('http-status');
/**
 * User Schema
 */

const UserSchema = new Schema({
	username: { type: String, required:true,unique:true},
	email: { type: String},
	realname: { type: String},
	role: { type: String, default: 'USER'},
	hashed_password: { type: String},
	salt: { type: String}
}, {
	timestamps: {}
});

const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

UserSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

/**
 * Validations
 */

// the below 5 validations only apply if you are signing up traditionally

// UserSchema.path('username').validate(function (name) {
// 	const User = mongoose.model('User');
// 	// Check only when it is a new user or when email field is modified
// 	if (this.isNew || this.isModified('username')) {
// 		User.find({ username: name }).exec(function (err, users) {
// 			return !err && users.length === 0;
// 		});
// 	} else return true;
// }, 'username already exists');



/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.password)) {
		next(new Error('Invalid password'));
	} else {
		next();
	}
});

/**
 * Methods
 */

UserSchema.methods = {

	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */

	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */

	makeSalt: function () {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */

	encryptPassword: function (password) {
		if (!password) return '';
		try {
			return crypto
				.createHmac('sha1', this.salt)
				.update(password)
				.digest('hex');
		} catch (err) {
			return '';
		}
	}
};

/**
 * Statics
 */

UserSchema.statics = {

	/**
	 * Load
	 *
	 * @param {Object} options
	 * @param {Function} cb
	 * @api private
	 */

	load: function (options, cb) {
		options.select = options.select || 'username realname';
		return this.findOne(options.criteria)
			.select(options.select)
			.exec(cb);
	},
	/**
	 * 根据用户名查找
	 * @param {string} name 
	 */
	getByUsername(name) {
		return this.findOne({username:name})
			.exec()
			.then((user) => {
				if (user) return user;
				const err = new APIError('用户名不存在', httpStatus.NOT_FOUND);
				return Promise.reject(err);
			});
	},
	/**
  * Get user
  * @param {ObjectId} id - The objectId of user.
  * @returns {Promise<User, APIError>}
  */
	getById(id) {
		return this.findById(id)
			.exec()
			.then((user) => {
				if (user) {
					return user;
				}
				const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
				return Promise.reject(err);
			});
	},

	/**
	 * List users in descending order of 'createdAt' timestamp.
	 * @param {number} skip - Number of users to be skipped.
	 * @param {number} limit - Limit number of users to be returned.
	 * @returns {Promise<User[]>}
	 */
	list({ skip = 0, limit = 50 } = {}) {
		return this.find()
			.sort({ createdAt: -1 })
			.skip(+skip)
			.limit(+limit)
			.exec();
	}
};

module.exports = mongoose.model('User', UserSchema);