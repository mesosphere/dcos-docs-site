---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 130
excerpt: Discover the new features, updates, and known limitations in this release of the NiFi Service 
featureMaturity:
enterprise: false
---

# Release Notes for NiFi Service version 0.1.0-1.5.0

This is the first release of Apache NiFi to Universe. Based on the latest stable release version of Apache NiFi, version 1.5.0, this installation is supported on DC/OS version 1.9 and later. This has been built using the current stable version of the SDK (Version 0.40.2).

## Breaking Changes

This is a first release and you must perform a fresh install.  

## Improvements

Based on the latest stable release of the `dcos-commons` SDK (Version 0.40.2), this installation provides numerous benefits:

- Integration with DC/OS features such as virtual networking and integration with DC/OS access controls
- Orchestrated software and configuration update, ability to add new nodes, increase memory and CPU. Installation on DCOS
Cluster provides the ability to restart and replace nodes.
- Placement constraints for pods
- Uniform user experience across all NiFi Cluster nodes
- Graceful shutdown for nodes
- Foldered installation

## Bug fixes

This is the first release to Universe. Reported bugs will be fixed in subsequent releases.

## Documentation

Released first version of Service guide with following topics:

### Table of Contents

- [Overview](overview/index.md)
- [Install and Customize](install/index.md)
- [Deployment Best Practices](deploymentbestpractice/index.md)
- [Security](security/index.md)
- [Uninstall](uninstall/index.md)
- [Command Reference](command-reference/index.md)
- [Connecting Clients](connecting-clients/index.md)
- [Managing](managing/index.md)
- [Diagnostic Tools](diagnostictools/index.md)
- [API Reference](api-reference/index.md)
- [Troubleshooting](troubleshooting/index.md)
- [Limitations](limitations/index.md)
- [Supported Versions](supported-versions/index.md)
- [Release Notes](release-notes/index.md)
