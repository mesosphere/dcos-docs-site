---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release Notes for DSE v. 3.1.0-6.7.6
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/dse/data.yml
render: mustache
---

# Version 3.1.0-6.7.6

## Updates
- Upgraded {{ model.techShortName }} to version 6.7.6 and {{ model.techOpsName }} to version 6.7.6
- Upgraded SDK to 0.57.0.post0. For more information see SDK's Release Notes for: 
  - [0.57.0.post0](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0.post0)
  - [0.57.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0)
  - [0.56.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.3)
  - [0.56.2](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.2)
  - [0.56.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.1)
  - [0.56.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.0)
  - [0.55.5](https://github.com/mesosphere/dcos-commons/releases/tag/0.55.5)

## New Features
- Added support for DSS [volume profiles](/mesosphere/dcos/services/{{ model.serviceName }}/latest/configuration/#using-volume-profiles)
- Added [custom domain](/mesosphere/dcos/services/{{ model.serviceName }}/latest/security/#forwarding-dns-and-custom-domain) support

## Improvements
- Remove non-HTTPS resources and references by replacing them with HTTPS ones
- Added more directories to the PATH (resources/cassandra/bin, resources/cassandra/tools/bin)
- Added descriptions for configuration parameters
- Updated UI URLs to redirect to correct reference doc pages
- Exclude {{ model.techOpsName }} keyspace from list of keyspaces managed by Repair Services
- Accurate Scheduler Plan status in the UI

## Bug Fixes
- Used correct YAML markup for TPC-related configurations: TPC CORES, TPC IO CORES, IO GLOBAL QUEUE DEPTH
- DSEFS could be enabled independently from DSE Analytics
- Ignore error code of nodetool commands, stop command to run indifinitely.
- Save OpsCenter event-plugins on volume, Alert sending configuration are now persisted between OpsCenter restarts.
- Fix OpsCenter UI shows gray ring on restart

## Upgrading your cluster from {{ model.techShortName }} 5.1.10 to 6.7.6
Due to the complexity of upgrading to {{ model.techShortName }} 6.7, we strongly advise that you attempt the upgrade on a test cluster before upgrading in your production environment. See the [update section](/mesosphere/dcos/services/dse/3.1.0-6.7.6/updates/) for specific instructions.

