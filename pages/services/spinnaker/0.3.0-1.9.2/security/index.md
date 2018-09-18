---
layout: layout.pug
navigationTitle:
excerpt: Using native transport encryption, authentication and authorization on Couchbase
title: Security
menuWeight: 50
model: /services/spinnaker/data.yml
render: mustache
---


Refer to the [Couchbase documentation](https://developer.couchbase.com/documentation/server/current/security/security-x509certsintro.html).


# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports transport encryption, authentication, and authorization mechanisms. The service provides automation and orchestration to simplify the use of these important features.

<table class=“table note” bgcolor=#7d58ff>
<tr>
  <td align=justify style=color:white><strong>NOTE:</strong> These security features are only available on DC/OS Enterprise 1.10 and later.</td>
</tr>
</table>

## Transport Encryption

With transport encryption enabled, DC/OS {{ model.techName }} will automatically deploy all nodes with the correct configuration to encrypt communication via SSL.

<table class=“table note” bgcolor=#7d58ff>
<tr>
  <td align=justify style=color:white><strong>NOTE:</strong>The current exception is the connections to Redis. A code change is needed in the other services in the way they use Jedis.</td>
</tr>
</table>

The service uses the [DC/OS CA](/latest/security/ent/tls-ssl/) to generate the SSL artifacts that it uses to secure the service. Any client that trusts the DC/OS CA will consider the service's certificates valid.

#include /services/include/security-configure-transport-encryption.tmpl

Service account and service account secret plus enabling TLS can also be configured when launching the {{ model.serverName }} via the DC/OS console.

## Authentication

DC/OS {{ model.techName }} supports OAuth2 authentication mechanism using G Suite, github, or azure.

<table class=“table note” bgcolor=#7d58ff>
<tr>
  <td align=justify style=color:white><strong>NOTE:</strong> Other authentication mechanisms, e.g. LDAP, are currently not supported.</td>
</tr>
</table>



## Authorization

DC/OS {{ model.techName }} service currently does not enable Fiat based authorization.
