---
layout: layout.pug
navigationTitle: Attach an Existing Kubernetes Cluster
title: Attach an Existing Kubernetes Cluster
menuWeight: 7
excerpt: A guide for attaching an existing Kubernetes cluster using kubeconfig
beta: false
---

## Using Kommander with an existing Kubernetes cluster

You can attach an existing Kubernetes cluster directly to Kommander. During the attachment process, certain namespaces are created on the cluster, and workspace platform services are deployed automatically into the newly-created namespaces. Review the [workspace platform service resource requirements][platform_service_req] to ensure the attached cluster has sufficient resources before you begin. For more information on platform services and customizing them, see [workspace platform services][workspace_platform_services].

If the cluster you want to attach was created using Amazon EKS, Azure AKS, or Google GKE, you will need to create a service account as part of generating a kubeconfig file. If you are attaching an Amazon EKS cluster to Kommander, [use these detailed instructions][attach_eks_cluster].

### Before you begin

You must have a [kubeconfig file][generate_kubeconfig_file] to attach a cluster. The kubeconfig file contains a YAML manifest that provides the required context and authentication tokens to allow Kommander to manage an existing cluster.

If you already have a kubeconfig file, skip this procedure and go to the next section, **Attaching a Cluster**.

If you do not want to add the cluster to the Default Workspace, [create a new Workspace][create-workspaces] before proceeding.

### Attaching a Cluster

Using the **Add Cluster** option, you can attach an existing Kubernetes or Konvoy cluster directly to Kommander. Attaching a cluster allows you to access the multi-cluster management and monitoring benefits that Kommander provides, while keeping your existing cluster on its current provider and infrastructure.

You have these security options when attaching a cluster:

- Attach a cluster with [no additional networking restrictions][no-network-restrictions]
- Attach a cluster that [has networking restrictions][with-network-restrictions]

[attach_eks_cluster]: /dkp/kommander/1.4/clusters/attach-cluster/attach-eks-cluster/
[clusteradmin]: https://kubernetes.io/docs/concepts/cluster-administration/cluster-administration-overview/
[create-workspaces]: /dkp/kommander/1.4/workspaces/create-workspaces/
[generate_kubeconfig_file]: /dkp/kommander/1.4/clusters/attach-cluster/generate-kubeconfig/
[kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[no-network-restrictions]: cluster-no-network-restrictions/
[platform_service_req]: /dkp/kommander/1.4/workspaces/platform-service-requirements/
[with-network-restrictions]: cluster-with-network-restrictions/
[workspace_platform_services]: /dkp/kommander/1.4/workspaces/workspace-platform-services/
