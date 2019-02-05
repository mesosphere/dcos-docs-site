---
layout: layout.pug
navigationTitle: Release Notes for 1.12.0 Beta 1
title: Release Notes for 1.12.0 Beta 1
menuWeight: 15
excerpt: Release notes for DC/OS 1.12.0 Beta 1
---

DC/OS 1.12.0 Beta 1 was released on September 20, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/testing/1.12.0-beta1/commit/a55cf6cd18bea6961e2cc3c957ac8d0ee47583d5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://downloads.mesosphere.io/dcos-enterprise/testing/1.12.0-beta1/commit/9d2ee649f1ddb90728757ea24d912189aaef9a52/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

DC/OS 1.12.0 Beta 1 release is for testing only and not to be used in production. This release will only support new installations.

<p class="message--note"><strong>NOTE: </strong>Provide feedback on the new features and services at <a href="https://support.mesosphere.com">support.mesosphere.com</a>.</p>

<p class="message--important"><strong>IMPORTANT: </strong>Mesos endpoints with the <code>.json</code> suffix are deprecated in DC/OS 1.12 and will be removed in DC/OS 1.13.</p>

# About DC/OS 1.12.0 Beta 1

DC/OS 1.12.0 Beta 1 includes the following new features and capabilities:

## New Features and Capabilities

[enterprise]
### Anonymous LDAP Bind Support
[/enterprise]
- Complies with standardized Enterprise LDAP integration pattern without a dedicated DC/OS integration LDAP user.

[enterprise]
### Dynamic LDAP Synchronization
[/enterprise]
- Automatically synchronize [LDAP user account groups](https://docs.mesosphere.com/1.12/security/ent/users-groups/) without manual synchronization of [LDAP directory](https://docs.mesosphere.com/1.12/security/ent/ldap/) with accounts imported into DC/OS.

### Improved Multi-Cluster UI
- DC/OS CLI now supports [multiple clusters](https://docs.mesosphere.com/1.12/administering-clusters/multiple-clusters/) with different versions.
- DC/OS CLI now automatically downloads and install the enterprise-cli plugins. [enterprise type="inline" size="small" /]

### Mesosphere Kubernetes Engine
- High density [multi-Kubernetes](https://docs.mesosphere.com/services/beta-kubernetes/2.0.0-1.12.0-beta/) leveraging enhanced containerized bin packing. 

### Metrics
Maturation of [metrics](https://docs.mesosphere.com/1.12/metrics/) observability are:
- Adopt industry standards, Free and Open Source Software (FOSS) metrics infrastructure.
- Simplify a complicated codebase.
- Enable additional output formats.
- No longer require modifications when collecting metrics via Prometheus endpoint in 1.11.
- Exporting metrics directly to Datadog is currently not supported in DC/OS 1.12.0 Beta 1.

[enterprise]
### Private Package Registry
[/enterprise]
- Enable [on-premise package distribution and management](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/).
- Enable air-gapped Virtual Private Cloud package management.
- Simplify package artifact management.
- Full support for NFS and S3 as storage backends for package storage.
- Package specific controls for adding/removing/updating packages within a cluster.
- Package management CLI.


### UX Enhancements
- Add master table and health information in the nodes page.
- Include base tech version in the services page.
- Include node type (Public/Private) in the nodes page.
- Remove the CPU/MEM/Disk graphic from the nodes page.
- Add the Mesosphere DC/OS logo above the UI.
- Fix 100+ bugs and performance improvements.


## Known Issues and Limitations
- DCOS-9929 - Implement a validation approach to access secrets. [enterprise type="inline" size="small" /]
- DCOS-38011 - Fix bouncer recovery from unresponsive Cockroachdb. [enterprise type="inline" size="small" /]
- DCOS-40551 - Prevent Mesos modules from loading an empty value.
- DCOS-40740 - Modify `access_log` permissions from IAM. [enterprise type="inline" size="small" /]
- DCOS-40748 - Modify default configurations in Mesos authorizer HTTP client with reasonable duration for timeouts. [enterprise type="inline" size="small" /]
- DCOS-40878 - Fix operations (add and remove) on event stream subscribers.
- DCOS-41559/DCOS_OSS-4060 - Fix `null` value issue in `dcos_metrics` output.
- DCOS_OSS-4088/DCOS_OSS-4090 - Bump `Telegraf` package to fix 500 responses from v0 metrics API due to JSON serialization error.




