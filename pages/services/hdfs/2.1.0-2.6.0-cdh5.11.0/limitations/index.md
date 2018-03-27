---
layout: layout.pug
navigationTitle:
excerpt:
title: Limitations
menuWeight: 100
model: /services/hdfs/data.yml
render: mustache
---

<!-- Imported from https://github.com/mesosphere/dcos-commons.git:sdk-0.40 -->


#include /services/include/limitations.tmpl

## Zones

DC/OS Zones allow the service to implement rack-awareness. When the service is deployed with some zone configuration (or lack thereof), it cannot be upgraded/downgraded to another zone configuration.

## Security

### Toggling Kerberos

Kerberos authentication cannot be toggled (enabled / disabled). In order to enable or disable Kerberos, the service must be uninstalled and reinstalled with the desired configuration.

### Toggling Transport Encryption

Transport Encryption (TLS) cannot toggled (enabled / disabled). In order to enable or disable TLS, the service must be uninstalled and reinstalled with the desired configuration.
