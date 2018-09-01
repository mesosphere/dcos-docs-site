---
layout: layout.pug
navigationTitle:
excerpt: DC/OS Prometheus Security
title: Security
menuWeight: 50
model: /services/couchbase/data.yml
render: mustache
---


Refer to the [Couchbase documentation](https://developer.couchbase.com/documentation/server/current/security/security-x509certsintro.html).


# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.

**Note**: These security features are only available on DC/OS Enterprise 1.10 and later.

## Transport Encryption

With transport encryption enabled, DC/OS {{ model.techName }} will automatically deploy all nodes with the correct configuration to encrypt communication via SSL.

**Note**: Couchbase server currently supports TLS for client interactions and cross data center replication. There is no TLS for the node to node communication. See the [couchbase documentation](https://developer.couchbase.com/documentation/server/current/security/security-x509certsintro.html) for more details.

The service uses the [DC/OS CA](/latest/security/ent/tls-ssl/) to generate the SSL artifacts that it uses to secure the service. Any client that trusts the DC/OS CA will consider the service's certificates valid.

#include /services/include/security-configure-transport-encryption.tmpl


#### Secure ports

**Note**: http port are left open ...

The secure ports are ...

#### Verify Transport Encryption Enabled


## Authentication

DC/OS {{ model.techName }} supports ...

[authentication](https://developer.couchbase.com/documentation/server/current/security/security-authentication.html)

## Authorization

The DC/OS {{ model.techName }} service supports ...

[authorization](https://developer.couchbase.com/documentation/server/current/security/security-authorization.html)
