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

-   Ensure the `dkp` binary can be found in your $PATH.

-   Complete the steps in [Create a CAPI VM template][create-capi-image]

## Bootstrap Cluster Lifecycle Services

1.  If an HTTP proxy is required for the bootstrap cluster, set the local `http_proxy`, `https_proxy`, and `no_proxy` environment variables. They are copied into the bootstrap cluster.

1.  Create a bootstrap cluster:

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    The output resembles this example:

    ```
    INFO[2022-03-30T15:52:42-07:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:151"
    INFO[2022-03-30T15:53:35-07:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:112"
    INFO[2022-03-30T15:54:22-07:00] Created bootstrap controllers                 src="bootstrap/controllers.go:125"
    INFO[2022-03-30T15:54:22-07:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:129"
    INFO[2022-03-30T15:54:22-07:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:38"
    INFO[2022-03-30T15:54:22-07:00] Created/Updated Tigera operator               src="bootstrap/clusterresourceset.go:43"
    INFO[2022-03-30T15:54:22-07:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:96"
    INFO[2022-03-30T15:54:22-07:00] Created/Updated AWS EBS CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:101"
    INFO[2022-03-30T15:54:22-07:00] Initializing Azure Disk CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:103"
    INFO[2022-03-30T15:54:22-07:00] Created Azure Disk CustomResourceSet          src="bootstrap/clusterresourceset.go:108"
    INFO[2022-03-30T15:54:22-07:00] Initializing Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:110"
    INFO[2022-03-30T15:54:22-07:00] Created/Updated Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:115"
    INFO[2022-03-30T15:54:22-07:00] Initializing VSphere CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:117"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated VSphere CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:122"
    INFO[2022-03-30T15:54:23-07:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:196"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:201"
    INFO[2022-03-30T15:54:23-07:00] Initializing Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:254"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:259"
    INFO[2022-03-30T15:54:23-07:00] Initializing NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:312"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:317"
    INFO[2022-03-30T15:54:23-07:00] Initializing VSphere CPI CustomResourceSet    src="bootstrap/clusterresourceset.go:370"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated VSphere CPI CustomResourceSet  src="bootstrap/clusterresourceset.go:375"
    ```

    Konvoy creates a bootstrap cluster using [KIND][kind] as a library. Konvoy then deploys the following [Cluster API][capi_book] providers on the cluster:

    - [Core Provider][capi]
    - [vSphere Infrastructure Provider][capv]
    - [Kubeadm Bootstrap Provider][cabpk]
    - [Kubeadm ControlPlane Provider][kcp]

1.  Ensure that the CAPV controllers are present with the command:

    ```bash
     kubectl get pods -n capv-system
    ```

    The output resembles the following:

    ```sh
    NAME                                      READY   STATUS    RESTARTS   AGE
    capv-controller-manager-785c5978f-nnfns   1/1     Running   0          13h
    ```

1.  Konvoy waits until the controller-manager and webhook deployments of these providers are ready. List these deployments using this command:

    ```bash
    kubectl get --all-namespaces deployments -l=clusterctl.cluster.x-k8s.io
    ```

    ```sh
    NAMESPACE                           NAME                                            READY   UP-TO-DATE   AVAILABLE   AGE
    capa-system                         capa-controller-manager                         1/1     1            1           22m
    capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager       1/1     1            1           22m
    capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager   1/1     1            1           22m
    capi-system                         capi-controller-manager                         1/1     1            1           22m
    cappp-system                        cappp-controller-manager                        1/1     1            1           22m
    capv-system                         capv-controller-manager                         1/1     1            1           22m
    capz-system                         capz-controller-manager                         1/1     1            1           22m
    cert-manager                        cert-manager                                    1/1     1            1           22m
    cert-manager                        cert-manager-cainjector                         1/1     1            1           22m
    cert-manager                        cert-manager-webhook                            1/1     1            1           22m
    ```

    Konvoy then creates additional resources for Cluster API to apply to every new cluster. The resources, called `ClusterResourceSets`, contain complete YAML manifests to deploy essential cluster applications, such as the [Calico][calico] Container Networking Interface (CNI) implementation, and Container Storage Interface (CSI) implementations for various infrastructure APIs. You can list ClusterResourceSets using this command:

    ```bash
    kubectl get clusterresourceset
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

[calico]: https://projectcalico.docs.tigera.io/about/about-calico
[cabpk]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/bootstrap/kubeadm
[capi]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/
[capi_book]: https://cluster-api.sigs.k8s.io/
[capv]: https://github.com/kubernetes-sigs/cluster-api-provider-vsphere
[clusterresourceset_cape]: https://github.com/kubernetes-sigs/cluster-api/blob/master/docs/proposals/20200220-cluster-resource-set.md
[create-capi-image]: ../create-capi-vm-image/
[create-cluster]: ../new/
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[kcp]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/controlplane/kubeadm
[kind]: https://github.com/kubernetes-sigs/kind
[create-capi-image]: ../create-capi-vm-image/
[create-cluster]: ../new/
