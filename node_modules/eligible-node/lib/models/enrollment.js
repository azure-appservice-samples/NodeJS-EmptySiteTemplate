var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');
var errors = require('../errors');
var Promise = require('bluebird');
var fs = require('fs');

module.exports = function(config) {

  function Enrollment(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(Enrollment, Resource);

  Enrollment.create = function(params) {
    return request('post', 'enrollment_npis', params, config)
      .then(function(json) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        return new Enrollment(json.enrollment_npi);
      });
  };

  Enrollment.all = function(params) {
    return request('get', 'enrollment_npis', params, config)
      .then(function(json) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        json.enrollment_npis = (json.enrollment_npis || [])
          .map(function(enrollment) {
            return new Enrollment(enrollment.enrollment_npi);
          });
        return json;
      });
  };

  Enrollment.get = function(enrollmentNpiId) {
    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    return request('get', 'enrollment_npis/' + enrollmentNpiId, {}, config)
      .then(function(json) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        return new Enrollment(json.enrollment_npi);
      });

  };

  Enrollment.update = function(enrollmentNpiId, params) {
    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }

    return request('put', 'enrollment_npis/' + enrollmentNpiId, params, config)
      .then(function(json) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        return new Enrollment(json.enrollment_npi);
      });

  };

  Enrollment.viewReceivedPDF = function(enrollmentNpiId) {
    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    return request(
      'get',
      'enrollment_npis/' + enrollmentNpiId + '/received_pdf',
      {}, config
    )
    .then(function(json) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      return new ReceivedPDF(json.received_pdf);
    });
  };

  Enrollment.downloadReceivedPDF = function(enrollmentNpiId) {
    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    return request(
      'download',
      'enrollment_npis/' + enrollmentNpiId + '/received_pdf/download',
      {}, config
    );
  };

  Enrollment.createOriginalSignaturePDF = function(enrollmentNpiId, params) {
    params = params || {};

    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    if (typeof params.file === 'undefined') {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'file is required',
          400
        ));
    }

    if (typeof params.file === 'string') {
      params.file = fs.createReadStream(params.file);
    }

    return request(
      'post',
      'enrollment_npis/' + enrollmentNpiId + '/original_signature_pdf',
      {
        formData: params,
      }, config
    ).then(function(json) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      return new OriginalSignaturePDF(json.original_signature_pdf);
    });
  };

  Enrollment.updateOriginalSignaturePDF = function(enrollmentNpiId, params) {
    params = params || {};

    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    if (typeof params.file === 'undefined') {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'file is required',
          400
        ));
    }

    if (typeof params.file === 'string') {
      params.file = fs.createReadStream(params.file);
    }

    return request(
      'put',
      'enrollment_npis/' + enrollmentNpiId + '/original_signature_pdf',
      {
        formData: params,
      }, config
    ).then(function(json) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      return new OriginalSignaturePDF(json.original_signature_pdf);
    });
  };

  Enrollment.viewOriginalSignaturePDF = function(enrollmentNpiId) {
    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    return request(
      'get',
      'enrollment_npis/' + enrollmentNpiId + '/original_signature_pdf',
      {}, config
    )
    .then(function(json) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      return new OriginalSignaturePDF(json.original_signature_pdf);
    });
  };


  Enrollment.deleteOriginalSignaturePDF = function(enrollmentNpiId) {
    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    return request(
      'delete',
      'enrollment_npis/' + enrollmentNpiId + '/original_signature_pdf',
      {}, config
    )
    .then(function(json) {
      return json;
    });
  };

  Enrollment.downloadOriginalSignaturePDF = function(enrollmentNpiId) {
    if (!enrollmentNpiId) {
      return new Promise.reject(
        new errors.InvalidRequestError(
          'enrollment_npi_id is required',
          400
        ));
    }
    return request(
      'download',
      'enrollment_npis/' + enrollmentNpiId + '/original_signature_pdf/download',
      {}, config
    );
  };


  function ReceivedPDF(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(ReceivedPDF, Resource);

  Enrollment.ReceivedPDF = ReceivedPDF;

  function OriginalSignaturePDF(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(OriginalSignaturePDF, Resource);
  Enrollment.OriginalSignaturePDF = OriginalSignaturePDF;

  return Enrollment;
};
