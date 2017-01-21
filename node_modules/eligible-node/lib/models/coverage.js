var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');

module.exports = function(config) {

  function Coverage(attributes) {
    Resource.call(this, attributes);
  }

  Coverage.all = function(params) {
    return request('get', 'coverage/all.json', params, config)
      .then(function(json) {
        return new Coverage(json);
      });
  };
  Coverage.medicare = function(params) {
    return Medicare.all(params);
  };
  Coverage.costEstimates = function(params) {
    return CostEstimates.all(params);
  };

  util.inherits(Coverage, Resource);

  /*
    Medicare Resource
  */

  function Medicare(attributes) {
    Resource.call(this, attributes);
  }

  Medicare.all = function(params) {
    return request('get', 'coverage/medicare.json', params, config)
      .then(function(json) {
        return new Medicare(json);
      });
  };

  util.inherits(Medicare, Resource);
  Coverage.Medicare = Medicare;

  /*
    CostEstimates Resource
  */

  function CostEstimates(attributes) {
    Resource.call(this, attributes);
  }

  CostEstimates.all = function(params) {
    return request('get', 'coverage/cost_estimates.json', params, config)
      .then(function(json) {
        return new CostEstimates(json);
      });
  };

  util.inherits(CostEstimates, Resource);
  Coverage.CostEstimates = CostEstimates;

  return Coverage;
};
