---
layout: layout.pug
navigationTitle: Scale the Cluster
title: Scale the Cluster
menuWeight: 84
excerpt: Procedure to scale-up or scale-down an existing DKP cluster
beta: false
enterprise: false
---

## Scale up a Cluster

Follow these steps:

1.  Identify the existing `PreprovisionedInventory` that you wish to scale:

    ```bash
    kubectl get preprovisionedinventory -A
    ```

1.  Edit the `PreprovisionedInventory` to add additional IPs needed for additional worker nodes in the `spec.hosts` section:

    ```bash
    kubectl edit preprovisionedinventory <name> -n <namespace>
    ```

1.  (Optional) Add any additional host IPs that you require for adding to your cluster:

    ```bash
    spec:
      hosts:
        - address: <worker.ip.add.1>
        - address: <worker.ip.add.2>
    ```

    After you edit `PreprovisionedInventory`, fetch the `MachineDeployment`. The naming convention with `md` means that it is for worker machines backed by a `MachineDeployment`. For example:

    ```bash
    kubectl get machinedeployment -A
    ```

    ```sh
    NAME                     CLUSTER        AGE     PHASE     REPLICAS   READY   UPDATED   UNAVAILABLE
    machinedeployment-md-0   cluster-name   9m10s   Running   4          4       4
    ```

1.  Scale the worker nodes to the required number. In this example we are scaling from 4 to 6 worker nodes:

    ```bash
    kubectl scale --replicas=6 machinedeployment machinedeployment-md-0 -n default
    ```

    ```sh
    machinedeployment.cluster.x-k8s.io/machinedeployment-md-0 scaled
    ```

1.  Monitor the scaling with this command, by adding `-w` option to watch:

    ```bash
    kubectl get machinedeployment -n default -w
    ```

    ```sh
    NAME                     CLUSTER        AGE   PHASE       REPLICAS   READY   UPDATED   UNAVAILABLE
    machinedeployment-md-0   cluster-name   20m   ScalingUp   6          4       6         2
    ```

1.  Check the machine deployment to ensure it has successfully scaled. The output should resemble this example:

    ```bash
    kubectl get machinedeployment -n default
    ```

    ```sh
    NAME                     CLUSTER             AGE     PHASE     REPLICAS   READY   UPDATED   UNAVAILABLE
    machinedeployment-md-0   machinedeployment   3h33m   Running   6          6       6
    ```

1.  Alternately, you can use this command and verify the `NODENAME` column and you should see the additional worker nodes added and in `Running` state:

    ```bash
    kubectl get machines -A -o wide
    ```

    ```sh
    NAMESPACE   NAME                                    CLUSTER             AGE     PROVIDERID                          PHASE     VERSION   NODENAME
    default     machinedeployment-control-plane-sljgr   machinedeployment   113m    preprovisioned:////34.123.456.162   Running   v1.21.6   ip-10-0-245-186.us-west-2.compute.internal
    default     machinedeployment-control-plane-wn6pp   machinedeployment   108m    preprovisioned:////54.123.456.63    Running   v1.21.6   ip-10-0-21-113.us-west-2.compute.internal
    default     machinedeployment-control-plane-zpsh6   machinedeployment   119m    preprovisioned:////35.12.345.183    Running   v1.21.6   ip-10-0-43-72.us-west-2.compute.internal
    default     machinedeployment-md-0-d9b7658b-59ndc   machinedeployment   119m    preprovisioned:////18.123.456.224   Running   v1.21.6   ip-10-0-6-233.us-west-2.compute.internal
    default     machinedeployment-md-0-d9b7658b-5tbq9   machinedeployment   119m    preprovisioned:////35.12.345.237    Running   v1.21.6   ip-10-0-19-175.us-west-2.compute.internal
    default     machinedeployment-md-0-d9b7658b-9cgc8   machinedeployment   119m    preprovisioned:////54.123.45.76     Running   v1.21.6   ip-10-0-2-119.us-west-2.compute.internal
    default     machinedeployment-md-0-d9b7658b-9cgc7   machinedeployment   119m    preprovisioned:////55.123.45.76     Running   v1.21.6   ip-10-0-2-118.us-west-2.compute.internal
    default     machinedeployment-md-0-d9b7658b-9cgc6   machinedeployment   5m23s   preprovisioned:////56.123.45.76     Running   v1.21.6   ip-10-0-2-117.us-west-2.compute.internal
    default     machinedeployment-md-0-d9b7658b-9cgc5   machinedeployment   5m23s   preprovisioned:////57.123.45.76     Running   v1.21.6   ip-10-0-2-116.us-west-2.compute.internal
    ```

## Scale Down a Cluster

Run the following command:

```bash
kubectl scale machinedeployment <name> -n <namespace> --replicas <new number>
```

For control plane nodes, currently there is an <a href="https://github.com/kubernetes-sigs/cluster-api/issues/4847/">upstream bug</a> that prevents scaling, but once the issue gets resolved and the fixed CAPI version gets used for DKP, you can perform the following command:

```bash
kubectl scale kubeadmcontrolplane <name> -n <namespace> --replicas <new number>
```

While this item (for control planes) is still being worked on, a workaround would be to perform a `kubectl edit kubeadmcontrolplane` command and change the replica value under the `spec` section.

## Additional Notes for Scaling Down

It is possible for machines to get stuck in the provisioning stage when scaling down. You can utilize a delete operation to clear the stale machine deployment:

```bash
kubectl delete machine <name> -n <namespace>
```
