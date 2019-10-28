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
- Updated to Mesos 1.9. (DCOS_OSS-5342)
- Updated Marathon to 1.9.100. Marathon 1.9 brings multi-role support, enabling you to launch services for different roles (against different Mesos quotas) with the same Marathon instance.
- Updated to Metronome 0.6.33 which has the following benefits: When querying run detail with embed=history, `successfulFinishedRuns` and `failedFinishedRuns` contains new field tasks which is an array of taskIds of that finished run. This will allow people to query task IDs even for finished job runs. (DCOS_OSS-5166)


# New Features and Capabilities 

## Multi-Tenancy Support

DC/OS has improved Multi-Tenancy support by adding quota management for service groups. Specifically, DC/OS enables managing quota limits through UI and CLI for Marathon based and SDK based services. For more details, see [Quota Management](/mesosphere/dcos/2.1/multi-tenancy/quota-management/#quotas). (DCOS-54186) 

## Node Draining Enables Graceful Maintenance

DC/OS adds the ability to drain agent nodes via the DC/OS CLI and UI. For more details, see [Draining a Node](/mesosphere/dcos/2.1/administering-clusters/draining-a-node/). (DCOS-53654)

## UCR Support for Applications Requiring Configurable Shared Memory

As tasks in a pod are running on the same agent, it is possible to define a shared memory segment for tasks. DC/OS supports configurable `/dev/shm` size and IPC namespace in UCR. For more details, see [Shared Memory](/mesosphere/dcos/2.1/deploying-services/pods/technical-overview/#shared-memory). (DCOS-54618) 

DC/OS introduces the following parameters to UCR support:

- `mesos_disallow_sharing_agent_ipc_namespace` can be used to control whether the top-level Mesos container is allowed to share the Mesos agent host's IPC namespace and `/dev/shm`. The default value is `false`. (DCOS-56619)
- `mesos_default_container_shm_size` can be used to specify the default size of the `/dev/shm` for the Mesos container which has its own `/dev/shm`. The format is [number][unit], where `number` must be a positive integer and `unit` can be B (bytes), KB (kilobytes), MB (megabytes), GB (gigabytes) or TB (terabytes). (DCOS-56619)

## New Diagnostics Commands

DC/OS introduces a new diagnostic service with the addition of the [`dcos diagnostics`](/mesosphere/dcos/2.1/cli/command-reference/dcos-diagnostics/) suite of CLI commands. A  more RESTful API will generate diagnostics bundles for troubleshooting DC/OS issues. This decentralized model will generate a local bundle on every node, and then merge all local bundles. This change greatly reduces the amount of time needed to generate a diagnostic bundle. (DCOS_OSS-5098)
- Create new diagnostics bundle REST API with performance improvements. 
- Deprecate legacy routes and create a more RESTful API for generating diagnostics bundles.  

## Other Improvements

- DC/OS has a new container debug endpoint, and the diagnostic bundle includes the debug endpoint tracking data for a stuck task. (DCOS-55383)
- Metronome post-install configuration can be added to `/var/lib/dcos/metronome/environment`. (DCOS_OSS-5309)
- Add L4LB metrics in DC/OS Net. (DCOS_OSS-5011)
- Previously, Marathon would validate that an external volume with the same name is only used once across all apps. Multiple external volume providers now allow shared access to mounted volumes, so we introduce a way to disable the uniqueness check. (MARATHON-8681)
- Add a new DC/OS configuration parameter `mesos_docker_volume_chown`, to change Docker volume ownership to the task user. By default, this parameter defaults to `false`; if this parameter is set as `true`, Mesos will change the ownership of a Docker volume non-recursively to be the task user when launching a container. It is not recommended that this option be enabled  if there is any Docker volume shared by multiple non-root users. (COPS-5176, DCOS_OSS-5381, MESOS-9908)

# Fixed and Improved Issues

- Update ref of `dvdcli` to fix `dvdcli` package build. (DCOS-53581)
- Fix performance degradation in Lashup. As of now, `dcos-dns` uses a new LWW mode to gossip DNS zone updates. (DCOS_OSS-4240)
- Optimize memory and CPU usage in `dcos-net`. (DCOS_OSS-5269, DCOS_OSS-5268)
- Remove `nogroup` group from installation. (COPS-5220, DCOS-59427)
- Upgrade Admin Router's underlying OpenResty/nginx from 1.13.x to 1.15.x. (DCOS_OSS-5320)
- In `dcos-net`, use cached Mesos state in case of Mesos instability. (DCOS_OSS-5463)
- Bump Mesos modules to have overlay metrics exposed. (DCOS_OSS-5322)
- Improved Marathon API performance. JSON serialization is 50% faster and has 50% less memory overhead.
- DC/OS no longer increases the rate limit for `journald` logging, to reduce cases of `journald` being overloaded and blocking other services. (DCOS-53763)
- Fix preflight Docker version check failing for Docker 1.19. (DCOS-56831)
- Bump Telegraf to have Mesos overlay module metrics collected. (DCOS_OSS-5323)
- Fix wrong value in `dcos_service_port_index` that breaks Admin Router cache. (COPS-5147, DCOS_OSS-5491)
- Add framework ID tags to Mesos framework metrics. (DCOS-53302)
- The DC/OS configuration variable `mesos_seccomp_enabled` now defaults to `true`, with `mesos_seccomp_profile_name` set to `default.json`. This is not expected to break tasks. If you experience problems, though, note that seccomp can be disabled for individual tasks through the DC/OS SDK and Marathon. For more details, see [`mesos_seccomp_enabled`](/mesosphere/dcos/2.1/installing/production/advanced-configuration/configuration-reference/#mesos-seccomp-enabled) and [`mesos_seccomp_profile_name`](/mesosphere/dcos/2.1/installing/production/advanced-configuration/configuration-reference/#mesos-seccomp-profile-name). (DCOS-50038)
- Very large quota values can crash Mesos master. (DCOS-59695)
- Marathon crash-loops after receiving a very long error message from a task's fetcher. (COPS-5365, MARATHON-8698)
- ACL gives inappropriate access to tasks. (COPS-4929)
- When deploying a service with an L4-VIP, it can take up to 10 minutes until the VIP is available. (COPS-5081, DCOS_OSS-5356)
- The `dcos-net` logs show too many entries on masters. (COPS-5229, DCOS-57506)



## Third-party Updates and Compatibility

- Telegraf now supports specifying port names for `task-label` based Prometheus endpoints discovery. (DCOS-55100) 
- Update Telegraf to process Mesos operations metrics. (DCOS_OSS-5023, DCOS-51344) 
- Upgrade Erlang OTP to release 22.0.3. (DCOS_OSS-5276)
- Upgrade platform CPython to release 3.6.8. (DCOS_OSS-5318)
- Upgrade CockroachDB to release 2.1.8. (DCOS_OSS-5360)
- Upgrade platform curl from 7.59.0 to 7.65.1. (DCOS_OSS-5319)
- Upgrade platform OpenSSL from 1.0.2x to release 1.1.1x. (DCOS-54108)



<!-- - Updated to the latest version of cron-utils 9.0.0 and removed threeten-backport. This fixes a number of cron related issues in the underlying dependencies. Fixed a bug when task status was not updated after the task turned running (when querying embed=activeRuns). Fixes DCOS_OSS-5166 where metronome did not use the revive operation. -->

# Known Issues and Limitations
This section covers any known issues or limitations. These do not necessarily affect all customers, but might require changes to your environment to address specific scenarios. Where applicable, issue descriptions include one or more tracking identifiers for reference, enclosed in parentheses.

- `/v2/pods` and `/v2/tasks` do not include any information about existing instances. (DCOS_OSS-5616)
- Mesos modules in Enterprise version can cause deadlock during process. (DCOS-57401)
- Mesos Resources Summary dashboard should show quota limits instead of guarantees. (DCOS-57261)
- Grafana fails to load because of file permission error. (DCOS-59209)
- DC/OS overlay networks are not compared by value, but should be.  Only VTEP IP address and subnets are used. Until this issue is fixed, use VTEP IP and Subnets only, instead of NAMED overlay networks. (DCOS_OSS-5620)
- MKE is not rescheduled when a drained node is re-activated. (DCOS-59788)


<!-- - Task is marked as FAILED after being marked as FINISHED. (COPS-4995) -->


# Previous Releases
To review changes from the most recent previous releases, see the following links:
- [Release version 1.10.11](/mesosphere/dcos/1.10/release-notes/1.10.11/) - 12 February 2019.
- [Release version 1.11.12](/mesosphere/dcos/1.11/release-notes/1.11.12/) - 10 October  2019.
- [Release version 1.12.4](/mesosphere/dcos/1.12/release-notes/1.12.4/) - 2 July 2019.
- [Release version 1.13.5](/mesosphere/dcos/1.13/release-notes/1.13.5/) - 2 October 2019
