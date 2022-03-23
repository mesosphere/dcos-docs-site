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

    In vSphere it is critical that the name is unique, as no two clusters in the same vSphere account can have the same name.

1.  Set the environment variable:

    ```sh
    export CLUSTER_NAME=my-vsphere-cluster
    ```

## Create a new vSphere Kubernetes cluster

1. Use the following command to set the environment variables for vSphere:

   ```bash
   export VSPHERE_SERVER=example.vsphere.url
   export VSPHERE_USERNAME=user@example.vsphere.url
   export VSPHERE_PASSWORD=example_password
   ```

1.  Ensure your vSphere credentials are up-to-date, by refreshing the credentials with the command:

    ```bash
    dkp update bootstrap credentials vsphere
    ```

1.  Generate the Kubernetes cluster objects: %%% John, make these generic and note that the template is from a previous proc

    ```bash
    konvoy create cluster vsphere \
      --cluster-name vsphere-konvoy \
      --network VMs \
      --control-plane-endpoint-host 10.128.2.230 \
      --data-center dc1 \
      --data-store datastore1 \
      --folder cluster-api  \
      --server vcenter.ca1.ksphere-platform.d2iq.cloud \
      --ssh-authorized-key "<SSH_KEY>" \
      --resource-pool Users \
      --vm-template konvoy-ova-vsphere-rhel-84-1.21.6-1645833616
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

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/${CLUSTER_NAME} condition met
    ```

    The `READY` status becomes `True` after the cluster control-plane becomes ready in one of the following steps.

    After the objects are created on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines. As they progress, they update the Status of each object.

1. Run the DKP command to describe the current status of the cluster:

    ```bash
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```sh
    %%% need Vsphere specific output
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /vsphere-example                                                True                     35s
    ├─ClusterInfrastructure - AWSCluster/aws-example                True                     4m47s
    ├─ControlPlane - KubeadmControlPlane/aws-example-control-plane  True                     36s
    │   └─3 Machine...                                              True                     4m20s
    └─Workers
        └─MachineDeployment/aws-example-md-0
    ```

1.  As they progress, the controllers also create Events. You can list the Events using this command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AWSCluster"` and `kubectl get events --field-selector involvedObject.kind="AWSMachine"`.

    ```sh
    %%% need a (shorter?) vSphere specific output
    7m26s       Normal    SuccessfulSetNodeRef                            machine/aws-example-control-plane-2wb9q      ip-10-0-182-218.us-west-2.compute.internal
    11m         Normal    SuccessfulCreate                                awsmachine/aws-example-control-plane-vcjkr   Created new control-plane instance with id "i-0dde024e80ae3de7a"
    11m         Normal    SuccessfulAttachControlPlaneELB                 awsmachine/aws-example-control-plane-vcjkr   Control plane instance "i-0dde024e80ae3de7a" is registered with load balancer
    7m25s       Normal    SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/aws-example-control-plane-vcjkr   AWS Secret entries containing userdata deleted
    7m6s        Normal    FailedDescribeInstances                         awsmachinepool/aws-example-mp-0              No Auto Scaling Groups with aws-example-mp-0 found
    7m3s        Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: 
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of DKP Konvoy.</p>

- The Konvoy version used to create a bootstrap cluster must match the Konvoy version used to create a workload cluster.

- Konvoy supports deploying one workload cluster.

- Konvoy generates a set of objects for one Node Pool.

- Konvoy does not validate edits to cluster objects.

[bootstrap]: ../bootstrap
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
