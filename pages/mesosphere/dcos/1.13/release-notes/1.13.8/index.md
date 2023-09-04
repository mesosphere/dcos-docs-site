---
layout: layout.pug
navigationTitle: Release notes for 1.13.8
title: Release notes for 1.13.8
menuWeight: 2
excerpt: Release notes for DC/OS 1.13.8, including Open Source attribution, and version policy.
---
DC/OS&trade; 1.13.8 was released on 19 March 2020.

<p class="message--warning"><strong>WARNING: </strong>The DC/OS 1.13.8 release has a critical error in its networking stack. We recommend that you do NOT download or upgrade to it. Instead, download and upgrade to the 1.13.9 release <a href="https://docs.d2iq.com/mesosphere/dcos/1.13/release-notes/1.13.9/">here</a>.</p>
  
[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.8/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.8/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Components

DC/OS 1.13.8 includes the following component versions:

- Apache&reg; Mesos&reg; 1.8.2-dev

### DC/OS Fixed and Improved Issues

- Fixed an issue where in some rare circumstances, after upgrading a cluster from DC/OS 1.11 to DC/OS 1.13 users were no longer able to launch tasks that use the UCR containerizer. (D2iQ-64507, COPS-5868)

- DC/OS no longer increases the rate limit for `journald` logging. Scale testing demonstrated that raising the limit can overload `journald`, causing stress for other components. The default of 10000 messages per 30 seconds appears to distinguish well between busy components and excessively verbose components. (D2iQ-53763, COPS-5830)

- Fixed an issue where image pull in UCR was not working for nvcr.io (missing 'service'/'scope' parameters). (D2iQ-63303, COPS-5804)

- Fixed an issue where after a DC/OS upgrade, the executor resources used by tasks on the agent were being incorrectly counted against quota. (D2iQ-62519, COPS-5725)  

- DC/OS Admin Router now allows large packages of files, up to 32GB, to be uploaded to the Package Registry. (D2iQ-61233, COPS-5615)

- Modified pre-flight check to use filesystem mount name instead of filesystem device name. (D2iQ-59406)

- Fixed an issue where an agent marked a Task as FAILED immediately after marking it as FINISHED (D2iQ-62454, COPS-4995)

# Marathon

## Components

DC/OS 1.13.8 includes the following Marathon&trade; component version:

- Marathon 1.8.239

### Marathon Fixed and Improved Issues

- Removed non-host reachable container endpoints from the output of the plaintext /v2/tasks endpoint. (MARATHON-8721, COPS-5791)

- Improved the expunge logic so that it evaluates in the same timely manner that unreachable inactive evaluates. (MARATHON-8719, COPS-5617)
