---
layout: layout.pug
navigationTitle: Release Notes for 1.11.11
title: Release Notes for 1.11.11
menuWeight: 5
excerpt: Release notes for DC/OS 1.11.11
---

DC/OS version 1.11.11 was released on June 5, 2019.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.11/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.11.11/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

DC/OS 1.11.11 includes the following components:
- Apache Mesos 1.5.4 [change log](https://github.com/apache/mesos/blob/6a8b61b59498dcea64d9380a233d517ce65dc2ef/CHANGELOG).
- Marathon 1.6.585 [change log](https://github.com/mesosphere/marathon/blob/3e0898228572e5c758c4ae17838fc5a9b0459e92/changelog.md).
- Metronome 0.6.18 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.5).

# Release Summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues Fixed in DC/OS 1.11.11
The issues that have been fixed in DC/OS 1.11.11 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.


## CLI 
- DCOS-42928, DCOS_OSS-5105 - Use `docker ps` instead of `docker up` in diagnostics, since `docker up` is an invalid Docker command. 
- DCOS_OSS-1502 - There were couple issues caused by unused volumes for removed containers. It is recommended to use Docker prune commands to avoid the occurrence of such issues. This release uses `docker-gc` command to remove the unused volumes.

## Exhibitor
- DCOS-51751 - The configuration parameters `aws_secret_access_key` and `exhibitor_azure_account_key` for Exhibitor are marked as `secret`. These configuration parameters will not be revealed in `user.config.yaml` on cluster nodes. In this release, the configuration parameters will appear only in `user.config.full.yaml` which has stricter read permissions and is not included in DC/OS diagnostics bundles.

## GUI
- DCOS-54087 - In the previous releases, UI overrides `concurrencyPolicy` field in schedule to always be `ALLOW`. In this release, the `concurrencyPolicy` field is fixed for UI to keep the value intact, thus allowing other concurrency policies other than `ALLOW`.

## Installation
- DCOS-15890 - The pre-flight check on advanced installer shows misleading information. This release improves the context of an error message, in case Docker is not running at the start of installation.
- DCOS-53077 - Fixed a number of issues that caused some DC/OS components to crash when `/tmp` is mounted with the `noexec` option.

## MARATHON
- MARATHON-8596 - Marathon health checks is a deprecated feature and users are strongly recommended to switch to Mesos health checks for scalability reasons. However, there are  number of issues when excessive number of Marathon health checks (HTTP and TCP) would overload parts of Marathon. This release introduces a new parameter `--max_concurrent_marathon_health_checks` that defines the maximum number (256 by default) of Marathon health checks (HTTP/S and TCP). These health checks can be executed concurrently. Remember that setting a large value here and using many services with Marathon health checks will overload Marathon thus leading to internal timeouts and unstable behavior.

## Networking
- DCOS-49711 - This release fixes the failure of `dcos-net-setup.py` when `systemd` network directory did not exist. 
- DCOS_OSS-4970, DCOS_OSS-5061 - If a container is using port mapping functionality (such as a container in bridge mode) and if there is a VIP listening on the same port as the host port in port mapping then the VIP traffic doesn't work. This happens because the iptable rules for port mapper kicks in before the VIP iptable rule. This release fixes a conflict between VIP port and port mapping. 

## Package Management
- COPS-2861 - Users often encounter an issue where pkgpanda will attempt to extract a package tarball into `/opt/mesosphere/packages`, but it fails due to the tarball only having been partially downloaded. This causes the entire DC/OS install process to fail. This release validates tarballs and/or retry a failed package download in DC/OS bootstrap. 
- COPS-3889, COPS-4296, COPS-4628, DCOS-49982 - An error occurred when trying to use UCR with a Docker image via [Docker Hub](https://registry-1.docker.io) and Nexus 3 Docker registry is configured as a proxy to the Docker Hub. This release adds a support for Docker registry V2 Schema 2 because some major registries may start to deprecate V2 Schema 1 in the near future. 
- COPS-3961, DCOS_OSS-4316 - Updated REX-Ray version to [0.11.4](https://github.com/rexray/rexray/releases/tag/v0.11.4).
- DCOS_OSS-4097, DCOS_OSS-5106 - In the previous releases, pkgpanda relied on the fact that the `useradd` command creates a matching group for a newly-created user. This assumption worked because it was set in the `USERGROUPS_ENAB` setting in `/etc/login.defs`. For more information read the [useradd](https://linux.die.net/man/8/useradd) command. This release explicitly creates user groups for all users.

## Platform 
- DCOS_OSS-4613 - If you run the `dcos_generate_config` command with the `--validate` option, the command validates the configuration settings in your config.yaml file. In some cases, this option issued warning messages that validation failed for parameters that are no longer used. For example, some SSH parameters, such as `ssh_key_path` and `ssh_user`, have been deprecated. Previously, if you ran `dcos_generate_config` with the `--validate` option to check your configuration settings and these parameters were not specified, the command reported that the validation of configuration parameters had failed. With this release, the `--validate` option does not return validation failure messages for parameters that are no longer required for installation.

## Security
- DCOS-45468 - Changed Admin Router's service endpoint to support Marathon app definitions that use the container networking mode. See [network API migration](https://github.com/mesosphere/marathon/blob/master/docs/docs/upgrade/network-api-migration.md#example-definitions) for more information.
- DCOS-52210 - Update to `urllib` 1.24.2 due to a security vulnerability in version 1.24.1.
- DCOS_OSS-4868 - Updated to [OpenSSL 1.0.2r](https://www.openssl.org/news/openssl-1.0.2-notes.html).


# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds. [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service.
- Enhanced data security. [enterprise type="inline" size="small" /]
- Updated data services.

Provide feedback on the new features and services at [support.mesosphere.com](https://support.mesosphere.com).

## New Features and Capabilities in DC/OS 1.11

### Platform
- Multi-region management - Enables a DC/OS cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between one cluster and another. You can add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links/). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Decommission nodes - Support for permanently decommissioning nodes makes it easier to manage `spot` cloud instances, allowing for immediate task rescheduling. [View the documentation](/1.11/hybrid-cloud/features/decommission-nodes/)
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers/).
  - Support for Docker image pull secrets. [View the documentation](/1.11/installing/ent/custom/configuration/configuration-parameters/#cluster-docker-credentials). An example for Docker credentials is [here](/1.11/installing/ent/custom/configuration/examples/#docker-credentials). [enterprise type="inline" size="small" /]

### Networking
- Edge-LB 1.0. [View the documentation](https://docs.mesosphere.com/services/edge-lb/1.0/). [enterprise type="inline" size="small" /]
- IPv6 is now supported for Docker containers.
- Performance improvements to the DC/OS network stack - All networking components (minuteman, navstar, spartan) are aggregated into a single systemd unit called `dcos-net`.  Read this [note](/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.
- The configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists ([DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)). [View the documentation](/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) to understand its usage.

[enterprise]
### Security
[/enterprise]
- Secrets Management Service
  - Secrets can now be binary files in addition to environment variables.
  - Hierarchical access control is now supported.

### Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/1.11/metrics/).
- Unified logging API provides simple access to container (task) and system component logs. [View the documentation](/1.11/monitoring/logging/logging-api/).

### Storage
- DC/OS Storage Service 0.1 (beta) - DSS users will be able to dynamically create volumes based upon profiles or policies to fine-tune their applications storage requirements. This feature leverages the industry-standard Container Storage Interface (CSI) to streamline the development of storage features in DC/OS by Mesosphere and our community and partner ecosystems. [View the documentation](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /] [enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

<p class="message--note"><strong>NOTE: </strong>Because these storage features are beta in 1.11, they must be explicitly enabled in the config.yaml file when installing DC/OS. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.</p>

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported. [enterprise type="inline" size="small" /]
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [enterprise type="inline" size="small" /]
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper/).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.
