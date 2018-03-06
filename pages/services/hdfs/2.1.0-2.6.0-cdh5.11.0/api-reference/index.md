---
layout: layout.pug
navigationTitle:
excerpt:
title: API Reference
menuWeight: 70
model: /services/hdfs/data.yml
render: mustache
---

<!-- Imported from https://github.com/mesosphere/dcos-commons.git:sdk-0.40 -->


#include /services/include/api-reference.tmpl

# Connection Information

The HDFS service exposes contents of `hdfs-site.xml` and `core-site.xml` for use by clients. Those contents may be requested as follows (assuming your service is named "{{ model.serviceName }}"):

```bash
$ curl -H "Authorization:token=$auth_token" dcos_url/service/{{ model.serviceName }}/v1/endpoints/hdfs-site.xml
```

```bash
$ curl -H "Authorization:token=$auth_token" <dcos_url>/service/{{ model.serviceName }}/v1/endpoints/core-site.xml
```

The contents of the responses represent valid `hdfs-site.xml` and `core-site.xml` that can be used by clients to connect to the service.
