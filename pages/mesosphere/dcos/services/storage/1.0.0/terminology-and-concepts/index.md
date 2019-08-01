---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/terminology-and-concepts/index.md
navigationTitle: Terminology and Concepts
title: Terminology and Concepts
menuWeight: 15
excerpt: Common definitions and terms used throughout DC/OS Storage Service documentation.
enterprise: true
---

We use the following terminology throughout the documentation.

# Device

A Linux block [device file](https://en.wikipedia.org/wiki/Device_file/) presenting storage capacity on an agent.

# CSI Spec

The [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md/) is an open standard developed by the community to standardize the API between container orchestrators (Mesos, Kubernetes, Cloud Foundry, Docker, etc.) and storage vendors (EBS, Dell ScaleIO, Ceph, Portworx, etc.).

Currently, DC/OS supports v0.1 of the CSI specification.

# CSI Plugin

A CSI plugin provides an endpoint that presents the gRPC services defined by the CSI specification.
See more details about CSI terminology [here](https://github.com/container-storage-interface/spec/blob/master/spec.md#terminology/).

# Storage Local Resource Provider (SLRP)

A Mesos component that drives a single CSI plugin to manage storage resources that are local to an agent.
It presents these storage resources (both raw capacity and in the form of volumes) to Mesos and translates operations on those resources to CSI RPCs which it executes against the CSI plugin.
Examples of CSI plugins are those for LVM, Raw GPT, other direct-attached storage.
Learn more details about SLRP in [Mesos documentation](http://mesos.apache.org/documentation/latest/csi/#storage-local-resource-provider).

# Storage External Resource Provider (SERP)

A Mesos component that drives a single CSI plugin to manage storage resources available to the cluster (and not localized to a single agent).
It presents these storage resources (both raw capacity and in the form of volumes) to Mesos and translates operations on those resources to CSI RPCs which it executes against the CSI plugin.
Examples of such CSI plugins are those for Amazon EBS, NFS, other storage that can be automatically reattached to different agents.

# Volume Provider

A storage object from which a volume can be provisioned.
Practically, a volume provider is associated with a single instance of a CSI plugin.
Each volume provider integrates with Mesos through a single instance of a Storage Local Resource Provider (SLRP) or Storage External Resource Provider (SERP).
There can be many instances of a given kind of volume provider.
For example, "lvm volume group" is a kind of volume provider but there can be multiple LVM volume groups where each volume group is configured as a separate volume provider.

Example for volume providers, multiples of which can appear on the same cluster or agent:

1. LVM Volume Group (via the LVM CSI plugin).
2. NFS mount (via some NFS CSI plugin).
3. ScaleIO <Protection Domain, Storage Pool> (via some ScaleIO CSI plugin).
4. Amazon EBS: ebs-1, ebs-2, etc. (via some EBS CSI plugin).

# Volume Plugin

The software installable component associated with a volume provider.
It is typically installed on the agent nodes, such as the LVM plugin.
Plugins have easily recognizable names such as "lvm" or "ebs".

# Volume Profile

A set of parameters that can be used to configure a volume.
Volume profiles are used to classify volumes according to a user's use cases.
For example, users can group all their SSDs into a "fast" profile, while grouping HDDs into a "slow" volume profile.
Volume profiles are immutable and therefore cannot contain references to specific devices, nodes or other ephemeral identifiers.
The CLI subcommand is called "profile" instead of "volume profile" for the sake of brevity.

# Volume

A chunk of storage capacity allocated from a volume provider.
This term is inherited from the [CSI Specification](https://github.com/container-storage-interface/spec/blob/v0.2.0/spec.md/).
A volume maps to the concept of a Mesos Volume, although not all Mesos Volumes correspond to CSI volumes (such as Mesos Container Volume, Mesos Persistent Volume).
