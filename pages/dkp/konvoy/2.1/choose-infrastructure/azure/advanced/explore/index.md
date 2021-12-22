---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 25
excerpt: Learn to interact with your Kubernetes cluster
enterprise: false
---

This guide explains how to use the command line to interact with your newly-deployed Kubernetes cluster.

Before you start, make sure you have created a workload cluster, as described in [Create a New Cluster][createnewcluster].

## Explore the new Kubernetes cluster

1.  Get a kubeconfig file for the workload cluster:

    When the workload cluster is created, the cluster lifecycle services generate a kubeconfig file for the workload cluster, and writes it to a _Secret_. The kubeconfig file is scoped to the cluster administrator.

    Get the kubeconfig from the _Secret_, and write it to a file, using this command:

    ```sh
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes using the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    The output appears similar to:

    ```sh
    NAME                                   STATUS   ROLES                  AGE     VERSION
    my-azure-cluster-control-plane-t6pzx   Ready    control-plane,master   8m17s   v1.21.6
    my-azure-cluster-md-0-hvg4b            Ready    <none>                 6m17s   v1.21.6
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Node's Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

1.  List the Pods using this command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    The output appears similar to:

    ```sh
    NAMESPACE                           NAME                                                                 READY   STATUS    RESTARTS   AGE
    calico-system                       calico-kube-controllers-f95867bfb-4vxzz                              1/1     Running   0          124m
    calico-system                       calico-node-xjqkq                                                    1/1     Running   0          124m
    calico-system                       calico-node-z2h7c                                                    1/1     Running   0          120m
    calico-system                       calico-typha-74b6bbd989-5d8lb                                        1/1     Running   0          124m
    calico-system                       calico-typha-74b6bbd989-zxd94                                        1/1     Running   0          120m
    capa-system                         capa-controller-manager-7cbc764d6b-5fcb8                             2/2     Running   0          12m
    capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager-6cf88b5459-cr46w           2/2     Running   0          12m
    capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager-86f749cf89-dj6vp       2/2     Running   0          12m
    capi-system                         capi-controller-manager-7c9ff4ddc7-wdz8s                             2/2     Running   0          12m
    capi-webhook-system                 capa-controller-manager-5848b6b65b-plfbv                             2/2     Running   0          12m
    capi-webhook-system                 capi-controller-manager-54bf59bd8d-9jv5s                             2/2     Running   0          12m
    capi-webhook-system                 capi-kubeadm-bootstrap-controller-manager-65c99884-7lcrc             2/2     Running   0          12m
    capi-webhook-system                 capi-kubeadm-control-plane-controller-manager-5869f67c96-qkhcn       2/2     Running   0          12m
    capi-webhook-system                 capz-controller-manager-55557b6cdf-29kjf                             2/2     Running   0          12m
    capz-system                         capz-controller-manager-5b98d9756d-vlgxz                             2/2     Running   0          11m
    capz-system                         capz-nmi-tbpmr                                                       1/1     Running   0          11m
    cert-manager                        cert-manager-86cb5dcfdd-f8zb5                                        1/1     Running   0          13m
    cert-manager                        cert-manager-cainjector-84cf775b89-cdwfk                             1/1     Running   0          13m
    cert-manager                        cert-manager-webhook-5d5dc765f6-29qqq                                1/1     Running   0          13m
    kube-system                         coredns-74ff55c5b-9xdnd                                              1/1     Running   0          127m
    kube-system                         coredns-74ff55c5b-xfkww                                              1/1     Running   0          127m
    kube-system                         ebs-csi-controller-9c4b68678-2tmpx                                   4/4     Running   0          125m
    kube-system                         ebs-csi-controller-9c4b68678-lgvnm                                   4/4     Running   0          125m
    kube-system                         ebs-csi-node-7phdg                                                   3/3     Running   0          125m
    kube-system                         ebs-csi-node-d9m6p                                                   3/3     Running   0          120m
    kube-system                         etcd-ip-10-0-126-209.us-west-2.compute.internal                      1/1     Running   0          127m
    kube-system                         kube-apiserver-ip-10-0-126-209.us-west-2.compute.internal            1/1     Running   0          127m
    kube-system                         kube-controller-manager-ip-10-0-126-209.us-west-2.compute.internal   1/1     Running   0          127m
    kube-system                         kube-proxy-744s5                                                     1/1     Running   0          127m
    kube-system                         kube-proxy-hsmmr                                                     1/1     Running   0          120m
    kube-system                         kube-scheduler-ip-10-0-126-209.us-west-2.compute.internal            1/1     Running   0          127m
    tigera-operator                     tigera-operator-675ccbb69c-2cwpn                                     1/1     Running   0          125m
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[createnewcluster]: ../new
