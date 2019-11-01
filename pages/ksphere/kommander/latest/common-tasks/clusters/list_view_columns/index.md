---
layout: layout.pug
navigationTitle: List View Columns
title: List View Columns
menuWeight: 10
excerpt:
---
Name
cluster name
Type
See Cluster types
Provider
see Administration > Cloud Providers
Version
The version of kubernetes the cluster was created with
Status
see Cluster Statuses
CPU Requests
The portion of the allocatable CPU resource that the cluster is requesting to be allocated. Measured in number of cores (e.g.: .5 cores)
CPU Limits
The portion of the allocatable CPU resource that the cluster is limited to allocating. Measured in number of cores (e.g.: .5 cores)
CPU Usage
How much of the allocatable CPU resource that is being consumed. Cannot be higher than the configured CPU limit. Measured in number of cores (e.g.: .5 cores)
Memory Requests
The portion of the allocatable memory resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 MiB)
Memory Limits
The portion of the allocatable memory resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 MiB)
Memory Usage
How much of the allocatable memory resource that is being consumed. Cannot be higher than the configured memory limit. Measured in bytes (e.g.: 64 MiB)
Disk Requests
The portion of the allocatable ephemeral storage resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 MiB)
Disk Limits
The portion of the allocatable ephemeral storage resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 MiB)
Nodes
Number of nodes in the cluster
Pods
How many of the allocatable pods that are being used. Measured in number of pods (e.g.: 5 pods)
Labels
labels added to the cluster (e.g.: region: us-west-2)
