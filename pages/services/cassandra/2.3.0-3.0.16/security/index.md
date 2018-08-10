---
layout: layout.pug
navigationTitle:
excerpt: Securing your service
title: Security
menuWeight: 50
model: /services/cassandra/data.yml
render: mustache
enterprise: true
---

# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service allows Enterprise DC/OS users to configure secure service accounts, with permissions that allow access to DC/OS functions. At this time, {{ model.techName }}'s authentication and authorization features are not supported.

The DC/OS {{ model.techName }} service supports {{ model.techName }}'s native transport encryption mechanisms. The service provides automation and orchestration to simplify the usage of these important features.

**Note:** These security features are only available on DC/OS Enterprise 1.10 and later.


#include /services/include/service-account.tmpl

#include /services/include/security-create-permissions.tmpl

# <a name="transport_encryption"></a> Transport Encryption

#include /services/include/security-transport-encryption-lead-in.tmpl

#include /services/include/security-configure-transport-encryption.tmpl

**Note:** It is possible to update a running DC/OS {{ model.techName }} service to enable transport encryption after initial installation, but the service may be unavailable during the transition. Additionally, your clients will need to be reconfigured unless `service.security.transport_encryption.allow_plaintext` is set to `true`.

#include /services/include/security-transport-encryption-clients.tmpl
