var Config = require('./http/config');
var errors = require('./errors');

function Eligible(config) {
  if (!(config instanceof Config)) {
    config = new Config(config);
  }
  var eligible = {
    config: config,
    Payer: require('./models/payer')(config),
    Coverage: require('./models/coverage')(config),
    Claim: require('./models/claim')(config),
    Payment: require('./models/payment')(config),
    Customer: require('./models/customer')(config),
    Referral: require('./models/referral')(config),
    Precertification: require('./models/precertification')(config),
    Enrollment: require('./models/enrollment')(config),
    X12: require('./models/x12')(config),
    Ticket: require('./models/ticket')(config),
  };
  return eligible;
}

Eligible.Config = Config;
Object.keys(errors).forEach(function(errorType) {
  Eligible[errorType] = errors[errorType];
});

module.exports = Eligible;
