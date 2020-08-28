---
layout: layout.pug
navigationTitle: Release notes for 1.13.9
title: Release notes for 1.13.9
menuWeight: 1
excerpt: Release notes for DC/OS 1.13.9, including Open Source attribution, and version policy.
---
DC/OS&trade; 1.13.9 was released on 29 April, 2020.

<p class="message--warning"><strong>WARNING: </strong>The DC/OS 1.13.9 release includes a data format change for the persisted dcos-net state that, if you upgrade to anything other than 2.0.4, can cause critical issues with dcos-net. Because of this, we recommend upgrading to release 2.0.4 or higher.</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.9/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.9/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

### DC/OS Fixed and Improved Issues

- Fixed an issue introduced in 1.13.8 that caused a crashloop of dcos-net when reconciling L4LB. This issue was preventing users from successfully upgrading their DC/OS instance. (COPS-6002)
