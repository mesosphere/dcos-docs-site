---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 20
excerpt: Use Konvoy to create a new AKS cluster
enterprise: false
---

Before you start, make sure you have completed the steps in [Bootstrap][bootstrap].

## Create a new AKS Kubernetes cluster

1.  Set the environment variable to a name for this cluster.

    ```bash
    export CLUSTER_NAME=aks-example
    ```

    See [Get Started with AKS](../../aks-quickstart) for information on naming your cluster.

1.  Inspecting or editing the cluster objects:

    Use your favorite editor.

    <p class="message--note"><strong>NOTE: </strong>Editing the cluster objects requires some understanding of Cluster API. Edits can prevent the cluster from deploying successfully.</p>

    The objects are [Custom Resources][k8s_custom_resources] defined by Cluster API components, and they belong in three different categories:

    1.  Cluster

        A _Cluster_ object has references to the infrastructure-specific and control plane objects.

    1.  Control Plane

    1.  Node Pool

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (for example, kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

1.  Find the latest available version for Kubernetes v1.22, see https://docs.microsoft.com/en-us/azure/aks/supported-kubernetes-versions?tabs=azure-cli for more details:

	```bash
	az aks get-versions -o table --location westus
	```

1.  Create the cluster from the objects.

    ```bash
    dkp create cluster aks --cluster-name=${CLUSTER_NAME} --kubernetes-version=1.22.6 --additional-tags=owner=$(whoami)
    ```

    ```sh
	Generating cluster resources
	cluster.cluster.x-k8s.io/aks-example created
	azuremanagedcontrolplane.infrastructure.cluster.x-k8s.io/aks-example created
	azuremanagedcluster.infrastructure.cluster.x-k8s.io/aks-example created
	machinepool.cluster.x-k8s.io/aks-example created
	azuremanagedmachinepool.infrastructure.cluster.x-k8s.io/cp6dsz8 created
	machinepool.cluster.x-k8s.io/aks-example-md-0 created
	azuremanagedmachinepool.infrastructure.cluster.x-k8s.io/mp6gglj created
	clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-aks-example created
	configmap/cluster-autoscaler-aks-example created
	clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-aks-example created
	configmap/node-feature-discovery-aks-example created
	clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-aks-example created
	configmap/nvidia-feature-discovery-aks-example created
    ```

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/aks-example condition met
    ```

    The `READY` status will become `True` after the cluster control-plane becomes ready. You can follow along in the following steps.

1.  Once the objects are created on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines. As they progress, they update the Status of each object. Konvoy provides a command to describe the current status of the cluster:

    ```bash
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                       READY  SEVERITY  REASON  SINCE  MESSAGE
	Cluster/aks-example                                        True                     48m
	├─ClusterInfrastructure - AzureManagedCluster/aks-example
	└─ControlPlane - AzureManagedControlPlane/aks-example
    ```

1.  As they progress, the controllers also create Events. List the Events using this command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AKSCluster"` and `kubectl get events --field-selector involvedObject.kind="AKSMachine"`.

    ```sh
    48m         Normal    SuccessfulSetNodeRefs                machinepool/aks-example-md-0                  [{Kind: Namespace: Name:aks-mp6gglj-41174201-vmss000000 UID:e3c30389-660d-46f5-b9d7-219f80b5674d APIVersion: ResourceVersion: FieldPath:} {Kind: Namespace: Name:aks-mp6gglj-41174201-vmss000001 UID:300d71a0-f3a7-4c29-9ff1-1995ffb9cfd3 APIVersion: ResourceVersion: FieldPath:} {Kind: Namespace: Name:aks-mp6gglj-41174201-vmss000002 UID:8eae2b39-a415-425d-8417-d915a0b2fa52 APIVersion: ResourceVersion: FieldPath:} {Kind: Namespace: Name:aks-mp6gglj-41174201-vmss000003 UID:3e860b88-f1a4-44d1-b674-a54fad599a9d APIVersion: ResourceVersion: FieldPath:}]
	6m4s        Normal    AzureManagedControlPlane available   azuremanagedcontrolplane/aks-example          successfully reconciled
	48m         Normal    SuccessfulSetNodeRefs                machinepool/aks-example                       [{Kind: Namespace: Name:aks-mp6gglj-41174201-vmss000000 UID:e3c30389-660d-46f5-b9d7-219f80b5674d APIVersion: ResourceVersion: FieldPath:} {Kind: Namespace: Name:aks-mp6gglj-41174201-vmss000001 UID:300d71a0-f3a7-4c29-9ff1-1995ffb9cfd3 APIVersion: ResourceVersion: FieldPath:} {Kind: Namespace: Name:aks-mp6gglj-41174201-vmss000002 UID:8eae2b39-a415-425d-8417-d915a0b2fa52 APIVersion: ResourceVersion: FieldPath:}]
    ```


## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create a bootstrap cluster must match the Konvoy version used to create a workload cluster.
- Konvoy supports deploying one workload cluster.
- Konvoy generates a set of objects for one Node Pool.
- Konvoy does not validate edits to cluster objects.

When complete, you can [explore the new cluster][aa-explore].

[aa-explore]: ../aa-explore
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[bootstrap]: ../aa-bootstrap
