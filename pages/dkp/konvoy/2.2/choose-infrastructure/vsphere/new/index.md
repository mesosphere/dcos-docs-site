---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 60
excerpt: Use Konvoy to create a new Kubernetes cluster
enterprise: false
---

## Prerequisites

Before you begin, make sure you have created a [Bootstrap][bootstrap] cluster.

## Name your cluster

1.  Give your cluster a unique name suitable for your environment.

1.  Set the `CLUSTER_NAME` environment variable with the command:

    ```bash
    export CLUSTER_NAME=my-vsphere-cluster
    ```

## Create a new vSphere Kubernetes cluster

1.  Use the following command to set the environment variables for vSphere:

    ```bash
    export VSPHERE_SERVER=example.vsphere.url
    export VSPHERE_USERNAME=user@example.vsphere.url
    export VSPHERE_PASSWORD=example_password
    ```

1.  Ensure your vSphere credentials are up-to-date by refreshing the credentials with the command:

    ```bash
    dkp update bootstrap credentials vsphere
    ```

1.  Generate the Kubernetes cluster objects by copying and editing this command to include the correct values, including the VM template name you assigned in the previous procedure:

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Docker Hub's rate limit</a> use your Docker Hub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

    ```bash
    dkp create cluster vsphere \
      --cluster-name ${CLUSTER_NAME} \
      --network <NETWORK_NAME> \
      --control-plane-endpoint-host <xxx.yyy.zzz.000> \
      --data-center <DATACENTER_NAME> \
      --data-store <DATASTORE_NAME> \
      --folder <FOLDER_NAME> \
      --server <VCENTER_API_SERVER_UTR> \
      --ssh-public-key-file <SSH_PUBLIC_KEY_FILE> \
      --resource-pool <RESOURE_POOL_NAME> \
      --virtual-ip-interface <NETWORK_INTERFACE> \
      --vm-template <TEMPLATE_NAME>
    ```

1.  (Optional) To configure the Control Plane and Worker nodes to use an HTTP proxy:

    ```bash
    export CONTROL_PLANE_HTTP_PROXY=http://example.org:8080
    export CONTROL_PLANE_HTTPS_PROXY=http://example.org:8080
    export CONTROL_PLANE_NO_PROXY="example.org,example.com,example.net,localhost,127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,169.254.169.254,.elb.amazonaws.com"

    export WORKER_HTTP_PROXY=http://example.org:8080
    export WORKER_HTTPS_PROXY=http://example.org:8080
    export WORKER_NO_PROXY="example.org,example.com,example.net,localhost,127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,169.254.169.254,.elb.amazonaws.com"
    ```

    - Replace `example.org,example.com,example.net` with you internal addresses
    - `localhost` and `127.0.0.1` addresses should not use the proxy
    - `10.96.0.0/12` is the default Kubernetes service subnet
    - `192.168.0.0/16` is the default Kubernetes pod subnet
    - `kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local` is the internal Kubernetes kube-apiserver service
    - `.svc,.svc.cluster,.svc.cluster.local` is the internal Kubernetes services
    - `169.254.169.254` is the AWS metadata server
    - `.elb.amazonaws.com` is for the worker nodes to allow them to communicate directly to the kube-apiserver ELB

1.  (Optional) Create a Kubernetes cluster with HTTP proxy configured. This step assumes you did not already create a cluster in the previous steps:

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Docker Hub's rate limit</a> use your Docker Hub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

    ```bash
    dkp create cluster vsphere --cluster-name=${CLUSTER_NAME} \
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

        A _Cluster_ object has references to the infrastructure-specific and control plane objects. Because this is a vSphere cluster, there is an object that describes the infrastructure-specific cluster properties.

    1.  Control Plane

        A _KubeadmControlPlane_ object describes the control plane, which is the group of machines that run the Kubernetes control plane components, which include the etcd distributed database, the API server, the core controllers, and the scheduler. The object describes the configuration for these components. The object also has a reference to an infrastructure-specific object that describes the properties of all control plane machines. Here, it references an _vSphereMachineTemplate_ object.

    1.  Node Pool

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (for example, kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_, and a _vSphereMachineTemplate_ object.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

1.  Create the cluster from the objects.

    ```bash
    kubectl create -f ${CLUSTER_NAME}.yaml
    ```

    ```sh
    cluster.cluster.x-k8s.io/vsphere-example created
    cluster.infrastructure.cluster.x-k8s.io/vsphere-example created
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/vsphere-example-control-plane created
    machinedeployment.cluster.x-k8s.io/vsphere-example-mp-0 created
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/vsphere-example-mp-0 created
    ```

1.  Use the `wait` command to monitor the cluster control-plane readiness:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/${CLUSTER_NAME} condition met
    ```

    The `READY` status becomes `True` after the cluster control-plane becomes Ready in one of the following steps.

    After DKP creates the objects on the API server, the Cluster API controllers reconcile them, creating infrastructure and machines. As the controllers progress, they update the Status of each object.

1.  Run the DKP describe command to monitor the current status of the cluster:

    ```bash
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                                READY  SEVERITY  REASON  SINCE  MESSAGE
    Cluster/d2iq-e2e-cluster_name-1                                     True                     13h
    ├─ClusterInfrastructure - VSphereCluster/d2iq-e2e-cluster_name-1    True                     13h
    ├─ControlPlane - KubeadmControlPlane/d2iq-control-plane             True                     13h
    │ ├─Machine/d2iq--control-plane-7llgd                               True                     13h
    │ ├─Machine/d2iq--control-plane-vncbl                               True                     13h
    │ └─Machine/d2iq--control-plane-wbgrm                               True                     13h
    └─Workers
        └─MachineDeployment/d2iq--md-0                                  True                     13h
        ├─Machine/d2iq--md-0-74c849dc8c-67rv4                           True                     13h
        ├─Machine/d2iq--md-0-74c849dc8c-n2skc                           True                     13h
        ├─Machine/d2iq--md-0-74c849dc8c-nkftv                           True                     13h
        └─Machine/d2iq--md-0-74c849dc8c-sqklv                           True                     13h
    ```

1.  Check all machines has `NODE_NAME` assigned

    ```bash
    kubectl get machines
    ```

    The output appears similar to the following:

    ```sh
    NAME                                       CLUSTER              NODENAME                                       PROVIDERID                                       PHASE     AGE   VERSION
    d2iq-e2e-cluster-1-control-plane-7llgd     d2iq-e2e-cluster-1   d2iq-e2e-cluster-1-control-plane-7llgd     vsphere://421638e2-e776-9af6-f683-5e105de5da5a   Running   13h   v1.23.7
    d2iq-e2e-cluster-1-control-plane-vncbl     d2iq-e2e-cluster-1   d2iq-e2e-cluster-1-control-plane-vncbl     vsphere://42168835-7fef-95c4-3652-ebcad3e10d36   Running   13h   v1.23.7
    d2iq-e2e-cluster-1-control-plane-wbgrm     d2iq-e2e-cluster-1   d2iq-e2e-cluster-1-control-plane-wbgrm     vsphere://421642df-afc4-b6c2-9e61-5b86e7c37eac   Running   13h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-67rv4   d2iq-e2e-cluster-1   d2iq-e2e-cluster-1-md-0-74c849dc8c-67rv4   vsphere://4216f467-8483-73cb-a8b6-8d6a4a71e4b4   Running   14h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-n2skc   d2iq-e2e-cluster-1   d2iq-e2e-cluster-1-md-0-74c849dc8c-n2skc   vsphere://42161cde-9904-4dd2-7a3e-cdfc7655f090   Running   14h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-nkftv   d2iq-e2e-cluster-1   d2iq-e2e-cluster-1-md-0-74c849dc8c-nkftv   vsphere://42163a0d-eb8d-b5a6-82d5-188e24817c00   Running   14h   v1.23.7
    d2iq-e2e-cluster-1-md-0-74c849dc8c-sqklv   d2iq-e2e-cluster-1   d2iq-e2e-cluster-1-md-0-74c849dc8c-sqklv   vsphere://42161dff-92a5-6da9-7ac1-e987e2c8fed2   Running   14h   v1.23.7
    ```

1.  Verify that the kubeadm control plane is ready with the command

     ```bash
    kubectl get kubeadmcontrolplane
    ```

    The output appears similar to the following:

    ```sh
    NAME                               CLUSTER              INITIALIZED   API SERVER AVAILABLE   REPLICAS   READY   UPDATED   UNAVAILABLE   AGE   VERSION
    d2iq-e2e-cluster-1-control-plane   d2iq-e2e-cluster-1   true          true                   3          3       3         0             14h   v1.23.7
    ```

1.  Describe the kubeadm control plane and check its status and events with the command:

    ```bash
    kubectl describe kubeadmcontrolplane
    ```

1.  As they progress, the controllers also create Events, which you can list using the command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, this example uses `grep`. You can also use separate commands to get Events for specific objects, such as `kubectl get events --field-selector involvedObject.kind="VSphereCluster"` and `kubectl get events --field-selector involvedObject.kind="VSphereMachine"`.

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of DKP Konvoy.</p>

-   The DKP Konvoy version used to create a bootstrap cluster must match the DKP Konvoy version used to create a workload cluster.

-   DKP Konvoy supports deploying one workload cluster.

-   DKP Konvoy generates a set of objects for one Node Pool.

-   DKP Konvoy does not validate edits to cluster objects.

Next, [explore your cluster][explore-cluster] and create your kubeconfig.

[bootstrap]: ../bootstrap
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[explore-cluster]: ../explore
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[make-self-manage]: ../self-managed/
