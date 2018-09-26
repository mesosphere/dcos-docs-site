---
layout: layout.pug
navigationTitle: Release Notes for 1.12.0
title: Release Notes for 1.12.0 
menuWeight: 5
excerpt: Release notes for DC/OS 1.12.0
---

DC/OS 1.12.0 was released on October 25, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/testing/1.12.0/commit/a55cf6cd18bea6961e2cc3c957ac8d0ee47583d5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://downloads.mesosphere.io/dcos-enterprise/testing/1.12.0/commit/9d2ee649f1ddb90728757ea24d912189aaef9a52/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

<p class=“message--warning”><strong>WARNING: </strong>Mesos endpoints with `.json` suffix (e.g., /mesos/state.json) are deprecated in DC/OS 1.12 and will be removed in DC/OS 1.13.</p>

# About DC/OS 1.12.0 

DC/OS 1.12.0 includes the following new features and capabilities:

## New Features and Capabilities

[enterprise]
### Anonymous LDAP Bind Support
[/enterprise]
- Complies with standardized Enterprise LDAP integration pattern without a dedicated DC/OS integration LDAP user.

### CLI 
- DCOS_OSS-1899 - Enabled Windows-based pkgpanda builds.
- DCOS_OSS-3491 - Replace the `dcos-diagnostics` check runner with `dcos-check-runner`. 

[enterprise]
### Dynamic LDAP Synchronization
[/enterprise]
- Automatically synchronize [LDAP user account groups](https://docs.mesosphere.com/1.12/security/ent/users-groups/) without manual synchronization of [LDAP directory](https://docs.mesosphere.com/1.12/security/ent/ldap/) with accounts imported into DC/OS.

### Installing 
- DCOS-38953 - DC/OS can now be installed with SELinux in enforcing mode with the targeted policy loaded.

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
- Contact for DataDog plugin support.

### Networking 
- DCOS_OSS-1566 - DC/OS Net: Use operator HTTP API.
- DCOS_OSS-2073 - DC/OS Net: Support Mesos Windows agent.

### Platform 
- DCOS_OSS-4129 - Change Admin Router access log format to facilitate debugging and performance analysis. 

[enterprise]
### Private Package Registry
[/enterprise]
- Enable [on-premise package distribution and management](https://docs.mesosphere.com/1.12/administering-clusters/package-registry/).
- Enable air-gapped Virtual Private Cloud package management.
- Simplify package artifact management.
- Full support for NFS and S3 as storage backends for package storage.
- Package specific controls for adding/removing/updating packages within a cluster.
- Package management CLI.
- DCOS_OSS-2420 - Admin Router: Disable HTTP request buffering for `/service/` endpoint requests through the `DCOS_SERVICE_REQUEST_BUFFERING` Marathon label and disable upstream request URL rewriting for `/service/` endpoint requests through the `DCOS_SERVICE_REWRITE_REQUEST_URLS` Marathon label. 

[enterprise]
### Security
[/enterprise]
- DCOS_OSS-2283 - Add a DC/OS API endpoint to distinguish `open` and `enterprise` build variants.

### UX Enhancements
- Add master table and health information in the nodes page.
- Include base tech version in the services page.
- Include node type (Public/Private) in the nodes page.
- Remove CPU/MEM/Disk graphic from the nodes page.
- Add the Mesosphere DC/OS logo above the UI.
- Fix 100+ bugs and performance improvements.

## Breaking Changes
- DCOS_OSS-2256 - Remove the DC/OS web installer.
- DCOS_OSS-3714 - Replace `dcos-metrics` with Telegraf.


## Improvements and Major Issues Fixed Since 1.12.0 Beta 1

### CLI 
- DCOS_OSS-2239 - Node and cluster checks are executed in parallel. 

### Deploying Services 
- DCOS_OSS-2195 - Release cosmos v0.6.0. 

### Installing 
- DCOS_OSS-2389 - A cluster's IP detect script may be changed with a config upgrade.
- DCOS_OSS-3549 - Fixed ftype=1 check for dcos-docker.
- DCOS_OSS-3556 - Root Marathon support for post-installation configuration of flags and JVM settings has been improved
- DCOS_OSS-3556 - Root Marathon support for post-installation configuration of flags and JVM settings has been improved. 
- DCOS_OSS-3804 - Fix logging of dcos-checks-poststart results to the journal. 
- DCOS_OSS-3556 - Root Marathon heap size can be customized during installation.

### Mesos 
- DCOS_OSS-2137 - Expose jemalloc memory profiler by default.

### Metrics
- DCOS_OSS-2368 - DC/OS Metrics: moved the prometheus producer from port 9273 to port 61091.

### Platform 
- DCOS_OSS_3961 - Add mountinfo to diagnostics bundle.
- DCOS_OSS-4040 - Allow dcos-diagnostics bundles location to be configured.
- DCOS_OSS-3861 - Get timestamp on dmesg, timedatectl, distro version, systemd unit status and pods endpoint in diagnostics bundle. 

### Networking 
- DCOS_OSS-1406 -  Added an API for checks at /system/checks/ on all cluster nodes. 
- DCOS_OSS-1751 - DC/OS Net: Get rid of epmd 
- DCOS_OSS-3655 - Upgrade OTP version.
- DCOS_OSS-3697 - Fixed Docker isolation iptables rule reversal on reboot.
- DCOS_OSS-3841 - Updated CNI plugins to v0.7.1.
- DCOS_OSS-3929 - DC/OS Net: Logging improvements.

## Notable Changes

- Update DC/OS UI to master+v2.21.8 [change log](https://github.com/dcos/dcos-ui/releases/tag/master+v2.21.8).

- DCOS_OSS-2338 - Update Metronome to 0.5.0.

- DCOS_OSS-2378 - Update OTP version to 20.3.2 

- DCOS_OSS-3597 - Update REX-Ray version to [0.11.2](https://github.com/rexray/rexray/releases/tag/v0.11.2). 

## Known Issues and Limitations


**Note:** Provide feedback on the new features and services at [support.mesosphere.com](https://support.mesosphere.com).

