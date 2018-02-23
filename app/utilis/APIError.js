const httpStatus = require('http-status');
/**
   * Class representing an API error.
   * @extends ExtendableError
   */
class APIError {
	/**
	 * Creates an API error.
	 * @param {string} message - Error message.
	 * @param {number} status - HTTP status code of error.
	 * @param {boolean} isPublic - Whether the message should be visible to user or not.
	 */
	constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = true) {
		this.message = message
		this.status = status
		this.isPublic = isPublic
	}
}

module.exports = APIError;