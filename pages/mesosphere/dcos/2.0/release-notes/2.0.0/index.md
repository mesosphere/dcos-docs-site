---
layout: layout.pug
navigationTitle: Release notes for 2.0.0
title: Release notes for 2.0.0
menuWeight: 5
render: mustache
model: /mesosphere/dcos/2.0/data.yml
excerpt: Release notes for DC/OS 2.0.0, including Open Source attribution, and version policy.
---
DC/OS 2.0.0 was released on 25 October 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/2.0.0/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

Registered DC/OS Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

If you have DC/OS deployed in a production environment, see [Known issues and limitations](#known-issues) to see if any potential operational changes for specific scenarios apply to your environment.

- Updated DC/OS UI to master+v2.150.2.
- Updated to Mesos 1.9. (DCOS_OSS-5342)
- Updated Marathon to 1.9.99


# New features and capabilities


- DC/OS has improved Multi Tenancy support by adding quota management for service groups. Specifically, DC/OS enables managing quota limits through UI and CLI for marathon based and SDK based services. See [documentation](/mesosphere/dcos/2.0/multi-tenancy/quota-management/#quotas) for more details. (DCOS-54186).
- DC/OS supports configurable `/dev/shm` size and IPC namespace in UCR (DCOS-54618).
- DC/OS has a new container debug endpoint, and diagnostic bundle includes the debug endpoint tracking data for stuck task. (DCOS-55383)
- Added the ability to drain agent nodes via the DC/OS CLI and UI. See [documentation](/mesosphere/dcos/2.0/administering-clusters/draining-a-node/) for more details. (DCOS-53654)
- Created new diagnostics bundle REST API with performance improvements. (DCOS_OSS-5098)
- Metronome post-install configuration can be added to `/var/lib/dcos/metronome/environment`. (DCOS_OSS-5309)
- Updated Telegraf to process Mesos operations metrics (DCOS_OSS-5023)
- Added L4LB metrics in DC/OS Net. (DCOS_OSS-5011)

# Fixed and improved issues

- Updated ref of `dvdcli` to fix `dvdcli` package build (DCOS-53581)
- Fixed performance degradation in Lashup. As of now, `dcos-dns` uses a new LWW mode to gossip dns zone updates. (DCOS_OSS-4240)
- Optimized memory and CPU usage in `dcos-net`. (DCOS_OSS-5269, DCOS_OSS-5268)
- Enabled Mesos IPC namespace isolator for configurable IPC namespace and `/dev/shm`. (DCOS-54618)
- Upgraded Admin Router's underlying OpenResty/nginx from 1.13.x to 1.15.x. (DCOS_OSS-5320)
- Bumped Mesos modules to have overlay metrics exposed. (DCOS_OSS-5322)
- Marathon API performance has been improved. JSON serialization is 50% faster and has 50% less memory overhead.


## Third-party updates and compatibility

- Telegraf now supports specifying port names for `task-label` based Prometheus endpoints discovery. (DCOS-55100)
- Upgraded Erlang OTP to release 22.0.3. (DCOS_OSS-5276)
- Upgraded platform CPython to release 3.6.8. (DCOS_OSS-5318)
- Upgraded CockroachDB to release 2.1.8. (DCOS_OSS-5360)
- Upgraded platform curl from 7.59.0 to 7.65.1. (DCOS_OSS-5319)
- Upgraded platform OpenSSL from 1.0.2x to release 1.1.1x. (DCOS-54108)




# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more tracking identifiers enclosed in parenthesis for reference.

### Deprecated or decommissioned features


# Updated components change lists


# Previous releases
To review changes from a recent previous release, see the following links:
- [Release version 1.10.11](/mesosphere/dcos/1.10/release-notes/1.10.11/) - 12 February 2019.
- [Release version 1.11.10](/mesosphere/dcos/1.11/release-notes/1.11.10/) - 12 February 2019.
- [Release version 1.12.3](/mesosphere/dcos/1.12/release-notes/1.12.3/) - 14 March 2019.
