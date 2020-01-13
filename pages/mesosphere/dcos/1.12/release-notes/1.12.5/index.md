---
layout: layout.pug
navigationTitle: Release Notes for 1.12.5
title: Release Notes for 1.12.5
menuWeight: 3
excerpt: Release notes for DC/OS 1.12.5
---

DC/OS Version 1.12.5 was released on 13 January 2020.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.12.5/dcos_generate_config.ee.sh"]Download DC/OS Enterprise [/button]

DC/OS 1.12.5 includes the following components:

- Apache Mesos 1.7.3-dev [change log](https://github.com/apache/mesos/blob/d8acd9cfacd2edf8500f07f63a8837aa0ddd14ba/CHANGELOG)
- Marathon 1.7.216 [change log](https://github.com/mesosphere/marathon/blob/9e2a9b579b968a2664df03099b03eaf86ffc7efc/changelog.md)
- Metronome 0.6.33 [change log](https://github.com/dcos/metronome/blob/b8a73dd3cc3c2da035222031ccbbcf5c836ede7b/changelog.md)
- Updated DC/OS UI to 1.12+v2.26.18.
- Updated Signal service to release 1.6.0

# Release summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues fixed in DC/OS 1.12.5
The issues that have been fixed in DC/OS 1.12.5 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

- The DC/OS diagnostics bundle now includes Mesos state logs content, located at `/var/log/mesos-state.tar.gz`. (DCOS-56403)
- Added 3 new environment files to Mesos systemd. (DCOS-49092)
- [Metronome] post-install configuration can be added to `/var/lib/dcos/metronome/environment` (DCOS_OSS-5509)
- Changed `dcos-zk backup` and `dcos-zk restore` to exit early if ZooKeeper is running. (DCOS_OSS-5353)
- Fixed preflight docker version check failing on unknown versions. (DCOS-56831)
- DC/OS Net: Fix support for big sets in the IPset manager. (DCOS-57506, COPS-5229)
- Added new diagnostic REST API bundle with performance improvements. (DCOS_OSS-5098)
- Fixed old diagnostics bundle from increasing diagnostics job duration when job was done. (DCOS_OSS-5494)
- Removed `nogroup` creation. (COPS-5220, DCOS-59247) 
- Increased number of diagnostics fetchers. (DCOS-51483) 
- Fixed DC/OS overlay networks update comparison to use all fields. (DCOS_OSS-5620)
- All agent VTEP IPs reserve when recovering from replicated log. (DCOS_OSS-5626)
- Set network interfaces as unmanaged for networkd only on CoreOS, which fixes an issue that could prevent the overlay network from working properly in some situations.(COPS-5575, DCOS-60956)
- Fixed DC/OS clients that do not adhere to Exhibitor TLS. (DCOS-57704)	
- Changed dcos-e2e version to get higher log retention in 1.12, 1.13 and master branches. (DCOS-58001)	
- Fixed incorrect dcos-diagnostics HTTP response status codes for GET/DELETE. (DCOS-58105)	
- Fixed DC/OS clients that do not adhere to Exhibitor TLS for versions 1.12 and 1.13. (DCOS-58361)
- Fixed DC/OS Backup for Exhibitor TLS. (COPS-5313, DCOS-60918)
- Added support for Mesos overlay networking to drop agents from the state. (DCOS_OSS-5536)
- DC/OS now supports multi-role framework in the authorization module. (DCOS-54635)
- The time it takes to deploy a service with a L4-VIP has been reduced by pruning VIPs, which reduced growth of state messages exchanged among dcos-net processes.  (DCOS-56071, DCOS_OSS-5356)
- You can now delete a service endpoint via Form. (DCOS-21472) 
- You can now save Docker parameters, as expected. (DCOS-45226)
- Fixed tests: autouse=True in Marathon fixture. (DCOS-45746) 
- Fixed TypeError in ResourcesUtil.getAvailableResources (DCOS-46307)
- Error message for invalid input in package creation now goes away after updating the field. (DCOS-46413) 
- Fixed an issue where Mesos master memory use seems to increase (DCOS-55315)
- Fixed an issue where `dcos-signal` did not report customer ID from customer environments. (DCOS-55882)
- Fixed issue where Secrets folder can fill up a partition. (DCOS-56481)
- Fixed potential deadlock in RPC authenticatee (DCOS-57388)
- Fixed Chrome issue on OS X such that certificates start on 30 June 2019. (DCOS-60205)
- Fixed an issue where newly added public agents were not showing up in the DC/OS UI. (COPS-5606, DCOS-61274)
- Fixed an issue where Secrets sometimes disappear from JSON editor in UI (COPS-4928, DCOS-55692)
- Fixed an issue where the UI form deletes `networkNames` property from pod endpoints (DCOS-50452)
- Secret generator no longer produces extra authentication warnings in Enterprise Mesos modules (COPS-4767, DCOS-52793)
- DC/OS now supports DESTROY_RAW_DISK authorization action. (DCOS-50932)
- Under heavy load, direct requests to the IAM could be slowed down, making the IAM slow to respond to all requests. Mesos master now uses a login endpoint that goes through Admin Router, reducing the effect of any slow senders. This addresses a rare error condition in which the IAM system can become unavailable, potentially leading to Mesos task launch errors in the strict security mode. (DCOS-56053)
- Package specific icons are now showing up properly for all services installed from Universe. (DCOS-53674, COPS-4710) 
- Fixed a licensing permissions error, that resulted in the following message, "error getting LicenseID. Got error: Get http://unix/licenses: dial unix /run/dcos/dcos-licensing.sock: connect: permission denied" (DCOS-57291)
- Updated code to unify frequency between DC/OS Signal EE and OSS; signal now sends telemetry data every five minutes. (DCOS-57281)
- Updated DC/OS master to accept the most up to date plugins. Pinned the dcos CLI plugins in every DC/OS branch for both OSS and Enterprise versions, and consolidated all dcos cli instantiations into one fixture. (DCOS-57266)
- Completed merge signal work for both Enterprise and OSS versions. (DCOS-57062)
