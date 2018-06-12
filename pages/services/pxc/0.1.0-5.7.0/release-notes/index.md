---
post_title: Release Notes
menu_order: 120
enterprise: 'no'
---

## Version 5.7.21-29.26

This is the first release of Percona XtraDB Cluster the latest stable release version of Percona XtraDB Cluster installation would be supported on DCOS cluster 1.09 and above. This has been built using current stable version of SDK (Version 0.40.2).

### Breaking Changes

This is a first release and you must perform a fresh install . You cannot upgrade to version x.x.x from x x.x.x version of the package. 

### Improvements

Based on the latest stable release of the dcos-commons SDK (Version 0.42.0), this installation provides numerous benefits:

    - Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
    - Orchestrated software and configuration update, ability to add new nodes, increase memory and CPU. Installation on DCOS Cluster provides the ability to restart and replace nodes.
    - Placement constraints for pods.
    - Uniform user experience across all Pxc cluster nodes.
    - Graceful shutdown for nodes
    - Foldered Installation

### Bug Fixes

This is the first release to Universe. Reported bugs will be fixed in subsequent releases.

### Documentation

Released first version of Service Guide with following topics:

    - Overview
    - Install and Customize
    - Security
    - Uninstall
    - Quick Start
    - Connecting Clients
    - Managing
    - Diagnostic Tools
    - API Reference
    - Troubleshooting
    - Limitations
    - Supported Versions
    - Release Notes
    - Upgrade
