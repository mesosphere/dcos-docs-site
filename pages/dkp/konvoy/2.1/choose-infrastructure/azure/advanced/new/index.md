---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 20
excerpt: Use Konvoy to create a new Kubernetes cluster
enterprise: false
---

Several small procedures work together to create a new Azure Kubernetes cluster. Be sure to read each one carefully, as some are optional. The basic process is:

1.  Satisfy the [prerequisites](../new#prerequisites).

1.  [Name your cluster](../new#name-your-cluster).

1.  [Create new Azure Kubernetes cluster objects](../new#create-new-azure-kubernetes-cluster-objects).

1.  [Inspect and edit the cluster objects](../new#inspect-or-edit-the-cluster-objects)

    Editing the objects allows you to use the optional procedures for:

    - Specifying an HTTP proxy
    - Configuring the cluster to use existing network infrastructure

1.  [Create the actual Azure Kubernetes cluster](../new#create-the-actual-azure-kubernetes-cluster)

Be sure also that you review the [known limitations section](../new#known-limitations)

## Prerequisites

- Before you begin, make sure you have created a [Bootstrap][bootstrap] cluster.

## Name your cluster

1.  Give your cluster a unique name suitable for your environment.

1.  Set the environment variable:

    ```sh
    CLUSTER_NAME=my-azure-cluster
    ```

### Naming Tips and Tricks

1.  To create a cluster name that is unique, use the following command:

    ```sh
    CLUSTER_NAME=$(whoami)-azure-cluster-$(LC_CTYPE=C tr -dc 'a-z0-9' </dev/urandom | fold -w 5 | head -n1)
    echo $CLUSTER_NAME
    ```

    The output appears similar to:

    ```text
    hunter-azure-cluster-pf4a3
    ```

    This command creates a unique name every time you run it, so use it carefully.

1.  Set the environment variable to the name you assigned this cluster:

    ```sh
    CLUSTER_NAME=my-azure-cluster
    ```

## Create new Azure Kubernetes cluster objects

This procedure uses the `--dry-run` and `--output-yaml` flags together to create basic Azure Kubernetes cluster objects in a YAML file. This approach allows you to examine the YAML objects before creating the actual Azure Kubernetes cluster itself.

When creating the basic Azure Kubernetes cluster objects, you need to first consider whether you need to use an HTTP proxy.  If you do, you need to do some additional configuration when creating the cluster objects. Consult the optional "Configure the control plane and workers to use an HTTP Proxy" section for more details.

1.  Generate the basic Kubernetes cluster objects:

    ```sh
    dkp create cluster azure --cluster-name=${CLUSTER_NAME} \
    --dry-run \
    --output=yaml \
    > ${CLUSTER_NAME}.yaml
    ```

The output of this command is a `${CLUSTER_NAME}.yaml` file that you can examine or modify. If you use this method to create a basic cluster without HTTP proxies, skip to the heading, "Inspect or edit the cluster objects."

## (Optional) Configure the control plane and workers to use an HTTP Proxy

To configure the Control Plane and Worker nodes to use an HTTP proxy:

1.  Copy the commands in the following code block to an editor and apply the list of edits that follows to customize them, then execute them from the command line:

    ```sh
    export CONTROL_PLANE_HTTP_PROXY=http://example.org:8080
    export CONTROL_PLANE_HTTPS_PROXY=http://example.org:8080
    export CONTROL_PLANE_NO_PROXY="example.org,example.com,example.net,localhost,127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,169.254.169.254,.cloudapp.azure.com"

    export WORKER_HTTP_PROXY=http://example.org:8080
    export WORKER_HTTPS_PROXY=http://example.org:8080
    export WORKER_NO_PROXY="example.org,example.com,example.net,localhost,127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,169.254.169.254,.cloudapp.azure.com"
    ```

    - Replace `example.org,example.com,example.net` with your internal addresses
    - `localhost` and `127.0.0.1` addresses should not use the proxy
    - `10.96.0.0/12` is the default Kubernetes service subnet
    - `192.168.0.0/16` is the default Kubernetes pod subnet
    - `kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local` is the internal Kubernetes kube-apiserver service
    - `.svc,.svc.cluster,.svc.cluster.local` is the internal Kubernetes services
    - `169.254.169.254` is the Azure metadata server
    - `.cloudapp.azure.com` allows the worker nodes to communicate directly to the kube-apiserver load balancer

1.  Copy and run the following command to create a Kubernetes cluster with HTTP proxy configured. (This step assumes you did not already create a cluster in the previous procedure.)

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

The output of this command is a `${CLUSTER_NAME}.yaml` file that you can examine or modify further.

## Inspect or edit the cluster objects

1.  Inspect or edit the cluster objects:

    <p class="message--note"><strong>NOTE: </strong>Familiarize yourself with [Cluster API][capi_book] before editing the cluster objects as edits may prevent the cluster from deploying successfully.</p>

    The objects are [Custom Resources][k8s_custom_resources] defined by Cluster API components, and they belong in three different categories:

    1.  Cluster

        A _Cluster_ object has references to the infrastructure-specific and control plane objects. Because this is an Azure cluster, there is an _AzureCluster_ object that describes the infrastructure-specific cluster properties. Here, this means the Azure region, the VPC ID, subnet IDs, and security group rules required by the Pod network implementation.

    1.  Control Plane

        A _KubeadmControlPlane_ object describes the control plane, which is the group of machines that run the Kubernetes control plane components, which include the etcd distributed database, the API server, the core controllers, and the scheduler. The object describes the configuration for these components. The object also has a reference to an infrastructure-specific object that describes the properties of all control plane machines. Here, it references an _AzureMachineTemplate_ object, which describes the instance type, the type of disk used, and the size of the disk, among other properties.

    1.  Node Pool

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (for example, the kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_, and an _AzureMachineTemplate_ object, which describes the instance type, the type of disk used, the size of the disk, among other properties.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

## (Optional) Configure existing network infrastructure in the cluster

As part of inspecting and editing your cluster objects, you can also configure it to use existing network infrastructure. If you do not need to use an existing network infrastructure, you can skip this step.

1.  Review the following AzureCluster excerpt, noting the entries under `networkSpec` for the apiServerLB, nodeOutboundLB, subnets, and vnet values:

    ```yaml
    ---
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha4
    kind: AzureCluster
    metadata:
      creationTimestamp: "2021-12-17T20:25:12Z"
      generation: 1
      name: my-azure-cluster
      namespace: default
      uid: 64851501-f658-4b40-84a7-6a9f7c871629
    spec:
      additionalTags:
        konvoy.d2iq.io_cluster-name: my-azure-cluster
        konvoy.d2iq.io_version: v2.1.0
      azureEnvironment: AzurePublicCloud
      bastionSpec: {}
      controlPlaneEndpoint:
        host: ""
        port: 0
      location: westus
      networkSpec:
        apiServerLB:
          frontendIPs:
          - name: my-azure-cluster-public-lb-frontEnd
            publicIP:
              name: pip-my-azure-cluster-apiserver
          idleTimeoutInMinutes: 4
          name: my-azure-cluster-public-lb
          sku: Standard
          type: Public
        nodeOutboundLB:
          frontendIPs:
          - name: my-azure-cluster-frontEnd
            publicIP:
              name: pip-my-azure-cluster-node-outbound
          frontendIPsCount: 1
          idleTimeoutInMinutes: 4
          name: my-azure-cluster
          sku: Standard
          type: Public
        subnets:
        - cidrBlocks:
          - 10.0.0.0/16
          name: my-azure-cluster-controlplane-subnet
          natGateway:
            ip:
              name: ""
          role: control-plane
          routeTable: {}
          securityGroup:
            name: my-azure-cluster-controlplane-nsg
        - cidrBlocks:
          - 10.1.0.0/16
          name: my-azure-cluster-node-subnet
          natGateway:
            ip:
              name: ""
          role: node
          routeTable:
            name: my-azure-cluster-node-routetable
          securityGroup:
            name: my-azure-cluster-node-nsg
        vnet:
          cidrBlocks:
          - 10.0.0.0/8
          name: my-azure-cluster-vnet
          resourceGroup: my-azure-cluster
      resourceGroup: my-azure-cluster
    ```

    After you make and verify changes in these areas, save the file and go to the "create the actual cluster" procedure.

## Create the actual Azure Kubernetes cluster

Use this procedure to create the Azure Kubernetes cluster when you finish your inspection and edits.

1.  Create the cluster from the generated, and any modified, YAML objects using the command:

    ```sh
    kubectl apply -f ${CLUSTER_NAME}.yaml
    ```

    The output appears similar to:

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

1.  Wait for the cluster's control-plane Status to be Ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    When the control plane status is Ready, the output is similar to:

    ```text
    cluster.cluster.x-k8s.io/my-azure-cluster condition met
    ```

    After DKP creates the objects on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines, and as they progress, they update the Status of each object.

1.  Run the DKP Konvoy command to describe the current status of the cluster:

    ```sh
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    The output is similar to:

    ```text
    NAME                                                                 READY  SEVERITY  REASON  SINCE  MESSAGE
    /my-azure-cluster                                                    True                     6m37s
    ├─ClusterInfrastructure - AzureCluster/my-azure-cluster              True                     13m
    ├─ControlPlane - KubeadmControlPlane/my-azure-cluster-control-plane  True                     6m37s
    │ └─3 Machines...                                                    True                     10m    See my-azure-cluster-control-plane-bmc9b, my-azure-cluster-control-plane-msftd, ...
    └─Workers
    └─MachineDeployment/my-azure-cluster-md-0                            True                     7m58s
    └─4 Machines...                                                      True                     8m10s  See my-azure-cluster-md-0-84bd8b5f5b-b8cnq, my-azure-cluster-md-0-84bd8b5f5b-j8ldg, ...
    ```

1.  As they progress, the controllers also create Events. List the Events using the command:

    ```sh
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example command also uses `grep`. You can use separate commands to get Events for specific objects, for example, `kubectl get events --field-selector involvedObject.kind="AzureCluster"` and `kubectl get events --field-selector involvedObject.kind="AzureMachine"`.

    The output is similar to:

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
[capi_book]: https://cluster-api.sigs.k8s.io/
