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
	NAME                                         STATUS   ROLES                  AGE     VERSION
	ip-10-0-100-85.us-west-2.compute.internal    Ready    <none>                 8m13s   v1.23.7
	ip-10-0-106-183.us-west-2.compute.internal   Ready    control-plane,master   6m22s   v1.23.7
	ip-10-0-158-104.us-west-2.compute.internal   Ready    control-plane,master   8m58s   v1.23.7
	ip-10-0-203-138.us-west-2.compute.internal   Ready    control-plane,master   7m52s   v1.23.7
	ip-10-0-70-169.us-west-2.compute.internal    Ready    <none>                 8m14s   v1.23.7
	ip-10-0-77-176.us-west-2.compute.internal    Ready    <none>                 8m11s   v1.23.7
	ip-10-0-96-61.us-west-2.compute.internal     Ready    <none>                 8m12s   v1.23.7
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a few minutes for the Status to move to <code>Ready</code> while the Pod network is deployed. The Nodes' Status should change to Ready soon after the <code>calico-node</code> DaemonSet Pods are Ready.</p>

1.  List the Pods using this command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get --all-namespaces pods
    ```

    ```sh
	NAMESPACE                NAME                                                                 READY   STATUS     RESTARTS        AGE
	calico-system            calico-kube-controllers-57fbd7bd59-xlnfq                             1/1     Running    0               9m41s
	calico-system            calico-node-7lfmj                                                    1/1     Running    0               9m2s
	calico-system            calico-node-8jm52                                                    1/1     Running    0               9m41s
	calico-system            calico-node-cgrwx                                                    1/1     Running    0               9m23s
	calico-system            calico-node-g96f6                                                    1/1     Running    0               9m22s
	calico-system            calico-node-kvwgq                                                    1/1     Running    0               9m21s
	calico-system            calico-node-nbjr6                                                    1/1     Running    0               7m32s
	calico-system            calico-node-w5sb5                                                    1/1     Running    0               9m24s
	calico-system            calico-typha-8699c7db75-645pm                                        1/1     Running    0               9m22s
	calico-system            calico-typha-8699c7db75-7czwp                                        1/1     Running    0               9m12s
	calico-system            calico-typha-8699c7db75-xk6wn                                        1/1     Running    0               9m41s
	kube-system              cluster-autoscaler-68c759fbf6-2bclx                                  0/1     Init:0/1   0               10m
	kube-system              coredns-78fcd69978-882jg                                             1/1     Running    0               10m
	kube-system              coredns-78fcd69978-ntp5f                                             1/1     Running    0               10m
	kube-system              ebs-csi-controller-77574b5cf5-84z7l                                  6/6     Running    0               10m
	kube-system              ebs-csi-controller-77574b5cf5-tsr5q                                  6/6     Running    0               10m
	kube-system              ebs-csi-node-2j9pd                                                   3/3     Running    0               9m23s
	kube-system              ebs-csi-node-6t4sr                                                   3/3     Running    0               9m2s
	kube-system              ebs-csi-node-8qkpr                                                   3/3     Running    0               10m
	kube-system              ebs-csi-node-kbq57                                                   3/3     Running    0               9m24s
	kube-system              ebs-csi-node-qf9mh                                                   3/3     Running    0               9m22s
	kube-system              ebs-csi-node-v84dd                                                   3/3     Running    0               9m21s
	kube-system              ebs-csi-node-zqrtp                                                   3/3     Running    0               7m32s
	kube-system              etcd-ip-10-0-106-183.us-west-2.compute.internal                      1/1     Running    0               7m31s
	kube-system              etcd-ip-10-0-158-104.us-west-2.compute.internal                      1/1     Running    0               10m
	kube-system              etcd-ip-10-0-203-138.us-west-2.compute.internal                      1/1     Running    0               9m1s
	kube-system              kube-apiserver-ip-10-0-106-183.us-west-2.compute.internal            1/1     Running    0               7m31s
	kube-system              kube-apiserver-ip-10-0-158-104.us-west-2.compute.internal            1/1     Running    0               10m
	kube-system              kube-apiserver-ip-10-0-203-138.us-west-2.compute.internal            1/1     Running    0               9m1s
	kube-system              kube-controller-manager-ip-10-0-106-183.us-west-2.compute.internal   1/1     Running    0               7m31s
	kube-system              kube-controller-manager-ip-10-0-158-104.us-west-2.compute.internal   1/1     Running    1 (8m51s ago)   10m
	kube-system              kube-controller-manager-ip-10-0-203-138.us-west-2.compute.internal   1/1     Running    0               9m2s
	kube-system              kube-proxy-4j9s5                                                     1/1     Running    0               9m23s
	kube-system              kube-proxy-64svf                                                     1/1     Running    0               9m2s
	kube-system              kube-proxy-9xghm                                                     1/1     Running    0               7m32s
	kube-system              kube-proxy-cwbqm                                                     1/1     Running    0               9m24s
	kube-system              kube-proxy-p6thh                                                     1/1     Running    0               9m22s
	kube-system              kube-proxy-pgs47                                                     1/1     Running    0               9m21s
	kube-system              kube-proxy-zrplb                                                     1/1     Running    0               10m
	kube-system              kube-scheduler-ip-10-0-106-183.us-west-2.compute.internal            1/1     Running    0               7m31s
	kube-system              kube-scheduler-ip-10-0-158-104.us-west-2.compute.internal            1/1     Running    1 (8m51s ago)   10m
	kube-system              kube-scheduler-ip-10-0-203-138.us-west-2.compute.internal            1/1     Running    0               9m2s
	kube-system              snapshot-controller-545b6bf98-k2fbv                                  1/1     Running    0               10m
	kube-system              snapshot-controller-545b6bf98-nf2m8                                  1/1     Running    0               10m
	node-feature-discovery   node-feature-discovery-master-84c67dcbb6-gqfq8                       1/1     Running    0               10m
	node-feature-discovery   node-feature-discovery-worker-46b9r                                  1/1     Running    0               8m12s
	node-feature-discovery   node-feature-discovery-worker-g6dw7                                  1/1     Running    0               8m12s
	node-feature-discovery   node-feature-discovery-worker-jzkmt                                  1/1     Running    0               8m12s
	node-feature-discovery   node-feature-discovery-worker-vmsbm                                  1/1     Running    0               8m12s
	tigera-operator          tigera-operator-d499f5c8f-glx25                                      1/1     Running    1 (8m51s ago)   10m
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
[createnewcluster]: ../new
