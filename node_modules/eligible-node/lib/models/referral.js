var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');

module.exports = function(config) {

  function Referral(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(Referral, Resource);

  Referral.create = function(params) {
    return request('post', 'referral/create', params, config)
      .then(function(json) {
        return new Referral(json);
      });
  };

  Referral.inquiry = function(params) {
    return request('get', 'referral/inquiry', params, config)
      .then(function(json) {
        return new Referral(json);
      });
  };

  return Referral;
};
