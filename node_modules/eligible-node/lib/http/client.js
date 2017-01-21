var Promise = require('bluebird'),
  extend = require('extend'),
  util = require('util'),
  https = require('https'),
  debug = util.debuglog('eligible'),
  Config = require('./config'),
  errors = require('../errors'),
  pkg = require('../../package.json'),
  os = require('os');

var request = require('request').defaults({
  headers: getDefaultHeaders(),
});

// Certificate fingerprints for gds.eligibleapi.com
var FINGERPRINTS = [
  '79:D6:2E:8A:9D:59:AE:68:73:72:F8:E7:13:45:C7:6D:92:52:7F:AC',
  '4B:2C:68:88:ED:E7:9D:0E:E4:73:39:DC:6F:AB:5A:6D:0D:C3:CB:0E',
];

function handleResponse(response, body) {
  var error;

  // Try parsing JSON
  try {
    body = JSON.parse(body);
  }
  catch (e) {
    // Invalid JSON for 200 status
    if (response.statusCode === 200 &&
    response.req.path.indexOf('x12') === -1) {
      return new Promise.reject(
        new errors.APIResponseError(e.message, response.statusCode, body)
      );
    }
  }

  if (response.statusCode === 401) {
    error = new Promise.reject(
      new errors.AuthenticationError('Authentication' +
      ' or authorization error. Mostly due to invalid api_key or provider' +
      ' need enrollment with payer.',response.statusCode, body)
    );
  } else if (response.statusCode === 404) {
    error = new Promise.reject(
      new errors.InvalidRequestError(
        'Not Found',
        response.statusCode,
        body
      ));
  } else if (response.statusCode === 400) {
    error = new Promise.reject(
      new errors.InvalidRequestError(
        'Bad request, invalid or missing parameters.',
        response.statusCode,
        body
      ));
  } else if (response.statusCode !== 200) {
    error = new Promise.reject(
      new errors.APIError(
        body,
        response.statusCode,
        body
      ));
  }
  if (error) {
    return error;
  }

  // Valid JSON response for 200 status

  // Sometimes, for 200 status code, there are errors for invalid parameters
  if ((body.errors || body.error) && !body.success) {
    return new Promise.reject(
      new errors.InvalidRequestError(
        'Bad request, invalid or missing parameters.',
        400,
        body
      ));
  }

  return new Promise.resolve(body);
}

function getDefaultHeaders() {
  var headers = {};
  headers.Accept = 'application/json';
  headers['Accept-Charset'] = 'UTF-8';
  headers['X-Eligible-Client-User-Agent'] = JSON.stringify({
    'os.name': os.platform(),
    'os.arch': os.arch(),
    'os.version': os.release(),
    'node.version': process.version,
    lang: 'nodejs',
  });
  return headers;
}

function getHeaders(config) {
  var headers = {};
  headers['User-Agent'] = 'eligible-node/' + pkg.version ;
  headers['Eligible-Version'] = config.getApiVersion();
  return headers;
}

function verifyFingerprint(response) {
  // Skip fingerprint verification for testing
  // Because `nock` doesn't save socker certs

  if (process.env.NODE_ENV === 'testing') {
    return;
  }

  var fingerprint = response.socket.getPeerCertificate().fingerprint;
  debug('fingerprint %s', fingerprint);
  if (FINGERPRINTS.indexOf(fingerprint) === -1) {
    response.request.abort();
    throw new errors.APIConnectionError('SSL fingerprint mismatch.');
  }
}

module.exports = function(method, uri, params, config) {
  params = params || {};

  if (!(config instanceof Config) || !config.getApiKey()) {
    return new Promise.reject(
      new errors.AuthenticationError('No API key provided.', 0)
    );
  }

  var url = config.getApiBase() + '/' + config.getApiVersion() + '/' + uri;
  // jshint camelcase: false
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  extend(params, {
    api_key: config.getApiKey(),
    test: String(config.isTest()),
  });
  var options = {
    headers: getHeaders(config),
    agent: new https.Agent({ maxCachedSessions: 0 }),
    strictSSL: true,
  };
  return module.exports[method](url, params, options);
};

module.exports.request = function(options) {
  debug('request params:', options);
  return new Promise(function(resolve, reject) {

    request(options, function(error, response, body) {
      if (error) {
        return reject(new errors.APIConnectionError(error.message));
      }
      return resolve(handleResponse(response, body));
    })
    .on('response', function(response) {
      try {
        verifyFingerprint(response);
      }
      catch (e) {
        reject(e);
      }
    });
  });
};

module.exports.get = function(url, params, options) {
  options.qs = params;
  options.url = url;
  options.method = 'GET';

  return module.exports.request(options);

};

module.exports.post = function(url, params, options) {
  options.body = JSON.stringify(params);
  options.url = url;
  options.method = 'POST';
  return module.exports.request(options);
};


module.exports.put = function(url, params, options) {
  options.body = JSON.stringify(params);
  options.url = url;
  options.method = 'PUT';

  return module.exports.request(options);
};


module.exports.delete = function(url, params, options) {
  options.qs = params;
  options.url = url;
  options.method = 'DELETE';

  return module.exports.request(options);
};

module.exports.download = function(url, params, options) {
  options.qs = params;
  options.url = url;
  options.method = 'GET';

  return new Promise(function(resolve, reject) {
    request(options)
    .on('response', function(response) {
      response.pause();
      try {
        verifyFingerprint(response);
        return resolve(response);
      }
      catch (err) {
        return reject(err);
      }
    })
    .on('error', function(err) {
      return reject(new errors.APIConnectionError(err.message));
    });
  });
};

module.exports.getHeaders = getHeaders;
