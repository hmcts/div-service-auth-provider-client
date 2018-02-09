const jwt = require('jsonwebtoken');

/**
 * Check if a token is expired
 *
 * @param {string} token
 * @returns {boolean}
 */
const isTokenExpired = token => {
  const decoded = jwt.decode(token);
  if (decoded === null || !decoded.exp) {
    throw new Error('Invalid token format');
  }

  const secondsToMilliseconds = 1000;
  return (parseInt(decoded.exp) * secondsToMilliseconds) - new Date() <= 0;
};

module.exports = isTokenExpired;
