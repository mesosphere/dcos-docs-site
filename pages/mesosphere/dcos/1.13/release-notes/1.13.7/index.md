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


# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Fixed and Improved Issues in DC/OS 1.13.7
<!-- The issues that have been fixed and improved in DC/OS 1.13.7 are grouped by feature, functional area, or component.  -->
- Marathon will now bundle multiple concurrent authentication requests for the same identity to a single request, reducing thundering-herd effects on the underlying DC/OS authentication infrastructure. (DCOS-62006)
- Fixed an issue where (DCOS-61529)
- Fixed an issue where (DCOS-61502)
- Fixed an issue where (DCOS-61439)
- Fixed an issue where (DCOS-60956)
- Fixed an issue where (DCOS-60344)
- Fixed an issue where (DCOS-60342)
- Fixed an issue where (DCOS-59959)


