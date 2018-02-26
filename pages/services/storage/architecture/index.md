---
layout: layout.pug
navigationTitle: Architecture
title: Architecture
menuWeight: 10
excerpt:
---

# Architecture

![Storage support in DC/OS](/services/img/Storage-Service-Architecture.png)

The above figure, shows the high level architecture of the storage support in DC/OS. One of the most important component in this architecture is the DC/OS storage service (DSS), a <a href="https://docs.mesosphere.com/1.11/overview/concepts/#service/">Service</a> that manages volumes, volume profiles, volume providers, and storage devices in the cluster. DSS serves as the brain of the storage support by collecting storage related information from various components in the cluster, keeping track of their states, and acting on user requests.

Volumes are modeled as <a href="http://mesos.apache.org/documentation/latest/attributes-resources/#resources/">Mesos Resources</a> (“disk” resources) so that all the resource management features (e.g., quota, fair sharing, weights) from Mesos apply to volumes. DSS itself is a Mesos Framework that registers with the Mesos master, and manages “disk” resources offered from Mesos.

Devices from each agent are reported to DSS as <a href="http://mesos.apache.org/documentation/latest/csi/#new-disk-source-types/">Mesos RAW disk resources</a>. Those devices can be used to create LVM volume providers. Currently, there is a 1:1 mapping between volume providers and <a href="http://mesos.apache.org/documentation/latest/csi/#storage-local-resource-provider/">Mesos Storage Local Resource Providers (SLRP)</a>. Creating a volume provider effectively means creating a SLRP. To create a volume provider, DSS will hit the Mesos agent operator API to create a SLRP.

Each SLRP is associated with a <a href="http://mesos.apache.org/documentation/latest/csi/#slrp-configuration/">CSI Plugin</a> that is responsible for talking to the actual storage backend. Each CSI Plugin is a set of long running gRPC services, whose lifecycles are managed by the corresponding SLRP. More details can be found <a href="http://mesos.apache.org/documentation/latest/csi/#standalone-containers-for-csi-plugins/">here</a> .

DSS is also responsible for creating volumes by <a href="http://mesos.apache.org/documentation/latest/csi/#new-offer-operations-for-disk-resources/">converting</a> Mesos<a href="http://mesos.apache.org/documentation/latest/csi/#new-disk-source-types/">RAW disk resources</a> to either <a href="http://mesos.apache.org/documentation/latest/csi/#new-disk-source-types/">Mount or Block disk resources</a> and deleting volumes by doing the reverse). Created Mount or Block disk resources will be offered to other frameworks in the cluster. Those frameworks can then use those disk resources the same way they would use other Mount or Block disk resources.

Cluster administrators can use DC/OS CLI to interact with DC/OS storage service (DSS). A ‘storage’ command has been introduced. 

See more details in the <a href="https://docs.google.com/document/d/1MZ7ARRAs_lmXo94h28-wCPqsqA9xDwMPSLgN7_5n84w/edit#heading=h.uxzvneaexifq/">CLI documentation</a>
