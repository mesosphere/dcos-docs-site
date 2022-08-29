---
layout: layout.pug
navigationTitle: Scale the Cluster
title: Scale the Cluster
menuWeight: 84
excerpt: Procedure to scale-up or scale-down an existing DKP cluster.
beta: false
enterprise: false
---

## Scale up a Cluster

Follow these steps:

1.  Identify the existing `PreprovisionedInventory` that you wish to scale:

    ```bash
    kubectl get preprovisionedinventory -A
    ```

2.  Edit the `PreprovisionedInventory` to add additional IPs needed for additional worker nodes in the `spec.hosts` section:

    ```bash
    kubectl edit preprovisionedinventory <name> -n <namespace>
    ```

3.  (Optional) Add any additional host IPs that you require for adding to your cluster:

    ```bash
    spec: 
        hosts: 
        - address: <worker.ip.add.1> 
        - address: <worker.ip.add.2> 
    ```

    After you edit `PreprovisionedInventory`, fetch the `MachineDeployment`. The naming convention with `md` means that it is for worker machines backed by a `MachineDeployment`. For example:

    ```bash
    kubectl get machinedeployment -A
    ```

    ```bash
    NAME             CLUSTER     AGE     PHASE     REPLICAS   READY   UPDATED   UNAVAILABLE 
    machinedeployment-md-0   cluster-name   9m10s   Running   4          4       4   
    ```

4.  Scale the worker nodes to the required number. In this example we are scaling from 4 to 6 worker nodes:

    ```bash
    kubectl scale --replicas=6 machinedeployment machinedeployment-md-0 -n default
    ```

    ```bash
    machinedeployment.cluster.x-k8s.io/<name-of-machine-deployment> scaled 
    ```

5.  Monitor the scaling with this command, by adding `-w` option to watch:

    ```bash
    kubectl get machinedeployment -n default -w
    ```

    ```bash
    NAME             CLUSTER     AGE   PHASE       REPLICAS   READY   UPDATED   UNAVAILABLE 
    machinedeployment-md-0   cluster-name   20m   ScalingUp   6          4       6         2 
    ```

6.  Check the machine deployment to ensure it has successfully scaled. The output should resemble this example:

    ```bash
    kubectl get machinedeployment -n default
    ```

    ```bash
    NAME             CLUSTER     AGE     PHASE     REPLICAS   READY   UPDATED   UNAVAILABLE 
    machinedeployment-md-0   coytestds   3h33m   Running   6          6       6 
    ```

7.  Alternately, you can use this command and verify the `NODENAME` column and you should see the additional worker nodes added and in `Running` state:

    ```bash
    kubectl get machines -A -o wide
    ```

    ```bash
    NAME                              CLUSTER     AGE     PROVIDERID                          PHASE     VERSION   NODENAME
    ```

## Scale Down a Cluster

Follow these steps:

1.  Run the following commands:

    ```bash
    kubectl scale machinedeployment <name> -n <namespace> --replicas <new number>
    ```

    For control plane nodes, currently there is an <a href="https://github.com/kubernetes-sigs/cluster-api/issues/4847/">upstream bug</a> that prevents scaling, but once the issue gets resolved and the fixed CAPI version gets used for DKP2, you can perform the following command:

    ```bash
    kubectl scale kubeadmcontrolplane <name> -n <namespace> --replicas <new number>
    ```

    While this item (for control planes) is still being worked on, a workaround would be to perform a `kubectl edit kubeadmcontrolplane` command and change the replica value under the `spec` section.

## Additional Notes for Scaling Down

It is possible for machines to get stuck in the provisioning stage when scaling down. You can utilize a delete operation to clear the stale machine deployment:

```bash
kubectl delete machine <name> -n <namespace>
```
