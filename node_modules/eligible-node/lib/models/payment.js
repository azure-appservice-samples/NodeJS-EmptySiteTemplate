var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');

module.exports = function(config) {

  function Payment(attributes) {
    Resource.call(this, attributes);
  }

  Payment.status = function(params) {
    return request('get', 'payment/status.json', params, config)
      .then(function(json) {
        return new Payment(json);
      });
  };

  util.inherits(Payment, Resource);

  return Payment;
};
