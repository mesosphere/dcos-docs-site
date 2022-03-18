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
    NAME                                         STATUS   ROLES    AGE   VERSION
    ip-10-0-115-179.us-west-2.compute.internal   Ready    <none>   13m   v1.21.5-eks-bc4871b
    ip-10-0-117-5.us-west-2.compute.internal     Ready    <none>   12m   v1.21.5-eks-bc4871b
    ip-10-0-81-221.us-west-2.compute.internal    Ready    <none>   12m   v1.21.5-eks-bc4871b
    ip-10-0-94-48.us-west-2.compute.internal     Ready    <none>   12m   v1.21.5-eks-bc4871b
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Nodes' Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

1.  List the Pods using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    ```sh
    NAMESPACE                           NAME                                                                 READY   STATUS    RESTARTS   AGE
    calico-system            calico-kube-controllers-6b48c9575d-pvc4w        1/1     Running    0          3m51s
    calico-system            calico-node-4z2cn                               1/1     Running    0          3m51s
    calico-system            calico-node-6j6jt                               1/1     Running    0          3m47s
    calico-system            calico-node-cdzzs                               1/1     Running    0          3m49s
    calico-system            calico-node-ln74k                               1/1     Running    0          3m50s
    calico-system            calico-typha-578fc65f-82cdb                     1/1     Running    0          3m43s
    calico-system            calico-typha-578fc65f-mg59n                     1/1     Running    0          3m51s
    calico-system            calico-typha-578fc65f-qvxnl                     1/1     Running    0          3m43s
    kube-system              cluster-autoscaler-b4789f4bf-ds44f              0/1     Init:0/1   0          4m41s
    kube-system              coredns-85d5b4454c-hjp4h                        1/1     Running    0          7m41s
    kube-system              coredns-85d5b4454c-j26c5                        1/1     Running    0          7m41s
    kube-system              kube-proxy-bwl8s                                1/1     Running    0          3m53s
    kube-system              kube-proxy-gf9sr                                1/1     Running    0          3m49s
    kube-system              kube-proxy-mwcw9                                1/1     Running    0          4m2s
    kube-system              kube-proxy-p5hmm                                1/1     Running    0          3m47s
    node-feature-discovery   node-feature-discovery-master-65dc499cd-c867m   1/1     Running    0          4m44s
    node-feature-discovery   node-feature-discovery-worker-c72vn             1/1     Running    0          3m29s
    node-feature-discovery   node-feature-discovery-worker-n57p9             1/1     Running    0          3m27s
    node-feature-discovery   node-feature-discovery-worker-v7v6q             1/1     Running    0          3m42s
    node-feature-discovery   node-feature-discovery-worker-zd7lf             1/1     Running    0          3m33s
    tigera-operator          tigera-operator-59f4845b57-b5ltk                1/1     Running    0          4m42s
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
[createnewcluster]: ../new
