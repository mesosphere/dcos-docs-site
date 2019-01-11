---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.8
title: Release Notes for 1.11.8
menuWeight: 5
excerpt: Release notes for DC/OS 1.11.8
---

DC/OS 1.11.8 was released on December 6, 2018. 

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.8/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.8 includes the following components:
- Apache Mesos 1.5.x [change log](https://github.com/apache/mesos/blob/9c28b265804269de9411f04cfcccefe3bdd8ef1a/CHANGELOG).
- Marathon 1.6.567 [change log](https://github.com/mesosphere/marathon/tree/2d8b3e438).
- Metronome 0.4.5 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.5).

# Issues Fixed in DC/OS 1.11.8

## GUI
- COPS-3360, DCOS-43934 - Updates to the DC/OS UI provide better rendering for elements such as environment variables, secrets, labels, and version information.   
- DCOS-37791, DCOS-42504 - For improved scalability, the DC/OS UI starts loading state information immediately after users log on.

## Marathon
- COPS-3764	- The upgrade to Marathon 1.6.x enables successful secret validation for secrets included in a Marathon JSON app definition file.

## Mesos
- COPS-3573 - Service endpoints for layer-4 load balancing (`l4lb`) addresses with UCR and CNI can be configured and deployed by using the DC/OS UI or through the DC/OS CLI. A fix ensures that the configuration done through the DC/OS UI is not overwritten by using the DC/OS CLI.
- COPS-3953	- The Mesos fetcher process automatically retries downloading files using their associated URI if the previously-downloaded and cached versions of the files are not found.
- DCOS-41248 - Changes to `dcos-log` prevent agents from overwheming the `journald ` logging facility with messages from endpoints and API requests.
- DCOS-43544 - Logic changes enable nested containers to run under the same user account as the user associated with their parent container by default. For nested containers in a pod, the default executor’s user--that is, the user running the top-level container--has been the framework user. In a scenario where the framework user is a normal user but the nested container user is `root`, the change in this release enables the second-level nested containers to run as the same user--for example, the `root` user--as the parent top-level container instead of as the framework user by default.
- DCOS-43593 - This release fixes an issue that could cause Mesos master endpoints—such as `reserveResources` or `createVolume`—to fail during authorization. For example, before implementing this fix, the authorization requests for an endpoint might fail or be incomplete if there’s extreme load on the IAM service. The change in this release ensures that authorization requests for an endpint are complete before continuing.
- DCOS-43670, DCOS-44827 - The `cgroups` event listener code is used to poll events for a container. An update to this code ensures that the listener closes the file descriptor after read operations are complete. The fix prevents a race condition that can leave the container in an ISOLATING or PROVISIONING state.

## Metronome
- DCOS-45564, DCOS_OSS-2535 - This release adds support for enhancements and issues fixed in Metronome 0.4.5.
- DCOS_OSS-3616	- Metronome initialization improvements prevent Metronome from being in an incomplete state that could cause Mesos offers and associated resources to be held in reserve waiting for the offer to be accepted or declined.

## Networking
- COPS-3924 - The distributed layer-4 load-balancer (dcos-l4lb) network component waits to route traffic until a scale out operation is complete or its health check has passed.
- COPS-4034, DCOS_OSS-4398	- This release prevents `dcos-net` from continously restarting `systemd-networkd` on a bare-metal server with bond interfaces.
- COPS-4087	- For applications that use Docker containers with a Virtual IP address, backend port mapping resolves access to the application by using the `host_IP:port_number` instead of the `container_ip:port_number`.

# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds [enterprise type="inline" size="small" /].
- Production Kubernetes-as-a-service.
- Enhanced data security [enterprise type="inline" size="small" /].
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
