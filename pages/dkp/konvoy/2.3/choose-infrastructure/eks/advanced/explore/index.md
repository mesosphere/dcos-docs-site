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
	ip-10-0-122-211.us-west-2.compute.internal   Ready    <none>   32s   v1.21.5-eks-9017834
	ip-10-0-127-74.us-west-2.compute.internal    Ready    <none>   42s   v1.21.5-eks-9017834
	ip-10-0-71-155.us-west-2.compute.internal    Ready    <none>   46s   v1.21.5-eks-9017834
	ip-10-0-93-47.us-west-2.compute.internal     Ready    <none>   51s   v1.21.5-eks-9017834
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Nodes' Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

1.  List the Pods using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    ```sh
	NAMESPACE                NAME                                             READY   STATUS     RESTARTS   AGE
	calico-system            calico-kube-controllers-69845d4df5-sc9vq         1/1     Running    0          44s
	calico-system            calico-node-5lppw                                1/1     Running    0          44s
	calico-system            calico-node-dwbfj                                1/1     Running    0          44s
	calico-system            calico-node-q6tg6                                1/1     Running    0          44s
	calico-system            calico-node-rbm7c                                1/1     Running    0          44s
	calico-system            calico-typha-68c68c96d-tcrxn                     1/1     Running    0          35s
	calico-system            calico-typha-68c68c96d-xhrjv                     1/1     Running    0          44s
	kube-system              aws-node-25bnt                                   1/1     Running    0          80s
	kube-system              aws-node-dr4b7                                   1/1     Running    0          89s
	kube-system              aws-node-mmn87                                   1/1     Running    0          70s
	kube-system              aws-node-z6cdb                                   1/1     Running    0          84s
	kube-system              cluster-autoscaler-68c759fbf6-zszxr              0/1     Init:0/1   0          9m50s
	kube-system              coredns-85d5b4454c-n54rq                         1/1     Running    0          12m
	kube-system              coredns-85d5b4454c-xzd9w                         1/1     Running    0          12m
	kube-system              kube-proxy-4bhzp                                 1/1     Running    0          84s
	kube-system              kube-proxy-5hkv9                                 1/1     Running    0          80s
	kube-system              kube-proxy-g82d7                                 1/1     Running    0          70s
	kube-system              kube-proxy-h2jv5                                 1/1     Running    0          89s
	node-feature-discovery   node-feature-discovery-master-84c67dcbb6-s6874   1/1     Running    0          9m50s
	node-feature-discovery   node-feature-discovery-worker-677hh              1/1     Running    0          69s
	node-feature-discovery   node-feature-discovery-worker-fvjwz              1/1     Running    0          49s
	node-feature-discovery   node-feature-discovery-worker-xcgvt              1/1     Running    0          64s
	node-feature-discovery   node-feature-discovery-worker-zctnz              1/1     Running    0          60s
	tigera-operator          tigera-operator-d499f5c8f-b56xn                  1/1     Running    1          9m47s
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
[createnewcluster]: ../new
