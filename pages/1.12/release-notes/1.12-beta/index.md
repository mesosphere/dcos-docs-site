---
layout: layout.pug
navigationTitle: Release Notes for 1.12.0 Beta 1
title: Release Notes for 1.12.0 Beta 1
menuWeight: 5
excerpt: Release notes for DC/OS 1.12.0 Beta 1
---

DC/OS 1.12.0 Beta 1 was released on September 20, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/testing/1.12.0-beta1/commit/a55cf6cd18bea6961e2cc3c957ac8d0ee47583d5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://downloads.mesosphere.io/dcos-enterprise/testing/1.12.0-beta1/commit/9d2ee649f1ddb90728757ea24d912189aaef9a52/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

DC/OS 1.12.0 Beta 1 release is for testing only and not to be used in production. This release will only support new installations.

**Note:** Provide feedback on the new features and services at [support.mesosphere.com](https://support.mesosphere.com).


# About DC/OS 1.12.0 Beta 1

DC/OS 1.12.0 Beta 1 includes the following new features and capabilities:

## New Features and Capabilities

[enterprise]
### Anonymous LDAP Bind Support
[/enterprise]
- Complies with standardized Enterprise LDAP integration pattern without a dedicated DC/OS integration LDAP user.

### Dynamic LDAP Synchronization
- Automatically synchronize LDAP user account groups without manual synchronization of LDAP directory with accounts imported into DC/OS.

### Improved Multi-Cluster UI
- DC/OS CLI now supports multiple clusters with different versions.

### Mesosphere Kubernetes Engine
- High density Multi-Kubernetes leveraging enhanced containerized bin packing. 

### Metrics
Maturation of [metrics](https://docs.mesosphere.com/1.12/metrics/) observability:
- Adopt industry standards, Free and Open Source Software (FOSS) metrics infrastructure.
- Simplify a complicated codebase.
- Enable additional output formats.
- Does not require modifications when collecting metrics via Prometheus endpoint in 1.11.
- Contact for DataDog plugin support.

[enterprise]
### Private Package Registry
[/enterprise]
- Enable On Premise package distribution and management.
- Enable air-gapped Virtual Private Cloud package management.
- Simplify package artifact management.
- Full support for NFS and S3 as storage backends for package storage.
- Package specific controls for adding/removing/updating packages within a cluster.
- Package management CLI.


### UX Enhancements


## Known Issues and Limitations
- DCOS-9929 - Implement a validation approach to access secrets. [enterprise type="inline" size="small" /]
- DCOS-38011 - Fix bouncer recovery from unresponsive Cockroachdb. [enterprise type="inline" size="small" /]
- DCOS-40551 - Prevent Mesos modules from loading an empty value.
- DCOS-40740 - Modify `access_log` permissions from IAM. [enterprise type="inline" size="small" /]
- DCOS-40748 - Modify default configurations in Mesos authorizer HTTP client with reasonable duration for timeouts. [enterprise type="inline" size="small" /]
- DCOS-40878 - Fix add and remove operations on event stream subscribers.
- DCOS-41559/DCOS_OSS-4060 - Fix `null` value issue in `dcos_metrics` output.
- DCOS_OSS-4088/DCOS_OSS-4090 - Bump `Telegraf` package to fix 500 responses from v0 metrics API due to JSON serialization error.




