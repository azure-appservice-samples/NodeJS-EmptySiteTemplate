var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');
var https = require('https');

module.exports = function(config) {

  function X12(attributes) {
    Resource.call(this, attributes);
  }
  util.inherits(X12, Resource);

  X12.post = function(params) {
    return request('post', 'x12', params, config)
      .then(function(x12) {
        return x12;
      });
  };
  X12.mimePost = function(params) {
    return request.request({
      url: config.getApiBase() + '/' + config.getApiVersion() +
        '/' +  'mime_multipart/x12',
      method: 'POST',
      headers: request.getHeaders(config),
      agent: new https.Agent({ maxCachedSessions: 0 }),
      strictSSL: true,
      formData: {
        Payload: params? params.Payload : '',
        ApiKey: config.getApiKey(),
      },
    })
      .then(function(x12) {
        return x12;
      });
  };

  return X12;
};
