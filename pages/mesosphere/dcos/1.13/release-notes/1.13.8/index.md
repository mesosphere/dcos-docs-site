---
layout: layout.pug
navigationTitle: Release notes for 1.13.8
title: Release notes for 1.13.8
menuWeight: 0
excerpt: Release notes for DC/OS 1.13.8, including Open Source attribution, and version policy.
---
DC/OS 1.13.8 was released on ?? March 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.8/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.8/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Components 

DC/OS 1.13.8 includes the following component versions:

- Apache Mesos 1.8.2-dev

### DC/OS Fixed and Improved Issues

- Modified pre-flight check to use filesystem mount name instead of filesystem device name. (D2iQ-59406)

- DC/OS Admin Router now allows large packages of files, up to 32GB, to be uploaded to the Package Registry. (D2iQ-61233, COPS-5615)

- DC/OS no longer increases the rate limit for journald logging. Scale testing demonstrated that raising the limit can overload journald, causing stress for other components. The default of 10000 messages per 30 seconds appears to distinguish well between busy components and excessively verbose components. (D2IQ-53763)

- Fixed an issue where in some rare circumstances, after upgrading a cluster from DC/OS 1.11 to DC/OS 1.13 users were no longer able to launch tasks that use the UCR containerizer. (D2IQ-64507, COPS-5868)

- Customers now experience zero downtime while upgrading DC/OS services. (D2IQ-61077, COPS-5602)

# Marathon

## Components

DC/OS 1.13.8 includes the following Marathon component version:

- Marathon 1.8.239

### Marathon Fixed and Improved Issues

- Removed non-host reachable container endpoints from the output of the plaintext /v2/tasks endpoint. (MARATHON-8721, COPS-5791)
- Improved the expunge logic so that it evaluates in the same timely manner that unreachable inactive evaluates. (MARATHON-8719, COPS-5617)
