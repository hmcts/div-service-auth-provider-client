/* eslint-env mocha */
const { assert } = require('chai');
const sinon = require('sinon');
const request = require('request-promise-native');
const jwt = require('jsonwebtoken');

const serviceAuthProviderClient = require('../index');

const millisecondsToSeconds = 1000;

describe('serviceAuthProviderClient', () => {
  let client = {}, options = {};

  before(() => {
    sinon.stub(request, 'post');
    sinon.stub(jwt, 'decode');
  });

  beforeEach(() => {
    options = {
      apiBaseUrl: 'http://base-url',
      microservice: 'service_name',
      secret: 'VeryVerySecretString'
    };
    client = serviceAuthProviderClient.init(options);
  });

  afterEach(() => {
    request.post.reset();
    jwt.decode.reset();
  });

  after(() => {
    request.post.restore();
    jwt.decode.restore();
  });

  it('checks for Service name', () => {
    // Arrange.
    const clientWithMissingMicroservice = () => {
      return serviceAuthProviderClient.init({ secret: 'some-secret' });
    };
    // Assert.
    assert.throws(clientWithMissingMicroservice);
  });

  it('checks for secret', () => {
    // Arrange.
    const clientWithMissingService = () => {
      return serviceAuthProviderClient.init({ microservice: 'some-service' });
    };
    // Assert.
    assert.throws(clientWithMissingService);
  });

  describe('#lease', () => {
    it('makes the request according to contract', () => {
      // Act.
      client.lease();
      // Assert.
      const { args } = request.post.getCall(0);
      assert.equal(args[0].uri, `${options.apiBaseUrl}/lease`);
      assert.equal(args[0].body.microservice, options.microservice);
      assert.match(args[0].body.oneTimePassword, /^\d{6}$/);
    });
  });

  describe('#isTokenExpired', () => {
    it('throws when token is empty (decodes to null)', () => {
      // Arrange.
      jwt.decode.returns(null);
      const isTokenExpiredWithNullToken = () => {
        return client.isTokenExpired();
      };
      // Assert.
      assert.throws(isTokenExpiredWithNullToken);
    });

    it('throws when token is invalid (does not have an expiry set)', () => {
      // Arrange.
      jwt.decode.returns({ foo: 'bar' });
      const isTokenExpiredWithInvalidToken = () => {
        return client.isTokenExpired();
      };
      // Assert.
      assert.throws(isTokenExpiredWithInvalidToken);
    });

    it('returns false when not expired', () => {
      // Arrange.
      // Token valid for 1 hour
      const oneHourInSeconds = 3600;
      jwt.decode.returns(
        { exp: (new Date() / millisecondsToSeconds) + oneHourInSeconds }
      );
      // Act
      const output = client.isTokenExpired();
      // Assert.
      assert.isFalse(output);
    });

    it('returns true when expired', () => {
      // Arrange.
      // Token expired 1 second ago
      jwt.decode.returns(
        { exp: (new Date() / millisecondsToSeconds) - 1 }
      );
      // Act
      const output = client.isTokenExpired();
      // Assert.
      assert.isTrue(output);
    });
  });
});
