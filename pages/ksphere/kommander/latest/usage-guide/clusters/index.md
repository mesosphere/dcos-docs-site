---
layout: layout.pug
navigationTitle: Clusters Overview
title: Clusters Overview
excerpt:
menuWeight: 10
---
## Clusters

list of all available clusters

### Overview

#### Cluster dropdown menu

- View details - navigates to the cluster’s detail page

- Download Kubeconfig - downloads a YAML file of the cluster’s configuration

- Add-ons - service add-ons available to the cluster

- Edit - Navigates to the edit form. Currently, the edit form can only add, update, or remove labels.
  Only available on “Managed” and “Imported” clusters.
  Changing a cluster’s labels may add or remove the cluster from Projects. If a cluster is removed from a project any resources deployed to the cluster from that Project will be removed. If a cluster is added to a project any existing project resources will be deployed to the cluster.

- Disconnect - Disconnects the cluster from the Management cluster.
  The cluster will be unjoined from `kubefed` and resources deployed to the cluster from Kommander will be removed.

- Delete - Deletes the cluster
  only available on “Managed” clusters
  The cluster will be de-provisioned from your cloud provider
  The Cloud Provider used to create the cluster must still be available and active to delete the cluster.

### List view columns 

- Name - cluster name

- Type - see [Cluster types](https://github.com/mesosphere/kommander/blob/master/docs/site/glossary/cluster-types.md)

- Provider - see Administration > Cloud Providers

- Version - The version of kubernetes the cluster was created with

- Status - see [Cluster types](https://github.com/mesosphere/kommander/blob/master/docs/site/glossary/cluster-statuses.md)

- CPU Requests - The portion of the allocatable CPU resource that the cluster is requesting to be allocated. Measured in number of cores (e.g.: .5 cores)

- CPU Limits - The portion of the allocatable CPU resource that the cluster is limited to allocating. Measured in number of cores (e.g.: .5 cores)

- CPU Usage - How much of the allocatable CPU resource that is being consumed. Cannot be higher than the configured CPU limit. Measured in number of cores (e.g.: .5 cores)

- Memory Requests - The portion of the allocatable memory resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 MiB)

- Memory Limits - The portion of the allocatable memory resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 MiB)

- Memory Usage - How much of the allocatable memory resource that is being consumed. Cannot be higher than the configured memory limit. Measured in bytes (e.g.: 64 MiB)

- Disk Requests - The portion of the allocatable ephemeral storage resource that the cluster is requesting to be allocated. Measured in bytes (e.g.: 64 MiB)

- Disk Limits - The portion of the allocatable ephemeral storage resource that the cluster is limited to allocating. Measured in bytes (e.g.: 64 MiB)

- Nodes - Number of nodes in the cluster

- Pods - How many of the allocatable pods that are being used. Measured in number of pods (e.g.: 5 pods)

- Labels - labels added to the cluster (e.g.: region: us-west-2)

- Cards view - At the time of this writing, the cards view contains all of the same cluster data as the list view. The primary difference between the list view and the cards view is that the cards view cannot be sorted.

### + Add Cluster

#### Create Konvoy Cluster

- Kubernetes Version - The version of Kubernetes the cluster will be running on
  Also determines which version of Konvoy is used to deploy the cluster

- Cloud Provider
  When a valid cloud provider is selected:

  - The regions are fetched and the “Region” field is populated if there is no error during fetch
  - The “Availability Zones” field is populated
  - Default Node Pools are populated

- Regions - The regions available based on your cloud provider
  When your region is selected, we fetch its availability zones

- Availability Zones - Subsets of the selected region

- Name - The display name of the cluster

- Configure Node Pools - There can be no more than 10 worker node pools

  - Name - “control-plane”: designates the node pool as a control plane
    If the Node Pool is a control plane, it must have an odd number of nodes
    “bastion”: designates the node pool as a bastion
  - Any other valid name creates a worker node pool
  - Machine type - Dependent on user’s cloud provider
  - Number of nodes - Number of nodes in the node pool
    Must be at least 1
    Maximum number?
  - Taints - [Kubernetes docs](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)
  - Labels - Used as selectors for the workloads

- Labels - Used as selectors for Projects (kubefed)
  Default labels:
- region: based on what was selected for “Region” above
- provider: based on what was selected for “Cloud Provider” above
  Validation:
  - Alphanumeric
  - Can contain “-”, “_”, and “.”, but cannot start or end with “-”, “_”, or “.”
  - Cannot be blank

#### Create Konvoy Cluster via yaml

Same functionality as “Create Konvoy Cluster” form, but in a format for more advanced users to have full control over the cluster config

#### Connect cluster

Uses a configuration to connect a cluster to the Management cluster

- Kubeconfig File - The configuration that allows a cluster to be connected to the Management cluster. Allows Kommander to create artifacts (e.g.: namespace) and allocate resources

- Context - Pick one context from the kubeconfig

- Name - The display name of the cluster

- Labels - Used as selectors for Projects (kubefed)
  Default labels:
  - region: based on what was selected for “Region” above
  - provider: based on what was selected for “Cloud Provider” above
    Validation:
  - Alphanumeric
  - Can contain “-”, “_”, and “.”, but cannot start or end with “-”, “_”, or “.”
  - Cannot be blank
