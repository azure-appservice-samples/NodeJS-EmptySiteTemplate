var inherits = require('util').inherits;

/**
 * Eligible base error constructor.
 */
function EligibleError(message, code) {
  Error.call(this);
  code = code || 0;
  this.message = message;
  this.code = code;
  this.name = this.constructor.name;
  Error.captureStackTrace(this, this.constructor);
}
inherits(EligibleError, Error);
exports.EligibleError = EligibleError;

/**
 * Connection exception to API endpoint.
 */
function APIConnectionError(message, code) {
  EligibleError.call(this, message, code);
}
inherits(APIConnectionError, EligibleError);
exports.APIConnectionError = APIConnectionError;

/**
 * Internal API exception.
 */
function APIResponseError(message, code, response) {
  EligibleError.call(this, message, code);
  this.response = response;
}
inherits(APIResponseError , EligibleError);
exports.APIResponseError  = APIResponseError ;

/**
 * Internal API exception.
 */
function APIError(message, code, response) {
  EligibleError.call(this, message, code);
  this.response = response;
}
inherits(APIError, EligibleError);
exports.APIError = APIError;

/**
 * Exception while authenticating.
 */
function AuthenticationError(message, code, response) {
  EligibleError.call(this, message, code);
  this.response = response;
}
inherits(AuthenticationError, EligibleError);
exports.AuthenticationError = AuthenticationError;

/**
 * Invalid or Incomplete request exception.
 */
function InvalidRequestError(message, code, response) {
  EligibleError.call(this, message, code);
  this.response = response;
}
inherits(InvalidRequestError, EligibleError);
exports.InvalidRequestError = InvalidRequestError;
