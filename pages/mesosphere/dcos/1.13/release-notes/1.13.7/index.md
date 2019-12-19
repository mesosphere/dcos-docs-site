---
layout: layout.pug
navigationTitle: Release notes for 1.13.7
title: Release notes for 1.13.7
menuWeight: 0
excerpt: Release notes for DC/OS 1.13.7, including Open Source attribution, and version policy.
---
DC/OS 1.13.7 was released on 3 January 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.7/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.7/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.7 includes the following components:

- Apache Mesos 1.8.2-dev
- Marathon to 1.8.232

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 1.13.7

<!-- The issues that have been fixed and improved in DC/OS 1.13.7 are grouped by feature, functional area, or component.  -->

- Marathon now bundles multiple concurrent authentication requests for the same identity to a single request, reducing thundering-herd effects on the underlying DC/OS authentication infrastructure. (DCOS-62006)
- Use Golang 1.10.8 to build CockroachDB. (DCOS-61502)
- [Mesos] Support quoted realms in WWW-Authenticate header. (DCOS-61529)
- The Service tab in DC/OS now displays services, as expected. (DCOS-61439)
- DC/OS can now ping between nodes, as expected. (DCOS-60956)
- The refresh rate for the DC/OS GUI has been decreased. (DCOS-60344)
- Fixed an issue where (DCOS-60342)
- Fixed an issue where (DCOS-59959)
- DC/OS overlay networks should be compared by-value. (DCOS_OSS-5620)
- Drop labels from Lashup's kv_message_queue_overflows_total metric. (DCOS_OSS-5634)
- Reserve all agent VTEP IPs upon recovering from replicated log. (DCOS_OSS-5626)
- Set network interfaces as unmanaged for networkd only on coreos. (DCOS-60956)

