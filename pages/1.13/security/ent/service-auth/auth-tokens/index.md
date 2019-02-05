---
layout: layout.pug
navigationTitle:  Managing JSON Web Tokens
title: Managing JSON Web Tokens
menuWeight: 200
excerpt: Managing JSON web tokens

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# Refreshing Tokens
Services can use a variety of means to refresh their tokens. Ideally, a service should calculate the length of time until the token expires, which is embedded within the token itself, and request a new one before it expires. However, a service can also wait until it receives a `401` to request a new token.

You may need to provision a service with a service account depending on your [security mode](/1.13/security/ent/#security-modes) and the origin of the service's requests. 

An API consumer should be able to handle when its current authentication token expires.

-  **Post-Expiration Renewal** With this method, you obtain a new auth token after an "invalid token" response is received. An invalid authentication token is responded to with a 401 HTTP status code and the service re-invokes the service account login procedure. It attempts to get a fresh authentication token (with retry and back-off). During the period where the service has no valid authentication token, the service might need to hold back operations, resulting in latency spikes.
- **Pre-Expiration Renewal** With this method, the token is refreshed before it expires. The service can schedule asynchronous token renewal ahead of the expiration. It can fetch a new authentication token while the old one is still valid. This prevents the latency spikes caused by an expired authentication token.

# Out-of-band Verification of an RS256 Authentication JWT
DC/OS services can authenticate incoming requests on behalf of the [DC/OS Identity and Access Manager (Bouncer)](/1.13/overview/architecture/components/#dcos-iam) component, using public key cryptography. This works if the authentication token presented by the client has been signed by Bouncer using Bouncer's private key with the RS256 algorithm.

## Bouncer JSON Web Key Set (JWKS) endpoint
The Bouncer's JWKS endpoint (`/auth/jwks`) provides the public key details required for verifying the signature of type RS256 JWTs issued by Bouncer. The JSON document data structure emitted by that endpoint is compliant with [RFC 7517](https://tools.ietf.org/html/rfc7517). Within that data structure, the public key is parameterized according to [RFC 7518](https://tools.ietf.org/html/rfc7518).

Here is an example response:

```json
curl localhost:8101/acs/api/v1/auth/jwks
{
  "keys": [
    {
      "e": "AQAB",
      "use": "sig",
      "n": "7dYvibxUngEyfdut1uSYbRCCP5dT5MQyMfLyy_6o5x8PD-fUMgkm0vGUJAUoKimnkZ85aUmswaU3yAxQiZ8yeaoSpgUR4WJCRhOIEJ6Oyq4mjK06vr9-wJj5gVXDBaqbxD0yhgzMHEDyxg3EFOJ2ve73Vkg4p7pygA4fI_de1Bs6n68Hwt9LJ7B-fPg0PU8IdPe_4dYNuHT09KGxWSlq3m4KSvNxPIGQ8nNK9H3gjQaoBT9-hDXfsAgrQo7GenXRZTYW13KATtRAR5Vtd177iEeVefbK3HRj9IfYjYPnlBP2CZv_YIK-9H_33JPXxlDTFgI92l_JKRF-fPSa1EEkIw",
      "alg": "RS256",
      "kid": "49f795b26f80bec01f44b0f52e6ba6459ee2048fbb342f861f1a4e8ed4ebcb7f",
      "kty": "RSA"
    }
  ]
}
```

## Constructing the public key from the JWKS data
The two parameters that fully define an RSA public key are the modulus (`n`) and the exponent (`e`). Both are integers. In the previous example, the exponent parameter is encoded in the values of the `e`, and the modulus is encoded with the value of `n`.

The integers are "Base64urlUInt"-encoded. This encoding is specified by [RFC 7518](https://tools.ietf.org/html/rfc7518#section-6.3):

<blockquote>The representation of a positive or zero integer value as the base64url encoding of the value's unsigned big-endian representation as an octet sequence.  The octet sequence **must** utilize the minimum number of octets needed to represent the value.  Zero is represented as BASE64URL(single zero-valued octet), which is "AA".</blockquote>

For example, the value `AQAB` represents 65537.

Use the tool of your choice to generate the public key representation that you will need to validate the authentication token. Here is a Python example based on the cryptography module (which uses OpenSSL as its back-end). This example generates a public key object from a given exponent and modulus directly.

```python
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

# `modulus_int` and `exponent_int` are the two parameters defining
# an RSA public key. These are objects of type `int`.
public_numbers = rsa.RSAPublicNumbers(n=modulus_int, e=exponent_int)
public_key = public_numbers.public_key(backend=default_backend())
```

## Verifying the authentication token using the public key
This example uses the Python [PyJWT module](https://pyjwt.readthedocs.io/en/latest/), auth token verification, and extraction of the user ID:

```python
# `token` is the string holding the authentication token.
# `public_key` is an RSA public key object of the cryptography module.
payload = jwt.decode(token, public_key, algorithm='RS256')
uid = payload['uid']
```

The decode method verifies the token signature and expiration time and raises an exception if the token is invalid.

## Complete token verification example
This example invalidates an authentication token (an RS256 JWT). Here is the example token

```json
eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0Njc5ODU0NjYsInVpZCI6InBldGVyIn0.lsLJx2WsX99HF96CizMOcZpMIgbjGDBHvFZCGeNDsM-xZQzHQJHo_UA8WodQ52o8uBJ2CY983DhJdIH2Gfc_fbZtYGvUx-IvQnHFbUBd8qBN0A_4BQHeNINFUKdVQuJsbsW-uVj-w0q3RAFwO5DPPc2ppwIjkeQbgGP1ZN-2-uV6Jow04cdkq4jcODsD1y0v4EmIBPLQil0HU2B95IHtlBNN7haTUkCksXE-43BHy4ErboySeq6VgkwLpw_Pi8n236kZ2-GobSmhA-BpjbkO3uGLHrYUfJjrJyiPM2_PZQMHY80-m5sMMMQ9m1Ciag2Cw74JKGfJ3qMW3j3z2Hm7GQ
```

Here is Python code for performing the validation, following the instructions given above:

```python
>>> import jwt
>>> import requests
>>> from cryptography.hazmat.backends import default_backend
>>> from cryptography.hazmat.primitives.asymmetric import rsa
>>> from jwt.utils import base64url_decode, bytes_to_number

>>> keys = requests.get('http://localhost:8101/acs/api/v1/auth/jwks').json()['keys'][0]
>>> keys
{'kty': 'RSA', 'n': 'sybUYxu3TXxXAgG_Eq72tKxE7xhGFgL14g5OGryDtE5dBL8frAoSsI4D7tSKR2pLbOlT68YJbYLUHxoju0E_NB9htjKEsay4t3WXoXQ-XsDM4Zz22H6HfDG6CCcvGb2DoQP0R2je1HJDA56_BoR8shZMxHbrX1WgQURtGygMD7bQY95qmHZYRPlq13-pR5Jnu70OMmFlbl-_o-ag1JfndTJPtx75IalCgy_h_itHLDPhdTfypAJeiewCOUZd9nNa1j19M-xeqlZonlRABqiH0e-vQVWCeW5FZ0HJamIjd2VifhRCp0fSAgCdCQdrY6HdI3h6egpn6z4gwkwXBfczww', 'kid': '55fb61042768f62ea3b06778c6043f7c8c92769a0c248076a2995dfd50c4acb9', 'use': 'sig', 'alg': 'RS256', 'e': 'AQAB'}

>>> exponent_bytes = base64url_decode(keys['e'].encode('ascii'))
>>> exponent_int = bytes_to_number(exponent_bytes)

>>> modulus_bytes = base64url_decode(keys['n'].encode('ascii'))
>>> modulus_int = bytes_to_number(modulus_bytes)

>>> public_numbers = rsa.RSAPublicNumbers(n=modulus_int, e=exponent_int)
>>> public_key = public_numbers.public_key(backend=default_backend())

>>> authtoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE0Njc5ODU0NjYsInVpZCI6InBldGVyIn0.lsLJx2WsX99HF96CizMOcZpMIgbjGDBHvFZCGeNDsM-xZQzHQJHo_UA8WodQ52o8uBJ2CY983DhJdIH2Gfc_fbZtYGvUx-IvQnHFbUBd8qBN0A_4BQHeNINFUKdVQuJsbsW-uVj-w0q3RAFwO5DPPc2ppwIjkeQbgGP1ZN-2-uV6Jow04cdkq4jcODsD1y0v4EmIBPLQil0HU2B95IHtlBNN7haTUkCksXE-43BHy4ErboySeq6VgkwLpw_Pi8n236kZ2-GobSmhA-BpjbkO3uGLHrYUfJjrJyiPM2_PZQMHY80-m5sMMMQ9m1Ciag2Cw74JKGfJ3qMW3j3z2Hm7GQ"
>>> payload = jwt.decode(authtoken, public_key, algorithm='RS256')
>>> payload
{'uid': 'peter', 'exp': 1467985466}
```

The response indicates that this is a valid authentication token for `peter`.
