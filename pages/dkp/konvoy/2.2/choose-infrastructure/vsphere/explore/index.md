---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 25
excerpt: Learn to interact with your Kubernetes cluster
enterprise: false
---

This guide explains how to use the command line to interact with your newly-deployed Kubernetes cluster.

Before you start, make sure you have created a workload cluster.

## Explore the new Kubernetes cluster

1.  Get a kubeconfig file for the workload cluster:

    When the workload cluster is created, the cluster lifecycle services generate a kubeconfig file for the workload cluster, and write it to a _Secret_. The kubeconfig file is scoped to the cluster administrator.

    Get the kubeconfig from the _Secret_, and write it to a file using this command:

    ```sh
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes using this command: %%% need some sample putplut data from a vSphere run, please

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    ```sh
    NAME                                         STATUS   ROLES                  AGE    VERSION
    ip-10-0-126-209.us-west-2.compute.internal   Ready    control-plane,master   124m   v1.21.6
    ip-10-0-204-168.us-west-2.compute.internal   Ready    <none>                 118m   v1.21.6
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Nodes' Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

1.  List the Pods using this command:  %%% need some sample putplut data from a vSphere run, please

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    ```sh
    NAMESPACE                           NAME                                                                 READY   STATUS    RESTARTS   AGE
    calico-system                       calico-kube-controllers-f95867bfb-4vxzz                              1/1     Running   0          124m
    calico-system                       calico-node-xjqkq                                                    1/1     Running   0          124m
    calico-system                       calico-node-z2h7c                                                    1/1     Running   0          120m
    etc
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
%%% is there a relevant vSphere link we need to locate?
[createnewcluster]: ../new
