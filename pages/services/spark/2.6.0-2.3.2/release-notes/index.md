---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 145
excerpt: Release notes for DC/OS Apache Spark 2.6.0-2.3.2
featureMaturity:
---

## Version Spark and Spark history 2.6.0-2.3.2

### New features
- Upgraded Spark and Spark History Server to 2.3.2
- Added DC/OS Spark CLI support for `--jars`
- Added CNI Support for Dispatcher, Driver, and Executors for Docker and Mesos containerizers
- Added CNI labels support for Mesos containerizer
- Added package configuration for CNI:
    - `virtual_network_enabled`
    - `virtual_network_name`
    - `virtual_network_plugin_labels`
- Spark Dispatcher by default launches Spark Drivers and Executors in the same virtual network it was launched in itself

<div class="message--note"><strong>NOTE: </strong>Limitations of current Spark CNI support:
<ul>
  <li>Configuration of network plugin labels from DC/OS UI supported only in JSON editing mode</li>
  <li>Network plugin labels are not supported by Docker containerizer</li>
  <li>Currently, DC/OS AdminRouter doesn't support virtual networks so DC/OS {{ model.techShortName }} endpoints will not be accessible from CLI, and jobs need to be submitted from a routable network</li>
</ul>
</div>

### Updates
- `SPARK_HOME` environment variable defaults to `/opt/spark` in Dockerfile and executable scripts
- Switched to Spark's own StatsD Sink instead of 3rd-party dependency
- Updated [dcos-commons](https://github.com/mesosphere/dcos-commons/) bootstrap version to 0.55.2

### Bug fixes
- Fixed bug for Dispatcher restarting duplicate Spark drivers after agent restart in `--supervised` mode
- Fixed bug for CLI incorrect `--jars` parsing resulting in submit failure

## Version Spark and Spark history 2.5.0-2.2.1

### New features
- Added unique Mesos Task IDs for Spark executors.
- Added trusted Ubuntu 18.04 base Docker image.
- Added `nobody` user support on RHEL/CentOS (through configuration).

### Updates
- Changed the default user for the Docker container from `root` to `nobody`.
- Upgraded JRE to 1.8.192.
- Upgraded to Ubuntu 18.04`
- Updated Hadoop dependencies from 2.7.3 to 2.7.7 (fixes CVE-2016-6811, CVE-2017-3162, CVE-2017-3166, CVE-2018-8009).
- Updated Jetty dependencies from 9.3.11.v20160721 to 9.3.24.v20180605 (fixes CVE-2017-7658).
- Updated Jackson dependencies from 2.6.5 to 2.9.6 (fixes CVE-2017-15095, CVE-2017-17485, CVE-2017-7525, CVE-2018-7489, CVE-2016-3720).
- Updated ZooKeeper dependencies from 3.4.6 to 3.4.13.

### Bug fixes
- `dcos task log` now works because of unique Mesos Tasks IDs of Spark executors.
- Fixed unstable health checks for Spark dispatcher and history server.
- Spark dispatcher task output now redirects to stdout and is available in logs.

### Breaking changes
- Added a new configuration option `docker_user` to overridw the user when running Spark using Docker containerizer.
- The default Hadoop dependency is now 2.7 and not 2.6.

## Version Spark and Spark history 2.4.0-2.2.1-3

### New features
- Added service name to dispatcher’s VIP endpoints.
- Added shell-escape fix to spark-cli (SPARK-21014).
- Added spark.mesos.executor.gpus (SPARK-21033).
- Added dispatcher and driver metrics.
- Added `statsd` sink for spark metrics.
  <p class="message--note"><strong>NOTE: </strong>Metrics is a beta feature and requires enabling UCR. Production use is not advised.</p>

### Updates
- Updated tests, build tools, CLI, and vendor packages.
- Updated bootstrap version to 0.50.0.
- Updated JRE version to 8u172.

### Bug fixes
- Fixed duplicate docker image URLs, with use `resource.json` as the default.

### Breaking changes
- VIP endpoints for the dispatcher are no longer `spark-dispatcher:<port>` and are now `dispatcher.{{service.name}}:<port>`.

## Version Spark and Spark history 2.4.0-2.2.1-3

### New features
- Added service name to dispatcher’s VIP endpoints.
- Added shell-escape fix to spark-cli (SPARK-21014).
- Added spark.mesos.executor.gpus (SPARK-21033).
- Added dispatcher and driver metrics.
- Added `statsd` sink for spark metrics.
  <p class="message--note"><strong>NOTE: </strong>Metrics is a beta feature and requires enabling UCR. Production use is not advised.</p>

### Updates
- Updated tests, build tools, CLI, and vendor packages.
- Updated bootstrap version to 0.50.0.
- Updated JRE version to 8u172.

### Bug fixes
- Fixed duplicate docker image URLs, with use `resource.json` as the default.

### Breaking changes
- VIP endpoints for the dispatcher are no longer `spark-dispatcher:<port>` and are now `dispatcher.{{service.name}}:<port>`.

## Version Spark and Spark history 2.3.1-2.2.1-2

### Updates
- Updated `libmesos`  version with a critical bug fix.

### Documentation
- Added a [page](https://docs.mesosphere.com/services/spark/2.3.1-2.2.1-2/limits/) documenting results from scale testing of Spark on DC/OS.

## Version 2.3.0-2.2.1-2

### New features
- Added secrets support for drivers, so that a secret can be disseminated to the executors. (SPARK-22131).
- Added Kerberos ticket renewal (SPARK-21842).
- Added Mesos sandbox URI to the Dispatcher UI (SPARK-13041).
- Added support for Driver <-> Executor TLS with file-based secrets.
- Added support for Driver <-> Executor SASL (RPC endpoint authentication and encryption) using file-based secrets.
- Added `--executor-auth-secret` as a shortcut for Driver <-> Executor Spark SASL (RPC endpoint authentication and encryption) configuration.
- Added CLI command to generate a random secret.
- Enabled native BLAS for MLLib.
- Added configuration to deploy Dispatcher on UCR (default is Docker).
- Instead of setting the `krb5.conf` as a base64-encoded blob, the user can now specify `service.security.kerberos.kdc.[port|hostname]` and `service.security.kerberos.realm` directly in the `options.json` file. The behavior with the base64-encoded blob remains the same, and will overwrite the new configuration.

### History server
- Added Kerberos support for integration with a Kerberized HDFS. See documentation for configuration instructions.
- Made the user configurable, defaults to root.

### Updates
- Updated JRE version to 8u152 JCE.
- Changed the default user to root (Breaking change).

### Bug fixes
- First delegation token renewal time is not 75% of renewal time (SPARK-22583).
- Fixed supervise mode with checkpointing(SPARK-22145).
- Added support for older SPARK_MESOS_KRB5_CONF_BASE64 environment variable.
- The spark CLI has "shortcut" command-line arguments that are translated into `spark.config=setting` configurations downstream (such as `spark.executor.memory`) no longer overwrite the configuration a user sets directly with the default value for the shortcut argument.

### Breaking changes
- Changed the default user to root, in both the Dispatcher and history server.
- To configure Kerberos in the `options.json` file, a new property `service.security.kerberos.enabled` must be set to `true`. This option applies to both the Dispatcher and history server.
- Removed the `security.ssl` properties from the `options.json` file. These properties are no longer needed for the Go-based CLI.
- Removed `--dcos-space` option from the CLI. Access to secrets is determined by the Spark Dispatcher service name. See [security](/security/) for more information about where to place secrets.

## Version 2.1.0-2.2.0-1

### Improvements
- Changed the image to run as user `nobody` instead of `root` by default. (https://github.com/mesosphere/spark-build/pull/189)

### Bug fixes
- Configuration to allow custom Dispatcher docker image. (https://github.com/mesosphere/spark-build/pull/179)
- CLI breaks with multiple spaces in submit args. (https://github.com/mesosphere/spark-build/pull/193)

### Documentation
- Updated the HDFS endpoint information in [hdfs]{/hdfs/}.
- Added checkpointing instructions. (https://github.com/mesosphere/spark-build/pull/181)
- Updated custom docker image support policy. (https://github.com/mesosphere/spark-build/pull/200)

## Version 2.2.0-2.2.0-2-beta

### Improvements
* Added secrets support in driver (SPARK-22131).
* Added Kerberos ticket renewal (SPARK-21842).
* Added Mesos sandbox URI to dispatcher UI(SPARK-13041).
* Updated JRE version to 8u152 JCE.
* Added support for Driver <-> Executor TLS with file-based secrets.
* Added support for Driver <-> Executor SASL (RPC endpoint authentication and encryption) with file-based secrets.
* Added CLI command to generate a random secret.
* Enabled native BLAS for MLLib.
* Added configuration to deploy Dispatcher on UCR (default is Docker).

### Bug fixes
* First delegation token renewal time is not 75% of renewal time (SPARK-22583).
* Fixed `supervise` mode with checkpointing(SPARK-22145).
* Added support for older `SPARK_MESOS_KRB5_CONF_BASE64` environment variable.

### Tests
* Added integration test that reads / writes to a Kerberized HDFS.
* Added integration test that reads / writes to a Kerberized Kafka.
* Added integration test of checkpointing and supervise.

### Documentation
* Updated naming of DC/OS.
* Updated docs links in package post-install notes.
* Updated Kerberos docs.
* Documented running Spark Streaming jobs with Kerberized Kafka.
* Documented `nobody` limitation on certain OSes.

## Version 2.1.0-2.2.0-1

### Improvements
- Changed the image to run as user `nobody` instead of `root` by default. (https://github.com/mesosphere/spark-build/pull/189)

### Bug fixes
- Configuration to allow a custom dispatcher Docker image. (https://github.com/mesosphere/spark-build/pull/179)
- CLI breaks with multiple spaces in submit arguments. (https://github.com/mesosphere/spark-build/pull/193)

### Documentation
- Updated HDFS endpoint information in [hdfs](/hdfs/).
- Added checkpointing instructions. (https://github.com/mesosphere/spark-build/pull/181)
- Updated custom docker image support policy. (https://github.com/mesosphere/spark-build/pull/200)

## Version 2.0.1-2.2.0-1

### Improvements
- Exposed isR and isPython spark run arguments.

### Bug fixes
- Allowed for application args to have arguments without equals sign.
- Fixed docs link in Universe package description.

## Version 2.0.0-2.2.0-1

### Improvements
- Kerberos support has changed to use common code from `spark-core` instead of custom implementation.
- Added file and environment variable-based secret support.
- Kerberos keytab/TGT login from the DC/OS Spark CLI in cluster mode (uses file-based secrets).
- Added CNI network label support.
- CLI doesn't require spark-submit to be present on client machine.

### Bug fixes
- Drivers are successfully re-launched when `--supervise` flag is set.
- CLI works on 1.9 and 1.10 DC/OS clusters.

### Breaking changes
- Setting `spark.app_id` has been removed (for example, `dcos config set spark.app_id <dispatcher_app_id>`). To submit jobs with a given
dispatcher, use `dcos spark --name <dispatcher_app_id>`.
- `principal` is now `service_account` and `secret` is now `service_account_secret`.

## Version 1.1.1-2.2.0

### Improvements
* Upgrade to Spark 2.2.0.
* Spark driver now supports configurable failover_timeout. The default value is 0 when the configuration is not set [SPARK-21456](https://issues.apache.org/jira/browse/SPARK-21456).

### Breaking change

*  Spark CLI no longer supports `-Dspark` arguments.

## Version 1.0.9-2.1.0-1

- The history server has been removed from the "spark" package, and put into a dedicated "spark-history" package.
