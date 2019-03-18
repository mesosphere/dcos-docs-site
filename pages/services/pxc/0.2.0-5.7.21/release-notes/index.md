---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Discover the new features, updates, and known limitations in this release of the Percona XtraDB Cluster Service
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---

# Release Notes for Percona XtraDB Cluster Service version 0.2.0-5.7.21

This is the first release of the DC/OS {{ model.techName }} service. The  latest stable release version of {{ model.techName }} installation will be supported on DCOS cluster 1.10 and above. This has been built using the current stable version of SDK (Version 0.42.1).

### Breaking Changes

This is a first release and you must perform a fresh install. Upgrade is not supported in this release. 

### Improvements

Based on the latest stable release of the dcos-commons SDK (Version 0.42.1), this installation provides numerous benefits:

- Integration with DC/OS features such as virtual networking and DC/OS access controls
- Orchestrated software and configuration update, ability to add new nodes, increase memory and CPU. Installation on a DCOS cluster provides the ability to restart and replace nodes
- Placement constraints for pods
- Uniform user experience across all {{ model.techName }} cluster nodes
- SSL Authentication and Data at Rest encryption
- PAM with OpenLDAP Authentication
- Foldered Installation
- Back up to and restore from all S3-compatible storage.

### Bug Fixes

This is the first release to the DC/OS Universe. Reported bugs will be fixed in subsequent releases.

