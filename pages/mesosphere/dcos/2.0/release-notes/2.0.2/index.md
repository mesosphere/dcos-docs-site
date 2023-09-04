---
layout: layout.pug
navigationTitle: Release notes for 2.0.2
title: Release notes for 2.0.2
menuWeight: 15
excerpt: Release notes for DC/OS 2.0.2
---
DC/OS 2.0.2 was released on 30 January 2020.

<p class="message--warning"><strong>WARNING: </strong>The DC/OS 1.13.9 release includes a data format change for the persisted dcos-net state that, if you upgrade to release 2.0.2, can cause critical issues with dcos-net. Because of this, we recommend upgrading to release 2.0.4 or higher.</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.2/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 2.0.2

- Upgraded Java to version 8u232 to align with previous DC/OS releases. (DCOS-62548, COPS-5738)

## Marathon 
- Marathon will now bundle multiple concurrent authentication requests for the same identity to a single request, reducing thundering-herd effects on the underlying DC/OS authentication infrastructure. (DCOS-62006) 
- DC/OS now shows resident pod instances in /v2/pods/::status when they transition to "unknown", or any other task status that may cause them to be excluded. (MARATHON-8710)

## Admin Router

- Fixed an issue where, after upgrade to DC/OS 2.0, adminrouter-agent was failing to start on older CPUs that were missing SSE 4.2. (DCOS_OSS-5643)
