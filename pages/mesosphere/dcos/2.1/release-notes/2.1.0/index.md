---
layout: layout.pug
navigationTitle: Release notes for 2.1.0
title: Release notes for 2.1.0
menuWeight: 5
render: mustache
model: /mesosphere/dcos/2.1/data.yml
excerpt: Release notes for DC/OS 2.1.0, including Open Source attribution, and version policy.
---
DC/OS 2.1.0 was released on Day Month, 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.0/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

If you have DC/OS deployed in a production environment, see [Known Issues and Limitations](#known-issues-and-limitations) to see if any potential operational changes for specific scenarios apply to your environment.

- Updated DC/OS UI to master+v2.150.2.
- Updated to Mesos ??
- Updated Marathon to 


# New Features and Capabilities 

## Multi-Tenancy Support

DC/OS has improved Multi-Tenancy support by adding quota management for service groups. Specifically, DC/OS enables managing quota limits through UI and CLI for Marathon based and SDK based services. For more details, see [Quota Management](/mesosphere/dcos/2.1/multi-tenancy/quota-management/#quotas). (DCOS-54186) 


# Previous Releases
To review changes from the most recent previous releases, see the following links:
- [Release version 1.10.11](/mesosphere/dcos/1.10/release-notes/1.10.11/) - 12 February 2019.
- [Release version 1.11.12](/mesosphere/dcos/1.11/release-notes/1.11.12/) - 10 October  2019.
- [Release version 1.12.4](/mesosphere/dcos/1.12/release-notes/1.12.4/) - 2 July 2019.
- [Release version 1.13.5](/mesosphere/dcos/1.13/release-notes/1.13.5/) - 2 October 2019
