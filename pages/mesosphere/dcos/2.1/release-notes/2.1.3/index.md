---
layout: layout.pug
navigationTitle: DC/OS 2.1.3 Release Notes
title: DC/OS 2.1.3 Release Notes
menuWeight: 0
excerpt: Release notes for DC/OS 2.1.3, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.1.3 was released on 17 December, 2020.

<p class="message--warning"><strong>WARNING:</strong> Upgrading from DC/OS 2.1.x to DC/OS 2.2.0 causes all Docker containers, launched by Docker Containerizer, in any cluster to be restarted due to an issue that changes the name of the 'libnetwork' certificate. Because of this, we recommend you upgrade directly to DC/OS 2.2.1 or higher.</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.3/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

## Component Versions
DC/OS 2.1.3 includes the following component versions:
- Apache Mesos 1.10.1
- Marathon 1.10.36
- DC/OS UI 6.1.16
- Fluentbit 1.4.6

### DC/OS Fixed and Improved Issues
DC/OS 2.1.3 fixes the following issues:

- Etcd is now disabled when calico is disabled via `calico_enable` (D2IQ-73299).
- Fixed dcos-net startup script to configure network ignore file for on-prem (COPS-6519 / D2IQ-73113).
- Calico CNI will not be configured when `calico_enabled` is `false` (D2IQ-73141).
- Package registry fixed to work with intermediate certificates (COPS-6561 / D2IQ-72615).
- Python cryptography package updated (CVE-2020-25659 / D2IQ-73273).
- Don't respect instances that are about to be restarted in placement constraints (COPS-5617 / MARATHON-8771).

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/3ca3879d52ea0f9bff05443d331d63105b2cc4db/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues

- Job ids allow double `-`s again. (MARATHON-8730)

For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
