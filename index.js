const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidation = require('express-validation');
const APIError = require('./app/utilis/APIError');
const config = require('./config/config');
const httpStatus = require('http-status');
const cors = require('cors');
const app = express();
const routes = require('./app/routes');
/**
 * connect database
 */
mongoose.connect(config.MONGO_URL);
mongoose.connection.once('open', () => {
	console.log(`db ${config.MONGO_URL} connected!`)
})


app.use(bodyParser.json());
app.use(cors());
// root rooter
app.use('/api', routes);




//----------error handler------------------------------------
// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
	//if err is a APIError
	if (err instanceof APIError) {
		return next(err);
	}
	//else instantiate a APIError
	const apiError = new APIError(err.message, err.status, err.isPublic)
	return next(apiError);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new APIError('API not found', httpStatus.NOT_FOUND);
	return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	//if not a public error , simply display it in console
	if (!err.isPublic) {
		console.log(err);
		return next();
	}
	else {
		res.status(err.status).json({
			status: err.status,
			message: err.message
		})
	}
});


module.exports = app;