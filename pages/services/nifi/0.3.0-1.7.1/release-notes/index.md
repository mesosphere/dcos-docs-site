---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 5
excerpt: Release Notes for version 0.3.0-1.7.1
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---


## Version 0.3.0-1.7.1

### Updates 
- Upgrade {{ model.packageName }} base tech to version 1.7.1. See [Apache NiFi's Release Notes](https://cwiki.apache.org/confluence/display/NIFI/Release+Notes#ReleaseNotes-Version1.7.1) for details.
- Removing HTTP Port and HTTPS Port configuration.

### New Features
- Support for secrets file upload.

### Bug Fix
- Fixed `cn_dn_node_identity` value for default installation of DC/OS {{model.techName }}.


## Version 0.2.0-1.5.0

### New Features
- Support for Kerberos and SSL authorization and authentication.
- Support for DC/OS {{model.techName }} CLI.
- Support for DC/OS {{model.techName }} Metrics using DCOS Metrics API

### Updates
- Removing configurable settings for DC/OS {{model.techName }} like container path and some default configurations.


## Version 0.1.0-1.5.0

This is the first release of DC/OS {{model.techName }} to Universe. Based on the latest stable release version of DC/OS {{model.techName }}, version 1.5.0, this installation would be supported on DCOS cluster 1.9 and above. This has been built using current stable version of SDK (Version 0.40.2).

### Breaking Changes

This is a first release and you must perform a fresh install.

### Improvements

Based on the latest stable release of the dcos-commons SDK (Version 0.40.2), this installation provides numerous benefits:

    - Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
    - Orchestrated software and configuration update, ability to add new nodes, increase memory and CPU. Installation on DCOS Cluster provides the ability to restart and replace nodes.
    - Placement constraints for pods.
    - Uniform user experience across all DC/OS {{model.techName }} Cluster nodes.
    - Graceful shutdown for nodes
    - Foldered Installation

### Bug Fixes

This is the first release to Universe. Reported bugs will be fixed in subsequent releases.
