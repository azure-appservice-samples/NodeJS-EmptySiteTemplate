var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');
var errors = require('../errors');
var Promise = require('bluebird');

module.exports = function(config) {

  function Payer(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(Payer, Resource);

  Payer.retrieve = function(payerId) {
    if (!payerId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'payer_id is required',
          400
        ));
    }
    return request(
      'get',
      'payers/' + payerId,
      {},
      config
    ).then(function(json) {
      return new Payer(json);
    });
  };

  Payer.all = function(params) {
    return request('get', 'payers', params, config)
      .then(function(json) {
        return json.map(function(payer) {
          return new Payer(payer);
        });
      });
  };

  Payer.searchOptions = function(payerId) {
    // jshint camelcase: false
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    if (payerId) {
      return new Payer({payer_id: payerId}).searchOptions();
    }
    return request('get', 'payers/search_options', {}, config)
      .then(function(json) {
        return json;
      });
  };

  Payer.prototype.searchOptions = function() {
    // jshint camelcase: false
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    return request(
      'get',
      'payers/' + this.payer_id + '/search_options',
      {}, config
    )
    .then(function(json) {
      return json;
    });
  };
  return Payer;
};
