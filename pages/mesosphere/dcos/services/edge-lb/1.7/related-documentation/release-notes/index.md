---
layout: layout.pug
navigationTitle:  Release notes
title: Release notes
menuWeight: 101
excerpt: Provides release-specific information for Edge-LB
enterprise: false
---

These Edge-LB Release Notes summarize release-specific changes that fix issues or update Edge-LB features for DC/OS&trade; clusters.

# DC/OS for Edge-LB Service version 1.7.0 Release Notes

Edge-LB Service version 1.7.0 was released on 27 October 2020.

## IMPORTANT
This release contains fixes to the Auto Pool and HAProxy Pool templates. To receive the benefit of these fixes, both the Auto Pool templates and the HAProxy Pool templates must be reset:

```sh
# for the default and any additional configured Auto Pool pool-template
dcos edgelb pool-template reset default

# for each existing pool
dcos edgelb template delete <pool-name>
```

If the templates have been customized, it is advised to download the new templates and manually merge them as needed.

## New features and capabilities
- Auto Pools generated pools configuration is sorted to prevent unnecessary pool reloads:
    - Backend servers are sorted by Mesos framework id and task id
    - Certificate lists are sorted alphabetically
    - Secrets are sorted by secret name
    - Frontends are sorted by port number
    - Backends are sorted by `<group>` / backend name
    - Fontend -> Backend rules are sorted by:
        - hostEq
        - hostReg
        - pathBeg (most specific paths are listed first)
        - pathReg
        - pathEnd (most specific paths are listed first)
- HAProxy generated configuration is sorted to prevent unnecessary pool reloads:
    - Frontends are sorted by name
    - Backends are sorted by name
    - Backend servers are sorted by type, host, and port
- Mesos updates are rate limited (default 1/second)
- Logos added for display in the Universe Catalogue
- HAProxy is configured to log to stdout directly by default, removing the need for syslog in the loadbalancer container
- Service Diagnostic CLI command now correctly captures apiserver logs for default installs
- HAProxy is updated to 2.0.18
- EdgeLB is now built with Golang 1.15.3

# DC/OS for Edge-LB Service version 1.6.1 Release Notes

Edge-LB Service version 1.6.1 was released on 26 June 2020.

## New features and capabilities

- Added option to disable AWS meta-data fetching as well as the meta-data endpoint
- Auto Pool templates now support applications overriding the backend.endpoin dictionary
- HAProxy is updated to 2.0.15
- EdgeLB is now built with GO 1.14.4


# DC/OS for Edge-LB Service version 1.6.0 Release Notes

Edge-LB Service version 1.6.0 was released on 10 June 2020.

## New features and capabilities

- EdgeLB is now supported on DC/OS Open Source
- `mesosProto` defaults to https when running on Enterprise instead of http
- HAProxy is updated to 2.0.14
- Pools are launched with the scheduler jre (OpenJDK-11)


# DC/OS for Edge-LB Service version 1.5.1 Release Notes

Edge-LB Service version 1.5.1 was released on 17 December 2019.

## Bug Fixes
- Edge-LB TLS certificates now include the full bundle of intermediate certificates in the CC's cert. (DCOS-60770)
- Edge-LB 1.5 is now using the correct container IP address. (DCOS-60517)

## Other Changes
- Upgraded SDK version to v0.57.2 to resolve a deployment issue.
- Began collecting diagnostic bundle for all pools, by default.

## Known issues and limitations
- Auto Pool updates slow down as the number of templates increases, or as large changes to the Apache&reg; Mesos&reg; state occur, such as many apps starting or stopping.


# DC/OS for Edge-LB Service version 1.5.0 Release Notes

Edge-LB Service version 1.5.0 was released on 30 October 2019.

## Breaking Changes
- Templates now use [Sprig](http://masterminds.github.io/sprig/) template functions instead of custom functions. The [`env`](http://masterminds.github.io/sprig/os.html) functions are not exposed to templates.

## Deprecation
- The v1 API is now deprecated and D2iQ&reg; may remove it in a future release.

## New features and capabilities
- The Auto Pools feature allows self-service configuration, and can automatically start a pool from a template with values from Apache&reg; Mesos&reg; task labels.
- The certificate generated for `$AUTOCERT` is now valid for 10 years and has a random serial number.
- Updates the SDK version from 0.55.2 to 0.57.0.
- Adds `apiserver`, `cloud-controller`, `dcos-template`, `lbmgr`, and `mesos-listener` exporter for metrics.
- Metric names renamed in line with Prometheus community guideline.
- The `apiserver` now uses `container/bridge` network type.
- [Pool constraints](/mesosphere/dcos/services/edge-lb/1.5/reference/pool-configuration-reference/v2-reference/#pool) now support region placement constraints.

## Known issues and limitations
- Auto Pool updates become slower as the number of templates increases, or as large changes to the Mesos state occur, such as many apps starting or stopping.


# Edge-LB version 1.4
Edge-LB service version 1.4.0 was released June 24, 2019.

## New features and capabilities
- Introduces automatic provisioning and lifecycle management for AWS&reg; Network Load Balancers&reg; (NLB&reg;).
- Adds a new command-line program for removing AWS load balancer instances created for Edge-LB, if you uninstall Edge-LB.
- Provides a new command-line program for collecting logs and creating diagnostic bundles for Edge-LB operations.
- Updates the HAProxy&reg; version to 2.0.1
- Updates the Golang version to 1.12.7
- Removes the use of sidecar
- Adds haproxy exporter for HAProxy metrics


# Edge-LB version 1.3.1
Edge-LB service version 1.3.1 was released April 29, 2019.

### New features and capabilities
* Includes Apache Mesos health checks when generating the list of active backends.
* Provides Edge-LB artifacts as a .dcos package bundle.
* Updates the SDK version from 0.55.2 to 0.55.4.
* Updates the HAProxy version to 1.9.4.
* Improves support for dynamically-allocated frontend ports.
* Displays the frontend name in the output for the dcos edgelb endpoints command.
* Improves the stability and scalability for the Edge-LB pool dcos-template and in the `mesos-listener` program.
* Provides additional test coverage and other improvements in existing Edge-LB integration tests.

### Issues fixed in this release
* DCOS-45719 - Edge-LB waits for load balanced applications to to be running in a healthy state before routing traffic to them. This change prevents Edge-LB from routing traffic to an application before it completes its startup operations and its first health check.
* DCOS-47839 - Users can specify the Edge-LB pool frontend using either the name or port setting.
* DCOS-44077 - The Mesos-listener program that communicates with Edge-LB includes improvements to tests coverage and code refactoring.
* DCOS-51865 - Edge-LB contiuous integration has been enhanced through testing and code refactoring.
* DCOS-48059 - Edge-LB can successfully return the task id and task status for both server and sidecar tasks.
* DCOS-46502 - Validates regular expressions from user input.
* DCOS-48132 - The Edge-LB dcos-template monitors and reloads its configuration file to prevent Edge-LB pool updates from generating errors when there are frequent pool changes.


# Edge-LB version 1.3.0
Edge-LB service version 1.3.0 was released February 6, 2019.

### New features and capabilities
* Simplifies and optimizes the HAProxy load balancer reload loop.
* Improves the update strategy for the Edge-LB pool.
* Updates the SDK version used by Edge-LB to 0.55.2.
* Adds protection against installing a pool while its previous version is still uninstalling.
* Improves sidecars runs.
* Improves integration test coverage.
* Provides better error messages and logging.

### Issues fixed in this release
* COPS-4272, DCOS-46189 - Restores Edge-LB artifacts that were missing on the Mesosphere Edge-LB Downloads page.
* DCOS-46043 - Updates the Edge-LB API server’s file comparison functions to provide more accurate information.
* DCOS-46510 - Supports load balancer configuration settings that include duplicate backends.
* DCOS-46837 - Protects against installing a pool with given name while a different pool with the same name is still uninstalling. This change prevents the framework scheduler from crashes caused by conflicting uninstall and install operations.
* DCOS-48009 - Updates the location used for `$ENVFILE` certificates to match the location where the Edge-LB load balancer expects to find them.


# Edge-LB version 1.2 series
This section summarizes changes integrated into Edge-LB from Edge-LB 1.2.0 (September 2018) to Edge-LB 1.2.3 (November 2018), with the most recent changes listed first.

### Edge-LB version 1.2.3
Released on November 27, 2018.

* `lbmgr`: Enforces the timeout during the connection phase of the health check command.
* `apiserver`: Makes health checks for pool tasks configurable using the following new pool parameters:
  * `poolHealthcheckGracePeriod` - Defines the period of time after start of the pool container when failed health checks will be ignored (default: 180s).
  * `poolHealthcheckInterval` - Defines the health check execution interval. At most, one health check is going to execute at any given time (default: 12s).
  * `poolHealthcheckMaxFail` - Defines how many consecutive failures mark the task as failed before forcing Mesos to kill it (default: 5).
  * `poolHealthcheckTimeout` - Defines the timeout enforced by Mesos on the healthcheck execution. It includes the container startup (fetch, setup, start, etc...) as well as the time spent by the healthcheck command executing the test.

#### Issues fixed in this release
* COPS-3951, DCOS-43677 - Prevents load balancing tasks from being killed intermittently. This change helps to prevent service outages for applications that are being load balanced.
* COPS-4127, DCOS-45184 - Prevents Edge-LB pools from being KILLED to due missing `/var/state/haproxy/global` files.

### Edge-LB version 1.2.2
Released on November 15, 2018.

* lbmgr:
  * Instead of shelling out to use the `socat` utility, `lbmgr` now natively handles communication with the HAProxy load balancer.
  * Adds more information about successful and failed health checks, including the size of the reply, the time it took to write the command, the time required to fetch the result, and the total time for the operation to complete.
    * Sets the health check timeout to 9 seconds. This timeout expires one second sooner than the default Mesos health check. This change helps you identify when the timeout occurred.
* mesos-listener:
    * Adds support for TASK_GONE_BY_OPERATOR events.
    * Ignores events for non-existent tasks.
    * Marks `goroutines` as done when properly terminated.
    * Prevents overriding of Mesos-failover framework data in carried-over tasks.
    * Prevents carry-over logic from removing frameworks that may still be in use by the tasks in the active snapshot.
    * Prevents sending inactive tasks to the clients. Only tasks in the TASK_RUNNING state are included in the data offered to clients.
    * Increases tests coverage with improved integration tests.
* Updates the SDK used by Edge-LB from 0.42.3 to 0.54.2. This change also updates the Java runtime environment (JRE) to 8u192 from 8u172 to address Java vulnerabilities.
* Updates the HAProxy version used from 1.8.13 to 1.8.14.
* Pool task container improvements:
  * Uses the `-slim` version of Debian for smaller containers.
  * Includes basic debugging tools during installation.
  * Make `LBWORKDIR` the working directory of the container.
  * Removes unnecessary tooling regarding `iptables`, `syslogd`, and other programs.
  * Copies only the necessary artifacts into the container during the build (for example, does not include the Dockerfile).
  * Supports verbose output when copying files during the container startup operation.

#### Issues fixed in this release
* COPS-3823, DCOS-42154 - Fixes a problem in the Edge-LB default template for server name indication (SNI).
* COPS-3891, DCOS-42944 - Improves handling for resource reservations to ensure that Edge-LB pools that have been properly created or relaunched are included when you list pool information using the DC/OS Edge-LB command-line interface (CLI) commands such as `dcos edgelb list` and `dcos edgelb endpoints <pool-name>`.
* COPS-3893, DCOS-42960 - Allows an Edge-LB pool to launch additional load balancer tasks.
* COPS-3901, DCOS-43049 - Reduces the number of sidecars that Edge-LB creates to address segmentation faults in Edge-LB API server logs.
* COPS-4014, DCOS-44199 - Allows Edge-LB pools to be deployed if the app and secret are under namespace/group.
* COPS-4024, DCOS-44207 - Supports strict mode for DC/OS Enterprise clusters and all non-superusers access to Edge-LB pool logs.
* DCOS-41521 - Enables Edge-LB to ignore terminal but not acknowledged tasks from Mesos when subscribing.
* DCOS-43470 - Improves handling for tasks in `mesos-listener` after Mesos master's failover.
* DCOS-43968 - Updates the SDK used by Edge-LB to mitigate Java vulnerability.
* DCOS-44061, DCOS-44346, DCOS-44715 - Improves the Edge-LB build process to support continuous integration.

### Edge-LB version 1.2.1
Released on September 17, 2018.

* Adds a timestamp to log messages produced during continue and start messages.
* Replaces manual log line prefixes with the proper source code file log field.
* Migrates logging to `logrus` to unify logging.
* Increases the log file retention for Edge-LB containers.
* Adds extra logging about the Mesos state snapshot logging for better troubleshooting of Edge-LB.

### Edge-LB version 1.2.0
Released on September 11, 2018.

* dcos-template: Properly handles empty values for some of the Mesos tasks `protobuf` fields.
* dcos-template: Increases the maximum message size allowed by the Edge-LB API server for messages received through gRPC to 100MIB.
* lbmgr: Adjusts how environment variable values are passed to match the new HAProxy service launch model. This change fixes `AUTOCERT` and `SECRET` environment variable handling for the HAProxy task container.
* api-swagger-spec: Bumps the API version to match the Edge-LB version.
* Introduces proper versioning for the `edgelb-pool` package to match the version of the package with the version of the `edgelb` package itself instead of `stub-universe`.
* Changes the output of the `dcos edgelb show --json` command be the actual pool configuration instead of wrapping the output in a configuration container. This change enables you to feed the output of the `show` command directly to the `update` command.
* Cleans up of the goswagger code generation code and build chain, bump of goswagger tool used for generation from v0.11 to v0.16.
* Bumps `golang` from 1.8.3 to 1.10.3.
* Fixes anonymous access control list (ACL) logic for predefined conditions.
* Bumps `haproxy` from 1.8.12 to 1.8.13. [changelog](http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;h=aed48fc5fb951aff7dd458c4bc9bfcfe1d5dd99a;hb=HEAD).
* Commits `protobuf` code changes that stem from [tool update].(https://github.com/golang/protobuf/tree/master/protoc-gen-go).

<p class="message--warning"><strong>WARNING: </strong>With the introduction of proper versioning of the `edgelb-pool` package, you must remove any `packageVersion` fields from the pool configuration prior to upgrading.</p>

#### Issues fixed in this release
* COPS-3566, DCOS-39655 - Enables Edge-LB to support the HAProxy `use_backend if` filter.
* COPS-3682, DCOS-40510 - Updates the Edge-LB pool `show --json` command to produce JSON that can be used in a subsequent pool operations.
* COPS-3733, DCOS-40866 - Enables Edge-LB to support automatically-generated certificates using the `AUTOCERT` feature.
* COPS-3736 - Enables Edge-LB to store SSL certificates as secrets.
* COPS-3767, DCOS-41274 - Changes the maximum GRPC message size to prevent high churn of sidecar tasks in the cluster.
* COPS-3768, DCOS-41288/DCOS-41544 - Increases the maximum size of the GRPC message supported by the Edge-LB API server.
* COPS-3769, DCOS-41287 - Improves how the dcos-template handles missing values for Mesos tasks. Previously, the dcos-template would trigger a segmentation fault (SIGSEGV) if values such as a port name, port number, or label were missing. With this release, these values are retrieved using a function that can properly handle fields without value settings.
* COPS-3770, DCOS-41322 - Addresses an issue with applications exposed through Edge-LB encountering 503 errors.


# Edge-LB versions 1.1 and earlier
This section summarizes changes integrated into Edge-LB from Edge-LB 1.0.1 (March 2018) to Edge-LB 1.1.0 (August 2018), with the most recent changes listed first.

### Edge-LB version 1.1.0
Released on August 9, 2018.

* Updates the version of HAProxy used by the pool servers to 1.8.12 from 1.7.6. For details about the changes for any release of HAProxy, see the [HAProxy CHANGELOG](https://www.haproxy.org/) for that release.
* Pool server reloads are no longer blocked by persistent connections.
* Improves stability, reliability, and debugging in the pool server code.
* Reduces the size of the pool container from approximately 250MB to 100MB.
* Improved transitions for Master/Worker mode for HAProxy running on the pool server. If custom configuration templates are used, then they must be updated as follows:
    - The template must not specify the `daemon` option.
    - The template must specify the `expose-fd` listeners parameter in the `stats` socket option.
* Edge-LB now uses the default CLI packages from the DC/OS SDK `edgelb-pool` CLI subcommand.
* Provides a `mesosAuthNZ` package installation option. If this option is set to false, Edge-LB can run on DC/OS 1.10 clusters in `disabled` security mode.


### Edge-LB version 1.0.3
Released on June 6, 2018.

* Updates the DC/OS SDK dependency to require version 0.42.1.
* Fixes a bug that was causing configuration reloads to cause short downtimes of the services behind the load balancer.

###Edge-LB version 1.0.2
Released on March 20, 2018.

* Fixes a bug that caused all V2 API `backend.service` selector fields ending in “Pattern” not to function properly.

### Edge-LB version 1.0.1
Released on March 12, 2018.

* Updates the SDK dependency to require version 0.40.5. This dependency change addresses a bug that could cause a pool scheduler to erroneously destroy one or more Marathon persistent volumes, potentially leading to data loss.

### Edge-LB version 1.0
This section summarizes changes integrated into Edge-LB from Edge-LB 0.1.5 (August 2017) to Edge-LB 1.0.0 (March 2018), with the most recent changes listed first.

### Edge-LB version 1.0.0
Released on March 7, 2018.

* Introduces the Edge-LB REST API version 2 (V2) with a new and more intuitive model for selecting service/app backends.
* Provides a new CLI command structure with the ability to create, modify, and delete individual pools.
* Supports Dockerized builds and other CI improvements.
* Adds strict security mode support for DC/OS Enterprise version 1.11, and newer.
* Includes a security-related fix in logging.
* Supports `curl` using the `-k` option within the same container.
* Updates health checks to MESOS_HTTP.
* Modifies the load balancer manager to connect to the Edge-LB API server through https adminrouter using a service account.
* The pool scheduler uses Mesos V1 API and requires additional service account permissions.
* Improves security for communication between Edge-LB commands and the Edge-LB API server.
* Adds logging to `mesos-listener` and to requests created by the Edge-LB API server.
* Adds the `loglevel` option to the Edge-LB package `install` command to make the API server `logLevel` configurable.

### Edge-LB version 0.1.9
Released on October 6, 2017.

* Fixes a path-routing bug which had resulted in adding a “/” to paths in certain configurations.
* Fixes the `dcos edgelb` command-line interface for clusters with dashboard URLs using `http://` scheme.

### Edge-LB version 0.1.8
Released on September 13, 2017.

* Fixes a scheduler bug for unhandled rescind offers that had resulted in services display an Unhealthy status in the DC/OS GUI.
* Decreases reload wait from 10 seconds to 5 seconds.

### Edge-LB version 0.1.7
Released on September 8, 2017.

* Updates the minimum DC/OS version to 1.10 in the universe package.
* Fixes static virtual IP address parsing in the Edge-LB template.
* Fixes a bug that resulted in stale Edge-LB API server template artifacts.

### Edge-LB version 0.1.6
Released on September 5, 2017.

* Supports the asterisk (*) wildcard for specifying a role in the Edge-LB configuration.

### Edge-LB version 0.1.5
Released on August 30, 2017.

* Fixes HTTP health checks.
* Upgrades HAProxy to 1.7.6, which eliminates a bug found in HAProxy 1.7.3 that caused timeouts to occur with each reload.
* Makes virtual networks configurable.
* Fixes bug with multiple secrets.
* Adds the  `dcos edgelb config --reference` command-line option.
