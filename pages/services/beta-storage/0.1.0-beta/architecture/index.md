---
layout: layout.pug
navigationTitle: Architecture
title: Architecture
menuWeight: 20
excerpt:
---

The following figure shows the high level architecture of the storage support in DC/OS.

![Storage support in DC/OS](../img/dcos-storage-architecture.png)

One of the most important components in this architecture is the DC/OS storage service (DSS), a [Service](/latest/overview/concepts/#system-service) that manages volumes, volume profiles, volume providers, and storage devices in the cluster.
DSS serves as the brain of the storage support by collecting storage related information from various components in the cluster, keeping track of their states, and acting on user requests.

Volumes are modeled as [Mesos Resources](http://mesos.apache.org/documentation/latest/attributes-resources/#resources/) ("disk" resources) so that all the resource management features (e.g., quota, fair sharing, weights) from Mesos apply to volumes.
DSS itself is a Mesos Framework that registers with the Mesos master, and manages "disk" resources offered from Mesos.

Devices from each agent are reported to DSS as [Mesos RAW disk resources](http://mesos.apache.org/documentation/latest/csi/#new-disk-source-types/).
Those devices can be used to create LVM volume providers.
Currently, there is a 1:1 mapping between volume providers and [Mesos Storage Local Resource Providers (SLRP)](http://mesos.apache.org/documentation/latest/csi/#storage-local-resource-provider/).
Creating a volume provider effectively means creating a SLRP.
To create a volume provider, DSS will ask the Mesos agent operator API to create a SLRP.

Each SLRP is associated with a [CSI Plugin](http://mesos.apache.org/documentation/latest/csi/#slrp-configuration/) that is responsible for talking to the actual storage backend.
Each CSI Plugin is a set of long running gRPC services, whose lifecycles are managed by the corresponding SLRP.
More details can be found [here](http://mesos.apache.org/documentation/latest/csi/#standalone-containers-for-csi-plugins/).

DSS is also responsible for creating volumes by [converting](http://mesos.apache.org/documentation/latest/csi/#new-offer-operations-for-disk-resources/) Mesos [RAW disk resources](http://mesos.apache.org/documentation/latest/csi/#new-disk-source-types/) to either [Mount or Block disk resources](http://mesos.apache.org/documentation/latest/csi/#new-disk-source-types/) and deleting volumes by doing the reverse.
Created Mount or Block disk resources will be offered to other frameworks in the cluster.
These frameworks can then use the disk resources in the same way as they would use other Mount or Block disk resources.

Cluster administrators can use DC/OS CLI to interact with DC/OS storage service (DSS) using the newly introduced 'storage' CLI sub-command.
See more details in the [CLI References](../cli-references/) section.
