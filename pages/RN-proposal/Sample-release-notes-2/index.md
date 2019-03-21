---
layout: layout.pug
navigationTitle: Mesosphere DC/OS Release Notes
title: Mesosphere DC/OS Release Notes
menuWeight: 5
excerpt: Second sample to illustrate potential changes to Mesosphere DC/OS release notes
---
Version 1.12.1 - Released 3 January 2019

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

This release provides enhancements to existing features, fixes to address specific issues, updates for ongoing improvements to logging, diagnostics, and documentation, and additional changes or testing to ensure and verify DC/OS compatibility and integration with other packages and platforms.

# What’s new in this release
This release includes changes for features in DC/OS Enterprise and DC/OS Open Source. If a change only applies to DC/OS Enterprise, it is labeled Enterprise. If a change only applies to DC/OS Open Source, it is labeled OSS.

## Highlights include features or fixes:
- Managing clusters across multiple regions. [enterprise type="inline" size="small" /]
- Enhancing security options. [enterprise type="inline" size="small" /]

### Multi-region management
Enables a DC/OS cluster to span multiple datacenters, clouds, and remote branches while providing unified management to control cluster operations and resources. 

### Security management
Enables DC/OS to store binary file as secrets in addition to environment variables and apply hierarchical access control for users, groups, and objects.

### Networking and load balancing
Enables DC/OS support for  Edge load balancing (Edge-LB 1.0). In addition, DC/OS Enterprise and DC/OS OSS support  IPv6or Docker containers.

## Updated components change lists
For access to the logs that track specific changes to components that are included in the DC/OS distribution, see the following links:
- Apache Mesos 1.5.x [change log](https://github.com/apache/mesos/blob/b97f0ba29d40a279dec00ffe51512e3b5a146049/CHANGELOG).
- Marathon 1.6.564 [change log](https://github.com/mesosphere/marathon/blob/48bfd6000c544df5ae03de04b42b019d5e9dbd4b/changelog.md).
- Metronome 0.4.4 [change log](https://github.com/dcos/metronome/blob/22945457c7cb10cb14d575ceeb137edd8158ba3c/changelog.md).
- DC/OS 1.12.1 [summary log].

## Issues fixed this release
- Sample query for issues fixed for DC/OS 1.x.x that need to be evaluated for release notes

## Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers enclosed in parenthesis for reference.

## Previous releases
To review changes from a recent previous release, see the following links:
- [Release version 1.10.9](https://docs.mesosphere.com/1.10/release-notes/1.10.9/) - 16 November 2018.
- [Release version 1.11.8](https://docs.mesosphere.com/1.11/release-notes/1.11.8/) - 6 December 2018.
- [Release version 1.12.0](https://docs.mesosphere.com/1.12/release-notes/1.12.0/) - 24 October 2018.
