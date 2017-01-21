var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');

module.exports = function(config) {

  function Precertification(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(Precertification, Resource);

  Precertification.create = function(params) {
    return request('post', 'precert/create', params, config)
      .then(function(json) {
        return new Precertification(json);
      });
  };

  Precertification.inquiry = function(params) {
    return request('get', 'precert/inquiry', params, config)
      .then(function(json) {
        return new Precertification(json);
      });
  };

  return Precertification;
};
