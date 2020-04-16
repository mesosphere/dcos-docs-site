---
layout: layout.pug
navigationTitle: Replacing a failed control plane node
title: Replacing a failed control plane node
excerpt: Learn how to deploy a sample application on the Konvoy cluster
menuWeight: 5
---

## Replacing a failed control plane node

<p class="message--note"><strong>NOTE: </strong>If a majority of control plane nodes failed permanently, for example the EC2 instance has been terminated, then a new etcd cluster must be created.</p>

1.  In the AWS console terminate the failed control plane node.

1.  Exec into a `working` control plane node.

    ```shell
    kubectl exec -ti -n kube-system etcd-ip-10-0-193-25.us-west-2.compute.internal sh
    ```

1.  From the `control plane shell` run the following command to list all the etcd members, and note down the `member id` of the failing control plane node, in this sample `adcebc0f12cd5b7f`.

    ```shell
    ETCDCTL_API=3 etcdctl --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key --cacert=/etc/kubernetes/pki/etcd/ca.crt --endpoints=https://127.0.0.1:2379 member list

    61a7a86f030d44b6, started, ip-10-0-197-223.us-west-2.compute.internal, https://10.0.197.223:2380, https://10.0.197.223:2379
    adcebc0f12cd5b7f, started, ip-10-0-200-149.us-west-2.compute.internal, https://10.0.200.149:2380, https://10.0.200.149:2379
    fce222be536f51c5, started, ip-10-0-193-25.us-west-2.compute.internal, https://10.0.193.25:2380, https://10.0.193.25:2379
    ```

1.  From the `control plane shell` run the following command to remove the failed member.

    ```shell
    ETCDCTL_API=3 etcdctl --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key --cacert=/etc/kubernetes/pki/etcd/ca.crt --endpoints=https://127.0.0.1:2379 member remove adcebc0f12cd5b7f

    Member adcebc0f12cd5b7f removed from cluster 7631c48ef36ea956
    ```

1.  Exit the `control plane shell` and run the following command from your Konvoy client shell to add a new control plane node.

    ```shell
    konvoy up
    ```
