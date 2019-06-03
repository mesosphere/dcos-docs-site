---
layout: layout.pug
navigationTitle:
excerpt: Using native transport encryption, authentication and authorization on Couchbase
title: Security
menuWeight: 50
model: /services/couchbase/data.yml
render: mustache
---


Refer to the [Couchbase documentation](https://developer.couchbase.com/documentation/server/current/security/security-x509certsintro.html).


# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s native transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.

<p class="message--note"><strong>NOTE: </strong>These security features are only available on DC/OS Enterprise 1.10 and later.</p> 


## Transport Encryption

With transport encryption enabled, DC/OS {{ model.techName }} will automatically deploy all nodes with the correct configuration to encrypt communication via SSL.

<p class="message--note"><strong>NOTE: </strong> Couchbase Server currently supports TLS for client interactions and cross data center replication. There is no TLS for node to node communication. See the [Couchbase documentation](https://developer.couchbase.com/documentation/server/current/security/security-x509certsintro.html) for more details.</p> 


The service uses the [DC/OS CA](/latest/security/ent/tls-ssl/) to generate the SSL artifacts that it uses to secure the service. Any client that trusts the DC/OS CA will consider the service's certificates valid.

#include /services/include/security-configure-transport-encryption.tmpl

Service account and service account secret plus enabling TLS can also be configured when launching the {{ model.serverName }} via the DC/OS console.

#### Secure ports

{{ model.techName }} uses the following ports, see `(SSL)`
```
8091: {{ model.techName }} Web console, REST/HTTP interface
8092: Views, queries, XDCR
8093: Query services (4.0+)
8094: Full-text Search (4.5+)
8095: Analytics (5.5+)
8096: Eventing (5.5+)
11207: Smart client library data node access (SSL)
11210: Smart client library/moxi data node access
11211: Legacy non-smart client library data node access
18091: {{ model.techName }} Web console, REST/HTTP interface (SSL)
18092: Views, query, XDCR (SSL)
18093: Query services (SSL) (4.0+)
18094: Full-text Search (SSL) (4.5+)
18095: Analytics (SSL) (5.5+)
18096: Eventing (SSL) (5.5+)
```

<p class="message--note"><strong>NOTE: </strong> Even if TLS is enabled, the non-TLS Couchbase ports stay open.</p> 




The important ports for clients to interact with {{ model.techName }} are 8091 (non-SSL) and 18091 (SSL).

#### TLS and {{ model.syncGatewayName }}

The {{ model.syncGatewayName }} also supports TLS on its inbound side. The following two lines must be added to your gateway configuration.

```
SSLCert: node.crt
SSLKey: node.key
...
```

## Authentication

DC/OS {{ model.techName }} supports the {{ model.techName }} native authentication mechanism. More details can be found [here](https://developer.couchbase.com/documentation/server/current/security/security-authentication.html).

<p class="message--note"><strong>NOTE: </strong> Non-native methods like LDAP and PAM are not supported at this time.</p> 




## Authorization

DC/OS {{ model.techName }} service supports the {{ model.techName }} native authorization mechanism. More details can be found [here](https://developer.couchbase.com/documentation/server/current/security/security-authorization.html).
