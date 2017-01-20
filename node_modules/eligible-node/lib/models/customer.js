var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');
var errors = require('../errors');
var Promise = require('bluebird');

module.exports = function(config) {

  function Customer(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(Customer, Resource);

  Customer.create = function(params) {
    return request('post', 'customers', params, config)
      .then(function(json) {
        return new Customer(json.customer);
      });
  };

  Customer.all = function(params) {
    return request('get', 'customers', params, config)
      .then(function(json) {
        json.customers = (json.customers || []).map(function(customer) {
          return new Customer(customer.customer);
        });
        return json;
      });
  };

  Customer.get = function(customerId) {
    if (!customerId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'customer_id is required',
          400
        ));
    }
    return request('get', 'customers/' + customerId, {}, config)
      .then(function(json) {
        return new Customer(json.customer);
      });

  };

  Customer.update = function(customerId, params) {
    if (!customerId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'customer_id is required',
          400
        ));
    }

    return request('put', 'customers/' + customerId, params, config)
      .then(function(json) {
        return new Customer(json.customer);
      });

  };

  return Customer;
};
