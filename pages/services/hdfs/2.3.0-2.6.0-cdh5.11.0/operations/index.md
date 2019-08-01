---
layout: layout.pug
navigationTitle:
excerpt:
title: Operations
menuWeight: 30
model: /services/hdfs/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/operations.tmpl

## Connecting Clients

Applications interface with HDFS like they would any POSIX file system. However, applications that will act as client nodes of the HDFS deployment require an `hdfs-site.xml` and `core-site.xml` file that provides the configuration information necessary to communicate with the cluster.

Execute the following command from the DC/OS CLI to retrieve the `hdfs-site.xml` file that client applications can use to connect to the HDFS instance.

```bash
$ dcos {{ model.packageName }} --name=<service-name> endpoints hdfs-site.xml
...
$ dcos {{ model.packageName }} --name=<service-name> endpoints core-site.xml
...
```
