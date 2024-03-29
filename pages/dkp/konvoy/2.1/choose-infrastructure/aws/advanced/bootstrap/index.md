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

<p class="message--note"><strong>WARNING: </strong>If you are running in an AWS environment with non-standard AWS Service Endpoints, C2S, SC2S for example, you must use flag <code>--aws-service-endpoints</code>. In this case, run <code>dkp create bootstrap</code> with the following parameters:
<code>dkp create bootstrap --aws-service-endpoints=${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...</code>
ServiceIDs would be: <code>ec2</code> , <code>elasticloadbalancing</code>, <code>autoscaling</code>, <code>secretsmanager</code>, <code>sts</code>.</p>

## Bootstrap Cluster Lifecycle Services

Follow these steps to create a bootstrap cluster:

1.  If an HTTP proxy is required for the bootstrap cluster, set the local `http_proxy`, `https_proxy`, and `no_proxy` environment variables. They are copied into the bootstrap cluster.

1.  Create a bootstrap cluster:

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
    INFO[2021-11-23T15:54:07-08:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:148"
    INFO[2021-11-23T15:55:01-08:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:94"
    INFO[2021-11-23T15:56:05-08:00] Created bootstrap controllers                 src="bootstrap/controllers.go:106"
    INFO[2021-11-23T15:56:05-08:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:110"
    INFO[2021-11-23T15:56:05-08:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:37"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Tigera operator               src="bootstrap/clusterresourceset.go:42"
    INFO[2021-11-23T15:56:05-08:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:95"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated AWS EBS CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:100"
    INFO[2021-11-23T15:56:05-08:00] Initializing Azure Disk CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:102"
    INFO[2021-11-23T15:56:05-08:00] Created Azure Disk CustomResourceSet          src="bootstrap/clusterresourceset.go:107"
    INFO[2021-11-23T15:56:05-08:00] Initializing Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:109"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:114"
    INFO[2021-11-23T15:56:05-08:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:181"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:186"
    INFO[2021-11-23T15:56:05-08:00] Initializing Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:239"
    INFO[2021-11-23T15:56:05-08:00] Created/Updated Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:244"
    INFO[2021-11-23T15:56:06-08:00] Initializing NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:297"
    INFO[2021-11-23T15:56:06-08:00] Created/Updated NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:302"
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
    capa-system                         capa-controller-manager                         1/1     1            1           5m24s
    capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager       1/1     1            1           5m28s
    capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager   1/1     1            1           5m26s
    capi-system                         capi-controller-manager                         1/1     1            1           5m29s
    cappp-system                        cappp-controller-manager                        1/1     1            1           5m20s
    capz-system                         capz-controller-manager                         1/1     1            1           5m21s
    cert-manager                        cert-manager                                    1/1     1            1           5m52s
    cert-manager                        cert-manager-cainjector                         1/1     1            1           5m52s
    cert-manager                        cert-manager-webhook                            1/1     1            1           5m52s
    ```

    Konvoy then creates additional resources for Cluster API to apply to every new cluster. The resources, called `ClusterResourceSets`, contain complete YAML manifests to deploy essential cluster applications, such as the [Calico][calico] Container Networking Interface (CNI) implementation, and Container Storage Interface (CSI) implementations for various infrastructure APIs. List ClusterResourceSets using this command:

    ```bash
    kubectl get clusterresourceset
    ```

    ```sh
    NAME                       AGE
    aws-ebs-csi                5m38s
    azure-disk-csi             5m38s
    cluster-autoscaler         5m38s
    local-volume-provisioner   5m38s
    node-feature-discovery     5m38s
    nvidia-feature-discovery   5m37s
    tigera-operator            5m38s
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

## Using a Custom AWS CA

You need to add the custom CAs into two places:

- The `capa-controller-manager` pod, because CAPA controllers interact with AWS API when creating and deleting infrastructure.
- The trusted root CAs in the AWS AMI used as Kubernetes nodes. The first step of the node bootstrap process is to fetch the sensitive information from the AWS Secrets Manager service, so the `aws` client on the instances needs to trust this custom CA. This process is unique to your environment but a general flow can be similar to what is documented in [adding trusted root certificates to the server](https://manuals.gfi.com/en/kerio/connect/content/server-configuration/ssl-certificates/adding-trusted-root-certificates-to-the-server-1605.html).

1.  Place the AWS CA file as `ca.pem` in your working directory

1.  Create a ConfigMap with the contents of the file

    ```bash
    kubectl create configmap -n capa-system aws-ca --from-file=ca.pem
    ```

1.  Update the capa-controller-manager to set an environment variable `AWS_CA_BUNDLE` in `capa-controller-manager`:

    ```bash
    kubectl patch deployment -n capa-system capa-controller-manager --patch '{"spec":{"template":{"spec":{"$setElementOrder/containers":[{"name":"manager"},{"name":"kube-rbac-proxy"}],"$setElementOrder/volumes":[{"name":"cert"},{"name":"credentials"},{"name":"aws-ca"}],"containers":[{"$setElementOrder/env":[{"name":"AWS_SHARED_CREDENTIALS_FILE"},{"name":"AWS_CA_BUNDLE"}],"$setElementOrder/volumeMounts":[{"mountPath":"/tmp/k8s-webhook-server/serving-certs"},{"mountPath":"/home/.aws"},{"mountPath":"/home/.konvoy/aws-ca.pem"}],"env":[{"name":"AWS_CA_BUNDLE","value":"/home/.konvoy/aws-ca.pem"}],"name":"manager","volumeMounts":[{"mountPath":"/home/.konvoy/aws-ca.pem","name":"aws-ca","subPath":"ca.pem"}]}],"volumes":[{"configMap":{"name":"aws-ca"},"name":"aws-ca"}]}}}}'
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
