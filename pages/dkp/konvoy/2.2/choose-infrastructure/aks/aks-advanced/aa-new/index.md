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

1.  Create the cluster from the objects.

    ```bash
    dkp create cluster aks --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

    ```sh
	Generating cluster resources
	cluster.cluster.x-k8s.io/aks-example created
	azuremanagedcontrolplane.infrastructure.cluster.x-k8s.io/aks-example created
	azuremanagedcluster.infrastructure.cluster.x-k8s.io/aks-example created
	machinepool.cluster.x-k8s.io/aks-example created
	azuremanagedmachinepool.infrastructure.cluster.x-k8s.io/cp8j69b created
	machinepool.cluster.x-k8s.io/aks-example-md-0 created
	azuremanagedmachinepool.infrastructure.cluster.x-k8s.io/mpqm2d8 created
	clusterresourceset.addons.cluster.x-k8s.io/calico-installation-aks-example created
	configmap/calico-cni-aks-example created
	clusterresourceset.addons.cluster.x-k8s.io/tigera-operator-aks-example created
	configmap/tigera-operator-aks-example created
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
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /aks-example                                                    True                     35s
    ├─ClusterInfrastructure - AzureManagedCluster/aks-example
    └─ControlPlane - AzureManagedControlPlane/aks-example
    ```

1.  As they progress, the controllers also create Events. List the Events using this command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AKSCluster"` and `kubectl get events --field-selector involvedObject.kind="AKSMachine"`.

    ```sh
    15m         Normal    AzureClusterObjectNotFound                  azurecluster                                          AzureCluster object default/aks-example not found
    15m         Normal    AzureManagedControlPlaneObjectNotFound      azuremanagedcontrolplane                              AzureManagedControlPlane object default/aks-example not found
    15m         Normal    AzureClusterObjectNotFound                  azurecluster                                          AzureCluster.infrastructure.cluster.x-k8s.io "aks-example" not found
    8m22s       Normal    SuccessfulSetNodeRef                        machine/aks-example-control-plane-bmc9b          aks-example-control-plane-fdvnm
    10m         Normal    Machine controller dependency not yet met   azuremachine/aks-example-control-plane-fdvnm     Machine Controller has not yet set OwnerRef
    12m         Normal    SuccessfulSetNodeRef                        machine/aks-example-control-plane-msftd          aks-example-control-plane-z9q45
    10m         Normal    SuccessfulSetNodeRef                        machine/aks-example-control-plane-nrvff          aks-example-control-plane-vmqwx
    12m         Normal    Machine controller dependency not yet met   azuremachine/aks-example-control-plane-vmqwx     Machine Controller has not yet set OwnerRef
    14m         Normal    Machine controller dependency not yet met   azuremachine/aks-example-control-plane-z9q45     Machine Controller has not yet set OwnerRef
    14m         Warning   VMIdentityNone                              azuremachinetemplate/aks-example-control-plane   You are using Service Principal authentication for Cloud Provider Azure which is less secure than Managed Identity. Your Service Principal credentials will be written to a file on the disk of each VM in order to be accessible by Cloud Provider. To learn more, see https://capz.sigs.k8s.io/topics/identities-use-cases.html#azure-host-identity
    12m         Warning   ControlPlaneUnhealthy                       kubeadmcontrolplane/aks-example-control-plane    Waiting for control plane to pass preflight checks to continue reconciliation: [machine aks-example-control-plane-msftd does not have APIServerPodHealthy condition, machine aks-example-control-plane-msftd does not have ControllerManagerPodHealthy condition, machine aks-example-control-plane-msftd does not have SchedulerPodHealthy condition, machine aks-example-control-plane-msftd does not have EtcdPodHealthy condition, machine aks-example-control-plane-msftd does not have EtcdMemberHealthy condition]
    11m         Warning   ControlPlaneUnhealthy                       kubeadmcontrolplane/aks-example-control-plane    Waiting for control plane to pass preflight checks to continue reconciliation: [machine aks-example-control-plane-nrvff does not have APIServerPodHealthy condition, machine aks-example-control-plane-nrvff does not have ControllerManagerPodHealthy condition, machine aks-example-control-plane-nrvff does not have SchedulerPodHealthy condition, machine aks-example-control-plane-nrvff does not have EtcdPodHealthy condition, machine aks-example-control-plane-nrvff does not have EtcdMemberHealthy condition]
    9m52s       Normal    SuccessfulSetNodeRef                        machine/aks-example-md-0-84bd8b5f5b-b8cnq        aks-example-md-0-bsc82
    9m53s       Normal    SuccessfulSetNodeRef                        machine/aks-example-md-0-84bd8b5f5b-j8ldg        aks-example-md-0-mjcbn
    9m52s       Normal    SuccessfulSetNodeRef                        machine/aks-example-md-0-84bd8b5f5b-lx89f        aks-example-md-0-pmq8f
    10m         Normal    SuccessfulSetNodeRef                        machine/aks-example-md-0-84bd8b5f5b-pcv7q        aks-example-md-0-vzprf
    15m         Normal    SuccessfulCreate                            machineset/aks-example-md-0-84bd8b5f5b           Created machine "aks-example-md-0-84bd8b5f5b-j8ldg"
    15m         Normal    SuccessfulCreate                            machineset/aks-example-md-0-84bd8b5f5b           Created machine "aks-example-md-0-84bd8b5f5b-lx89f"
    15m         Normal    SuccessfulCreate                            machineset/aks-example-md-0-84bd8b5f5b           Created machine "aks-example-md-0-84bd8b5f5b-pcv7q"
    15m         Normal    SuccessfulCreate                            machineset/aks-example-md-0-84bd8b5f5b           Created machine "aks-example-md-0-84bd8b5f5b-b8cnq"
    15m         Normal    Machine controller dependency not yet met   azuremachine/aks-example-md-0-bsc82              Machine Controller has not yet set OwnerRef
    15m         Normal    Machine controller dependency not yet met   azuremachine/aks-example-md-0-mjcbn              Machine Controller has not yet set OwnerRef
    15m         Normal    Machine controller dependency not yet met   azuremachine/aks-example-md-0-pmq8f              Machine Controller has not yet set OwnerRef
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
