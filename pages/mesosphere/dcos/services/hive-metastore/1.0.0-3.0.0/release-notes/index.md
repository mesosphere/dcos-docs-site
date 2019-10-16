---
layout: layout.pug
navigationTitle: Release Notes  
excerpt: Discover the new features, updates, and known limitations in this release of the Hive Metastore Service
title: Release Notes 
menuWeight: 10
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
---
# Release Notes for the {{ model.techName }} Service version 1.0.0-3.0.0

This is the first release of the {{ model.techName }}! Please read the documentation for details but some highlights include:

- Support for the following databases: Derby, MySQL, Percona-MySQL
- Being able to easily configure each node's resources
- Supporting high-availability with the ability to horizontally scale out
- Automatically generating the `metastore-site.xml` file and exposing it through the `endpoints` CLI command
- Beeline CLI support
- Using the SDK version `0.57.0` that enables all the DCOS 2.0 features such as:
  - node draining
  - quota enforcement
  - for more information see the release notes for version [0.57.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0)
- Support for the [DC/OS Storage Service](https://docs.d2iq.com/mesosphere/dcos/services/storage/)
