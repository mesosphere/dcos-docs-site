---
layout: layout.pug
navigationTitle: Release notes for 2.2.1
title: Release notes for 2.2.1
menuWeight: 5
excerpt: Release notes for DC/OS 2.2.1, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.2.1 was released on 5 Novemeber, 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.2.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.2.1/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Components

DC/OS 2.2.1 includes the following component versions:

- Apache® Mesos® 1.11.0-dev
- Marathon 1.11.23
- Metronome 0.6.68
- DC/OS UI 6.1.16
- CockroachDB 19.1.11
- Etcd 3.4.9

### DC/OS Fixed and Improved Issues

DC/OS 2.2.1 fixes the following issues:

-- Fixed the upgrade issue that caused Docker containers to restart on upgrade from DC/OS 2.1.x to 2.2.0. (COPS-6635)
-- Fixed Calico build failure issue in CentOS 8 (D2IQ-72821)

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/802a50f4902f1f5ca3829dca4a472d8a582f7b9b/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).

