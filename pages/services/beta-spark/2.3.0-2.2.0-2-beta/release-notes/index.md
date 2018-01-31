---
layout: layout.pug
navigationTitle: 
title: Release Notes
menuWeight: 140
excerpt:
featureMaturity:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


## Version 2.3.0-2.2.0-2-beta

## NOTICE

This is a beta release of the DC/OS Spark framework. It contains multiple improvements as well as new features that are to be considered of beta quality. Do _not_ operate this version in production.

### Improvements
- Added `--executor-auth-secret` as a shortcut for Spark SASL (Executor authentication and BlockTransferService encryption) configuration.
- Changed the default user to `root`. (Breaking change)
- Instead of setting the `krb5.conf` as a base64-encoded blob, the user can now specify `service.security.kerberos.kdc.[port|hostname]` and `service.security.kerberos.realm` directly in `options.json`. The old behavior with the base64-encoded blob remains the same, and will overwrite the new configs.

### Bug Fixes
- The spark CLI has "shortcut" command-line args, that are translated into spark.config=setting configurations downstream (such as `spark.executor.memory`). Fixed a bug where a user sets the configuration directly and is overwritten with the default value for the shortcut argument.

### Tests
- Changes to allow integration tests to run in strict mode.

### Documentation
- Added worked examples (walkthroughs) for setting up Spark securely.
- Added docs on using Mesos Quota to manage resources in job scheduling.
- Added instructions to Install docs describing how to install in strict mode.

### Breaking Changes
- Changed the default user to `root`, in both the Dispatcher and History Server.
- To configure Kerberos in `options.json`, a new property `service.security.kerberos.enabled` must be set to `true`. This applies to both the Dispatcher and History Server.
- Removed the `security.ssl` properties from `options.json`. These properties are no longer needed for the new Go-based CLI.

## Version 2.2.0-2.2.0-2-beta

## NOTICE

This is a beta release of the DC/OS Spark framework. It contains multiple improvements as well as new features that are to be considered of beta quality. Do _not_ operate this version in production.

### Improvements
* Added secrets support in Driver.
* Added Kerberos ticket renewal.
* Added Mesos sandbox URI to Dispatcher UI.
* Updated JRE version to 8u152 JCE.
* Added support for Driver<->Executor TLS with file-based secrets.
* Added support for Driver<->Executor SASL (RPC endpoint authentication and encryption), via file-based secrets.
* Added CLI command to generate a random secret.
* Enabled native BLAS for MLLib.
* Added configuration to deploy Dispatcher on UCR (default is Docker).

### Bug fixes
* First delegation token renewal time is not 75% of renewal time.
* Fixed `supervise` mode with checkpointing.
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

