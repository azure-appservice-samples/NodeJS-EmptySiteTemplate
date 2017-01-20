var debug = require('util').debuglog('eligible');

/** @constructor */
function Config(key) {
  /*
  @private
  */
  this._apiVersion = 'v1.5';

  /*
  @private
  */
  Object.defineProperty(this, '_apiKey', {
    enumerable: false,
    writable: true,
    value: null,
  });
  /*
  @private
  */
  this._isTest = false;

  /*
  @const
  */
  Object.defineProperty(this, 'API_BASE', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: 'https://gds.eligibleapi.com',
  });

  if (typeof key === 'string') {
    this.setApiKey(key);
  } else if (typeof key === 'object') {
    this.setApiKey(key.apiKey || null);
    this.setTest(key.isTest || false);
  } else if (typeof key === 'undefined') {
    this.setApiKey(process.env.ELIGIBLE_API_KEY);
    this.setTest(Boolean(process.env.ELIGIBLE_IS_TEST));
  }
}

Config.prototype.setApiKey = function(key) {
  this._apiKey = key;
  debug('apiKey %s', this._apiKey);
  return this;
};

Config.prototype.getApiKey = function() {
  return this._apiKey;
};

Config.prototype.getApiBase = function() {
  return this.API_BASE;
};

Config.prototype.getApiVersion = function() {
  return this._apiVersion;
};

Config.prototype.setApiVersion = function(version) {
  this._apiVersion = version;
  return this;
};

Config.prototype.setTest = function(value) {
  this._isTest = Boolean(value);
  return this;
};

Config.prototype.isTest = function() {
  return this._isTest;
};

module.exports = Config;
