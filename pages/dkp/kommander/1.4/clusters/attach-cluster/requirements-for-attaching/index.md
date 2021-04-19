---
layout: layout.pug
navigationTitle: Requirements for Attaching an Existing Cluster to Kommander
title: Requirements for Attaching an Existing Cluster to Kommander
menuWeight: 3
excerpt: Requirements for attaching an existing cluster to Kommander
beta: true
---

## Basic requirements

You can attach existing clusters to Kommander whether or not those clusters have networking restrictions.

For attaching existing clusters without networking restrictions, the requirements depend on the Kommander 1.X version that you plan to use. The supported Kubernetes versions are between version 1.16.x and 1.20.x with a maximum version of 1.20.5. To attach an existing cluster, the Kommander management cluster must be able to reach the services and the api-server of the target cluster.

For attaching clusters _with_ networking restrictions, the lowest Kubernetes version should be less than or equal to version 1.19.x. For these types of clusters, the Kommander cluster uses a tunnel to access the clusters you plan to attach. Any managed service you want to expose in the Kommander cluster requires the creation of a reverse proxy, or the use of HTTPS_PROXY environment variables that point to the Kommander tunnel proxy server.

When working with clusters that have networking restrictions, you need to run some YAML manifests on the existing cluster, so that Kommander can collect a resulting `kubeconfig` file used to establish the tunnel.

### Projects and Workspaces

Before you attach clusters, you need to create one or more Projects and Workspaces. [Projects][projects] allow you to define one or more clusters as a group to which Kommander pushes a common configuration. [Workspaces][workspaces] give you a logical way to represent your teams and specific configurations. Grouping your existing clusters in Kommander projects and workspaces makes managing their plaform services and resources easier and supports monitoring and logging.

### Platform service requirements

In addition to the basic cluster requirements, the combination of platform services that Kommander will manage on those clusters is very important. The [specific set of platform services][platform_service_requirements] you want to use makes a big difference in the requirements for the cluster nodes and their resources (CPU, memory, and storage).

The default platform services that Kommander provides include Prometheus, Kubecost, Traefik, and cert-manager.

## Attaching existing AWS and EKS clusters

Attaching an existing, Amazon-provisioned cluster requires that the cluster be fully-configured and running. The suggested default cluster confguration includes a control plane pool containing three (3) m5.xlarge nodes and a worker pool containing four (4) m5.2xlarge nodes.

Consider the additional resource requirements for running the platform services you want Kommander to manage, and ensure that your existing clusters comply.

To attach an existing EKS cluster, refer to the specific information in [Attach Amazon EKS Cluster to Kommander][attach_eks_cluster].

## Attaching existing Azure clusters

Attaching an existing, Azure-provisioned cluster requires that the cluster be fully-configured and running. The suggested default cluster configuration includes a control plane pool containing three (3) Standard_DS3_v2 nodes and a worker pool containing six (6) Standard_DS3_v2 nodes.

Consider the additional resource requirements for running the platform services you want Kommander to manage, and ensure that your existing clusters comply.

[attach_eks_cluster]: /dkp/kommander/latest/clusters/attach-cluster/attach-eks-cluster/
[projects]: /dkp/kommander/latest/projects
[workspaces]: /dkp/kommander/latest/workspaces
[platform_service_requirements]: /dkp/kommander/latest/platform-service-requirements
