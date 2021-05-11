---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 25
excerpt: Explore the new Kubernetes cluster
beta: true
enterprise: false
---

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```sh
    konvoy2 get kubeconfig > ${CLUSTER_NAME}.conf
    ```

1.  List Nodes (it may take a couple of minutes for the Status to be `Ready` while `calico-node` pods are being deployed):

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

1.  List Pods:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
