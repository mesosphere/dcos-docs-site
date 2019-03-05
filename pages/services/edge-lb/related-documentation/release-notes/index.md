---
layout: layout.pug
navigationTitle:  Release notes
title: Release notes
menuWeight: 101
excerpt: Provides release-specific information for Edge-LB 
enterprise: true
---

Edge-LB acts as a proxy server and load balancer for TCP, HTTP, and HTTPS requests. Edge-LB leverages features provided by `HAProxy`, which is open-source software that provides high-availability, failover support, load balancing, server health checks, and throughput metrics for TCP and HTTP based applications.

If you have DC/OS deployed in a production environment, see [Known issues and limitations](/services/edge-lb/related-documentation/known-limitations) to see if any potential operational changes for specific scenarios apply to your environment.

The release notes summarize release-specific changes to fix issues or update fnew eatures in DC/OS Enterprise and DC/OS Open Source clusters.

# Notable changes Edge-LB 1.3
Released on February 6, 2019.

DCOS-46043 - Improve the `apiserver` file comparison functions.

# Notable changes Edge-LB 1.2
This section summarizes changes integrated into Edge-LB from Edge-LB 1.2.0 (September 2018) to Edge-LB 1.2.3 (November 2018), with the most recent changes listed first.

## Edge-LB 1.2.3
Released on November 27, 2018.

* `lbmgr`: Enforce the timeout during the connection phase of the healthcheck command.
* `apiserver`: Make health checks for pool tasks configurable using the following new pool parameters:
  * `poolHealthcheckGracePeriod` - Defines the period of time after start of the pool container when failed healtchecks will be ignored (default: 180s).
  * `poolHealthcheckInterval` - Defines healthcheck execution interval. At most one healtcheck is going to execute at any given time (default: 12s).
  * `poolHealthcheckMaxFail` - Defines how many consecutive failures mark the task as failed and force Mesos to kill it (default: 5).
  * `poolHealthcheckTimeout` - Defines the timeout enforced by Mesos on the healthcheck execution. It includes the container startup (fetch, setup, start, etc...) as well as the time spent by the healthcheck command executing the test.

### Issues fixed in this release
* COPS-3951, DCOS-43677 - LB task getting killed intermittently leading to outage for apps being load balanced.
* COPS-4127, DCOS-45184 - Edge-LB Pools being KILLED to due missing `/var/state/haproxy/global` files.
 
## Edge-LB 1.2.2
Released on November 15, 2018.

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
  * Use `-slim` version of Debian for smaller containers.
  * Installed basic debugging tooling.
  * Made LBWORKDIR the working directory of the container.
  * Removed unnecessary tooling regarding iptables, syslogd, etc.
  * Now only necessary artifacts are copied into the container during the build (i.e., no more Dockerfile).
  * Verbose when copying files during the container start.

### Issues fixed in this release
* COPS-3823, DCOS-42154 - EdgeLB default template for SNI is incorrect.
* COPS-3891, DCOS-42944 - EdgeLB Pool created but does not show up in the DC/OS command-line interface (CLI).
* COPS-3893, DCOS-42960 - Edge-LB pool is unable to launch additional load balancer tasks.
* COPS-3901, DCOS-43049 - EdgeLB creating frequent sidecars, SIGSEV in apiserver logs.
* COPS-4014, DCOS-44199 - Edge LB pool cannot deploy if app and secret are under namespace/group.
* COPS-4024, DCOS-44207 - DC/OS 1.11.3 EE - Strict mode - Non superuser access needed to Edge-LB pool logs.
* DCOS-41521 - Edgelb should ignore terminal but not ack'ed tasks from Mesos when subscribing.
* DCOS-43470 - Bug in handling of carried tasks in mesos-listener, after Mesos master's failover.
* DCOS-43968 - Update SDK used by edge-lb in order to mitigate Java vuln.
* DCOS-44346 - Edge-LB build process is broken in a couple of places.
* DCOS-44061 - Version of dcos cli and dcos cluster do not match causing broken CI integration tests.
* DCOS-44715 - Failed to delete "Bootstrap Registry" causing CI of edgelb Broken.

## Edge-LB 1.2.1
Released on September 17, 2018.

* Added timestamp to log messages produced during cont. start.
* Replaced manual logline prefixing with proper source code file log field.
* Migrated logging to logrus, unify logging.
* Increased log retention for edge-lb containers.
* Added extra logging about the mesos state snapshot logging for better troubleshooting of Edge-LB.

## Edge-LB 1.2.0
Released on September 11, 2018.

* dcos-template: Properly handle nil values for some of the Mesos tasks protobuf fields.
* dcos-template: Set maximum grpc recv. message size to 100MIB.
* lbmgr: Adjust environment passing to match the new HAProxy svc launch model. This change fixes `AUTOCERT` and `SECRET` env passing in the HAProxy task container.
* api-swagger-spec: Bump api version to match Edge-LB version.
* Introduce proper versioning for edgelb-pool cosmos package to match the version of the package with the version of the edgelb package itself instead of `stub-universe`.
* Make the output of `dcos edgelb show --json` copmmand be the actual pool configuration instead of wrapping it in a configuration container. This enables feeding the output of `show` command directly to the `update` command.
* Cleanup of the goswagger code generation code and build chain, bump of goswagger tool used for generation from v0.11 to v0.16.
* Bump `golang` from 1.8.3 to 1.10.3.
* Fix anonymous ACLs logic for predefined conditions.
* Bump `haproxy` from 1.8.12 to 1.8.13. [changelog](http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;h=aed48fc5fb951aff7dd458c4bc9bfcfe1d5dd99a;hb=HEAD).
* Commit protobuf code changes that stem from [tool update].(https://github.com/golang/protobuf/tree/master/protoc-gen-go).

<p class="message--warning"><strong>WARNING: </strong>With the introduction of proper versioning of the edgelb-pool cosmos package, it is neccessary to remove any `packageVersion` fields from the pool configuration prior to upgrading.</p>

### Issues fixed in this release
* COPS-3566, DCOS-39655 - Edge-LB. HAProxy disobeys "use_backend if" filter.
* COPS-3682, DCOS-40510 - The EdgeLB pool 'show --json' command produces JSON that cannot be used in a subsequent pool operation. 
* COPS-3733, DCOS-40866 - EdgeLB 1.1.0 broke Autocert feature.
* COPS-3736 - Edge-LB: Cannot configure SSL certificate using secrets.
* COPS-3767, DCOS-41274 - High churn of sidecar tasks in the cluster.
* COPS-3768, DCOS-41288/DCOS-41544 - Increase the maximum size of the GRPC message supported by the Edge-LB API server.
* COPS-3769, DCOS-41287 - SIGSEGV ind dcos-template if the Name of the port is missing.
* COPS-3770, DCOS-41322 - Applications exposed through EdgeLB encountering 503 errors.

# Notable changes Edge-LB 1.1
This section summarizes changes integrated into Edge-LB from Edge-LB 1.0.1 (March 2018) to Edge-LB 1.1.0 (August 2018), with the most recent changes listed first.

## Edge-LB 1.1.0
Released on August 9, 2018.

* Updates the version of HAProxy used by the pool servers to 1.8.12 from 1.7.6. For details about the changes, see the HAProxy CHANGELOG.
* Pool server reloads are no longer blocked by persistent connections.
* Stability, debuggability and reliability improvements in the pool server code.
* The size of the pool container was reduced from approximately 250MB to 100MB. 
* Transition to Master/Worker mode in HAProxy running on the pool server. If custom configuration templates are used, then they must be updated. Namely:
template must not specify the daemon option
template must specify the expose-fd listeners parameter in the stats socket option.
* Edge-LB now uses the default CLI packages from the DC/OS SDK edgelb-pool CLI subcommand. Compared to edge-lb native packages, they do not support the version subcommand.
* Provides a `mesosAuthNZ` package install option. If this options is set to false, Edge-LB can run on DC/OS 1.10 clusters in `disabled` security mode.

## Edge-LB 1.0.3
Released on June 6, 2018.

* Updates the DC/OS SDK dependency to require version 0.42.1.
* Fixes a bug which was causing configuration reloads to cause short downtimes of the services behind the load balancer.

## Edge-LB 1.0.2
Released on March 20, 2018.

* Fixes a bug that caused all V2 API `backend.service` selector fields ending in “Pattern” to not function properly.

## Edge-LB 1.0.1
Released on March 12, 2018.

* Updates the SDK dependency to require version 0.40.5. This dependency change addresses a bug that could cause a pool scheduler to erroneously destroy one or more Marathon persistent volumes, potentially leading to data loss.

# Notable changes Edge-LB 1.0
This section summarizes changes integrated into Edge-LB from Edge-LB 0.1.5 (August 2017) to Edge-LB 1.0.0 (March 2018), with the most recent changes listed first.

## Edge-LB 1.0.0
Released on March 7, 2018.

* Introduces the Edge-LB REST API version 2 (V2) with a new and more intuitive model for selecting service/app backends.
* Provides a new CLI command structure with the ability to create, modify, and delete individual pools.
* Supports Dockerized builds and other CI improvements.
* Adds strict security mode support for DC/OS Enterprise version 1.11, and newer.
* Includes a security-related fix in logging.
* Supports `curl` using the `-k` option within the same container.
* Updates healthchecks to MESOS_HTTP.
* The Load balancer manager connects to the Edge-LB API server through https adminrouter with a service account.
* The pool scheduler uses Mesos V1 API and requires additional service account permissions.
* Improves security for communication between Edge-LB commands and the Edge-LB API server.
* Adds logging to mesos-listener and requests created by the API server.
* Adds the `loglevel` option to the Edge-LB package install command to make the API server `logLevel` configurable.

## Edge-LB 0.1.9
Released on October 6, 2017.

* Fix path routing bug which resulted in adding a “/” to paths in certain configurations.
* Fix `dcos edgelb` command-line interface for clusters with dashboard URLs using `http://` scheme.

## Edge-LB 0.1.8
Released on September 13, 2017.

* Fix scheduler bug for unhandled rescind offers (causes unhealthy in UI).
* Decrease reload wait from 10 seconds to 5 seconds.

## Edge-LB 0.1.7
Released on September 8, 2017.

* Minimum DC/OS version 1.10 in universe package.
* Fix static VIP parsing in template.
* Fix bug with stale API server template artifacts.

## Edge-LB 0.1.6
Released on September 5, 2017.

* Fix Mesos Role * in config.

## Edge-LB 0.1.5
Released on August 30, 2017.

* Fix HTTP healthchecks.
* Upgrade to HAProxy 1.7.6.
* HAProxy 1.7.3 had a bug that caused timeouts to occur with each reload.
* Make virtual networks configurable.
* Fix bug with multiple secrets.
* Add `dcos edgelb config --reference` command-line option.