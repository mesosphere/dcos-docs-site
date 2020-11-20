---
layout: layout.pug
navigationTitle: Release notes for 2.0.3
title: Release notes for 2.0.3
menuWeight: 10
excerpt: Release notes for DC/OS 2.0.3, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.0.3 was released on 09 April 2020.

<p class="message--warning"><strong>WARNING: </strong>The DC/OS 2.0.3 release has a critical error in Metronome where existing jobs are lost after upgrade. For more information, see the <a href="https://support.d2iq.com/s/article/Known-Issue-Critical-Metronome-Issue-in-DC-OS-2-0-3-D2iQ-2020-0004"> product advisory</a>. We recommend that you do NOT download, install or upgrade to it. Instead, download, then install or upgrade to the 2.0.2 release <a href="https://docs.d2iq.com/mesosphere/dcos/2.0/release-notes/2.0.2/">here</a>.</p> 

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.3/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Components

DC/OS 2.0.3 includes the following component versions:

- Apache&reg; Mesos&reg; 1.9.1-dev
- OpenSSL 1.1.1d	

### DC/OS Fixed and Improved Issues

- Fixed an issue where image pull in UCR was not working for nvcr.io (missing ‘service’/‘scope’ parameters). (COPS-5804)
- Fixed an issue where after a DC/OS upgrade, the executor resources used by tasks on the agent were being incorrectly counted against quota. (COPS-5725)
- DC/OS Admin Router now allows large packages of files, up to 32GB, to the Package Registry. (D2iQ-61233, COPS-5615)
- Fixed an issue where in some rare circumstances, after upgrading a cluster, users were no longer able to launch tasks that use the UCR containerizer. (D2iQ-64507, COPS-5868)
- Fixed an issue where an agent marked a Task as FAILED immediately after marking it as FINISHED (D2iQ-62454, COPS-4995)

# Marathon

## Components

DC/OS 2.0.3 includes the following Marathon&trade; component version:

- Marathon 1.9.136
- Metronome 0.6.41

### Marathon Fixed and Improved Issues

- Improved the expunge logic so that it evaluates in the same timely manner that unreachable inactive evaluates. (COPS-5617)
- `/v2/tasks` plaintext output in Marathon 1.5 returned container network endpoints in an unusable way. (MARATHON-8721)
- Marathon launched too many tasks when a missing docker image is resolved during a deployment. (DCOS_OSS-5679)
- Marathon would omit pod status report with tasks in `TASK_UNKOWN` state. (MARATHON-8710)
- Marathon was checking authorization for unrelated apps when performing a kill-and-scale operations; this has been resolved. (MARATHON-8731)

### Metronome Fixed and Improved Issues

 - There was a case where regex validation of project ids was ineffecient for certain inputs. The regex has been optimized. (MARATHON-8730)
