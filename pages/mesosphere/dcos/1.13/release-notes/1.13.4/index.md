---
layout: layout.pug
navigationTitle: Release notes for 1.13.4
title: Release notes for 1.13.4
menuWeight: 15
excerpt: Release notes for DC/OS 1.13.4, including Open Source attribution, and version policy.
---
DC/OS 1.13.4 was released on September 5, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.4/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.4 includes the following components:

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Issues fixed in DC/OS 1.13.4
The issues that have been fixed in DC/OS 1.13.4 are grouped by feature, functional area, or component. 

- Mesos agent no longer deadlocks in RPC authenticatee. (DCOS-57388)
- Fixed issue where jobs and group names appeared duplicated when the job name matched the group name. (DCOS-54937, COPS-5208)
- Fixed preflight Docker® version check failing for Docker 1.19. (DCOS-56831)ß

## Diagnostics
- Archive `/var/log/mesos-state.tar` has been added to all Diagnostics bundles. (DCOS-56403)

## Installation

- Windows build package now proceeds with the correct subset of packages; added variant `windows` to Python package. (DCOS_OSS-5429, DCOS-45547)
- `systemd` timer and service unit are now included in `dcos-diagnostics` package so that the installer picks them up during installation. (DCOS-56379)

[enterprise]
## Security
[/enterprise]
- Fixed authorization for MULTI_ROLE frameworks. (DCOS-54635)
