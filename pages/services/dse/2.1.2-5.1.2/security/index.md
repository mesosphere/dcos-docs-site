---
layout: layout.pug
navigationTitle:
excerpt:
title: Security
menuWeight: 22
model: /services/dse/data.yml
render: mustache
---

<!-- Imported from https://github.com/mesosphere/dcos-commons.git:sdk-0.40 -->



# DC/OS {{ model.techName }} Security

The DC/OS {{ model.techName }} service supports {{ model.techShortName }}'s native transport encryption mechanisms. The service provides automation and orchestration to simplify the usage of these important features.

*Note*: These security features are only available on DC/OS Enterprise 1.10 and above.

## Transport Encryption

#include /services/include/security-transport-encryption-lead-in.tmpl

#include /services/include/security-configure-transport-encryption.tmpl

#include /services/include/security-transport-encryption-clients.tmpl
