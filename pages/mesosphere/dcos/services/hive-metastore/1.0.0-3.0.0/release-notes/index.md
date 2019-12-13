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

This is the first release of the {{ model.techName }}! Please read the documentation for details, but some highlights include:

- Support for the following databases: Derby, MySQL, Percona-MySQL
- Ability to easily configure each node's resources
- Support for high-availability with the ability to horizontally scale out
- Automatic generation of the `metastore-site.xml` file and exposure of it through the `endpoints` CLI command
- Beeline CLI support
- Uses SDK version 0.56.1
- Support for the [DC/OS Storage Service](https://docs.d2iq.com/mesosphere/dcos/services/storage/)
- For more information, see the release notes for version [0.56.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.1)
