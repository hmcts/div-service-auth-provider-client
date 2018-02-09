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
  const form = {
    microservice,
    oneTimePassword
  };

  return request.post({ uri, form });
};

module.exports = lease;
