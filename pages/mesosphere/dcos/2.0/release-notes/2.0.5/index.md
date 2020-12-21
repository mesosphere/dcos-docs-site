---
layout: layout.pug
navigationTitle: Release notes for 2.0.5
title: Release notes for 2.0.5
menuWeight: 2
excerpt: Release notes for DC/OS 2.0.5, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.0.5 was released on 30 June, 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.5/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Components

DC/OS 2.0.5 includes the following component versions:

- Apache&reg; Mesos&reg; 1.9.1-dev
- OpenSSL 1.1.1g

### DC/OS Fixed and Improved Issues

- Fixed a critical error in Metronome where existing jobs appear to be lost after upgrade. (COPS-6174)
- Fixed an issue with unmounting external persistent volumes in Mesos. (COPS-5920, D2iQ-65497) 
- Zookeeper log messages are now being forwarded to syslog. (COPS-6128, D2iQ-68394)
- Additional logging has been added to the installation scripts to aid in debugging installation issues. (COPS-5428) 
- Fixed an issue where frameworks could interfere with Marathon pods by launching tasks on resources reserved to Marathon. (D2iQ-68800)
- Fixed an issue where the DC/OS UI sometimes did not report the correct DC/OS version due to browser caching. (D2iQ-69682)

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/1ff2fcd90eabd98786531748869b8596120f7dfe/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
