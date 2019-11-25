---
layout: layout.pug
navigationTitle: Release notes for 2.0.1
title: Release notes for 2.0.1
menuWeight: 2
excerpt: Release notes for DC/OS 2.0.1
---
DC/OS 2.0.1 was released on 22 November 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.1/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.


# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 2.0.1
<!-- The issues that have been fixed and improved in DC/OS 2.0.1 are grouped by feature, functional area, or component.  -->
- Fixed an issue where unfinished Marathon deployments would prevent a successful upgrade to DC/OS 2.0.

- Decreased the amount of Mesos agent memory used in DC/OS 2.0.  

- Fixed an issue in dcos-net where a task update was leading to two DNS zone updates. (DCOS_OSS-5495)

- When deciding whether to push a network overlay to Lasuhup, DC/OS now compares by value, in addition to TIEP IP address and subnet. (DCOS_OSS-5620)

- Labels from Lashup's kv_message_queue_overflows_total metric have been removed to improve the ability to shed load. (DCOS_OSS-5634)

- DC/OS now reserves all agent VTEP IPs upon recovering from replicated logs. (DCOS_OSS-5626)
