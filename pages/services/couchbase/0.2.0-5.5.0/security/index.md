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

Service account and service account secret plus enabling TLS can also be configured when launching the couchbase service via the DC/OS console.

#### Secure ports

Couchbase uses the following ports, see `(SSL)`
```
8091: Couchbase Web console, REST/HTTP interface
8092: Views, queries, XDCR
8093: Query services (4.0+)
8094: Full-text Search (4.5+)
8095: Analytics (5.5+)
8096: Eventing (5.5+)
11207: Smart client library data node access (SSL)
11210: Smart client library/moxi data node access
11211: Legacy non-smart client library data node access
18091: Couchbase Web console, REST/HTTP interface (SSL)
18092: Views, query, XDCR (SSL)
18093: Query services (SSL) (4.0+)
18094: Full-text Search (SSL) (4.5+)
18095: Analytics (SSL) (5.5+)
18096: Eventing (SSL) (5.5+)
```

**Note**: Even if TLS is enabled the none TLS couchbase ports stay open.

The important ports for clients to interact with couchbase are 8091 (none-SSL) and 18091 (SSL).

#### TLS and Couchbase Sync Gateway

The Couchbase Sync Gateway also supports TLS on its inbound side. The following two lines have to be added to your gateway configuration.

```
SSLCert: node.crt
SSLKey: node.key
...
```

## Authentication

DC/OS couchbase service supports the couchbase native authentication mechanism. More details can be found [here](https://developer.couchbase.com/documentation/server/current/security/security-authentication.html).

**Note**: None native methods like LDAP and PAM are not supported at this point.

## Authorization

DC/OS couchbase service supports the couchbase native authorization mechanism. More details can be found [here](https://developer.couchbase.com/documentation/server/current/security/security-authorization.html).
