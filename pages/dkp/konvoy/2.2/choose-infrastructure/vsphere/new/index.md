---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 60
excerpt: Use Konvoy to create a new Kubernetes cluster
enterprise: false
---

## Prerequisites

- Before you begin, make sure you have created a [Bootstrap][bootstrap] cluster.

## Name your cluster

1.  Give your cluster a unique name suitable for your environment.

1.  Set the CLUSTER_NAME environment variable with the command:

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

    ```bash
    konvoy create cluster vsphere \
      --cluster-name your-cluster-name \
      --network network-name \
      --control-plane-endpoint-host xxx.yyy.zzz.000 \
      --data-center data-ceneter-name \
      --data-store datastore-name \
      --folder folder-name  \
      --server vcenter-api-server-url \
      --ssh-authorized-key "<SSH_KEY>" \
      --resource-pool resource-pool-name \
      --vm-template template-name
    ```

<!--- 1.  (Optional) To configure the Control Plane and Worker nodes to use an HTTP proxy: %%% is this even possible in vSphere?

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

        A _Cluster_ object has references to the infrastructure-specific and control plane objects. Because this is a vSphere cluster, there is an object _%%% is there one? if so, what' it called?_ that describes the infrastructure-specific cluster properties. Here, this means the vSphere _%%% parm1, parm2, parm3, rule1, rule2, etc_ required by the Pod network implementation.

    1.  Control Plane

        A _KubeadmControlPlane_ object describes the control plane, which is the group of machines that run the Kubernetes control plane components, which include the etcd distributed database, the API server, the core controllers, and the scheduler. The object describes the configuration for these components. The object also has a reference to an infrastructure-specific object that describes the properties of all control plane machines. Here, it references an _vSphereMachineTemplate_ object, which describes _%%% thing1, thing2, and thing3_, among other properties.

    1.  Node Pool

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (for example, kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_, and a _vSphereMachineTemplate_ object, which describes _%%% thing 1, thing2, and thing3_, among other properties.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

1.  Create the cluster from the objects.

    ```bash
    kubectl apply -f ${CLUSTER_NAME}.yaml
    ```

    ```sh
    %%% need vSphere specific output
    cluster.cluster.x-k8s.io/aws-example created
    cluster.infrastructure.cluster.x-k8s.io/aws-example created
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/aws-example-control-plane created
    machinedeployment.cluster.x-k8s.io/aws-example-mp-0 created
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/aws-example-mp-0 created
    ``` --->

1.  Use the wait command to monitor the cluster control-plane readiness:

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
    %%% need Vsphere specific output
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /vsphere-example                                                True                     35s
    ├─ClusterInfrastructure - vSphereCluster/vsphere-example        True                     4m47s
    ├─ControlPlane - KubeadmControlPlane/vm-example-control-plane   True                     36s
    │   └─3 Machine...                                              True                     4m20s
    └─Workers
        └─MachineDeployment/vsphere-example-md-0
    ```

1.  As they progress, the controllers also create Events, which you can list using the command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, this example uses `grep`. You can also use separate commands to get Events for specific objects, such as `kubectl get events --field-selector involvedObject.kind="AWSCluster"` and `kubectl get events --field-selector involvedObject.kind="AWSMachine"`.

    ```sh
    %%% need a (shorter?) vSphere specific output
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of DKP Konvoy.</p>

- The DKP Konvoy version used to create a bootstrap cluster must match the DKP Konvoy version used to create a workload cluster.

- DKP Konvoy supports deploying one workload cluster.

- DKP Konvoy generates a set of objects for one Node Pool.

- DKP Konvoy does not validate edits to cluster objects.

[bootstrap]: ../bootstrap
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
