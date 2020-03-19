---
layout: layout.pug
navigationTitle: Release notes for 2.0.3
title: Release notes for 2.0.3
menuWeight: 0
excerpt: Release notes for DC/OS 2.0.3, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.0.3 was released on 19 March 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.3/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

Initial list:


D2IQ-65774
D2IQ-65604


# DC/OS 

## Components

DC/OS 2.0.3 includes the following component versions:

- Apache&reg; Mesos&reg; 1.8.2-dev

### DC/OS Fixed and Improved Issues

- Fixed an issue where in some rare circumstances, after upgrading a cluster from DC/OS 1.11 to DC/OS 1.13 users were no longer able to launch tasks that use the UCR containerizer. (D2IQ-64507, COPS-5868)

- DC/OS no longer increases the rate limit for `journald` logging. Scale testing demonstrated that raising the limit can overload `journald`, causing stress for other components. The default of 10000 messages per 30 seconds appears to distinguish well between busy components and excessively verbose components. (D2IQ-53763, COPS-5830)

- Fixed an issue where image pull in UCR was not working for nvcr.io (missing 'service'/'scope' parameters). (D2IQ-63303, COPS-5804)

- Fixed situation where application on MoM always waiting because the master does not allocate valid offers to framework. (D2IQ-62519, COPS-5725)

- DC/OS Admin Router now allows large packages of files, up to 32GB, to be uploaded to the Package Registry. (D2IQ-61233, COPS-5615)

- Modified pre-flight check to use filesystem mount name instead of filesystem device name. (D2IQ-59406)

- Fixed an issue where an agent marked a Task as FAILED immediately after marking it as FINISHED (D2IQ-62454, COPS-4995)

# Marathon

## Components

DC/OS 2.0.3 includes the following Marathon&trade; component version:

- Marathon 1.8.239

### Marathon Fixed and Improved Issues

- Removed non-host reachable container endpoints from the output of the plaintext /v2/tasks endpoint. (MARATHON-8721, COPS-5791)

- Improved the expunge logic so that it evaluates in the same timely manner that unreachable inactive evaluates. (MARATHON-8719, COPS-5617)