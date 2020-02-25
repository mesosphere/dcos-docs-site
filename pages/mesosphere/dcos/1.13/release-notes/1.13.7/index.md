---
layout: layout.pug
navigationTitle: Release notes for 1.13.7
title: Release notes for 1.13.7
menuWeight: 2
excerpt: Release notes for DC/OS 1.13.7, including Open Source attribution, and version policy.
---
DC/OS 1.13.7 was released on 3 January 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.7/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.7/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.7 includes the following components:

- Apache Mesos 1.8.2-dev
- Marathon 1.8.232

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 1.13.7

<!-- The issues that have been fixed and improved in DC/OS 1.13.7 are grouped by feature, functional area, or component.  -->

- Marathon now bundles multiple concurrent authentication requests for the same identity to a single request, reducing thundering-herd effects on the underlying DC/OS authentication infrastructure. (DCOS-62006)
- Fixed an issue where Marathon would sometimes launch too many replacement tasks during an application upgrade. (DCOS-62078)
- DC/OS now uses Golang 1.10.8 to build CockroachDB which corrects an issue that prevented CockroachDB from recovering properly after a time skew was encountered. (DCOS-61502)
- [Mesos] Support quoted realms in WWW-Authenticate header which fixes an issue that prevented the UCR from pulling from Docker registries configured with authentication that used quoted realms.(DCOS-61529)
- The Service tab in DC/OS now displays services as expected. (DCOS-61439)
- Fixed an issue that could prevent updates to the overlay network configuration from being properly propagated to all the nodes in the cluster. (DCOS_OSS-5620)
- Fixed an issue that could cause 'dcos-net' to stop responding when under heavy load.(DCOS_OSS-5634)
- Fixed a rare issue that could prevent the overlay network from recovering in certain situations. (DCOS_OSS-5626)
- Set network interfaces as unmanaged for networkd only on CoreOS, which fixes an issue that could prevent the overlay network from working properly in some situations. (DCOS-60956)
