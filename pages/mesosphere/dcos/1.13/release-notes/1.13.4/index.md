---
layout: layout.pug
navigationTitle: Release notes for 1.13.4
title: Release notes for 1.13.4
menuWeight: 3
excerpt: Release notes for DC/OS 1.13.4, including Open Source attribution, and version policy.
---
DC/OS 1.13.4 was released on September 5, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.3/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the [support website](https://support.mesosphere.com/s/downloads). For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

DC/OS 1.13.4 includes the following components:

<!-- - DC/OS Enterprise UI updated to 1.13+v2.82.7 and plugins to 1.13+v2.82.7+33076c53.

- DC/OS Enterprise plugins updated to 1.13+v2.82.7+33076c53.

- DC/OS core CLI updated to 1.13-patch.5 bundled in the private registry.

- Apache Mesos 1.8.x [change log](https://github.com/apache/mesos/blob/07d053f68b75505a4386913f05d521fa5e36373d/CHANGELOG).

- Marathon 1.8.207 [change log](https://github.com/mesosphere/marathon/tree/9f3550487).

- Metronome 0.6.33 [change log](https://github.com/dcos/metronome/releases/tag/v0.6.33).
 -->

 - Marathon 1.8.222  (DCOS_OSS-5460).


# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# Issues fixed in DC/OS 1.13.4
The issues that have been fixed in DC/OS 1.13.4 are grouped by feature, functional area, or component. 


## Diagnostics
- Archive `/var/log/mesos-state.tar` has been added to all Diagnostics bundles. (DCOS-56403)


## Installation

- Windows build package now proceeds with the correct subset of packages. (DCOS_OSS-5429)
- Mesos agent no longer deadlocks in RPC authenticatee. (DCOS-57388)
- `systemd` timer and service unit are now included in `dcos-diagnostics` package so that the installer picks them up during installation. (DCOS-56379)
 - Added variant `windows` to Python package. (DCOS-45547)


[enterprise]
## Security
[/enterprise]
- DC/OS signal now able to extract license ID (DCOS-57291)
- Pre-flight checking for Docker 1.19 revised to allow user to choose lowest client and server options (DCOS-56831)
- Enterprise CLI no longer fails due to transient network error while downloading `dcos-security-cli`. (DCOS-54793)
- Fixed authorization for MULTI_ROLE frameworks. (DCOS-54635)

## Deploying Jobs
- Jobs list no longer shows job twice if name matches group. (DCOS-54937)

# Marathon

- Marathon version upgraded to 1.8.222  (DCOS_OSS-5460).
- Added `maintenanceEnabled` status to informational endpoint. (MARATHON-8660)
- Removed references to Mesos set attributes. You cannot specify Mesos set attributes. (MARATHON-7977)
- Changed `clean_marathon_state` to `module` scoped so that it can exist in EE and OSS, and coexist with `module` scoped fixtures which create Marathon resources. (DCOS-45746)
