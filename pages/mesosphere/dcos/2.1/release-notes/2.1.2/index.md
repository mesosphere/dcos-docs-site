---
layout: layout.pug
navigationTitle: DC/OS 2.1.2 Release Notes
title: DC/OS 2.1.2 Release Notes
menuWeight: 0
excerpt: Release notes for DC/OS 2.1.2, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.1.2 was released on 20 November, 2020.

<p class="message--warning"><strong>WARNING:</strong> Upgrading from DC/OS 2.1.x to DC/OS 2.2.0 causes all Docker containers, launched by Docker Containerizer, in any cluster to be restarted due to an issue that changes the name of the 'libnetwork' certificate. Because of this, we recommend you upgrade directly to DC/OS 2.2.1.</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.2/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.
# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.
## Component Versions

DC/OS 2.1.2 includes the following component versions:
- Apache Mesos 1.10.1
- Marathon 1.10.36
- DC/OS UI 6.1.16
- Fluentbit 1.4.6
### DC/OS Fixed and Improved Issues
DC/OS 2.1.2 fixes the following issues:

- When resolv.conf is updated, the logs now display a diff in addition to the new contents to assist troubleshooting. (COPS-6411)
- Allow disabling Calico overlay by setting `calico_enabled` to `false`. (COPS-6451)
- During upgrade, all services are stopped in one systemctl command, to ensure correct order. (COPS-6512)
- Reset Docker start limit if it fails during reboot. (D2IQ-72103)
- Avoid timeouts in CockroachDB unit start. (D2IQ-69871)
- dcos-net now configures NetworkManager ignores for its interfaces. (COPS-6519)
- Nested Marathon groups were not inheriting enforceRole behavior from top-level groups. (COPS-6529)
- systemd warnings were being displayed during patch upgrades. (COPS-6506)
- UCR fetcher had issues pulling down images. (COPS-6381)
- dcos-telegraf.socket was down after a patch. (COPS-6512)
## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/5d684743682ee7bb28dd66dddb1128b8e2b387ac/CHANGELOG)
## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).
## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
