---
layout: layout.pug
navigationTitle: Replace a failed control plane node
title: Replace a failed control plane node
excerpt: Learn how to deploy a sample application on the Konvoy cluster
menuWeight: 5
---

## Replace a failed control plane node

<p class="message--note"><strong>NOTE: </strong>If a majority of control plane nodes failed permanently, for example the EC2 instance has been terminated, then a new etcd cluster must be created.</p>

1.  Confirm the failed control plane node is not communicating with other nodes.

    ```shell
    kubectl get nodes --output=custom-columns="NAME":".metadata.name","READY":".status.conditions[?(@.type==\"Ready\")].status"
    ```

    ```shell
    NAME                                     READY
    konvoy-example-cluster-control-plane-0   True
    konvoy-example-cluster-control-plane-1   Unknown
    konvoy-example-cluster-control-plane-2   True
    ```

    If the node's `READY` column does not say `True`, then the node is not ready. In the above example, the `konvoy-example-cluster-control-plane-1` node is not ready.

1.  Permanently remove the failed node.

    For example, if the node is an AWS EC2 instance, use the AWS CLI or Console to terminate the instance.

1.  Identify an etcd member ready to accept etcd API requests.

    ```shell
    kubectl -n kube-system get pod --selector=tier=control-plane,component=etcd --output=custom-columns="NAME":".metadata.name","READY":".status.conditions[?(@.type==\"Ready\")].status"
    ```

    ```shell
    NAME                                          READY
    etcd-konvoy-example-cluster-control-plane-0   True
    etcd-konvoy-example-cluster-control-plane-1   False
    etcd-konvoy-example-cluster-control-plane-2   True
    ```

    In the above example, both `etcd-konvoy-example-cluster-control-plane-0` and `etcd-konvoy-example-cluster-control-plane-2` are ready. Choose one and note (or copy) its name.

1.  Identify the failed etcd member.

    Find the ID of the etcd member for the failed control plane node.

    ```shell
    READY_ETCD_MEMBER="<name of etcd member from previous step>"
    ETCDCTL="ETCDCTL_API=3 etcdctl --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key --cacert=/etc/kubernetes/pki/etcd/ca.crt --endpoints=https://127.0.0.1:2379"
    kubectl -n kube-system exec -it "$READY_ETCD_MEMBER" -- /bin/sh -c "$ETCDCTL member list"
    ```

    ```shell
    1d021ffdd096a804, started, konvoy-example-cluster-control-plane-1, https://172.17.0.6:2380, https://172.17.0.6:2379, false
    40fd14fa28910cab, started, konvoy-example-cluster-control-plane-0, https://172.17.0.4:2380, https://172.17.0.4:2379, false
    87651970646a8073, started, konvoy-example-cluster-control-plane-2, https://172.17.0.5:2380, https://172.17.0.5:2379, false
    ```

    In the above example, the failed control node is `konvoy-example-cluster-control-plane-1`, so the etcd ID is `1d021ffdd096a804`. Note, or copy, this ID.

1.  Remove the failed etcd member.

    ```shell
    READY_ETCD_MEMBER="<name of etcd member from previous steps>"
    ETCD_ID_TO_REMOVE="<etcd member ID from previous step>"
    ETCDCTL="ETCDCTL_API=3 etcdctl --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key --cacert=/etc/kubernetes/pki/etcd/ca.crt --endpoints=https://127.0.0.1:2379"
    kubectl -n kube-system exec -it "$READY_ETCD_MEMBER" -- /bin/sh -c "$ETCDCTL member remove $ETCD_ID_TO_REMOVE"
    ```

    ```shell
    Member 1d021ffdd096a804 removed from cluster a6ea9ad1b116d02f
    ```

1.  Create a new control plane node to replace the failed node.

    ```shell
    konvoy up
    ```
