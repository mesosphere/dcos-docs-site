---
layout: layout.pug
navigationTitle:
excerpt:
title: Limitations
menuWeight: 100
model: /services/hdfs/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl
#include /mesosphere/dcos/services/include/limitations-regions.tmpl

## Security

### Toggling Kerberos

Kerberos authentication cannot be toggled (enabled / disabled). In order to enable or disable Kerberos, the service must be uninstalled and reinstalled with the desired configuration.

### Toggling Transport Encryption

Transport Encryption (TLS) cannot toggled (enabled / disabled). In order to enable or disable TLS, the service must be uninstalled and reinstalled with the desired configuration.
