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
- Ensure the `dkp` binary can be found in your `$PATH`.

## Bootstrap Cluster Lifecycle Services

1.  If an HTTP proxy is required for the bootstrap cluster, set the local `http_proxy`, `https_proxy`, and `no_proxy` environment variables. They are copied into the bootstrap cluster.

1.  Create a bootstrap cluster:

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
	 ✓ Creating a bootstrap cluster
	 ✓ Initializing new CAPI components
    ```

    Konvoy creates a bootstrap cluster using [KIND][kind] as a library. Konvoy then deploys the following [Cluster API][capi_book] providers on the cluster:

    - [Core Provider][capi]
    - [AWS Infrastructure Provider][capa]
    - [Kubeadm Bootstrap Provider][cabpk]
    - [Kubeadm ControlPlane Provider][kcp]

    Konvoy waits until the controller-manager and webhook deployments of these providers are ready. List these deployments using this command:

    ```bash
    kubectl get --all-namespaces deployments -l=clusterctl.cluster.x-k8s.io
    ```

    ```sh
	NAMESPACE                           NAME                                            READY   UP-TO-DATE   AVAILABLE   AGE
	capa-system                         capa-controller-manager                         1/1     1            1           3m17s
	capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager       1/1     1            1           3m18s
	capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager   1/1     1            1           3m18s
	capi-system                         capi-controller-manager                         1/1     1            1           3m18s
	cappp-system                        cappp-controller-manager                        1/1     1            1           3m14s
	capv-system                         capv-controller-manager                         1/1     1            1           3m14s
	capz-system                         capz-controller-manager                         1/1     1            1           3m15s
	cert-manager                        cert-manager                                    1/1     1            1           3m29s
	cert-manager                        cert-manager-cainjector                         1/1     1            1           3m29s
	cert-manager                        cert-manager-webhook                            1/1     1            1           3m29s
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
[kind]: https://github.com/kubernetes-sigs/kind
[capi_book]: https://cluster-api.sigs.k8s.io/
[calico]: https://docs.projectcalico.org/
[capi]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/
[kcp]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/controlplane/kubeadm
[cabpk]: https://github.com/kubernetes-sigs/cluster-api/tree/v0.3.20/bootstrap/kubeadm
[clusterresourceset_caep]: https://github.com/kubernetes-sigs/cluster-api/blob/master/docs/proposals/20200220-cluster-resource-set.md
[prerequisites]: ../prerequisites
