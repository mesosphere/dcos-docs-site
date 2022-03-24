---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 50
excerpt: Prepare to deploy Kubernetes clusters
enterprise: false
---

To create Kubernetes clusters, Konvoy uses [Cluster API][capi_book] (CAPI) controllers which run on a Kubernetes cluster. To get started creating your vSphere cluster, you need a _bootstrap_ cluster. By default, Konvoy creates a bootstrap cluster for you in a Docker container using the Kubernetes-in-Docker ([KIND][kind]) tool.

## Prerequisites

Before you begin, you must:

- Ensure the `dkp` binary can be found in your $PATH.

- Complete the steps in [Create a CAPI VM Image][create-capi-image]

## Bootstrap Cluster Lifecycle Services

1.  If an HTTP proxy is required for the bootstrap cluster, set the local `http_proxy`, `https_proxy`, and `no_proxy` environment variables. They are copied into the bootstrap cluster.

1.  Create a bootstrap cluster:

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
    %%% We'll need new output capture for vSphere
    ```

    Konvoy creates a bootstrap cluster using [KIND][kind] as a library. Konvoy then deploys the following [Cluster API][capi_book] providers on the cluster:

    - [Core Provider][capi]
    - [vSphere Infrastructure Provider][capv]
    - [Kubeadm Bootstrap Provider][cabpk]
    - [Kubeadm ControlPlane Provider][kcp]

    Konvoy waits until the controller-manager and webhook deployments of these providers are ready. List these deployments using this command:

    ```bash
    kubectl get --all-namespaces deployments -l=clusterctl.cluster.x-k8s.io
    ```

    ```sh
    NAMESPACE                           NAME                                            READY   UP-TO-DATE   AVAILABLE   AGE
    %%% need a new output capture for vSphere
    ```

    Konvoy then creates additional resources for Cluster API to apply to every new cluster. The resources, called `ClusterResourceSets`, contain complete YAML manifests to deploy essential cluster applications, such as the [Calico][calico] Container Networking Interface (CNI) implementation, and Container Storage Interface (CSI) implementations for various infrastructure APIs. List ClusterResourceSets using this command:

    ```bash
    kubectl get clusterresourceset
    ```

    ```sh
    NAME                       AGE
    %%% need new output capture for vSphere
    ```

When the bootstrap cluster is running, you are ready to [create a new cluster][create-cluster].

<!---A ClusterResourceSet object defines selectors that match against cluster labels, and a reference to a ConfigMap. The ConfigMap contains a YAML manifest. When a cluster with matching labels is created, the YAML manifest is applied to the cluster. The manifest is applied only once, when the cluster is created.

    For example, this is the `%%%-vSphere-something` ClusterResourceSet, which is now deployed by Konvoy from the above actions:

    ```yaml
    kind: ClusterResourceSet
    metadata:
      name: aws-ebs-csi
    spec:
      clusterSelector:
        matchLabels:
          konvoy.d2iq.io/csi: aws-ebs
          konvoy.d2iq.io/provider: aws
      resources:
      - kind: ConfigMap
        name: aws-ebs-csi
      strategy: ApplyOnce
    ```

    Konvoy defines the selectors and sets the correct labels on the Cluster objects. For a more detailed explanation of how ClusterResourceSets work, see the [Extension Proposal][clusterresourceset_cape]. --->

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[capv]: https://https://github.com/kubernetes-sigs/cluster-api-provider-vsphere
[kind]: https://github.com/kubernetes-sigs/kind
[capi_book]: https://cluster-api.sigs.k8s.io/
[capi]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/
[kcp]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/controlplane/kubeadm
[cabpk]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/bootstrap/kubeadm
[clusterresourceset_cape]: https://github.com/kubernetes-sigs/cluster-api/blob/master/docs/proposals/20200220-cluster-resource-set.md
[create-capi-image]: ../create-capi-vm-image/
[create-cluster]: ../new/
