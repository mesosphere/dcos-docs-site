---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 0
excerpt: Discover the new features, updates, and known limitations in this release of the Edge-LB Service
enterprise: false
---

# Release notes for Edge-LB version 1.3.1
Edge-LB Service version 1.3.1 was released April 29, 2019.

# New features and capabilities

- Includes Mesos health checks when generating the list of active backends.
- Provides Edge-LB artifacts as a `.dcos` package bundle.
- Updates the SDK version from 0.55.2 to 0.55.4.
- Updates the HAProxy version to 1.9.4.
- Improves support for dynamically-allocated frontend ports.
- Displays the frontend name in the output for the `dcos edgelb endpoints` command.
- Improves the stability and scalability for the Edge-LB pool `dcos-template` and in the `mesos-listener` program.
- Provides additional test coverage and other improvements in existing Edge-LB integration tests.

# Issues fixed

- DCOS-45719 - Edge-LB waits for load balanced applications to to be running in a healthy state before routing traffic to them. This change prevents Edge-LB from routing traffic to an application before it completes its startup operations and its first health check. 
- DCOS-47839 - Users can specify the Edge-LB pool frontend using either the `name` or `port` setting.
- DCOS-44077 - The `mesos-listener` program that communicates with Edge-LB includes improvements to tests coverage and code refactoring.
- DCOS-51865 - Edge-LB continuous integration has been enhanced through testing and code refactoring.
- DCOS-48059 - Edge-LB can successfully return the task id and task status for both server and sidecar tasks.
- DCOS-46502 - Validates regular expressions from user input.
- DCOS-48132 - The Edge-LB dcos-template monitors and reloads its configuration file to prevent Edge-LB pool updates from generating errors when there are frequent pool changes. 

# Known issues and limitations

- Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.

- The steps provided in the DC/OS 1.10 web interface to uninstall Edge-LB are incorrect. In order to correctly uninstall Edge-LB for any given DC/OS version, please follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.3/uninstalling/).

- Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with `ext4` may have connection issues.

- If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

# Release notes for Edge-LB version 1.3.0
Edge-LB Service version 1.3.0 was released February 6, 2019.

# New features and capabilities

- Simplify and optimize the HAProxy reload loop.
- Improve the update strategy for the Edge-LB pool.
- Bump the SDK version to 0.55.2.
- Add protection against installing a pool while its previous version is still uninstalling.
- Improve sidecars runs.
- Improve integration test coverage.
- Improve error messages with better logging
- Expose task without pre-defined mesos-assigned ports
- Dynamic allocation of the HAProxy STATS port
- Dynamic allocation of the HAProxy Frontend port
- Scale down Edge-LB pool instances

# Issues fixed

- COPS-4272, DCOS-46189 - Edge-LB assets is missing on downloads site
- DCOS-46043 - Fix Edge-LB API Server's file comparison functions
- DCOS-46510 - Edge-LB may create haproxy configuration with duplicate backends
- DCOS-46837 - Framework scheduler can crash after installing
- DCOS-48009 - ENVFILE Certificates written in wrong location
- DCOS-46181 - Integration test does not use artifacts uploaded from its PR

# Known issues and limitations

- Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.

- Edge-LB currently does not support self-service configuration. All configuration must be handled centrally.

- The steps provided in the DC/OS 1.10 web interface to uninstall Edge-LB are incorrect. In order to correctly uninstall Edge-LB for any given DC/OS version, please follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.3/uninstalling/).

- Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with `ext4` may have connection issues.

- If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

<!-- 
# v1.2.3

Released on November 27, 2018.

## Notable Changes

* lbmgr: Enforce the timeout also during the connection phase of the healthcheck
  command
* apiserver: Make the following parameters of the pool tasks healthchecking configurable via new pool parameters:
  * `poolHealthcheckGracePeriod` - Defines the period of time after start of the pool container when failed healtchecks will be ignored (default: 180s).
  * `poolHealthcheckInterval` - Defines healthcheck execution interval. At most one healtcheck is going to execute at any given time (default: 12s).
  * `poolHealthcheckMaxFail` - Defines how many consecutive failures mark the task as failed and force Mesos to kill it (default: 5).
  * `poolHealthcheckTimeout` - Defines the timeout enforced by Mesos on the healthcheck execution. It includes the container startup (fetch, setup, start, etc...) as well as the time spent by the healthcheck command executing the test.

## Bug Fixes

* LB task getting killed intermittently leading to outage for apps being load balanced.
 
## Known Limitations

* Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB currently does not support self-service configuration. All configuration must be handled centrally.

## Known Issues

* The steps provided in the DC/OS 1.10 web interface to uninstall Edge-LB are incorrect. In order to correctly uninstall Edge-LB for any given DC/OS version, please follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

# v1.2.2

Released on November 15, 2018.

## Notable Changes

* lbmgr: Improved healthchecking
  * Instead of shelling out to `socat`, lbmgr now natively handles communication with HAProxy
  * Added more information about status on successful and failed healthcheck regarding size of the reply, time it took to write the command, fetch the result, total time
  * Made the healthcheck time out to 9 seconds. This is 1 second sooner than Mesos healthcheck. This helps identifying the timeout occurence time.
* mesos-listener: Added support for TASK_GONE_BY_OPERATOR event
* mesos-listener: Events for non-existent tasks are ignored
* mesos-listener: Made goroutines properly mark themselves as done during the termination
* mesos-listener: Mesos-failover code handling:
  * Prevent overriding of framework data in carried-over tasks
  * Prevent carry-over logic from removing frameworks that may still be in use by the tasks in the active shapshot
* mesos-listener: No longer sends inactive tasks to the clients; only those in TASK_RUNNING will be now present in the data offered to clients.
* mesos-listener: Increased tests coverage with improved integration tests
* Updated SDK used by Edge-LB from 0.42.3 to 0.54.2
  * This also updated Java JRE to 8u192 from 8u172 to address Java vulnerabilities
* Bumped HAProxy version used from 1.8.13 to 1.8.14
* Pool task container improvements:
  * Use -slim version of Debian for smaller container
  * Installed basic debugging tooling
  * Made LBWORKDIR the working directory of the container
  * Removed unnecessary tooling regarding iptables, syslogd, etc.
  * Now only necessary artifacts are copied into the container during the build (i.e., no more Dockerfile)
  * Verbose when copying files during the container start


## Bug Fixes

* In DC/OS 1.11.3 EE (strict mode), non-superuser access needed to Edge-LB pool logs
* Edge-LB – default template for SNI is incorrect
* Edge-LB should ignore terminal but not ack'ed tasks from Mesos when subscribing.
* Edge-LB pool is unable to launch additional load balancer tasks
* Edge-LB pool can not deploy if app and secret are under namespace/group

## Known Limitations

* Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB currently does not support self-service configuration. All configuration must be handled centrally.

## Known Issues

* The steps provided in the DC/OS 1.10 web interface to uninstall Edge-LB are incorrect. In order to correctly uninstall Edge-LB for any given DC/OS version, please follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.
