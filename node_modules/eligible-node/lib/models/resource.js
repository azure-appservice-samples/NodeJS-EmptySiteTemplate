var extend = require('extend');

function Resource(attributes) {
  extend(this, attributes);
}

module.exports = Resource;
