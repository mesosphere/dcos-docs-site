---
layout: layout.pug
navigationTitle: Upgrade the Cluster
title: Upgrade the Cluster
menuWeight: 84
excerpt: Upgrade my pre-provisioned Konvoy cluster to the latest Kubernetes version
beta: false
enterprise: false
---

## Prerequisites

- You must have the bootstrap node running with the SSH key/secrets created.
- The export values in the environment variables section should contain the addresses of the nodes that you need to add in the section [define infrastructure][define-infrastructure].
- Update the preprovisioned_inventory.yaml with the new host addresses.
- Run the kubectl apply command.

## Scale up a Cluster Node

Follow these steps:

1.  Fetch the existing preprovisioned_inventory:

    ```bash
    $ kubectl get preprovisionedinventory
    ```

1.  Edit the preprovisioned_inventory to add additional IPs needed for additional worker nodes in the spec.hosts: section: 

    ```bash
    $ kubectl edit preprovisionedinventory <preprovisioned_inventory> -n default 
    ```

1.  (Optional) Add any additional IPs that you require:

    ```bash
    spec: 
        hosts: 
        - address: <worker.ip.add.1> 
        - address: <worker.ip.add.2> 
    ```

    After you edit preprovisioned_inventory, fetch the machine deployment. The naming convention with md means that it is for worker machines.\
    For example:

    ```bash
    $ kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment 
    NAME             CLUSTER     AGE     PHASE     REPLICAS   READY   UPDATED   UNAVAILABLE 
    machinedeployment-md-0   cluster-name   9m10s   Running   4          4       4   
    ```

1.  Scale the worker node to the required number.\
    In this example we are scaling from 4 to 6 worker nodes:

    ```bash
    $ kubectl --kubeconfig ${CLUSTER_NAME}.conf scale --replicas=6 machinedeployment machinedeployment-md-0
    machinedeployment.cluster.x-k8s.io/<name-of-machine-deployment> scaled 
    ```

1.  Monitor the scaling with this command, by adding -w option to watch:

    ```bash
    $ kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment -w 
    NAME             CLUSTER     AGE   PHASE       REPLICAS   READY   UPDATED   UNAVAILABLE 
    machinedeployment-md-0   cluster-name   20m   ScalingUp   6          4       6         2 
    ```

1.  Check the machine deployment to ensure it's already scaled. The output should resemble this example: 

    ```bash
    $ kubectl --kubeconfig ${CLUSTER_NAME}.conf get machinedeployment 
    NAME             CLUSTER     AGE     PHASE     REPLICAS   READY   UPDATED   UNAVAILABLE 
    machinedeployment-md-0   coytestds   3h33m   Running   6          6       6 
    ```

1.  Alternately, you can use this command and verify the NODENAME column and you should see the additional worker nodes added and in Running state:

    ```bash
    $ kubectl --kubeconfig ${CLUSTER_NAME}.conf get machines -o wide 
    NAME                              CLUSTER     AGE     PROVIDERID                          PHASE     VERSION   NODENAME 
    ```
## Scale Down a Cluster Node

Follow these step:

1.  Run this command on your worker nodes:

    ```bash
    kubectl scale machinedeployment ${CLUSTER_NAME}-md-0 --replicas <new number>
    ```

    For control plane nodes, currently there is a [K8 upstream bug][k8_upstream_bug] that prevents scaling but once the issue gets resolved and the fixed CAPI version gets used for DKP2, it would be just a matter of doing the following command:

    ```bash
    kubectl scale kubeadmcontrolplane ${CLUSTER_NAME}-control-plane --replicas <new number>
    ```

While this item (for control planes) is still being worked on a workaround would be to perform a kubectl edit kubeadmcontrolplane command and change the replica value under the specifications section.

## Additional Notes for Scaling Down

It is possible for machines to get stuck in the preprovisioning stage when you scaling down. You can utilize a delete operation to clear the stale machine deployment:

```bash
kubectl delete machine ${CLUSTER_NAME}-control-plane-<hash>
```

```bash
kubectl delete machine ${CLUSTER_NAME}-md-0-<hash>
```

[k8s_upstream_bug]: https://github.com/kubernetes-sigs/cluster-api/issues/4847/
