const request = require('request-promise-native');
const otp = require('otp');

/**
 * Obtain a service token
 *
 * @param {Object} options
 *
 * @returns {Promise} Request promise as returned by request-promise-native
 */
const lease = (options = {}) => {
  const uri = `${options.apiBaseUrl}/lease`;
  const { microservice, secret } = options;
  const oneTimePassword = otp({ secret }).totp();
  const body = {
    microservice,
    oneTimePassword
  };

  return request.post({ uri, body, json: true });
};

module.exports = lease;
