---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 15
excerpt: Prepare Konvoy to deploy Kubernetes clusters
enterprise: false
---

To create Kubernetes clusters, Konvoy uses [Cluster API][capi_book] (CAPI) controllers. These controllers run on a Kubernetes cluster. To get started, you need a _bootstrap_ cluster. By default, Konvoy creates a bootstrap cluster for you in a Docker container using the Kubernetes-in-Docker ([KIND][kind]) tool.

Before you begin, complete the steps in [Prerequisites][prereqs].

You can run Konvoy CLI commands in the working directory where the `konvoy` binary and related files are by using `./konvoy`.
For example, instead of using `konvoy create bootstrap` in the below instructions, use `./konvoy` for all the CLI commands, like:

   ```sh
   ./konvoy create bootstrap
   ```

## Bootstrap Cluster Lifecycle Services

1.  Create a bootstrap cluster:

    ```sh
    konvoy create bootstrap
    ```

    ```sh
    INFO[2021-06-04T15:49:15-07:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:143"
    INFO[2021-06-04T15:50:40-07:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:88"
    INFO[2021-06-04T15:52:41-07:00] Created bootstrap controllers                 src="bootstrap/controllers.go:93"
    INFO[2021-06-04T15:52:41-07:00] Waiting for bootstrap controllers to be ready  src="bootstrap/controllers.go:96"
    INFO[2021-06-04T15:53:00-07:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:101"
    INFO[2021-06-04T15:53:00-07:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:35"
    INFO[2021-06-04T15:53:02-07:00] Created Tigera operator                       src="bootstrap/clusterresourceset.go:40"
    INFO[2021-06-04T15:53:02-07:00] Initializing Calico installation              src="bootstrap/clusterresourceset.go:42"
    INFO[2021-06-04T15:53:06-07:00] Created Calico Installation                   src="bootstrap/clusterresourceset.go:47"
    INFO[2021-06-04T15:53:06-07:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:107"
    INFO[2021-06-04T15:53:08-07:00] Created AWS EBS CSI CustomResourceSet         src="bootstrap/clusterresourceset.go:112"
    INFO[2021-06-04T15:53:08-07:00] Initializing Azure Disk CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:114"
    INFO[2021-06-04T15:53:09-07:00] Created Azure Disk CustomResourceSet          src="bootstrap/clusterresourceset.go:119"
    INFO[2021-06-04T15:53:09-07:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:180"
    INFO[2021-06-04T15:53:09-07:00] Created Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:185"
    ```

    Konvoy creates a bootstrap cluster using [KIND][kind] as a library. Konvoy then deploys the following [Cluster API][capi_book] providers on the cluster:

    - [Core Provider][capi]
    - [AWS Infrastructure Provider][capa]
    - [Azure Infrastructure Provider][capz]
    - [Kubeadm Bootstrap Provider][cabpk]
    - [Kubeadm ControlPlane Provider][kcp]

    Konvoy waits until the controller-manager and webhook deployments of these providers are ready. List these deployments using this command:

    ```sh
    kubectl get --all-namespaces deployments -l=clusterctl.cluster.x-k8s.io
    ```

    ```sh
    NAMESPACE                           NAME                                            READY   UP-TO-DATE   AVAILABLE   AGE
    capa-system                         capa-controller-manager                         1/1     1            1           87s
    capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager       1/1     1            1           118s
    capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager   1/1     1            1           105s
    capi-system                         capi-controller-manager                         1/1     1            1           2m6s
    capi-webhook-system                 capa-controller-manager                         1/1     1            1           94s
    capi-webhook-system                 capi-controller-manager                         1/1     1            1           2m9s
    capi-webhook-system                 capi-kubeadm-bootstrap-controller-manager       1/1     1            1           2m4s
    capi-webhook-system                 capi-kubeadm-control-plane-controller-manager   1/1     1            1           111s
    capi-webhook-system                 capz-controller-manager                         1/1     1            1           78s
    capz-system                         capz-controller-manager                         1/1     1            1           69s
    ```

    Konvoy then creates additional resources for Cluster API to apply to every new cluster. The resources, called `ClusterResourceSets`, contain complete YAML manifests to deploy essential cluster applications, such as the [Calico][calico] Container Networking Interface (CNI) implementation, and Container Storage Interface (CSI) implementations for various infrastructure APIs. List ClusterResourceSets using this command:

    ```sh
    kubectl get clusterresourceset
    ```

    ```sh
    NAME                        AGE
    aws-ebs-csi                 3m49s
    azure-disk-csi              3m49s
    calico-installation-aws     3m49s
    calico-installation-azure   3m49s
    cluster-autoscaler          3m49s
    tigera-operator             3m49s
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

    Konvoy defines the selectors, and sets the correct labels on the Cluster objects. For a more detailed explanation of how ClusterResourceSets work, see the [Extension Proposal][clusterresourceset_caep].

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/tree/v0.6.6/
[kind]: https://github.com/kubernetes-sigs/kind
[capi_book]: https://cluster-api.sigs.k8s.io/
[calico]: https://docs.projectcalico.org/
[capi]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/
[capz]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/tree/v0.4.14/
[kcp]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/controlplane/kubeadm
[cabpk]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/bootstrap/kubeadm
[clusterresourceset_caep]: https://github.com/kubernetes-sigs/cluster-api/blob/master/docs/proposals/20200220-cluster-resource-set.md
[prereqs]: ../prerequisites
