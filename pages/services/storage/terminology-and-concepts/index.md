---
layout: layout.pug
navigationTitle: Terminology and Concepts
title: Terminology and Concepts
menuWeight: 5
excerpt:
---

# [Terminology and Concepts](#Terminology-and-Concepts)

## [Device](#Device)
## [CSI Spec](#CSI-Spec)
## [CSI Plugin](#CSI-Plugin)
## [Storage Local Resource Provider (SLRP)](#Storage-Local-Resource-Provider(SLRP))
## [Storage External Resource Provider (SERP)](#Storage-External-Resource-Provider(SERP)
## [Volume Provider](#Volume-Provider)
## [Volume Plugin](#Volume-Plugin)
## [Volume Profile](#Volume-Profile)
## [Volume](#Volume)

# Terminology and Concepts

We use the following terminology throughout the documentation.

## Device 

A Linux block <a href="https://en.wikipedia.org/wiki/Device_file/">device file</a> presenting storage capacity on an agent.

## CSI Spec
The <a href="https://github.com/container-storage-interface/spec/blob/master/spec.md/">Container Storage Interface</a> is an open standard developed by the community to standardize the API between container orchestrators (Mesos, Kubernetes, Cloud Foundry, Docker, etc.) and storage vendors (EBS, Dell ScaleIO, Ceph, Portworx, etc.).

Currently, DC/OS supports CSI spec v0.1.

## CSI Plugin

A gRPC endpoint that implements the CSI Services specified in the CSI spec. See more details about CSI terminology <a href="https://github.com/container-storage-interface/spec/blob/master/spec.md#terminology/">here</a>.

## Storage Local Resource Provider (SLRP)

A Mesos component that drives a single CSI plugin that manages storage resources that exist on a single agent. It presents these storage resources (both raw capacity and in the form of volumes) to Mesos and translates operations on those resources to CSI RPCs which it executes against the CSI plugin. Examples of such CSI plugins are those for LVM2, Raw GPT, other direct-attached storage. Learn more details about SLRP in this <a href ="http://mesos.apache.org/documentation/latest/csi/#storage-local-resource-provider/">Mesos documentation</a>.

## Storage External Resource Provider (SERP)

A Mesos component that drives a single CSI plugin that manages storage resources bound to the cluster as a whole, not tied to to a single agent. It presents these storage resources (both raw capacity and in the form of volumes) to Mesos and translates operations on those resources to CSI RPCs which it executes against the CSI plugin. Examples of such CSI plugins are those for Amazon EBS, NFS, other storage that can be automatically reattached to different agents.

## Volume Provider

A storage object from which a volume can be provisioned. Practically, a volume provider is associated with a single instance of a CSI plugin. Each volume provider hooks into Mesos through a single instance of a Storage Local Resource Provider (SLRP) or Storage External Resource Provider (SERP). There can be many instances of a given kind of volume provider. For example, “lvm volume group” is a kind of volume provider but there can be multiple LVM2 volume groups where each volume group is configured as a separate volume provider.

Example volume providers, multiple of which can appear on the same cluster or agent: 
LVM2 Volume Group (via the LVM2 CSI plugin), 
NFS mount (via some NFS CSI plugin),
ScaleIO <Protection Domain, Storage Pool> (via some ScaleIO CSI plugin)
Amazon EBS: ebs-1, ebs-2, etc.

## Volume Plugin

The software installable component associated with a volume provider. It is typically installed on the agent nodes, e.g., the LVM plugin. Plugins have easily recognizable names such as “lvm” or “ebs”.

## Volume Profile

A set of parameters that can be used to configure a volume. Volume profiles are used to classify volumes according to Dan’s use cases, for example Dan could group all his SSDs into a “fast” profile while grouping HDDs into a “slow” volume profile. Volume profiles are immutable and therefore cannot contain references to specific devices, nodes or other ephemeral identifiers. The CLI subcommand is called ‘profile’ instead of ‘volume profile’ for the sake of brevity.

## Volume

A chunk of storage capacity allocated from a volume provider. This term is inherited from the <a href="https://github.com/container-storage-interface/spec/blob/v0.1.0/spec.md/">CSI Specification</a>. A volume maps to the concept of a Mesos Volume, although not all Mesos Volumes correspond to CSI volumes (eg., Mesos Container Volume, Mesos Persistent Volume).







