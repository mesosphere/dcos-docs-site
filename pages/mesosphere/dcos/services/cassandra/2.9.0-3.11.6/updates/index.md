---
layout: layout.pug
navigationTitle: Update
excerpt: Updates and patches
title: Updating DC/OS Apache Cassandra
menuWeight: 47
model: /mesosphere/dcos/services/cassandra/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/update.tmpl

# Upgrading directly from 2.5.0-3.11.3

- It is possible to upgrade directly to `2.9.0-3.11.6` from version `2.5.0-3.11.3`. However, you'll need to run the following command to successfully upgrade your {{ model.techName }} package: 

  ```
  dcos {{ model.serviceName }} update start --package-version=2.9.0-3.11.6 --replace
  ```