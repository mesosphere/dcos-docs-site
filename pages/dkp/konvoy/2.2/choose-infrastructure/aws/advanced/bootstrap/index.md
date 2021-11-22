---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 15
excerpt: Prepare to deploy Kubernetes clusters
enterprise: false
---

To create Kubernetes clusters, Konvoy uses [Cluster API][capi_book] (CAPI) controllers. These controllers run on a Kubernetes cluster. To get started, you need a _bootstrap_ cluster. By default, Konvoy creates a bootstrap cluster for you in a Docker container using the Kubernetes-in-Docker ([KIND][kind]) tool.

## Prerequisites

Before you begin, you must:

- Complete the steps in [Prerequisites][prerequisites].
- Ensure the `dkp` binary can be found in your $PATH.

## Bootstrap Cluster Lifecycle Services

1.  If an HTTP proxy is required for the bootstrap cluster, set the local `http_proxy`, `https_proxy`, and `no_proxy` environment variables. They are copied into the bootstrap cluster.

1.  Create a bootstrap cluster:

    ```sh
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
    INFO[2021-08-25T13:43:50-32:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:143"
    INFO[2021-08-25T13:43:52-07:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:96"
    INFO[2021-08-25T13:44:29-07:00] Created bootstrap controllers                 src="bootstrap/controllers.go:101"
    INFO[2021-08-25T13:44:29-07:00] Waiting for bootstrap controllers to be ready  src="bootstrap/controllers.go:104"
    INFO[2021-08-25T13:44:39-07:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:109"
    INFO[2021-08-25T13:44:39-07:00] Patching ClusterRoleBinding for CAPPP         src="bootstrap/controllers.go:112"
    INFO[2021-08-25T13:44:39-07:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:37"
    INFO[2021-08-25T13:44:39-07:00] Created Tigera operator                       src="bootstrap/clusterresourceset.go:42"
    INFO[2021-08-25T13:44:40-07:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:109"
    INFO[2021-08-25T13:44:40-07:00] Created AWS EBS CSI CustomResourceSet         src="bootstrap/clusterresourceset.go:114"
    INFO[2021-08-25T13:44:40-07:00] Initializing Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:116"
    INFO[2021-08-25T13:44:40-07:00] Created Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:121"
    INFO[2021-08-25T13:44:40-07:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:181"
    INFO[2021-08-25T13:44:40-07:00] Created Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:186"
    INFO[2021-08-25T13:44:40-07:00] Initializing Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:239"
    INFO[2021-08-25T13:44:40-07:00] Created Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:244"
    INFO[2021-08-25T13:44:40-07:00] Initializing NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:297"
    INFO[2021-08-25T13:44:40-07:00] Created NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:302"
    ```

    Konvoy creates a bootstrap cluster using [KIND][kind] as a library. Konvoy then deploys the following [Cluster API][capi_book] providers on the cluster:

    - [Core Provider][capi]
    - [AWS Infrastructure Provider][capa]
    - [Kubeadm Bootstrap Provider][cabpk]
    - [Kubeadm ControlPlane Provider][kcp]

    Konvoy waits until the controller-manager and webhook deployments of these providers are ready. List these deployments using this command:

    ```sh
    kubectl get --all-namespaces deployments -l=clusterctl.cluster.x-k8s.io
    ```

    ```sh
    NAMESPACE                           NAME                                            READY   UP-TO-DATE   AVAILABLE   AGE
    capa-system                         capa-controller-manager                         1/1     1            1           2m22s
    capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager       1/1     1            1           2m26s
    capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager   1/1     1            1           2m25s
    capi-system                         capi-controller-manager                         1/1     1            1           2m26s
    cappp-system                        cappp-controller-manager                        1/1     1            1           2m21s
    cert-manager                        cert-manager                                    1/1     1            1           3m24s
    cert-manager                        cert-manager-cainjector                         1/1     1            1           3m24s
    cert-manager                        cert-manager-webhook                            1/1     1            1           3m24s
    ```

    Konvoy then creates additional resources for Cluster API to apply to every new cluster. The resources, called `ClusterResourceSets`, contain complete YAML manifests to deploy essential cluster applications, such as the [Calico][calico] Container Networking Interface (CNI) implementation, and Container Storage Interface (CSI) implementations for various infrastructure APIs. List ClusterResourceSets using this command:

    ```sh
    kubectl get clusterresourceset
    ```

    ```sh
    NAME                                            AGE
    aws-ebs-csi                                     5m41s
    calico-installation-aws                         5m41s
    calico-installation-azure                       5m41s
    calico-installation-preprovisioned              5m41s
    calico-installation-preprovisioned-flatcar      5m41s
    cluster-autoscaler                              5m41s
    local-volume-provisioner                        5m41s
    node-feature-discovery                          5m41s
    nvidia-feature-discovery                        5m41s
    tigera-operator                                 5m41s
    ```

    A ClusterResourceSet object defines selectors that match against cluster labels, and a reference to a ConfigMap. The ConfigMap contains a YAML manifest. When a cluster with matching labels is created, the YAML manifest is applied to the cluster. The manifest is applied only once, when the cluster is created.

    For example, this is the `aws-ebs-csi` ClusterResourceSet, which is now deployed by Konvoy from the above actions:

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

    Konvoy defines the selectors and sets the correct labels on the Cluster objects. For a more detailed explanation of how ClusterResourceSets work, see the [Extension Proposal][clusterresourceset_caep].

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/tree/v0.6.6/
[kind]: https://github.com/kubernetes-sigs/kind
[capi_book]: https://cluster-api.sigs.k8s.io/
[calico]: https://docs.projectcalico.org/
[capi]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/
[kcp]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/controlplane/kubeadm
[cabpk]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/bootstrap/kubeadm
[clusterresourceset_caep]: https://github.com/kubernetes-sigs/cluster-api/blob/master/docs/proposals/20200220-cluster-resource-set.md
[prerequisites]: ../prerequisites
