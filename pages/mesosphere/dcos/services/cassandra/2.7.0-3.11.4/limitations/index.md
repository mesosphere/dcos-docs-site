---
layout: layout.pug
navigationTitle: Limitations
excerpt: Limitations on backups, node counts, security
title: Limitations
menuWeight: 100
model: /mesosphere/dcos/services/cassandra/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl
#include /mesosphere/dcos/services/include/limitations-regions.tmpl

## JVM options

Custom JVM options are not currently supported in this version or earlier versions.

## Backup/Restore

The service does not support performing backup and restore with authentication/authorization enabled in this version or earlier versions.

## Node Count

The DC/OS {{ model.techName }} service must be deployed with at least {{ model.minNodeCount }} nodes.

### Toggling Transport Encryption

Transport encryption using TLS can be toggled (enabled/disabled), but will trigger a rolling restart of the cluster. As each node restarts, a client may lose connectivity based on its security settings and the value of the `service.security.transport_encryption.allow_plaintext` configuration option. You should make backups and schedule downtime.

In order to enable TLS, a service account and corresponding secret is required. Since it is not possible to change the service account used by a service, it is recommended that the service is deployed with an explicit service account to allow for TLS to be enabled at a later stage.

## Data Center Name

The name of the data center cannot be changed after installation. `service.data_center` and `service.rack` options are not allowed to be modified once {{ model.techName }} is installed.

```
"service": {
...
        data_center": {
          "description": "The name of the data center this cluster is running in",
          "type": "string",
          "default": "datacenter1"
        },
        "rack": {
          "description": "The name of the rack this cluster is running on",
          "type": "string",
          "default": "rack1"
        },
...
}
```
