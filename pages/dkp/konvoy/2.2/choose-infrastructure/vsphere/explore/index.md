---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 75
excerpt: Learn to interact with your Kubernetes cluster
enterprise: false
---

This guide explains how to use the command line interface to interact with your newly-deployed Kubernetes cluster.

Before you start, make sure you have [created a workload cluster][create-new-cluster] and if needed, that you have [made the cluster self-managing][make-self-managed].

## Explore the new Kubernetes cluster

1.  Get a kubeconfig file for the workload cluster:

    When the workload cluster is created, the cluster lifecycle services generate a kubeconfig file for the workload cluster, and write it to a _Secret_. The kubeconfig file is scoped to the cluster Administrator.

    Get the kubeconfig from the _Secret_, and write it to a file using this command:

    ```bash
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Node's Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

    The output resembles the following example:

    ```sh
        The output resembles this example:

    NAME                                       STATUS   ROLES                  AGE   VERSION
    d2iq-e2e-cluster-1-control-plane-7llgd     Ready    control-plane,master   20h   v1.22.8
    d2iq-e2e-cluster-1-control-plane-vncbl     Ready    control-plane,master   19h   v1.22.8
    d2iq-e2e-cluster-1-control-plane-wbgrm     Ready    control-plane,master   19h   v1.22.8
    d2iq-e2e-cluster-1-md-0-74c849dc8c-67rv4   Ready    <none>                 19h   v1.22.8
    d2iq-e2e-cluster-1-md-0-74c849dc8c-n2skc   Ready    <none>                 19h   v1.22.8
    d2iq-e2e-cluster-1-md-0-74c849dc8c-nkftv   Ready    <none>                 19h   v1.22.8
    d2iq-e2e-cluster-1-md-0-74c849dc8c-sqklv   Ready    <none>                 19h   v1.22.8
    ```

1.  List the Pods using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    The output resembles the following example:

    ```sh
    NAMESPACE                NAME                                                                 READY   STATUS     RESTARTS      AGE
    calico-system            calico-kube-controllers-57fbd7bd59-qqd96                             1/1     Running    0             20h
    calico-system            calico-node-2m524                                                    1/1     Running    3 (19h ago)   19h
    calico-system            calico-node-bbhg5                                                    1/1     Running    0             20h
    calico-system            calico-node-cc5lf                                                    1/1     Running    2 (19h ago)   19h
    calico-system            calico-node-cwg7x                                                    1/1     Running    1 (19h ago)   19h
    calico-system            calico-node-d59hn                                                    1/1     Running    1 (19h ago)   19h
    calico-system            calico-node-qmmcz                                                    1/1     Running    0             19h
    calico-system            calico-node-wdqhx                                                    1/1     Running    0             19h
    calico-system            calico-typha-655489d8cc-b5jnt                                        1/1     Running    0             20h
    calico-system            calico-typha-655489d8cc-q92x9                                        1/1     Running    0             19h
    calico-system            calico-typha-655489d8cc-vjlkx                                        1/1     Running    0             19h
    kube-system              cluster-autoscaler-68c759fbf6-7d2ck                                  0/1     Init:0/1   0             20h
    kube-system              coredns-78fcd69978-qn4qt                                             1/1     Running    0             20h
    kube-system              coredns-78fcd69978-wqpmg                                             1/1     Running    0             20h
    kube-system              etcd-d2iq-e2e-cluster-1-control-plane-7llgd                      1/1     Running    0             20h
    kube-system              etcd-d2iq-e2e-cluster-1-control-plane-vncbl                      1/1     Running    0             19h
    kube-system              etcd-d2iq-e2e-cluster-1-control-plane-wbgrm                      1/1     Running    0             19h
    kube-system              kube-apiserver-d2iq-e2e-cluster-1-control-plane-7llgd            1/1     Running    0             20h
    kube-system              kube-apiserver-d2iq-e2e-cluster-1-control-plane-vncbl            1/1     Running    0             19h
    kube-system              kube-apiserver-d2iq-e2e-cluster-1-control-plane-wbgrm            1/1     Running    0             19h
    kube-system              kube-controller-manager-d2iq-e2e-cluster-1-control-plane-7llgd   1/1     Running    1 (19h ago)   20h
    kube-system              kube-controller-manager-d2iq-e2e-cluster-1-control-plane-vncbl   1/1     Running    0             19h
    kube-system              kube-controller-manager-d2iq-e2e-cluster-1-control-plane-wbgrm   1/1     Running    0             19h
    kube-system              kube-proxy-cpscs                                                     1/1     Running    0             19h
    kube-system              kube-proxy-hhmxq                                                     1/1     Running    0             19h
    kube-system              kube-proxy-hxhnk                                                     1/1     Running    0             19h
    kube-system              kube-proxy-nsrbp                                                     1/1     Running    0             19h
    kube-system              kube-proxy-scxfg                                                     1/1     Running    0             20h
    kube-system              kube-proxy-tth4k                                                     1/1     Running    0             19h
    kube-system              kube-proxy-x2xfx                                                     1/1     Running    0             19h
    kube-system              kube-scheduler-d2iq-e2e-cluster-1-control-plane-7llgd            1/1     Running    1 (19h ago)   20h
    kube-system              kube-scheduler-d2iq-e2e-cluster-1-control-plane-vncbl            1/1     Running    0             19h
    kube-system              kube-scheduler-d2iq-e2e-cluster-1-control-plane-wbgrm            1/1     Running    0             19h
    kube-system              kube-vip-d2iq-e2e-cluster-1-control-plane-7llgd                  1/1     Running    1 (19h ago)   20h
    kube-system              kube-vip-d2iq-e2e-cluster-1-control-plane-vncbl                  1/1     Running    0             19h
    kube-system              kube-vip-d2iq-e2e-cluster-1-control-plane-wbgrm                  1/1     Running    0             19h
    kube-system              vsphere-cloud-controller-manager-4zj7q                               1/1     Running    0             19h
    kube-system              vsphere-cloud-controller-manager-87tgm                               1/1     Running    0             19h
    kube-system              vsphere-cloud-controller-manager-xqmn4                               1/1     Running    1 (19h ago)   20h
    node-feature-discovery   node-feature-discovery-master-84c67dcbb6-txfw9                       1/1     Running    0             20h
    node-feature-discovery   node-feature-discovery-worker-8tg2l                                  1/1     Running    3 (19h ago)   19h
    node-feature-discovery   node-feature-discovery-worker-c5f6q                                  1/1     Running    0             19h
    node-feature-discovery   node-feature-discovery-worker-fjfkm                                  1/1     Running    0             19h
    node-feature-discovery   node-feature-discovery-worker-x6tz8                                  1/1     Running    0             19h
    tigera-operator          tigera-operator-d499f5c8f-r2srj                                      1/1     Running    1 (19h ago)   20h
    vmware-system-csi        vsphere-csi-controller-7ffd6884cc-d7rql                              7/7     Running    5 (19h ago)   20h
    vmware-system-csi        vsphere-csi-controller-7ffd6884cc-k82cm                              7/7     Running    2 (19h ago)   20h
    vmware-system-csi        vsphere-csi-controller-7ffd6884cc-qttkp                              7/7     Running    1 (19h ago)   20h
    vmware-system-csi        vsphere-csi-node-678hw                                               3/3     Running    0             19h
    vmware-system-csi        vsphere-csi-node-6tbsh                                               3/3     Running    0             19h
    vmware-system-csi        vsphere-csi-node-9htwr                                               3/3     Running    5 (20h ago)   20h
    vmware-system-csi        vsphere-csi-node-g8r6l                                               3/3     Running    0             19h
    vmware-system-csi        vsphere-csi-node-ghmr6                                               3/3     Running    0             19h
    vmware-system-csi        vsphere-csi-node-jhvgm                                               3/3     Running    0             19h
    vmware-system-csi        vsphere-csi-node-rp77r                                               3/3     Running    0             19h
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[create-new-cluster]: ../new
[make-self-managed]: ../self-managed/
