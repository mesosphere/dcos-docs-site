---
layout: layout.pug
navigationTitle:
excerpt: Known limitations for the DC/OS Apache Kafka service
title: Limitations
menuWeight: 100
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl
#include /mesosphere/dcos/services/include/limitations-regions.tmpl

## Log Retention Bytes

The `disk` configuration value is denominated in MB. It is recommended that you set the configuration value `log_retention_bytes` to a value smaller than the indicated `disk` configuration. See the [Configuration](/mesosphere/dcos/services/kafka/2.5.0-2.1.0/configuration/) section for instructions on customizing these values.

## Security

### {{ model.techShortName }} CLI

When any security functions are enabled, the {{ model.techShortName }} service CLI sub-command `topic` will not function. While the service CLI convenience functions will not work, the tooling bundled with [{{ model.techName }}](https://cwiki.apache.org/confluence/display/KAFKA/System+Tools) and other tools that support the enabled security modes will work.


### Kerberos

When Kerberos is enabled, the broker VIP is disabled, as Kerberized clients will not be able to use it. This is because each {{ model.techShortName }} broker uses a specific Kerberos principal and cannot accept connections from a single unified principal which the VIP would require.

### Toggling Kerberos

Kerberos authentication can be toggled (enabled/disabled), but this triggers a rolling restart of the cluster. Clients configured with the old security settings will lose connectivity during and after this process. It is recommended that you back up your files and schedule downtime. 

### Toggling Transport Encryption

Transport encryption using TLS can be toggled (enabled/disabled), but this triggers a rolling restart of the cluster. As each broker restarts, a client may lose connectivity based on its security settings and the value of the `service.security.transport_encryption.allow_plaintext` configuration option. It is recommended that you back up your files and schedule downtime.

To enable TLS, a service account and corresponding secret is required. Since it is not possible to change the service account used by a service, we recommend that the service be deployed with an explicit service account, to allow for TLS to be enabled at a later stage.
