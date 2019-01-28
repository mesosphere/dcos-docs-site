---
layout: layout.pug
navigationTitle: 0.1.1-2.3.2
title: Release Notes
menuWeight: 10
excerpt: Release Notes for version 0.1.1-2.3.2
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---



## Version 5.7.21-29.26

This is the first release of {{ model.techName }} the latest stable release version of {{ model.techName }} installation would be supported on DCOS cluster 1.09 and above. This has been built using current stable version of SDK (Version 0.40.2).

### Breaking Changes

This is a first release and you must perform a fresh install. You cannot upgrade to version x.x.x from x x.x.x version of the package. 

### Improvements

Based on the latest stable release of the dcos-commons SDK (Version 0.42.0), this installation provides numerous benefits:

    - Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
    - Orchestrated software and configuration update, ability to add new nodes, increase memory and CPU. Installation on a DCOS cluster provides the ability to restart and replace nodes.
    - Placement constraints for pods.
    - Uniform user experience across all Pxc cluster nodes.
    - SSL Authentication and Data at Rest encryption
    - PAM with OpenLDAP Authentication
    - Foldered Installation
    - Backup to and restore from all S3-compatible support

### Bug Fixes

This is the first release to Universe. Reported bugs will be fixed in subsequent releases.

### Documentation

Released first version of service guide with following topics:
- Release Notes
- Overview
- Quick Start
- Getting Started
- Operations
    - Backup
    - Restore
    - Security
        - Service Account
    - Troubleshooting
        - Metrics
    - Uninstall
- CLI 
- Limitations
- Supported Versions