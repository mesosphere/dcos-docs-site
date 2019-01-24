---
layout: layout.pug
title: Operations
navigationTitle: Operations
excerpt: Plan and pod operations in DC/OS Apache HDFS service
menuWeight: 30
model: /services/hdfs/data.yml
render: mustache
---

#include /services/include/operations.tmpl

## Connecting Clients

Applications interface with {{ model.techShortName }} like they would any POSIX file system. However, applications that will act as client nodes of the {{ model.techShortName }} deployment require an `{{ model.packageName }}-site.xml` and `core-site.xml` file that provides the configuration information necessary to communicate with the cluster.

Execute the following command from the DC/OS CLI to retrieve the `{{ model.packageName }}-site.xml` file that client applications can use to connect to the {{ model.techShortName }} instance.

```bash
$ dcos {{ model.packageName }} --name=<service-name> endpoints {{ model.packageName }}-site.xml
...
$ dcos {{ model.packageName }} --name=<service-name> endpoints core-site.xml
...
```
