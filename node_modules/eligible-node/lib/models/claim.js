var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');
var extend = require('extend');
var errors = require('../errors');
var Promise = require('bluebird');


module.exports = function(config) {

  function Claim(attributes) {
    Resource.call(this, attributes);
  }

  util.inherits(Claim, Resource);

  Claim.create = function(params) {
    return request('post', 'claims', params, config)
      .then(function(json) {
        json = extend(json, params); // Merge input json claim with response

        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        delete json.success;
        delete json.api_key;
        delete json.test;

        return new Claim(json);
      });
  };

  Claim.prototype.acknowledgements = function() {
    // jshint camelcase: false
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

    return Claim.getAcknowledgements(this.reference_id);

  };

  Claim.queryAcknowledgements = function(params) {
    return request('get', 'claims/acknowledgements', params, config)
      .then(function(json) {
        return json;
      });
  };

  Claim.getAcknowledgements = function(referenceId) {
    if (!referenceId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'reference_id is required',
          400
        ));
    }
    return request(
      'get',
      'claims/' + referenceId + '/acknowledgements',
      {},
      config
    ).then(function(json) {
      return json;
    });
  };

  Claim.prototype.paymentReports = function(paymentReportId) {
    // jshint camelcase: false
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

    return Claim.getPaymentReports(this.reference_id, paymentReportId);

  };

  Claim.getPaymentReports = function(referenceId, paymentReportId) {

    if (!referenceId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'reference_id is required',
          400
        ));
    }

    var path = 'claims/' + referenceId + '/payment_reports';

    if (paymentReportId) {
      path += '/' + paymentReportId;
    }

    return request(
      'get', path, {}, config).then(function(json) {
        return new PaymentReport(json);
      });
  };

  Claim.queryPaymentReports = function(params) {
    return request(
      'get',
      'claims/payment_reports',
      params,config
    ).then(function(json) {
      return json;
    });
  };

  Claim.realtime = function(params) {
    return request('post', 'claims/realtime', params, config);
  };


  /*
    Payment Report Resource
  */

  function PaymentReport(attributes) {
    Resource.call(this, attributes);
  }

  util.inherits(PaymentReport, Resource);
  Claim.PaymentReport = PaymentReport;

  return Claim;
};
