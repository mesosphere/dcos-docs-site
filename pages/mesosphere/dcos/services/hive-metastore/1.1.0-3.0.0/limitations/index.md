---
layout: layout.pug
navigationTitle: Limitations
excerpt: Limitations on backups, node counts, security
title: Limitations
menuWeight: 100
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl
#include /mesosphere/dcos/services/include/limitations-regions.tmpl

## Percona-MySQL

PXC Strict Mode is designed to avoid the use of experimental and unsupported features in Percona XtraDB Cluster. It performs a number of validations at startup and during runtime.

| PXC Strict Mode| Restrictions |
| -------------- | ------------ |
| DISABLED       | Do not perform strict mode validations and run as normal. |
| PERMISSIVE     | If a validation fails, log a warning and continue running as normal. |
| ENFORCING      | If a validation fails during startup, halt the server and throw an error. If a validation fails during runtime, deny the operation and throw an error. |
| MASTER         | The same as ENFORCING except that the validation of explicit table locking is not performed. This mode can be used with clusters in which write operations are isolated to a single node. |


### Compatible modes
Using `percona-pxc-mysql` under mode `PERMISSIVE` or `DISABLED` works with {{ model.techName }} out of the box.

### Non-Compatible modes
Using `percona-pxc-mysql` under mode `ENFORCING` or `MASTER` is not supported in the current {{ model.techName }} version.
