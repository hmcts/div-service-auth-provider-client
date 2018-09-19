# Client library for service-auth-provider service

Client library to obtain service to service call tokens.

## Requirements

* Node >=8.0
* yarn



## Installation

As of now, this module is published only in a private repository.
We are working on publishing this project to NPM.
Until then, the package can be installed from its github URL, examples:

```bash
# Install the latest version
yarn add https://github.com/hmcts/div-service-auht-provider-client

# Install a specific version
yarn add https://github.com/hmcts/div-service-auth-provider-client#2.1.4
```


## Usage

First get a client

```es6
const serviceAuthProviderClient = require('@hmcts/div-service-auth-provider-client')

const client = serviceAuthProviderClient.init({
  apiBaseUrl: 'https://service-auth-provider-api:4502', // Base URL of service-auth-provider API
  microservice: 'reference', // The name of the IDAM service role
  secret: 'AAAAAAAAAAAAAAAA' // Service secret
})
```


### Obtain a token

```es6
client.lease()
  .then(token => {
    // The response payload contains the token in plain text.
    console.log(token)
  })
  .catch(err => {
    // Or an error in case of an error.
    console.error(err)
  })
```


### Check if a token is expired

```es6
client.isTokenExpired(token) // true if expired, false otherwise.
```


## Implementation notes

### Token expiry

Tokens returned contain an expiry date as a unix timestamp under `exp`. Ideally, this expiry date should be respected
and the token should be renewed using the lease method. 


### Service secrets

The service needs to be registered with IDAM and a secret is required in order to generate a token.

For early implementations where IDAM registration has not finished yet, the reference details (microservice, secret) can
be used from the above example.
