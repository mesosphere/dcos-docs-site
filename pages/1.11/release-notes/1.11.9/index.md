---
layout: layout.pug
navigationTitle: Release Notes for 1.11.9
title: Release Notes for 1.11.9
menuWeight: 5
excerpt: Release notes for DC/OS 1.11.9
---

DC/OS Version 1.11.9 was released on January 31, 2019.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.9/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.9 includes the following components:
- Apache Mesos 1.5.3 [change log](https://github.com/apache/mesos/blob/5f6225bd6e039c633b7758f02d2b5fbabc8e0169/CHANGELOG).
- Marathon 1.6.567 [change log](https://github.com/mesosphere/marathon/tree/2d8b3e438).
- Metronome 0.4.5 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.5).

# Release Summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues Fixed in DC/OS 1.11.9
The issues that have been fixed in DC/OS 1.11.9 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

## GUI 
- DCOS-45803 - The multi-container JSON editor deletes properties that are not supported by the form. When you run a Pod, the UI deletes `backoff`, `upgrade`, `killSelection`, and `unreachableStrategy` fields from the JSON app definition before sending the request to the server.

## Installing
- DCOS_OSS-4040 - The `dcos-diagnostic` bundle files are stored in `/var/lib/dcos/dcos-diagnostics/diag-bundles` and `/var/lib/dcos` is not a separate partition. It belongs to the root directory and there are many other critical data in the same directory on the masters, which could seriously damage a cluster if diagnostics bundle takes most of the space. The workaround is to add a configuration option that can be used to specify where to store diagnostic bundles on the masters.

## Mesos 
- COPS-4320, DCOS-46753 - This issue occurs due to a race between `.discard()` triggered by check container `TIMEOUT` and `IOSB` extracting `ContainerIO` object. This race could be exposed by overloaded/slow agent process if there are frequent check containers launched on an agent with heavy loads. This release fixes the issue by discarding `launch`, so the container I/O is cleaned up and therefore all FDs are closed.
- DCOS-29474 - Occasionally flakes in `test_srv_records` are traced down to frameworks that are not correctly unregistered. This release validates that the framework is correctly unregistered, and throws an exception (triggering log collection) if the check fails after an uninstall. 
- DCOS-46388 - If there is a validation error for `LAUNCH_GROUP`, or if there are multiple authorization errors for some of the tasks in a `LAUNCH_GROUP`, the master skips to process the remaining authorization results.
- DCOS-46814 - When an agent host reboots, all of its containers fail but the agent will try to recover from its checkpoint state after reboot. The agent will soon discover that all the `cgroup` hierarchies have failed and assume that the containers are destroyed. However, when trying to terminate the executor, the agent will first try to wait for the `exit` status of its container by `waitpid` on the checkpointed child process `pid`. If an agent host reboots and a new process with the same `pid` gets spawned then the parent waits for the wrong child process. This process will block the executor termination and future task status updates. 

## Metrics
- DCOS_OSS-3863 - This release fixes a bug in `dcos-metrics` that caused Prometheus exporter to omit some metrics data on the agent nodes. 

## Networking 
- COPS-3743, COPS-4323, DCOS_OSS-4620 - Erlang has a concept of [cookie](http://erlang.org/doc/reference_manual/distributed.html#security) which allows/disallows a node to make a connection with the other nodes in the cluster. Only nodes with the same cookie strings are allowed to make connections. Currently, this cookie is a fixed string and not configurable in DC/OS. If nodes from different DC/OS clusters are reachable to each other then there is a possibility of "cross talk" between the two clusters. This fix is to make the cookie configurable.
- DCOS-40539, DCOS-46506 - Currently, the configuration option `enable_ipv6` is not passed to the frontend. The UI is not aware that the cluster does not support the `dcos6` network type. This release passes the configuration option to the frontend configuration file and uses it to conditionally show the `dcos6` option for the network types. Therefore, this issue fixes the validation of overlay backends by marking `dcos6` overlay network as disabled, if `enable_ipv6` is set to false. 
- DCOS-46915 - In OTP 20 and earlier, all Erlang distribution protocol connections over TLS are initialized by `ssl_tls_dist_proxy` one at a time. This approach causes a bottleneck and is resolved in the newest OTP versions. If the node connects to a non-existing node, it takes up to 30 seconds to get an error. Lashup tries to connect to such nodes every `n` seconds which causes a message storm in `ssl_tls_dist_proxy`. The workaround is to restart the entire virtual machine, if there are more than `m` messages in the queue. It is recommended not to kill the `ssl_tls_dist_proxy` since it will break all new and old distribution protocol connections.
- DCOS_OSS-4667 - Mesos recently introduced a flag to toggle CNI root directory to persist across reboot. Now, you can expose the Mesos flag through DC/OS config.yaml file. 

## Package Management
- DCOS_OSS-4418 - The requests package before 2.20.0 for python sends a `HTTP` authorization header to a `HTTP URI` upon receiving a same host name `https-to-http` redirect, which makes it easier for remote attackers to discover credentials by sniffing the network. This causes a vulnerability in the requests library necessitating an upgrade. This release upgrades the version of the requests library to an updated and more secure version 2.20.1 and urllib3 to 1.24.1.

# Known Issues and Limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers.

## Mesos
- DCOS-44935, DCOS_OSS_3877, DCOS_OSS-4658 - The diagnostics bundle is the standard way of collecting the debugging information from a cluster to debug and fix critical issues on customer sites. Most of the powerful debugging information is lost since the diagnostic bundle is not created as the root user and network information is not collected as part of the diagnostic bundle. To resolve this issue, create `dcos-diagnostics` as the root user which will collect the best possible diagnostic information in order to effectively debug issues.

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
