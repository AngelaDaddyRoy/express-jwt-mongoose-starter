const expressJwt = require('express-jwt');
const config =require('../../config/config');
const APIError = require('../utilis/APIError')

/**
 * 在路由上使用jwt验证
*/
const jwt = expressJwt({ secret: config.JWT_SECRET });

/**
 * 在路由上使用role 角色验证
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const admin = function(req,res,next){
	if(req.user && req.user.role==='ADMIN'){
		next();
	}
	else{
		next(new APIError('权限不足'));
	}
}
module.exports = {jwt,admin}