---
layout: layout.pug
navigationTitle: Limitations
excerpt: Known limitations of the DC/OS Apache HDFS service
title: Limitations
menuWeight: 190
model: /services/hdfs/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl
#include /mesosphere/dcos/services/include/limitations-regions.tmpl

## JVM Options

Custom JVM options are not currently supported in this or previous versions.

## Security

### Toggling Kerberos

Kerberos authentication cannot be toggled (enabled/disabled). In order to enable or disable Kerberos, the service must be uninstalled and reinstalled with the desired configuration.

### Toggling Transport Encryption

Transport Encryption (TLS) cannot toggled (enabled/disabled). In order to enable or disable TLS, the service must be uninstalled and reinstalled with the desired configuration.
