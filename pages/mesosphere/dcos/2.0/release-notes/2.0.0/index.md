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
- Updated Marathon to 1.9.100. Marathon 1.9 brings support for multi-role, enabling you to launch services for different roles (against different Mesos quotas) with the same Marathon instance.
- Updated to Metronome 0.6.33 which has the following benefits: When querying run detail with embed=history, `successfulFinishedRuns` and `failedFinishedRuns` contains new field tasks which is an array of taskIds of that finished run. This will allow people to query task IDs even for finished job runs. 
- Updated to the latest version of cron-utils 9.0.0 and removed threeten-backport. This fixes a number of cron related issues in the underlying dependencies. Fixed a bug when task status was not updated after the task turned running (when querying embed=activeRuns). Fixes DCOS_OSS-5166 where metronome did not use the revive operation.

# New features and capabilities 

- DC/OS has improved Multi Tenancy support by adding quota management for service groups. Specifically, DC/OS enables managing quota limits through UI and CLI for Marathon based and SDK based services. See [Quota Management](/mesosphere/dcos/2.0/multi-tenancy/quota-management/#quotas) documentation for more details. (DCOS-54186).
- As tasks in a pod are running on the same agent, it is possible to define a shared memory segment for tasks. DC/OS supports configurable `/dev/shm` size and IPC namespace in UCR. See the [Shared Memory](/mesosphere/dcos/2.0/deploying-services/pods/technical-overview/#shared-memory) documentation. (DCOS-54618).
- DC/OS has a new container debug endpoint, and diagnostic bundle includes the debug endpoint tracking data for stuck task. (DCOS-55383)
- Added the ability to drain agent nodes via the DC/OS CLI and UI. See [Draining a Node](/mesosphere/dcos/2.0/administering-clusters/draining-a-node/) documentation for more details. (DCOS-53654)
- Created new diagnostics bundle REST API with performance improvements. (DCOS_OSS-5098)
- Metronome post-install configuration can be added to `/var/lib/dcos/metronome/environment`. (DCOS_OSS-5309)
- Added L4LB metrics in DC/OS Net. (DCOS_OSS-5011)
- Marathon relaxed name validation for external volumes. As there are some external volume providers which require options in the volume name, the strict validation of the name on the external volume is now removed. In addition, previously Marathon would validate that an external volume with the same name is only used once across all apps. However, multiple external volume providers now allow shared access to mounted volumes, so we introduced a way to disable the uniqueness check. (MARATHON-8681)
- Add a new DC/OS configuration parameter `mesos_docker_volume_chown`, to change Docker volume ownership to the task user. By default, this parameter defaults to `false`; if this parameter is set as `true`, Mesos will change the ownership of a Docker volume non-recursively to be the task user when launching a container. It is not recommended that this option be enabled  if there is any Docker volume shared by multiple non-root users. (DCOS_OSS-5381, COPS-5176, MESOS-9908)

# Fixed and improved issues

- Update ref of `dvdcli` to fix `dvdcli` package build (DCOS-53581)
- Fix performance degradation in Lashup. As of now, `dcos-dns` uses a new LWW mode to gossip dns zone updates. (DCOS_OSS-4240)
- Optimize memory and CPU usage in `dcos-net`. (DCOS_OSS-5269, DCOS_OSS-5268)
- Enable Mesos IPC namespace isolator for configurable IPC namespace and `/dev/shm`. (DCOS-54618)
- Upgrade Admin Router's underlying OpenResty/nginx from 1.13.x to 1.15.x. (DCOS_OSS-5320)
- Bump Mesos modules to have overlay metrics exposed. (DCOS_OSS-5322)
- Marathon API performance has been improved. JSON serialization is 50% faster and has 50% less memory overhead.
- DC/OS no longer increases the rate limit for `journald` logging, to reduce cases of journald being overloaded and blocking other services. (DCOS-53763)


## Third-party updates and compatibility

<!-- - Telegraf now supports specifying port names for `task-label` based Prometheus endpoints discovery. (DCOS-55100) -->
- Mesos has recently added new metrics related to operation feedback. The `telegraf` plugin has been updated in order to publish those metrics to Prometheus. Updated Telegraf to process Mesos operations metrics (DCOS_OSS-5023, DCOS-51344).
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
