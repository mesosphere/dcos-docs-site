---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 0
excerpt: Release notes for Edge-LB 1.2
enterprise: false
---

These are the release notes for Edge-LB 1.2.

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

# v1.2.1

Released on September 17, 2018.

## Notable Changes

- Added Add timestamp to log messages produced during cont. start
- Replaced manual logline prefixing with proper source code file log field
- Migrated logging to logrus, unify logging
- Increased log retention for edge-lb containers
- Added extra logging about the mesos state snapshot logging for better troubleshooting of Edge-LB

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the web interface to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

# v1.2.0

Released on September 11, 2018.

## Notable Changes

* dcos-template: Properly handle nil values for some of the Mesos tasks protobuf fields.
* dcos-template: Set maximum grpc recv. message size to 100MIB.
* lbmgr: Adjust environment passing to match the new HAProxy svc launch model. This fixes `AUTOCERT` and `SECRET` env passing in the HAProxy task container.
* api-swagger-spec: Bump api version to match Edge-LB version.
* Introduce proper versioning for edgelb-pool cosmos package to match the version of the package with the version of the edgelb package itself instead of `stub-universe`.
* Make the output of `dcos edgelb show --json` copmmand be the actual pool configuration instead of wrapping it in a configuration container. This enables feeding the output of `show` command directly to the `update` command.
* Cleanup of the goswagger code generation code and build chain, bump of goswagger tool used for generation from v0.11 to v0.16.
* Bump `golang` from 1.8.3 to 1.10.3.
* Fix anonymous ACLs logic for predefined conditions.
* Bump `haproxy` from 1.8.12 to 1.8.13. [changelog](http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;h=aed48fc5fb951aff7dd458c4bc9bfcfe1d5dd99a;hb=HEAD).
* Commit protobuf code changes that stem from [tool update](https://github.com/golang/protobuf/tree/master/protoc-gen-go).

<p class="message--warning"><strong>WARNING: </strong>With the introduction of proper versioning of the edgelb-pool cosmos package, it is neccessary to remove any `packageVersion` fields from the pool configuration prior to upgrading.</p>

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the web interface to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.1/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.
