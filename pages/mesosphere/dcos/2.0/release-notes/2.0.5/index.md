---
layout: layout.pug
navigationTitle: Release notes for 2.0.5
title: Release notes for 2.0.5
menuWeight: 0
excerpt: Release notes for DC/OS 2.0.5, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.0.5 was released on ???? 2020.

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
- Fixed an issue with unmounting external persistent volumes in Mesos. (COPS-5920) 
- Zookeeper log messages are now being forwarded to syslog. (COPS-6128)
- Additional logging has been added to the installation scripts to aid in debugging installation issues. (COPS-5428) 

# Marathon Fixed and Improved Issues

- You can see a full list of fixed and improved issues for Marathon in the [Marathon Changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).
