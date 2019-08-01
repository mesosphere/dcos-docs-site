---
layout: layout.pug
navigationTitle:
excerpt: Using Spinnaker security features
title: Security
menuWeight: 50
model: /services/spinnaker/data.yml
render: mustache
---


# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.

<p class="message--note">NOTE: </strong>These security features are only available on DC/OS Enterprise 1.10 and later.</p>

Refer to the [Couchbase documentation](https://developer.couchbase.com/documentation/server/current/security/security-x509certsintro.html) for more detail.

## Transport Encryption

With transport encryption enabled, DC/OS {{ model.techName }} will automatically deploy all nodes with the correct configuration to encrypt communication via SSL.

<p class="message--note"><strong>NOTE:</strong> The current exception is the connections to Redis, which does not support TLS. A code change is required in the other services in the way they use Redis.</p>

The service uses the [DC/OS CA](/mesosphere/dcos/latest/security/ent/tls-ssl/) to generate the SSL artifacts that it uses to secure the service. Any client that trusts the DC/OS CA will consider the service's certificates valid.

#include /mesosphere/dcos/services/include/security-configure-transport-encryption.tmpl

Service account and service account secret plus enabling TLS can also be configured when launching the {{ model.serverName }} via the DC/OS console.

## Authentication

DC/OS {{ model.techName }} supports OAuth2 authentication mechanisms using G Suite, Github, or Azure.

<p class="message--note"><strong>NOTE: </strong>Other authentication mechanisms, such as LDAP, are currently not supported.</p>

## Authorization

DC/OS {{ model.techName }} service currently does not enable Fiat based authorization.
