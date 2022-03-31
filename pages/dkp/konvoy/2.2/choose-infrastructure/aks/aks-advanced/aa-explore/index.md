---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 25
excerpt: Learn to interact with your AKS Kubernetes cluster
enterprise: false
---

This guide explains how to use the command line to interact with your newly deployed Kubernetes cluster.

Before you start, make sure you have created a workload cluster, as described in [Create a New Cluster][createnewcluster].

## Explore the new AKS cluster

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
    NAME                              STATUS   ROLES   AGE     VERSION
    aks-cplbnlb-18646133-vmss000000   Ready    agent   2m43s   v1.21.2
    aks-cplbnlb-18646133-vmss000001   Ready    agent   2m47s   v1.21.2
    aks-cplbnlb-18646133-vmss000002   Ready    agent   2m58s   v1.21.2
    aks-mpz427b-18646133-vmss000000   Ready    agent   3m1s    v1.21.2
    aks-mpz427b-18646133-vmss000001   Ready    agent   3m1s    v1.21.2
    aks-mpz427b-18646133-vmss000002   Ready    agent   2m47s   v1.21.2
    aks-mpz427b-18646133-vmss000003   Ready    agent   3m6s    v1.21.2
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Nodes' Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

1.  List the Pods using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    ```sh
    NAMESPACE                NAME                                            READY   STATUS     RESTARTS   AGE
    calico-system            calico-kube-controllers-5dcd4b47b5-tgslm        1/1     Running    0          3m58s
    calico-system            calico-node-46dj9                               1/1     Running    0          3m58s
    calico-system            calico-node-crdgc                               1/1     Running    0          3m58s
    calico-system            calico-node-m7s7x                               1/1     Running    0          3m58s
    calico-system            calico-node-qfkqc                               1/1     Running    0          3m57s
    calico-system            calico-node-sfqfm                               1/1     Running    0          3m57s
    calico-system            calico-node-sn67x                               1/1     Running    0          3m53s
    calico-system            calico-node-w2pvt                               1/1     Running    0          3m58s
    calico-system            calico-typha-6f7f59969c-5z4t5                   1/1     Running    0          3m51s
    calico-system            calico-typha-6f7f59969c-ddzqb                   1/1     Running    0          3m58s
    calico-system            calico-typha-6f7f59969c-rr4lj                   1/1     Running    0          3m51s
    kube-system              azure-ip-masq-agent-4f4v6                       1/1     Running    0          4m11s
    kube-system              azure-ip-masq-agent-5xfh2                       1/1     Running    0          4m11s
    kube-system              azure-ip-masq-agent-9hlk8                       1/1     Running    0          4m8s
    kube-system              azure-ip-masq-agent-9vsgg                       1/1     Running    0          4m16s
    kube-system              azure-ip-masq-agent-b9wjj                       1/1     Running    0          3m57s
    kube-system              azure-ip-masq-agent-kpjtl                       1/1     Running    0          3m53s
    kube-system              azure-ip-masq-agent-vr7hd                       1/1     Running    0          3m57s
    kube-system              cluster-autoscaler-b4789f4bf-qkfk2              0/1     Init:0/1   0          3m28s
    kube-system              coredns-845757d86-9jf8b                         1/1     Running    0          5m29s
    kube-system              coredns-845757d86-h4xfs                         1/1     Running    0          4m
    kube-system              coredns-autoscaler-5f85dc856b-xjb5z             1/1     Running    0          5m23s
    kube-system              csi-azuredisk-node-4n4fx                        3/3     Running    0          3m53s
    kube-system              csi-azuredisk-node-8pnjj                        3/3     Running    0          3m57s
    kube-system              csi-azuredisk-node-sbt6r                        3/3     Running    0          3m57s
    kube-system              csi-azuredisk-node-v25wc                        3/3     Running    0          4m16s
    kube-system              csi-azuredisk-node-vfbxg                        3/3     Running    0          4m11s
    kube-system              csi-azuredisk-node-w5ff5                        3/3     Running    0          4m11s
    kube-system              csi-azuredisk-node-zzgqx                        3/3     Running    0          4m8s
    kube-system              csi-azurefile-node-2rpcc                        3/3     Running    0          3m57s
    kube-system              csi-azurefile-node-4gqkf                        3/3     Running    0          4m11s
    kube-system              csi-azurefile-node-f6k8m                        3/3     Running    0          4m16s
    kube-system              csi-azurefile-node-k72xq                        3/3     Running    0          4m8s
    kube-system              csi-azurefile-node-vx7r4                        3/3     Running    0          3m53s
    kube-system              csi-azurefile-node-zc8kr                        3/3     Running    0          4m11s
    kube-system              csi-azurefile-node-zkl6b                        3/3     Running    0          3m57s
    kube-system              kube-proxy-4fpb6                                1/1     Running    0          3m53s
    kube-system              kube-proxy-6qfbf                                1/1     Running    0          4m16s
    kube-system              kube-proxy-6wnt2                                1/1     Running    0          4m8s
    kube-system              kube-proxy-cspd5                                1/1     Running    0          3m57s
    kube-system              kube-proxy-nsgq6                                1/1     Running    0          4m11s
    kube-system              kube-proxy-qz2st                                1/1     Running    0          4m11s
    kube-system              kube-proxy-zvh9k                                1/1     Running    0          3m57s
    kube-system              metrics-server-6bc97b47f7-ltkkj                 1/1     Running    0          5m28s
    kube-system              tunnelfront-77d68f78bf-t78ck                    1/1     Running    0          5m23s
    node-feature-discovery   node-feature-discovery-master-65dc499cd-fxwb5   1/1     Running    0          3m28s
    node-feature-discovery   node-feature-discovery-worker-277xc             1/1     Running    0          3m28s
    node-feature-discovery   node-feature-discovery-worker-4dq5k             1/1     Running    0          3m28s
    node-feature-discovery   node-feature-discovery-worker-57nb8             1/1     Running    0          3m28s
    node-feature-discovery   node-feature-discovery-worker-b4lkl             1/1     Running    0          3m28s
    node-feature-discovery   node-feature-discovery-worker-kslst             1/1     Running    0          3m28s
    node-feature-discovery   node-feature-discovery-worker-ppjtm             1/1     Running    0          3m28s
    node-feature-discovery   node-feature-discovery-worker-x5bgf             1/1     Running    0          3m28s
    tigera-operator          tigera-operator-74c4d9cf84-k7css                1/1     Running    0          5m25s
    ```

If you need to, you can [replace a node][aa-replace-node].

When ready, you can [delete the cluster][aa-delete].

[aa-replace-node]: ../aa-replace-node
[aa-delete]: ../aa-delete
[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
[createnewcluster]: ../aa-new
