---
layout: layout.pug
navigationTitle: Release Notes for 1.11.5
title: Release Notes for 1.11.5
menuWeight: 25
excerpt: Release notes for DC/OS 1.11.5
---

DC/OS 1.11.5 was released on September 12, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

# Notable Changes in DC/OS 1.11.5

DC/OS 1.11.5 includes the following components:
- Apache Mesos 1.5.x [change log](https://github.com/apache/mesos/blob/19d17cec3e797758e76c081efb68867d440ed4d3/CHANGELOG).
- Marathon 1.6.544 [change log](https://github.com/dcos/dcos/pull/3289).
- Metronome 0.4.3 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.3).

- DCOS-38342 - Documentation: Rename advanced installation to production installation.
 
# Customer Advisory
- [Addressing deadlock issues when SSL sockets are simultaneously sending/receiving data and buffers are full](https://support.mesosphere.com/s/article/Critical-Issue-DC-OS-Networking-MSPH-2018-0003).
- [Marathon will not launch if the first DC/OS Master is down](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004).
<p class="message--note"><strong>NOTE: </strong>The <a href="https://support.mesosphere.com/s/">support website</a> requires a <a href="https://support.mesosphere.com/s/login/">login credential</a> to access the customer advisory information.

# Issues Fixed in DC/OS 1.11.5

## GUI
- COPS-3051/DCOS-39662 - Fix deployment state in Marathon-LB debug page.
- COPS-3573/DCOS-39720 - Enable service endpoints on UCR.
- DCOS-21049 - Add `dcos:secrets:list:default:/` secret permission to access DC/OS UI.
- DCOS-38595 - Fix display error messages in framework configuration form.
- DCOS-39877 - Remove flickering filter issue in tasks view.
- DCOS-40523 - Enable empty environment variables reducer to support empty values. 
- DCOS-40577 - Fix dashboard permissions and node tab with correct ACLs for users (non-super users and remote users).
- DCOS_OSS-3801 - Add support for Docker parameters in Metronome jobs.
- Update DC/OS UI for 1.11+v1.19.0. [oss type="inline" size="small" /]
- Update DC/OS UI for 1.11+v1.19.0+1c67f4b5. [enterprise type="inline" size="small" /]

## Marathon
- COPS-3505/MARATHON-8326 - Add `wipe=true` support for pod's instances endpoint to automatically drain and decomission agent nodes.
- MARATHON-7568 - Prevent ZK credentials leak in /v2/info.
- MARATHON-8084 - Clean up Marathon API POST header. 
- MARATHON-8368 - Fix offer rejection statistics error when maintenance mode is enabled. 

## Mesos
- COPS-3616/DCOS-39973/DCOS-40162 - Fix container launch failures that occurred due to Mesos-bridge running out of IPs.
- COPS-3750/DCOS-41224 - Fix for UCR container cleanup `EBUSY` issue, which restarts EdgeLB tasks.
- DCOS-38225 - Prevent task loss by fixing error handling failures of Mesos-IAM interaction. [enterprise type="inline" size="small" /]
- DCOS-40410 - Bump Mesos to nightly [1.5.x eacabd7](https://github.com/mesosphere/mesos/blob/eacabd7/CHANGELOG).

## Networking
- COPS-3279/COPS-3576/DCOS-37703/DCOS-39721 - Fix erroneous values in service addresses stats. Bump dcos-net.
- COPS-3472/DCOS-38932 - Enable access to Marathon app via overlap network. 
- COPS-3520/DCOS-39999 - Fix DC/OS OSS build failure that occurred due to segmentation violation.
- DCOS-39707 - Fix clustering issues with `etcd`.
- DCOS_OSS-3697 - Fix connectivity issue between bridge and overlay networks.
- DCOS_OSS-3841 - Update CNI plugin versions to v0.7.1.

## Platform
- COPS-3568/DCOS-39883 - Add permissions to `dcos_diagnostics_master` to read marathon state.
- DCOS-22194 - Fix `dcos-metrics` pkgpanda build to utilize Docker. 
- DCOS-37454 - Fix Prometheus inconsistent output with stored metrics.

[enterprise]
## Security
[/enterprise]
- COPS-2988 - Provide access permissions with full capabilities to the user. 
- COPS-3195 - Fix cluster authentication issues running in strict mode and issues arising from transient errors in the `ip-detect` script.
- COPS-3485/DCOS_OSS-3937 - Prevent loss of ZK myid configuration file by recreating the deleted myid configuration file and restarting exhibitor 
- DCOS-38655 - Force all login requests through Admin Router. 
- DCOS-39259 - Add error handling for `StartTLS` in case of socket failure.
- DCOS-39260 - Fix LDAP login failure after upgrade from 1.11.1 to 1.11.3.
- DCOS_OSS-3932 - Update Java version from 8u151 to 8u181.

## Storage
 - DCOS-39891 - Add a new permission to `dcos_diagnostics_master` service account user during bootstrap.


# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds. [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service.
- Enhanced data security. [enterprise type="inline" size="small" /]
- Updated data services.

Provide feedback on the new features and services at: [support.mesosphere.com](https://support.mesosphere.com).


## New Features and Capabilities

### Platform
- Multi-region management - Enables a DC/OS Cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between one cluster and another. You add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links/). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Decommission node - Support for permanently decommissioning nodes makes it easier to manage “spot” cloud instances, allowing for immediate task rescheduling. [View the documentation](/1.11/hybrid-cloud/features/decommission-nodes/)
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers/).
  -  Support for Docker image pull secrets. [View the documentation](/1.11/installing/ent/custom/configuration/configuration-parameters/#cluster-docker-credentials). An example for Docker credentials is [here](/1.11/installing/ent/custom/configuration/examples/#docker-credentials). [enterprise type="inline" size="small" /]

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

**Note:** Because these storage features are beta in 1.11, they must be explicitly enabled in the config.yaml file when installing DC/OS. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported. [enterprise type="inline" size="small" /]
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [enterprise type="inline" size="small" /]
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper/).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.


