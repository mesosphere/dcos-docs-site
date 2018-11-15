---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 0
excerpt: Release notes for Edge-LB 1.2

enterprise: false
---

These are the release notes for Edge-LB 1.2.

# v1.2.2

Released on November 15, 2018.

## Notable Changes

* lbmgr: Improved healthchecking
  * Instead of shelling out to `socat`, lbmgr now natively handles communication with haproxy
  * Added more information about status on successful and failed healthcheck regarding size of the reply, time it took to write the command, fetch the result, total time
  * Made the healthcheck time out to 9 seconds. Its 1 second sooner than Mesos healthcheck. This way there is more verbose information about where the timeout occured.
* mesos-listener: Added support for TASK_GONE_BY_OPERATOR event
* mesos-listener: Events for non-existant tasks are ignored
* mesos-listener: Made goroutines properly mark themselves as done during the termination
* mesos-listener: Fixed bugs in mesos-failover handling code:
  * Prevent overriding of framework data in carried over tasks
  * Prevent carry-over logic from removing frameworks that may still be in use by the tasks in the active shapshot
* mesos-listener: No longer send inactive tasks to the clients, only those in TASK_RUNNING will be now present in the data offered to clients
* mesos-listener: Improve integration tests and increase the tests coverage
* Updated SDK used by Edge-LB from 0.42.3 to 0.54.2
  * This update also updates the Java JRE to 8u192 from 8u172 to address Java vulneralibities
* Bumped haproxy version used from 1.8.13 to 1.8.14
* Pool task container improvements:
  * Use -slim version of debian for smaller container
  * Installed some basic debugging tooling
  * Made LBWORKDIR the working directory of the container
  * Removed unnecessary tooling regarding iptables, syslogd, etc.
  * Made sure that only the necessary artifacts are copied into the container during the build (i.e. no more Dockerfile)
  * Be verbose when copying files during the container start

## Bug Fixes

* In DC/OS 1.11.3 EE (strict mode), non-superuser access needed to Edge-LB pool logs
* EdgeLB – default template for SNI is incorrect
* Edgelb should ignore terminal but not ack'ed tasks from Mesos when subscribing.
* Edge-LB pool is unable to launch additional load balancer tasks
* Edge LB pool can not deploy if app and secret are under namespace/group

## Known Limitations

* Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB currently does not support self-service configuration. All configuration must be handled centrally.

## Known Issues

* The steps provided in the DC/OS UI to uninstall Edge-LB are incorrect. Follow these steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

# v1.2.1

Released on September 17, 2018.

## Notable Changes

- Added Add timestamp to log messages produced during cont. start
- Replace manual logline prefixing with proper source code file log field
- Migrate logging to logrus, unify logging
- Increase log retention for edge-lb containers
- Add extra logging about the mesos state snapshot logging for better troubleshooting of Edge-LB

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

# v1.2.0

Released on September 11, 2018.

## Notable Changes

* dcos-template: Properly handle nil values for some of the Mesos tasks protobuf fields.
* dcos-template: Set maximum grpc recv. message size to 100MIB.
* lbmgr: Adjust environment passing to match the new haproxy svc launch model. This fixes `AUTOCERT` and `SECRET` env passing in the haproxy task container.
* api-swagger-spec: Bump api version to match edgelb version.
* Introduce proper versioning for edgelb-pool cosmos package to match the version of the package with the version of the edgelb package itself instead of `stub-universe`.
* Make the output of `dcos edgelb show --json` cmd be the actual pool configuration instead of wrapping it in a configuration container. This enables feeding the output of `show` command directly to the `update` command.
* Cleanup of the goswagger code generation code and build chain, bump of goswagger tool used for generation from v0.11 to v0.16.
* Bump `golang` from 1.8.3 to 1.10.3.
* Fix anonymous ACLs logic for predefined conditions.
* Bump `haproxy` from 1.8.12 to 1.8.13. [changelog](http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;h=aed48fc5fb951aff7dd458c4bc9bfcfe1d5dd99a;hb=HEAD).
* Commit protobuf code changes that stem from [tool update](https://github.com/golang/protobuf/tree/master/protoc-gen-go).

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.1/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.
