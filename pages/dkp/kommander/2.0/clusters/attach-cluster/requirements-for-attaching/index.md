---
layout: layout.pug
navigationTitle: Requirements for Attaching an Existing Cluster to Kommander
title: Requirements for Attaching an Existing Cluster to Kommander
menuWeight: 1
excerpt: Requirements for attaching an existing cluster to Kommander
---

## Basic requirements

To attach an existing cluster to Kommander, the Kommander management cluster must be able to reach the services and the `api-server` of the target cluster.

<!--- You can attach existing clusters with or without networking restrictions to Kommander. These networking restrictions refer to clusters that are located in a DMZ, behind a proxy server or a firewall, or that have additional requirements for access. -->

<p class="message--note"><strong>NOTE: </strong>Kommander does not support attachment of K3s clusters.</p>

For attaching existing clusters without networking restrictions, the requirements depend on which Kommander version you are using. Each version of Kommander supports a specific range of Kubernetes versions. You must ensure that the target cluster is running a compatible version.

For example, Kommander 2.0 supports Kubernetes versions between 1.19.0 and 1.21.x. Any cluster you want to attach using Kommander 2.0 must be running a Kubernetes version in that range.

<!--- For attaching clusters with networking restrictions the Kubernetes version of the cluster you want to attach must be greater than or equal to version 1.19.x. For these types of clusters, the Kommander cluster uses a tunnel to access the clusters you plan to attach. Any managed service you want to expose in the Kommander cluster requires the creation of a reverse proxy, or the use of HTTPS_PROXY environment variables that point to the Kommander tunnel proxy server.

When working with clusters that have networking restrictions, you will need to apply some YAML manifests on the existing cluster, so that Kommander can collect a resulting `kubeconfig` file used to establish the tunnel. When you use the Kommander UI, this is handled for you. If you choose to use the manual [CLI attachment process][manual_cli_attachment], you will apply those manifests as part of the procedure. -->

### Projects and Workspaces

Before you attach clusters, you need to create one or more Workspaces, and recommend that you also create Projects within your Workspaces. [Workspaces][workspaces] give you a logical way to represent your teams and specific configurations. [Projects][projects] let you define one or more clusters as a group to which Kommander pushes a common configuration. Grouping your existing clusters in Kommander projects and workspaces makes managing their platform services and resources easier and supports monitoring and logging.

<p class="message--important"><strong>IMPORTANT: </strong>The Default Workspace is currently reserved for the host management cluster.
All other clusters must be attached to a different workspace.</p>

<!--
### Platform service requirements

In addition to the basic cluster requirements, the platform services you want Kommander to manage on those clusters will have an impact on the total cluster requirements. The specific combinations of platform services will make a difference in the requirements for the cluster nodes and their resources (CPU, memory, and storage).

The default platform services that Kommander provides include Prometheus, Kubecost, Traefik, and cert-manager.
-->

## Attaching existing AWS and EKS clusters

Attaching an existing, Amazon-provisioned cluster requires that the cluster be fully configured and running. The suggested default cluster configuration includes a control plane pool containing three (3) m5.xlarge nodes and a worker pool containing four (4) m5.2xlarge nodes.
<!--
Consider the additional resource requirements for running the platform services you want Kommander to manage, and ensure that your existing clusters comply.
-->
To attach an existing EKS cluster, refer to the specific information in [Attach Amazon EKS Cluster to Kommander][attach_eks_cluster].

## Attaching existing Azure clusters

Attaching an existing Azure-provisioned cluster requires that the cluster be fully-configured and running. The suggested default cluster configuration includes a control plane pool containing three (3) Standard_DS3_v2 nodes and a worker pool containing four (4) Standard_DS3_v2 nodes.
<!--
Consider the additional resource requirements for running the platform services you want Kommander to manage, and ensure that your existing clusters comply.
-->
[attach_eks_cluster]: ../attach-eks-cluster/
[attach_with_network_restrictions]: ../cluster-with-network-restrictions
[existing-clusters]: ../generate-kubeconfig/
[projects]: ../../../projects
[workspaces]: ../../../workspaces
