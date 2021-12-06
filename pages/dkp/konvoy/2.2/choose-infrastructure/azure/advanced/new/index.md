---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 20
excerpt: Use Konvoy to create a new Kubernetes cluster
enterprise: false
---

## Prerequisites

- Before you begin, make sure you have created a [Bootstrap][bootstrap] cluster.

## Name your cluster

1.  Give your cluster a unique name suitable for your environment.

1.  Set the environment variable:

    ```sh
    CLUSTER_NAME=my-azure-cluster
    ```

## Tips and Tricks

1.  To create a cluster name that's unique, use the following command:

    ```sh
    CLUSTER_NAME=$(whoami)-azure-cluster-$(LC_CTYPE=C tr -dc 'a-z0-9' </dev/urandom | fold -w 5 | head -n1)
    echo $CLUSTER_NAME
    ```

    ```text
    hunter-azure-cluster-pf4a3
    ```

    This will create a unique name every time you run it, so use it with forethought.

1.  Set the environment variable to the name you assigned this cluster:

    ```sh
    CLUSTER_NAME=my-azure-cluster
    ```

## Create a new Azure Kubernetes cluster

1.  Generate the Kubernetes cluster objects:

    ```sh
    dkp create cluster azure --cluster-name=${CLUSTER_NAME} \
    --dry-run \
    --output=yaml \
    > ${CLUSTER_NAME}.yaml
    ```

1.  (Optional) To configure the Control Plane and Worker nodes to use an HTTP proxy:

    ```sh
    export CONTROL_PLANE_HTTP_PROXY=http://example.org:8080
    export CONTROL_PLANE_HTTPS_PROXY=http://example.org:8080
    export CONTROL_PLANE_NO_PROXY="example.org,example.com,example.net,localhost,127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,169.254.169.254,.cloudapp.azure.com"

    export WORKER_HTTP_PROXY=http://example.org:8080
    export WORKER_HTTPS_PROXY=http://example.org:8080
    export WORKER_NO_PROXY="example.org,example.com,example.net,localhost,127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,169.254.169.254,.cloudapp.azure.com"
    ```

    - Replace `example.org,example.com,example.net` with your internal addresses
    - `localhost` and `127.0.0.1` addesses should not use the proxy
    - `10.96.0.0/12` is the default Kubernetes service subnet
    - `192.168.0.0/16` is the default Kubernetes pod subnet
    - `kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local` is the internal Kubernetes kube-apiserver service
    - `.svc,.svc.cluster,.svc.cluster.local` is the internal Kubernetes services
    - `169.254.169.254` is the Azure metadata server
    - `.cloudapp.azure.com` is for the worker nodes to allow them to communicate directly to the kube-apiserver loadbalancer

1.  (Optional) Create a Kubernetes cluster with HTTP proxy configured. This step assumes you did not already create a cluster in the previous steps:

    ```sh
    dkp create cluster azure --cluster-name=${CLUSTER_NAME} \
    --control-plane-http-proxy="${CONTROL_PLANE_HTTP_PROXY}" \
    --control-plane-https-proxy="${CONTROL_PLANE_HTTPS_PROXY}" \
    --control-plane-no-proxy="${CONTROL_PLANE_NO_PROXY}" \
    --worker-http-proxy="${WORKER_HTTP_PROXY}" \
    --worker-https-proxy="${WORKER_HTTPS_PROXY}" \
    --worker-no-proxy="${WORKER_NO_PROXY}" \
    --dry-run \
    --output=yaml \
    > ${CLUSTER_NAME}.yaml
    ```

1.  Inspect or edit the cluster objects:

    <p class="message--note"><strong>NOTE: </strong>Familiarize yourself with Cluster API before editing the cluster objects as edits can prevent the cluster from deploying successfully.</p>

    The objects are [Custom Resources][k8s_custom_resources] defined by Cluster API components, and they belong in three different categories:

    1.  Cluster

        A _Cluster_ object has references to the infrastructure-specific and control plane objects. Because this is an Azure cluster, there is an _AzureCluster_ object that describes the infrastructure-specific cluster properties. Here, this means the Azure region, the VPC ID, subnet IDs, and security group rules required by the Pod network implementation.

    1.  Control Plane

        A _KubeadmControlPlane_ object describes the control plane, which is the group of machines that run the Kubernetes control plane components, which include the etcd distributed database, the API server, the core controllers, and the scheduler. The object describes the configuration for these components. The object also has a reference to an infrastructure-specific object that describes the properties of all control plane machines. Here, it references an _AzureMachineTemplate_ object, which describes the instance type, the type of disk used, and the size of the disk, among other properties.

    1.  Node Pool

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (e.g., kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_, and an _AzureMachineTemplate_ object, which describes the instance type, the type of disk used, the size of the disk, among other properties.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

1.  Create the cluster from the objects.

    ```sh
    kubectl apply -f ${CLUSTER_NAME}.yaml
    ```

    ```sh
    cluster.cluster.x-k8s.io/my-azure-cluster created
    azurecluster.infrastructure.cluster.x-k8s.io/my-azure-cluster created
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/my-azure-cluster-control-plane created
    azuremachinetemplate.infrastructure.cluster.x-k8s.io/my-azure-cluster-control-plane created
    clusterresourceset.addons.cluster.x-k8s.io/calico-installation-my-azure-cluster created
    configmap/calico-cni-my-azure-cluster created
    machinedeployment.cluster.x-k8s.io/my-azure-cluster-md-0 created
    azuremachinetemplate.infrastructure.cluster.x-k8s.io/my-azure-cluster-md-0 created
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/my-azure-cluster-md-0 created
    ```

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```text
    cluster.cluster.x-k8s.io/my-azure-cluster condition met
    ```

1.  After the objects are created on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines. As they progress, they update the Status of each object. Konvoy provides a command to describe the current status of the cluster:

    ```sh
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```text
    NAME                                                                       READY  SEVERITY  REASON  SINCE  MESSAGE
    /my-azure-cluster                                                    True                     6m37s
    ├─ClusterInfrastructure - AzureCluster/my-azure-cluster              True                     13m
    ├─ControlPlane - KubeadmControlPlane/my-azure-cluster-control-plane  True                     6m37s
    │ └─3 Machines...                                                    True                     10m    See my-azure-cluster-control-plane-bmc9b, my-azure-cluster-control-plane-msftd, ...
    └─Workers
    └─MachineDeployment/my-azure-cluster-md-0                            True                     7m58s
    └─4 Machines...                                                      True                     8m10s  See my-azure-cluster-md-0-84bd8b5f5b-b8cnq, my-azure-cluster-md-0-84bd8b5f5b-j8ldg, ...
    ```

1.  As they progress, the controllers also create Events. List the Events using this command:

    ```sh
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AzureCluster"` and `kubectl get events --field-selector involvedObject.kind="AzureMachine"`.

    ```text
    15m         Normal    AzureClusterObjectNotFound                  azurecluster                                          AzureCluster object default/my-azure-cluster not found
    15m         Normal    AzureManagedControlPlaneObjectNotFound      azuremanagedcontrolplane                              AzureManagedControlPlane object default/my-azure-cluster not found
    15m         Normal    AzureClusterObjectNotFound                  azurecluster                                          AzureCluster.infrastructure.cluster.x-k8s.io "my-azure-cluster" not found
    8m22s       Normal    SuccessfulSetNodeRef                        machine/my-azure-cluster-control-plane-bmc9b          my-azure-cluster-control-plane-fdvnm
    10m         Normal    Machine controller dependency not yet met   azuremachine/my-azure-cluster-control-plane-fdvnm     Machine Controller has not yet set OwnerRef
    12m         Normal    SuccessfulSetNodeRef                        machine/my-azure-cluster-control-plane-msftd          my-azure-cluster-control-plane-z9q45
    10m         Normal    SuccessfulSetNodeRef                        machine/my-azure-cluster-control-plane-nrvff          my-azure-cluster-control-plane-vmqwx
    12m         Normal    Machine controller dependency not yet met   azuremachine/my-azure-cluster-control-plane-vmqwx     Machine Controller has not yet set OwnerRef
    14m         Normal    Machine controller dependency not yet met   azuremachine/my-azure-cluster-control-plane-z9q45     Machine Controller has not yet set OwnerRef
    14m         Warning   VMIdentityNone                              azuremachinetemplate/my-azure-cluster-control-plane   You are using Service Principal authentication for Cloud Provider Azure which is less secure than Managed Identity. Your Service Principal credentials will be written to a file on the disk of each VM in order to be accessible by Cloud Provider. To learn more, see https://capz.sigs.k8s.io/topics/identities-use-cases.html#azure-host-identity
    12m         Warning   ControlPlaneUnhealthy                       kubeadmcontrolplane/my-azure-cluster-control-plane    Waiting for control plane to pass preflight checks to continue reconciliation: [machine my-azure-cluster-control-plane-msftd does not have APIServerPodHealthy condition, machine my-azure-cluster-control-plane-msftd does not have ControllerManagerPodHealthy condition, machine my-azure-cluster-control-plane-msftd does not have SchedulerPodHealthy condition, machine my-azure-cluster-control-plane-msftd does not have EtcdPodHealthy condition, machine my-azure-cluster-control-plane-msftd does not have EtcdMemberHealthy condition]
    11m         Warning   ControlPlaneUnhealthy                       kubeadmcontrolplane/my-azure-cluster-control-plane    Waiting for control plane to pass preflight checks to continue reconciliation: [machine my-azure-cluster-control-plane-nrvff does not have APIServerPodHealthy condition, machine my-azure-cluster-control-plane-nrvff does not have ControllerManagerPodHealthy condition, machine my-azure-cluster-control-plane-nrvff does not have SchedulerPodHealthy condition, machine my-azure-cluster-control-plane-nrvff does not have EtcdPodHealthy condition, machine my-azure-cluster-control-plane-nrvff does not have EtcdMemberHealthy condition]
    9m52s       Normal    SuccessfulSetNodeRef                        machine/my-azure-cluster-md-0-84bd8b5f5b-b8cnq        my-azure-cluster-md-0-bsc82
    9m53s       Normal    SuccessfulSetNodeRef                        machine/my-azure-cluster-md-0-84bd8b5f5b-j8ldg        my-azure-cluster-md-0-mjcbn
    9m52s       Normal    SuccessfulSetNodeRef                        machine/my-azure-cluster-md-0-84bd8b5f5b-lx89f        my-azure-cluster-md-0-pmq8f
    10m         Normal    SuccessfulSetNodeRef                        machine/my-azure-cluster-md-0-84bd8b5f5b-pcv7q        my-azure-cluster-md-0-vzprf
    15m         Normal    SuccessfulCreate                            machineset/my-azure-cluster-md-0-84bd8b5f5b           Created machine "my-azure-cluster-md-0-84bd8b5f5b-j8ldg"
    15m         Normal    SuccessfulCreate                            machineset/my-azure-cluster-md-0-84bd8b5f5b           Created machine "my-azure-cluster-md-0-84bd8b5f5b-lx89f"
    15m         Normal    SuccessfulCreate                            machineset/my-azure-cluster-md-0-84bd8b5f5b           Created machine "my-azure-cluster-md-0-84bd8b5f5b-pcv7q"
    15m         Normal    SuccessfulCreate                            machineset/my-azure-cluster-md-0-84bd8b5f5b           Created machine "my-azure-cluster-md-0-84bd8b5f5b-b8cnq"
    15m         Normal    Machine controller dependency not yet met   azuremachine/my-azure-cluster-md-0-bsc82              Machine Controller has not yet set OwnerRef
    15m         Normal    Machine controller dependency not yet met   azuremachine/my-azure-cluster-md-0-mjcbn              Machine Controller has not yet set OwnerRef
    15m         Normal    Machine controller dependency not yet met   azuremachine/my-azure-cluster-md-0-pmq8f              Machine Controller has not yet set OwnerRef
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create a bootstrap cluster must match the Konvoy version used to create a workload cluster.
- Konvoy supports deploying one workload cluster.
- Konvoy generates a set of objects for one Node Pool.
- Konvoy does not validate edits to cluster objects.

Next, you can [Explore the New Cluster][explore-new-cluster].

[bootstrap]: ../bootstrap
[explore-new-cluster]: ../explore
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
