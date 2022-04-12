---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 25
excerpt: Learn to interact with your Kubernetes cluster
enterprise: false
---

This guide explains how to use the command line to interact with your newly deployed Kubernetes cluster.

Before you start, make sure you have created a workload cluster, as described in [Create a New Cluster][createnewcluster].

## Explore the new Kubernetes cluster

1.  Get a kubeconfig file for the workload cluster:

    When the workload cluster is created, the cluster lifecycle services generate a kubeconfig file for the workload cluster, and write it to a _Secret_. The kubeconfig file is scoped to the cluster administrator.

    Get the kubeconfig from the _Secret_, and write it to a file, using this command:

    ```bash
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    ```sh
    NAME                                STATUS   ROLES                  AGE     VERSION
	azure-example-control-plane-7ffnl   Ready    control-plane,master   6m18s   v1.22.7
	azure-example-control-plane-l4bv8   Ready    control-plane,master   14m     v1.22.7
	azure-example-control-plane-n4g4l   Ready    control-plane,master   18m     v1.22.7
	azure-example-md-0-mpctb            Ready    <none>                 15m     v1.22.7
	azure-example-md-0-qglp9            Ready    <none>                 15m     v1.22.7
	azure-example-md-0-sgrd6            Ready    <none>                 16m     v1.22.7
	azure-example-md-0-wzbkl            Ready    <none>                 16m     v1.22.7
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Nodes' Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

1.  List the Pods using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    ```sh
	NAMESPACE                           NAME                                                             READY   STATUS    RESTARTS      AGE
	calico-system                       calico-kube-controllers-57fbd7bd59-v4tss                         1/1     Running   0             19m
	calico-system                       calico-node-59llv                                                1/1     Running   0             17m
	calico-system                       calico-node-7t7wj                                                1/1     Running   0             16m
	calico-system                       calico-node-pf8q8                                                1/1     Running   0             17m
	calico-system                       calico-node-sh2b7                                                1/1     Running   0             8m17s
	calico-system                       calico-node-tmxl5                                                1/1     Running   0             19m
	calico-system                       calico-node-vt5fh                                                1/1     Running   0             18m
	calico-system                       calico-node-whfs8                                                1/1     Running   0             18m
	calico-system                       calico-typha-797c9666d5-5w99r                                    1/1     Running   0             19m
	calico-system                       calico-typha-797c9666d5-hj6mj                                    1/1     Running   0             18m
	calico-system                       calico-typha-797c9666d5-s7rc6                                    1/1     Running   0             17m
	capa-system                         capa-controller-manager-74fffb5676-ch6xd                         1/1     Running   0             11m
	capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager-867759cc67-vg4lh       1/1     Running   0             15m
	capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager-5df55579c4-pc8x9   1/1     Running   1 (11m ago)   15m
	capi-system                         capi-controller-manager-79cc58bf5f-xsp9t                         1/1     Running   0             15m
	cappp-system                        cappp-controller-manager-85b5c77497-8ss8r                        1/1     Running   0             14m
	capv-system                         capv-controller-manager-7bf4d8b66-6x2mx                          1/1     Running   0             14m
	capz-system                         capz-controller-manager-5d4c6468bf-wfhcc                         1/1     Running   0             14m
	capz-system                         capz-nmi-2cbrg                                                   1/1     Running   0             14m
	capz-system                         capz-nmi-8dllm                                                   1/1     Running   0             14m
	capz-system                         capz-nmi-95dfk                                                   1/1     Running   0             14m
	capz-system                         capz-nmi-rtnd4                                                   1/1     Running   0             14m
	cert-manager                        cert-manager-848f547974-gjc5p                                    1/1     Running   1 (10m ago)   15m
	cert-manager                        cert-manager-cainjector-54f4cc6b5-rnh4f                          1/1     Running   0             15m
	cert-manager                        cert-manager-webhook-7c9588c76-rn2sd                             1/1     Running   0             15m
	kube-system                         cluster-autoscaler-68c759fbf6-6vg5r                              1/1     Running   1 (11m ago)   20m
	kube-system                         coredns-78fcd69978-6gx44                                         1/1     Running   0             20m
	kube-system                         coredns-78fcd69978-gr5q7                                         1/1     Running   0             20m
	kube-system                         csi-azuredisk-controller-c8fb44c8b-jhmfz                         6/6     Running   5 (11m ago)   20m
	kube-system                         csi-azuredisk-controller-c8fb44c8b-lpbbs                         6/6     Running   0             20m
	kube-system                         csi-azuredisk-node-2g7vw                                         3/3     Running   0             8m17s
	kube-system                         csi-azuredisk-node-6rdqc                                         3/3     Running   0             18m
	kube-system                         csi-azuredisk-node-99c6q                                         3/3     Running   0             17m
	kube-system                         csi-azuredisk-node-9b4ms                                         3/3     Running   0             17m
	kube-system                         csi-azuredisk-node-mz5pr                                         3/3     Running   0             18m
	kube-system                         csi-azuredisk-node-r2t99                                         3/3     Running   0             16m
	kube-system                         csi-azuredisk-node-t7gfs                                         3/3     Running   0             20m
	kube-system                         etcd-azure-example-control-plane-7ffnl                           1/1     Running   0             8m15s
	kube-system                         etcd-azure-example-control-plane-l4bv8                           1/1     Running   0             16m
	kube-system                         etcd-azure-example-control-plane-n4g4l                           1/1     Running   0             19m
	kube-system                         kube-apiserver-azure-example-control-plane-7ffnl                 1/1     Running   0             8m16s
	kube-system                         kube-apiserver-azure-example-control-plane-l4bv8                 1/1     Running   0             16m
	kube-system                         kube-apiserver-azure-example-control-plane-n4g4l                 1/1     Running   0             19m
	kube-system                         kube-controller-manager-azure-example-control-plane-7ffnl        1/1     Running   0             8m17s
	kube-system                         kube-controller-manager-azure-example-control-plane-l4bv8        1/1     Running   0             16m
	kube-system                         kube-controller-manager-azure-example-control-plane-n4g4l        1/1     Running   1 (17m ago)   19m
	kube-system                         kube-proxy-82zdl                                                 1/1     Running   0             8m17s
	kube-system                         kube-proxy-fd9f9                                                 1/1     Running   0             18m
	kube-system                         kube-proxy-l6lgc                                                 1/1     Running   0             17m
	kube-system                         kube-proxy-lzswh                                                 1/1     Running   0             16m
	kube-system                         kube-proxy-ndfmt                                                 1/1     Running   0             20m
	kube-system                         kube-proxy-nxlp9                                                 1/1     Running   0             18m
	kube-system                         kube-proxy-v9sxp                                                 1/1     Running   0             17m
	kube-system                         kube-scheduler-azure-example-control-plane-7ffnl                 1/1     Running   0             8m16s
	kube-system                         kube-scheduler-azure-example-control-plane-l4bv8                 1/1     Running   0             16m
	kube-system                         kube-scheduler-azure-example-control-plane-n4g4l                 1/1     Running   1 (17m ago)   19m
	node-feature-discovery              node-feature-discovery-master-84c67dcbb6-d2gm7                   1/1     Running   0             20m
	node-feature-discovery              node-feature-discovery-worker-drgf6                              1/1     Running   0             17m
	node-feature-discovery              node-feature-discovery-worker-hcz6k                              1/1     Running   0             17m
	node-feature-discovery              node-feature-discovery-worker-pgbcd                              1/1     Running   0             16m
	node-feature-discovery              node-feature-discovery-worker-vhj96                              1/1     Running   0             16m
	tigera-operator                     tigera-operator-d499f5c8f-jnj8b                                  1/1     Running   1 (18m ago)   19m
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[createnewcluster]: ../new
