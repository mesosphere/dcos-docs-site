---
layout: layout.pug
navigationTitle: Release Notes for 1.12.4
title: Release Notes for 1.12.4
menuWeight: 5
excerpt: Release notes for DC/OS 1.12.4
---

DC/OS Version 1.12.4 was released on July 2, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.12.4/dcos_generate_config.ee.sh"]Download DC/OS Enterprise [/button]

DC/OS 1.12.4 includes the following components:
- Apache Mesos 1.7.3 [change log](https://github.com/apache/mesos/blob/33a1ba97041f178f8be53cdeb7cbeb7c78b89798/CHANGELOG).
- Marathon 1.7.203 [change log](https://github.com/mesosphere/marathon/blob/9e2a9b579b968a2664df03099b03eaf86ffc7efc/changelog.md).
- Metronome 0.6.23 [change log](https://github.com/dcos/metronome/blob/b8a73dd3cc3c2da035222031ccbbcf5c836ede7b/changelog.md).

<!-- <p class="message--note"><strong>NOTE: </strong>DC/OS 1.12.1 release supports new CoreOS and Docker versions as listed in the <a href="../../../version-policy">compatibility matrix</a>.</p> -->

# Release summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues fixed in DC/OS 1.12.4
The issues that have been fixed in DC/OS 1.12.4 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

## Admin Router
- Changes the maximum size allowed for uploads to a service through Admin Router (DCOS-52768).

    This release increases the maximum size allowed for uploading packages from 1GB to 16GB. This change enables you to upload larger packages to a registry service without timing out the upload connection.

## Cluster operations
- Provides improved clean-up operations to eliminate issues caused by unused volumes for removed containers (DCOS_OSS-1502). 

    Previously, there have been issues caused by orphan volumes that were not removed when their associated containers were removed. In general, you can run  `docker prune` commands to avoid issues with unused volumes. However, with this release, you can also use  `dcos-docker-gc` to remove unused volumes associated with removed containers. 
    
    The `dcos-docker-gc` program is a `systemd`-controlled service that runs hourly on every cluster node to perform Docker-related clean-up operations on each cluster.

## Exhibitor
- Changes the security setting for the configuration parameters `aws_secret_access_key` and `exhibitor_azure_account_key` so that these values are not visible in the `user.config.yaml` file on cluster nodes (DCOS-51751). 

    These configuration parameters are used for Exhibitor. They are now marked as secret. The values set for these configuration parameters can only be viewed in the `user.config.full.yaml` file. The `user.config.full.yaml` file has stricter read permissions than the `user.config.yaml` file and is not included in DC/OS diagnostics bundles.

    <p class="message--note"><strong>NOTE: </strong>This issue and fix are only applicable if you use Amazon S3 or Azure Storage as the Exhibitor backend.</p>

## GUI
- Includes updates to the DC/OS frontend GUI to improve the user experience (COPS-4796, COPS-4804, COPS-4857, DCOS-53836, DCOS-54034, DCOS-54039, DCOS-54041).

## Installation
 - Corrects the output returned when running the `dcos_generate_config.sh` or `dcos_generate_config.ee.sh` script with the `--validate-config` option so that it doesn’t display warning or error messages about missing deprecated configuration settings such as `ssh_user` and `ssh_key_path` (COPS-4282, DCOS_OSS-4613, DCOS_OSS-5152).

## Job management
- Enables you to report the task IDs for finished jobs (DCOS_OSS-5258, DCOS_OSS-5273).

    With this release, you can query run details for jobs using the `embed=history` argument to return task IDs in the job history for both successful and failed finished jobs.

- Improves the validation performed for secrets when running jobs (COPS-4706, DCOS_OSS-5019).

    Previously, if a job had a secret defined but not used in its Environment configuration section, the job submission would fail with an error indicating that `Secret names are different from provided secrets`.
    
    In this release, the validation logic and error messages have changed to indicate the issue detected and how to proceed before resubmitting the job. 
    
    For example, if a secret is defined but not referenced, the validation error specifies that the secret should be removed:

    ```
    The following secrets are defined, but not referenced: "foo". Please remove them from the secrets field.
    ```

    If a job references a secret that isn’t defined, the validation error specifies that the secret should be added:

    ```
    The following secrets are referenced, but undefined: "foo". Please add them to the secrets field.
    ```

## Marathon
- Introduces a watcher loop process to monitor and, if necessary, re-register the Marathon leader after reelection (COPS-3554).<!--Also in previous RN, 1.12.4-->

- Fixes an issue that prevented services managed by Marathon from restarting (COPS-3593, DCOS_OSS-4193).

    In previous releases, you might have services managed by Marathon that are unable to restart if the container crashes or under certain DNS failure conditions. For example, restarting services might fail if the first ZooKeeper node or first DC/OS master is unreachable.

    Because this problem affects high availability for Marathon, a workaround (ping zk-1) was introduced for DC/OS 1.11.5 and 1.11.6 to address the issue. In this release, the underlying issue is resolved and you can safely remove the workaround if you have it deployed. For background information about the issue and the steps to remove the workaround, see [Removing the patch for Marathon failing to start if the first DC/OS is not available](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004). <!--Also in previous RN, 1.12.4-->

## Mesos platform and containerization
- Adds support for Docker registry manifest specification v2_schema2 images (COPS-3889, COPS-4296, COPS-4628, DCOS-49982).

    In previous releases, you might see errors if you attempted to use the DC/OS Universal Container Runtime (UCR) with a Docker image downloaded from [Docker Hub](https://registry-1.docker.io) or from the Nexus 3 Docker registry configured as a proxy for the Docker Hub.
    
    DC/OS Universal Container Runtime (UCR) now fully supports Docker images that are formatted using the Docker v2_schema2 specification. The DC/OS Universal Container Runtime (UCR) also continues to support Docker images that use the v2_schema1 format. If you also have Docker images that use Docker registry v2_schema1 format, you should consider updating those images because the v2_schema1 format is no longer supported by Docker and is likely to be deprecated for other registries in the near future.

    For more information about using Docker images with DC/OS Universal Container Runtime (UCR), see [Universal Container Runtime](/1.12/deploying-services/containerizers/ucr/).

- Changes the behavior for tasks when there are failed resource providers (ASF-2839).

    With this release, the resource manager will no longer ask all resource providers to publish all allocated resources. With this change, a failed resource provider would only fail tasks that wanted to use the failed resource provider's resources.

## Metrics
- Corrects the service endpoint values and service address-based statistics that are returned when the `statsd` metrics input plugin is enabled (COPS-3279, COPS-3576, DCOS-37703, DCOS-39703).<!--Also in previous RN, 1.12.4-->

- Adds HTTP request time and HTTP request size metrics for Metronome-scheduled jobs (DCOS_OSS-5020). 

- Enables framework names to be properly decoded in metric tags (DCOS_OSS-5039).

    Mesos masters allow spaces in framework names by using percent-encoding (%20) of the framework name. This release updates the Telegraf plugin to enable it to decode the framework name and export metrics with the correct tags.

- Fixes issues that caused some DC/OS components to crash when the `/tmp` directory is mounted using the `noexec` option (DCOS-53077).

- Modifies the Telegraf configuration settings to improve how metrics are collected on busy agents (DCOS-50994).

## Networking
- Adds a timeout to the Mesos network overlay module to prevent the overlay master from getting stuck in RECOVERING mode (COPS-4167, COPS-4747, DCOS_OSS-4575, DCOS-47930).

- Includes a fix that prevents duplicate virtual IP addresses (VIP) from showing up after the manual removal of an agent or framework initiated by operator intervention (COPS-4703, DCOS_OSS-4963, DCOS-51157).

    Previously, if an operator manual removed an agent or framework while performing routine maintenance or by issuing the framework TEARDOWN call, the Mesos agent might return information about terminated tasks in a response field normally reserved for running tasks. This incorrect response in turn resulted in the `dcos-net` networking component adding a duplicate VIP entry. The fix in this release prevents the `dcos-net` networking component from adding a duplicate virtual IP address when an agent or framework is removed.

- Changes the behavior for IP routing rules to resolve a conflict between the port used for virtual IP address traffic and the port mapping used for containers (DCOS_OSS-5061).

    Previously, if a container was configured to use port mapping (for example, because the container uses bridge networking) and there is a virtual IP address listening on the same port, the routing of the virtual IP traffic would fail. This failure was caused by a conflict between the `iptable` rules for the `portmapper` and the `iptable` rules for the virtual IP routing.
    
    With this release, the `iptable` rules have been modified so that they are not applied to the traffic that is being routed to a virtual IP address.

- Returns canonical name (CNAME) records before address (A or AAAA) records in DNS responses (COPS-4761, DCOS_OSS-5108). [enterprise type="inline" size="small" /]

    For most DNS clients, the order in which records are returned has no effect. However, there are some DNS clients that require CNAME records to be listed before A records. This change resolves issues for DNS clients that have this requirement.
    
    If you have DNS clients deployed for the DC/OS Enterprise cluster that are not able to resolve the `registry.component.thisdcos.directory` DNS name, the root cause of the issue is a bug in the DNS client `glibc` library. The `glibc` bug requires canonical name (CNAME) records to be retrieved before address (A or AAAA) records. With this release, the DC/OS DNS server sorts DNS results to ensure that the CNAME records appear first to resolve this issue.

- Adds round-robin DNS support so that DNS requests do not always return address (A) records in the same order (DCOS_OSS-5118).

## Package management
- Adds tarball package validation and support for retying a failed package download (COPS-2861).

    Previously, you might encounter issues if the DC/OS package installer (`pkgpanda`) attempted to extract a package tarball into the `/opt/mesosphere/packages` directory but detected that the tarball had only been partially downloaded. If downloading the entire tarball failed, the DC/OS installation process would also fail. With this release, the package installer validates tarballs and can retry the download if the package was not successfully downloaded to the bootstrap computer. 

[enterprise]
## Security
[/enterprise]
- Fixes a problem with the `dcos-iam-ldap-sync` service failing to start correctly after a system reboot (COPS-4455, COPS-4814, DCOS-48107, DCOS-53420).

    With this release, the DC/OS identity and access management LDAP synchronization `systemd` unit no longer relies on the `/opt/mesosphere` directory being available when the `systemd` configuration is loaded.

## Storage
- Updates Beta Rex-Ray to support NVMe (non-volatile memory express) EBS volumes (COPS-3961, DCOS_OSS-4316, DCOS-49828, DCOS-50047).

    REX-Ray is a container storage orchestration engine that enables persistence for cloud-native workloads. With Rex-Ray, you can manage native Docker Volume Driver operations through a command-line interface (CLI).

    Amazon Elastic Block Store (Amazon EBS) provides block-level storage volumes for Amazon Elastic Cloud (EC2) instances. Amazon EBS volumes can be attached to any running EC2 instance hosted in the same Amazon availability zone to provide persistent storage that is independent of the deployed instance. EBS storage volumes can be exposed using NVMe (non-volatile memory express) as a host controller interface and storage protocol. NVMe devices enable you to accelerate the transfer of data between nodes and solid-state drives (SSDs) over a computer's connection gateway.

    With this release, DC/OS updates REX-Ray to support NVMe storage when the DC/OS cluster runs on an Amazon instance. To work with NVMe devices, however, you must provide your own `udev` rules and  `nvme-cli` package. For more information about using Rex-Ray, see the [REX-Ray](https://rexray.io/) website and [github repository](https://github.com/rexray).

## Third-party updates and compatibility
- Updates the [ZooKeeper](https://zookeeper.apache.org/doc/r3.4.14/releasenotes.html) package for DC/OS to release version 3.4.14 (DCOS_OSS-4988).

- Updates support for OpenSSL to release version 1.0.2r (DCOS_OSS-4868).

- Updates the `urllib3` to version 1.24.2 to address the security vulnerability identified for Python when working with CA certificates in CVE-2019-11324 (DCOS-52210).

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers.

# About DC/OS 1.12 
DC/OS 1.12 includes many new features and capabilities. The key features and enhancements focus on:
- [Mesosphere Kubernetes engine](#kubernetes)
- [Mesosphere Jupyter service](#jupyter)
- [Observability and metrics](#observe-metrics)
- [Private package registry](#private-reg)
- [Installation and upgrade improvements](#install)
- [LDAP and networking enhancements](#ldap-net)

<a name="kubernetes"></a>

### Mesosphere Kubernetes engine
- Introduced High Density Multi-Kubernetes (HDMK) that allows operators to take advantage of intelligent resource pooling when running multiple Kubernetes clusters on DC/OS. Compared with other Kubernetes distributions that run a single Kubernetes node per virtual machine, Mesosphere HDMK uses its intelligent resource pooling to pack multiple Kubernetes nodes onto the same server for bare metal, virtual machine, and public cloud instances, driving significant cost savings and resource efficiencies. [Learn more about Kubernetes on DC/OS](/services/kubernetes/2.0.0-1.12.1/).

<a name="jupyter"></a>

### Mesosphere Jupyter service (MJS)
- Delivered secure, [cloud-native Jupyter](https://docs.mesosphere.com/services/beta-jupyter/) Notebooks-as-a-Service to empower data scientists to perform analytics and distributed machine learning on elastic GPU-pools with access to big and fast data services.
- Secured connectivity to data lakes and data sets on S3 and (Kerberized) HDFS.
- Included GPU-enabled Spark and distributed TensorFlow.
- Provided OpenID connect authentication and authorization with support for Windows Integrated Authentication (WIA) and Active Directory Federation Services (ADFS).

<a name="observe-metrics"></a>

### Observability and metrics
- Introduced a flexible and configurable metrics pipeline with multiple output formats.
- Enhanced support for application metric types including histograms, counters, timers, and gauges.
- Provided support for sample rates and multi-metrics packets. 
- Introduced Mesos [framework metrics](http://mesos.apache.org/documentation/latest/monitoring/#frameworks).
- No longer require modifications when collecting metrics via Prometheus endpoint in 1.11.

<a name="private-reg"></a>

[enterprise]
### Private package registry
[/enterprise]
- Enabled [on-premise package distribution and management](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/).
- Enabled air-gapped Virtual Private Cloud package management.
- Simplified package artifact management.
- Introduced package-specific controls for adding/removing/updating packages within a cluster.
- Introduced package management CLI.

<a name="install"></a>

### Installation and upgrade
- Provided full support for installing and operating a cluster with a Security-Enhanced Linux (SELinux) operating system, allowing you to use SELinux in targeted-enforcing mode for all hardened non-DC/OS components.
- Introduced a unified Terraform-based open source tool for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on AWS, GCP, and Azure.
- Introduced an intuitive, streamlined installation with a quick start process - Spin up a DC/OS cluster with a few easy steps in 10-15 minutes. 
- Officially recommended as a Mesosphere supported installation method with best practices built-in (i.e sequential masters & parallel agents in upgrade).
- Restructured [Mesosphere installation documentation](https://docs.mesosphere.com/1.12/installing/evaluation/) to organize Mesosphere supported installation methods and Community supported installation methods.
- Expanded DC/OS upgrade paths enable Mesosphere to skip specific [upgrade paths](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths) within a supported patch version of DC/OS (i.e upgrade from 1.11.1 => 1.11.5 in one move) and to skip upgrade paths between supported major to major versions of DC/OS (for example, enabling you to upgrade from 1.11.7 to 1.12.1 in one move).

<a name="ldap-net"></a>

[enterprise]
### LDAP and networking enhancements
[/enterprise]
- Introduced anonymous LDAP bind complies with standardized Enterprise LDAP integration pattern without a dedicated DC/OS integration LDAP user.
- Provided dynamic LDAP synchronization to synchronize [LDAP user account groups](https://docs.mesosphere.com/1.12/security/ent/users-groups/) automatically without manual synchronization of [LDAP directory](https://docs.mesosphere.com/1.12/security/ent/ldap/) with accounts imported into DC/OS.
- Enhanced networking component with 150+ bug fixes with limited logging for visibility.
- Improved DNS convergence time (sub-sec) performance.
- Configured MTU for Overlay networks.
- Provided reusable IP addresses for new agents in the cluster.
- Mitigation of networking stuck-state due to SSL deadlock in Erlang library.
- Provided TLS 1.2 support.
- Provided support for per container network Metrics.
- Leveraged persistent connections in Edge-LB for L7 load-balancing. [enterprise type="inline" size="small" /]
- Improved logging in Edge-LB. [enterprise type="inline" size="small" /]
