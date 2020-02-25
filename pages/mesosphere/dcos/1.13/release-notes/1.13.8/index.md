---
layout: layout.pug
navigationTitle: Release notes for 1.13.8
title: Release notes for 1.13.8
menuWeight: 0
excerpt: Release notes for DC/OS 1.13.8, including Open Source attribution, and version policy.
---
DC/OS 1.13. was released on ?? March 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.8/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.8/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.8 includes the following component updates:

- Apache Mesos 1.8.2-dev
- Marathon 1.8.239


# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 1.13.8

- Marathon: Pod status reports would miss tasks in state TASK_UNKOWN (MARATHON-8710)
- Fixed preflight check verifying the ftype value of /var/lib/mesos. (DCOS-59406)
- Allow Admin Router to accept files up to 32GB, such as for uploading large packages to Package Registry. (DCOS-61233)
- DC/OS no longer increases the rate limit for journald logging. Scale testing demonstrated that raising the limit overloads journald, causing problems for other components that see delayed or lost logs or, worse, hang until log buffers are read. The default of 10000 messages per 30 seconds appears to distinguish well between busy components and excessively verbose components. (DCOS-53763)
- Fix Telegraf migration when no containers present. (D2IQ-64507)
- /v2/tasks plaintext output in Marathon 1.5 returned container network endpoints in an unusable way (MARATHON-8721)
- Unreachable instances would interfere with replacements when using GROUP_BY / UNIQUE placement constraints, even if expungeAfter is configured the same as inactiveAfter (MARATHON-8719)