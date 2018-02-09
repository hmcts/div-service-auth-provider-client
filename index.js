const lease = require('./src/lease');
const isTokenExpired = require('./src/is-token-expired');

const serviceAuthProviderClient = {
  /**
   * Create a service authentication provider client
   *
   * @param {Object} options Options set with the following properties:
   *  - apiBaseUrl: URL of the payment-api service
   *  - microservice: The name of the service role to get the token for
   *  - secret: Service secret used to generate the one time password with
   *
   * @returns {{lease: (function(): Promise), isTokenExpired: (function(...[*]): boolean)}}
   */
  init: (options = {}) => {
    if (!options.microservice) {
      throw new Error('The name of the service must be set');
    }
    if (!options.secret) {
      throw new Error('Secret must be set');
    }

    return {
      lease: (...args) => {
        return lease(options, ...args);
      },
      isTokenExpired: (...args) => {
        return isTokenExpired(...args);
      }
    };
  }
};

module.exports = serviceAuthProviderClient;
