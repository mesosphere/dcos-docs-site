---
layout: layout.pug
navigationTitle: Release Notes for 1.12.0
title: Release Notes for 1.12.0 
menuWeight: 15
excerpt: Release notes for DC/OS 1.12.0
---

DC/OS 1.12.0 was released on October 25, 2018.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise* [/button]

<p class="message--warning"><strong>WARNING: </strong>Registered Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, please contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> when installing DC/OS Enterprise Edition.</p>

# About DC/OS 1.12.0 

DC/OS 1.12.0 includes the following new features and capabilities:

## New Features and Capabilities

### Mesosphere Kubernetes Engine
- High Density Multi-Kubernetes (HDMK) allows operators to take advantage of intelligent resource pooling when running multiple Kubernetes clusters on DC/OS. Compared with other Kubernetes distributions that run a single Kubernetes node per virtual machine, Mesosphere HDMK uses its intelligent resource pooling to pack multiple Kubernetes nodes onto the same server for bare metal, virtual machine, and public cloud instances, driving significant cost savings and resource efficiencies. [Learn more about Kubernetes on DC/OS](/services/kubernetes/2.0.0-1.12.1/).

### Mesosphere Jupyter Service (MJS)
- Delivered secure, [cloud-native Jupyter](https://docs.mesosphere.com/services/beta-jupyter/) Notebooks-as-a-Service to empower data scientists to perform analytics and distributed machine learning on elastic GPU-pools with access to big and fast data services.
- Secured connectivity to data lakes and data sets on S3 and (Kerberized) HDFS.
- GPU-enabled Spark and distributed TensorFlow.
- OpenID connect authentication and authorization with support for Windows Integrated Authentication (WIA) and Active Directory Federation Services (ADFS)

### Observability - Metrics
- Introduced a flexible and configurable metrics pipeline with multiple output formats.
- Enhanced support for application metric types including histograms, counters, timers, and gauges.
- Support for sample rates and multi-metrics packets. 
- Mesos framework metrics are now [available](http://mesos.apache.org/documentation/latest/monitoring/#frameworks).
- No longer require modifications when collecting metrics via Prometheus endpoint in 1.11.

[enterprise]
### Private Package Registry
[/enterprise]
- Enabled [on-premise package distribution and management](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/).
- Enabled air-gapped Virtual Private Cloud package management.
- Simplifies package artifact management.
- Package-specific controls for adding/removing/updating packages within a cluster.
- Package management CLI.

### SELinux Hardened OS Install Support
- Fully support installing and operating a cluster on SELinux hardened OS with SE Linux in targeted-enforcing mode for all hardened non-DC/OS components.

[enterprise]
### Anonymous LDAP Bind Support
[/enterprise]
- Complies with standardized Enterprise LDAP integration pattern without a dedicated DC/OS integration LDAP user.

[enterprise]
### Dynamic LDAP Synchronization
[/enterprise]
- Automatically synchronize [LDAP user account groups](https://docs.mesosphere.com/1.12/security/ent/users-groups/) without manual synchronization of [LDAP directory](https://docs.mesosphere.com/1.12/security/ent/ldap/) with accounts imported into DC/OS.

### Universal Installer 
- Introducing a unified Terraform-based open source tool for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on AWS, GCP, and Azure.
- Intuitive, streamlined installation with a quick start process - Spin up a DC/OS cluster with a few easy steps in 10-15 minutes. 
- Officially recommended as a Mesosphere supported installation method with best practices built-in (i.e sequential masters & parallel agents in upgrade).
- Restructured [Mesosphere installation documentation](https://docs.mesosphere.com/1.12/installing/evaluation/) to organize Mesosphere supported installation methods and Community supported installation methods.

### Networking
- Networking component enhancements with 150+ bug fixes with limited logging for visibility.
- Improved DNS convergence time (sub-sec) performance.
- Configurable MTU for Overlay networks.
- Reusable IP addresses for new agents in the cluster.
- Mitigation of networking stuck-state due to SSL deadlock in Erlang library.
- TLS 1.2 support.
- Support for per container network Metrics.
- Leverage persistent connections in Edge-LB for L7 load-balancing. [enterprise type="inline" size="small" /]
- Improved logging in Edge-LB. [enterprise type="inline" size="small" /]

### Expanded DC/OS Upgrade Paths 
- Mesosphere now supports specific skip [upgrade paths](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths) within a supported patch version of DC/OS (i.e upgrade from 1.11.1 => 1.11.5 in one move).
- Mesosphere now supports specific skip upgrade paths between supported major to major versions of DC/OS (i.e upgrade from 1.10.7 => 1.11.4 in one move).

### Services (Marathon) Enhancements
- [Preferential GPU scheduling](http://mesosphere.github.io/marathon/docs/preferential-gpu-scheduling.html) is enhanced with additional options to enable more fine grained resource management.
- Introducing a new parameter for  `--max_running_deployments` to set limit for running deployments.
- Added `wipe=true` support for pods instances endpoint.
- Easily configure Marathon config options from `/var/lib/mesosphere/marathon/environment`.
- Upgraded Marathon to version 1.7.174.

### Job Scheduling (Metronome)
- `Env-var` secret can now be attached to a job.

### UI/UX Enhancements
- Added master table and health information in the nodes page.
- Added the Mesosphere DC/OS logo above the UI.
- Expanded JSON editor view and GPU’s included if deployed in a cluster.
- Fixed 100+ bugs and performance improvements.
- Included base tech version in the services page.
- Included node type (Public/Private) in the nodes page.
- Removed CPU/MEM/Disk graphic from the nodes page.

## Notable Changes
- Update DC/OS UI to 1.12+v2.25.1 [change log](https://github.com/dcos/dcos-ui/releases/tag/1.12+v2.25.1).
- DCOS-19427 - CockroachDB: set cluster version to 1.1. [enterprise type="inline" size="small" /]
- DCOS-19922 - Remove disable security mode. [enterprise type="inline" size="small" /]
- DCOS-22308 - CockroachDB: use 1.1.8. [enterprise type="inline" size="small" /]
- DCOS-37654 - Add `permissions_cache_ttl_seconds` configuration parameter. [enterprise type="inline" size="small" /]
- DCOS-38663 - Enable DC/OS storage features by default. [enterprise type="inline" size="small" /]
- DCOS_OSS-2338 - Update Metronome to 0.5.0. 
- DCOS_OSS-2378 - Update OTP version to 20.3.2.
- DCOS_OSS-3597 - Update REX-Ray version to [0.11.2](https://github.com/rexray/rexray/releases/tag/v0.11.2). 
- Removed Local, Development, On-Premise sections and corresponding dcos-docker/dcos-vagrant installation methods from DC/OS 1.12, 1.11, 1.10 installation documentation.

<p class="message--warning"><strong>WARNING: </strong>Mesos endpoints with `.json` suffix (e.g., /mesos/state.json) are deprecated in DC/OS 1.12 and will be removed in DC/OS 1.13.</p>

## Improvements and Major Issues Fixed 

### CLI 
- DCOS_OSS-1899 - Enable Windows-based pkgpanda builds.
- DCOS_OSS-2239 - Execute node and cluster checks in parallel.
- DCOS_OSS-3491 - Replace the `dcos-diagnostics` check runner with `dcos-check-runner`. 
- DCOS_OSS-3683 - Fix to add a second EBS drive to agents and public agents.

### GUI
- COPS-2041 - DC/OS UI wipes labels with empty values.
- COPS-2661/DCOS-21440 - Fix to recognize `VIP_0` label.
- DCOS-20283 - Fix for network metrics failure on SOAK 111.
- DCOS-21723 - Include allocated and scheduler resources.
- DCOS_OSS-1551 - Show VIP fields in host mode to enable VIP.
- DCOS_OSS-1553 - Add VIP input to virtual networks.
- DCOS_OSS-1961 - DC/OS UI does not support lifecycle of pods.

### Installing 
- DCOS_OSS-2389 - Upgrade fails to update the agents ip-detect script.
- DCOS_OSS-3549 - Fixed ftype=1 check for dcos-docker.
- DCOS_OSS-3556 - Root Marathon support for post-installation configuration of flags and JVM settings is improved. 
- DCOS_OSS-3804 - Fix logging of dcos-checks-poststart results to the journal. 

### Marathon
- DCOS-18597 - Marathon Enterprise DCOS packaging needs revision. [enterprise type="inline" size="small" /]
- DCOS-39883 - Add permissions to `dcos_diagnostics_master` to read marathon state. [enterprise type="inline" size="small" /]
- DCOS-42827 - Marathon `--ssl_keystore_password` value no longer appears in `ps aux`. 
- DCOS_OSS-4193 - Marathon bootstrap relies on zk-1.zk node to be available.
- MARATHON-7390 - Add required pre-condition for Marathon startup and connect Marathon to Zookeeper.
- MARATHON-7969 - Fix to populate default `portDefinitions` when creating a new application via PUT. 
- MARATHON-8420 - Marathon framework ID generation is now very conservative. [enterprise type="inline" size="small" /]
- MARATHON-8360 - Fix the failure to reject invalid group IDs by creating mid-level groups. 
- MARATHON-8438 - Change default Mesos user with docker image default user.

### Mesos 
- COPS-1880 - Allow agents to re-register post a host reboot.
- COPS-1993 - Check for maintenance on agent causes fatal error.
- COPS-3574 - Bump Mesos to nightly 1.5.x dd68c0b.
- DCOS-24515 - Unresponsive Mesos containerizer.
- DCOS-38225 - Unexpected error handling of Mesos-IAM interaction failures leads to task loss.
- DCOS-39869 - Missing Mesos master log from Mesos UI.
- DCOS-40410/DCOS-40750 - Bump Mesos to nightly master 6a98857. 
- DCOS-41442 - Updated signature of `MesosContainerizer::create`.
- DCOS-42098 - Admin Router instructs downstream components (e.g. the load balancer) to close the connection from Mesos streaming endpoint after serving the request. [enterprise type="inline" size="small" /]
- DCOS_OSS-2137 - Expose jemalloc memory profiler by default.
- DCOS_OSS-4152 - Fix incorrect attempts to delete check containers by metrics isolater module.

### Metrics
- DCOS_OSS-2368 - DC/OS Metrics: Moved the prometheus producer from port 9273 to port 61091.

### Networking 
- COPS-3520 - Unable to build `dcos-cni` package.
- COPS-3540/DCOS-39517 - Fix delay in overlay configuration.
- COPS-3576/DCOS-37703 -  Fix erroneous values in service addresses stats and enable metrics forwarding.
- DCOS-38600 - Deadlock when SSL sockets are simultaneously sending/receiving data and buffers are full. [enterprise type="inline" size="small" /]
- DCOS-39165 - Fix failure to create VIP on overlay network.
- DCOS_OSS-1406 - Add an API for checks at /system/checks/ on all cluster nodes. [enterprise type="inline" size="small" /]
- DCOS_OSS-1566 - DC/OS Net: Use operator HTTP API.
- DCOS_OSS-1751 - DC/OS Net: Disable `epmd`. 
- DCOS_OSS-2073 - DC/OS Net: Support Mesos Windows agent.
- DCOS_OSS-3539 - Fix running tasks to get .dcos fqdns.
- DCOS_OSS-3655 - Upgrade OTP version.
- DCOS_OSS-3697 - Fix connectivity issue between bridge and overlay networks.
- DCOS_OSS-3707 - Fix network failure caused by updating to CoreOS v1800.7.
- DCOS_OSS-3750 - Move data directories to `tmpfs` location and recycle allocated IP addresses upon agent reboot. 
- DCOS_OSS-3841 - Update CNI plugins to v0.7.1.
- DCOS_OSS-3929 - DC/OS Net: Logging improvements.
- DCOS_OSS-4308 - Bump dcos-net.

### Platform
- DCOS-21611 - Fix failure to update cluster's IP detect script and fault domain detect script during a configuration upgrade. [enterprise type="inline" size="small" /]
- DCOS-40373 - Prevent `dcos-history` leaking auth tokens in the header.
- DCOS-40949 - Add CockroachDB enpoints data to diagnostics bundle. [enterprise type="inline" size="small" /]
- DCOS-42419 - Add UCR Support for package registry by supporting v2 schema 1.
- DCOS-43822 - Add an upgrade qualification table to show upgrading paths. 
- DCOS_OSS-2317 - Add retries for pkgpanda when downloading packages.
- DCOS_OSS-2422 - Fix to avoid failure of `test_history_service` on master.
- DCOS_OSS-3861 - Get timestamp on dmesg, timedatectl, distro version, systemd unit status and pods endpoint in diagnostics bundle. 
- DCOS_OSS_3961 - Add mountinfo to diagnostics bundle.
- DCOS_OSS-4040 - Allow dcos-diagnostics bundles location to be configured.
- DCOS_OSS-4287 - Check system clock is synced before starting Exhibitor.

[enterprise]
### Security
[/enterprise]
- Bump `python3-saml` for CVE-2017-11427. 
- COPS-2142 - Fix for Lookup DN no longer works in 1.10.x. 
- DCOS-19073 - Prevent ZooKeeper configuration credentials from being leaked while accessing mesos /state or /flags endpoints, as well as in the journald logs.
- DCOS-20133 - Fix an issue where bootstrap was generating empty keys for task executor authentication. 
- DCOS-21728 - Add `dcos-check` for cockroachdb `underreplicated ranges`.
- DCOS-21947 - DC/OS IAM never logs LDAP server passwords or private keys, at any log level.
- DCOS-21958 - Disable the 3DES bulk encryption algorithm for master Admin Router's TLS.
- DCOS-22050 - TLS: Admin Router can be configured with both RSA and EC type certificates. 
- DCOS-22326 - Disable the TLS 1.1 protocol for Master Admin Router's TLS.
- DCOS-37684 - Add `iam-database-backup` and `iam-database-restore` script to simplify backup/restore of the IAM database. 
- DCOS-38953 - Support DC/OS on SELinux in enforcing-targeted mode on RHEL/CentOS.
- DCOS-40246 - DC/OS Net: Support only TLS 1.2.
- DCOS-40648 - Add `LDAP_GROUP_IMPORT_LIMIT_SECONDS` default value to DC/OS configuration. 
- DCOS-42227 - DC/OS IAM: Consolidated LDAP group import in case when the user DN template and the entries in the directory use different capitalization of attribute names. 
- DCOS_OSS-2283 - Add a DC/OS API endpoint to distinguish `open` and `enterprise` build variants. [enterprise type="inline" size="small" /]
- DCOS_OSS-4129 - Change Admin Router access log format to facilitate debugging and performance analysis.

### SDK
- DCOS_OSS-2195 - Release cosmos v0.6.0. 

## Breaking Changes
- DCOS_OSS-2256 - Removed the DC/OS web installer. 
- DCOS_OSS-3714 - Replaced `dcos-metrics` with Telegraf.
- DCOS_OSS-4243 - By default, Marathon will decline offers for agents in [maintenance mode](https://github.com/mesosphere/marathon/blob/master/changelog.md#maintenance-mode-support-production-ready-now-default). Requests to Marathon's events API (/v2/events when queried directly) for standby instances no longer proxy, but instead responds with a redirect. Clients consuming Marathon's events API should be updated to follow redirects. Component such as updated to versions that follow redirects; for example, Marathon-LB should be updated to at least version v1.12.3. [See more details](https://github.com/mesosphere/marathon/blob/master/changelog.md#non-leaderstandby-marathon-instances-respond-to-v2events-with-a-redirect-rather-than-proxy).

## Customer Advisory 
- [Requirements for Kubernetes support on DC/OS 1.12](https://support.mesosphere.com/s/article/Critical-Issue-Kubernetes-Upgrade-MSPH-2018-0007).
- [Red Hat Docker 1.13 recommended for CentOS & RHEL support on DC/OS](https://support.mesosphere.com/s/article/Critical-Issue-KMEM-MSPH-2018-0006).
- Update components to support Marathon's [new event-stream redirects](https://support.mesosphere.com/s/article/Update-Components-to-Support-Marathon-s-New-Event-Stream-Redirects-MSPH-2018-0008).
- [`dcos-net` ignores some tcp/udp discovery ports for tasks on the host network](https://support.mesosphere.com/s/article/Known-Issue-DC-OS-Networking-MSPH-2018-0008).

## Known Issues and Limitations

### GUI
- DCOS-39298 - Edit Jobs: Make ID field non-editable.

### Marathon         
- MARATHON-8429 - Marathon app is not completely destroyed due to an agent or Docker issue. It is unable to scale the application until the agent/Docker issue is resolved.
- MARATHON-8441 - Docker image tests fail on master.

### Metrics
- DCOS-43601 - Service accounts `dcos_telegraf_master` and `dcos_telegraf_agent` require dcos::superuser permissions.

### Networking
- COPS-3690/DCOS-40539 - `dcos6` interface is displayed in the UI even when `enable_ipv6` was set to false.
- COPS-3900 - Connection timed out error while logging into docker using MLB.
- COPS-3901 - EdgeLB creating frequent sidecars, `SIGSEV` in apiserver logs.
- COPS-3924/DCOS-43552 - VIP returns 502 errors while application is scaling.
- DCOS_OSS-4184 - Mesos offers ports that are already in use.
- DCOS_OSS-4328 - Lashup fails to converge in certain cases.
- DCOS-10809 - DNS unavailable during DC/OS upgrade.
- DCOS-43857 - `test_dcos_cni_l4lb` fails for 1.12.0-rc3 & 1.11.6 on RHEL 7.5.
- COPS-4078/DCOS_OSS-4395 - `dcos-net` ignores some tcp/udp discovery ports for tasks on the host network.

[enterprise]
### Security
[/enterprise]
- DCOS-9929 - Lack of access to a secret should prevent a deployment.
- DCOS-42160 - Large group import of users fails due to CockroachDB error.
- DCOS-43432 - LDAP tests fail to sync after cluster is upgraded to 1.12-rc2.
- DCOS-43585 - MWT - Intermittent gateway time-outs API request (PUT-ing ACLs).
- DCOS-43598/DCOS-43596 - Mesos authorizer: Happy path post mortem auth token refresh exposes an error.

### Mesos
- DCOS-40878 - Event stream subscribers are added but not removed.
- DCOS-41729 - Permanent failure to kill task on agent.
- DCOS-42624 - Master Admin Router returns an error on `/service/jenkins`.
- DCOS-43044 - `OperationStatus` messages sent to framework must include both agent ID and resource provider ID.
- DCOS-43518 - Improve Mesos API to distinguish between health check states.
- DCOS-43670 - UCR container launch stuck at provisioning during image fetching.

### SDK
- DCOS-41362 - Master fails to process unreserve operation for resources.
- DCOS-42593 - Occurrence of `STORAGE_ERROR` during options update.

<p class="message--note"><strong>NOTE: </strong>Provide feedback on the new features and services at <a href="https://support.mesosphere.com">support.mesosphere.com</a>.</p>


