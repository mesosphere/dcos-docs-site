---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 20
excerpt: Use Konvoy to create a new Kubernetes cluster
enterprise: false
---

Before you start, make sure you have completed the steps in [Bootstrap][bootstrap].

## Create a new AWS Kubernetes cluster

1.  Set the environment variable to the name you assigned this cluster.

    ```bash
    export CLUSTER_NAME=eks-example
    ```

    See [Get Started with EKS](../../quick-start) for information on naming your cluster.

1.  Make sure your AWS credentials are up to date. Refresh the credentials using this command:

    ```bash
    dkp update bootstrap credentials aws
    ```

1.  Inspect or edit the cluster objects:

    Use your favorite editor.

    <p class="message--note"><strong>NOTE: </strong>Editing the cluster objects requires some understanding of Cluster API. Edits can prevent the cluster from deploying successfully.</p>

    The objects are [Custom Resources][k8s_custom_resources] defined by Cluster API components, and they belong in three different categories:

    1.  Cluster

        A _Cluster_ object has references to the infrastructure-specific and control plane objects. Because this is an AWS cluster, there is an _AWSCluster_ object that describes the infrastructure-specific cluster properties. Here, this means the AWS region, the VPC ID, subnet IDs, and security group rules required by the Pod network implementation.

    1.  Control Plane

        A _AWSManagedControlPlane_ object describes the control plane, which is the group of machines that run the Kubernetes control plane components, which include the etcd distributed database, the API server, the core controllers, and the scheduler. The object describes the configuration for these components. The object also has a reference to an infrastructure-specific object that describes the properties of all control plane machines.

    1.  Node Pool

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (for example, kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_, and an _AWSMachineTemplate_ object, which describes the instance type, the type of disk used, the size of the disk, among other properties.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

1.  Create the cluster from the objects.

    ```bash
    dkp create cluster eks --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

    ```sh
    Generating cluster resources
    cluster.cluster.x-k8s.io/eks-example created
    awsmanagedcontrolplane.controlplane.cluster.x-k8s.io/eks-example-control-plane created
    machinedeployment.cluster.x-k8s.io/eks-example-md-0 created
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/eks-example-md-0 created
    eksconfigtemplate.bootstrap.cluster.x-k8s.io/eks-example-md-0 created
    clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-eks-example created
    configmap/calico-cni-installation-eks-example created
    configmap/tigera-operator-eks-example created
    clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-eks-example created
    configmap/cluster-autoscaler-eks-example created
    clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-eks-example created
    configmap/node-feature-discovery-eks-example created
    clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-eks-example created
    configmap/nvidia-feature-discovery-eks-example created
    ```

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/eks-example condition met
    ```

    The `READY` status will become `True` after the cluster control-plane becomes ready.

1.  You can also check to see if the cluster's machine deployment is ready:

    ```bash
    kubectl wait --for=condition=Ready "machinedeployment/${CLUSTER_NAME}-md-0" --timeout=20m
    ```

    ```sh
    machinedeployment.cluster.x-k8s.io/eks-example-md-0 condition met
    ```

1.  Once the objects are created on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines. As they progress, they update the Status of each object. Konvoy provides a command to describe the current status of the cluster:

    ```bash
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```sh
    NAME                                                               READY  SEVERITY  REASON  SINCE  MESSAGE
    Cluster/eks-example                                                True                     10m
    ├─ControlPlane - AWSManagedControlPlane/eks-example-control-plane  True                     10m
    └─Workers
      └─MachineDeployment/eks-example-md-0                             True                     26s
        ├─Machine/eks-example-md-0-78fcd7c7b7-66ntt                    True                     84s
        ├─Machine/eks-example-md-0-78fcd7c7b7-b9qmc                    True                     84s
        ├─Machine/eks-example-md-0-78fcd7c7b7-v5vfq                    True                     84s
        └─Machine/eks-example-md-0-78fcd7c7b7-zl6m2                    True                     84s
    ```

1.  As they progress, the controllers also create Events. List the Events using this command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AWSCluster"` and `kubectl get events --field-selector involvedObject.kind="AWSMachine"`.

    ```sh
    46m         Normal   SuccessfulCreateVPC                             awsmanagedcontrolplane/eks-example-control-plane   Created new managed VPC "vpc-05e775702092abf09"
    46m         Normal   SuccessfulSetVPCAttributes                      awsmanagedcontrolplane/eks-example-control-plane   Set managed VPC attributes for "vpc-05e775702092abf09"
    46m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-0419dd3f2dfd95ff8"
    46m         Normal   SuccessfulModifySubnetAttributes                awsmanagedcontrolplane/eks-example-control-plane   Modified managed Subnet "subnet-0419dd3f2dfd95ff8" attributes
    46m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-0e724b128e3113e47"
    46m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-06b2b31ea6a8d3962"
    46m         Normal   SuccessfulModifySubnetAttributes                awsmanagedcontrolplane/eks-example-control-plane   Modified managed Subnet "subnet-06b2b31ea6a8d3962" attributes
    46m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-0626ce238be32bf98"
    46m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-0f53cf59f83177800"
    46m         Normal   SuccessfulModifySubnetAttributes                awsmanagedcontrolplane/eks-example-control-plane   Modified managed Subnet "subnet-0f53cf59f83177800" attributes
    46m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-0878478f6bbf153b2"
    46m         Normal   SuccessfulCreateInternetGateway                 awsmanagedcontrolplane/eks-example-control-plane   Created new managed Internet Gateway "igw-09fb52653949d4579"
    46m         Normal   SuccessfulAttachInternetGateway                 awsmanagedcontrolplane/eks-example-control-plane   Internet Gateway "igw-09fb52653949d4579" attached to VPC "vpc-05e775702092abf09"
    46m         Normal   SuccessfulCreateNATGateway                      awsmanagedcontrolplane/eks-example-control-plane   Created new NAT Gateway "nat-06356aac28079952d"
    46m         Normal   SuccessfulCreateNATGateway                      awsmanagedcontrolplane/eks-example-control-plane   Created new NAT Gateway "nat-0429d1cd9d956bf35"
    46m         Normal   SuccessfulCreateNATGateway                      awsmanagedcontrolplane/eks-example-control-plane   Created new NAT Gateway "nat-059246bcc9d4e88e7"
    46m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-01689c719c484fd3c"
    46m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    46m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-01689c719c484fd3c" with subnet "subnet-0419dd3f2dfd95ff8"
    46m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-065af81b9752eeb69"
    46m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    46m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-065af81b9752eeb69" with subnet "subnet-0e724b128e3113e47"
    46m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-03eeff810a89afc98"
    46m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    46m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-03eeff810a89afc98" with subnet "subnet-06b2b31ea6a8d3962"
    46m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-0fab36f8751fdee73"
    46m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    46m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-0fab36f8751fdee73" with subnet "subnet-0626ce238be32bf98"
    46m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-0e5c9c7bbc3740a0f"
    46m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    46m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-0e5c9c7bbc3740a0f" with subnet "subnet-0f53cf59f83177800"
    46m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-0bf58eb5f73c387af"
    46m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    46m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-0bf58eb5f73c387af" with subnet "subnet-0878478f6bbf153b2"
    46m         Normal   SuccessfulCreateSecurityGroup                   awsmanagedcontrolplane/eks-example-control-plane   Created managed SecurityGroup "sg-0b045c998a120a1b2" for Role "node-eks-additional"
    46m         Normal   InitiatedCreateEKSControlPlane                  awsmanagedcontrolplane/eks-example-control-plane   Initiated creation of a new EKS control plane default_eks-example-control-plane
    37m         Normal   SuccessfulCreateEKSControlPlane                 awsmanagedcontrolplane/eks-example-control-plane   Created new EKS control plane default_eks-example-control-plane
    37m         Normal   SucessfulCreateKubeconfig                       awsmanagedcontrolplane/eks-example-control-plane   Created kubeconfig for cluster "eks-example"
    37m         Normal   SucessfulCreateUserKubeconfig                   awsmanagedcontrolplane/eks-example-control-plane   Created user kubeconfig for cluster "eks-example"
    27m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-4t9nc                  Created new node instance with id "i-0aecc1897c93df740"
    26m         Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-4t9nc                  AWS Secret entries containing userdata deleted
    26m         Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-78fcd7c7b7-fn7x9          ip-10-0-88-24.us-west-2.compute.internal
    26m         Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-78fcd7c7b7-g64nv          ip-10-0-110-219.us-west-2.compute.internal
    26m         Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-78fcd7c7b7-gwc5j          ip-10-0-101-161.us-west-2.compute.internal
    26m         Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-78fcd7c7b7-j58s4          ip-10-0-127-49.us-west-2.compute.internal
    46m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-78fcd7c7b7             Created machine "eks-example-md-0-78fcd7c7b7-fn7x9"
    46m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-78fcd7c7b7             Created machine "eks-example-md-0-78fcd7c7b7-g64nv"
    46m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-78fcd7c7b7             Created machine "eks-example-md-0-78fcd7c7b7-j58s4"
    46m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-78fcd7c7b7             Created machine "eks-example-md-0-78fcd7c7b7-gwc5j"
    27m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-7whkv                  Created new node instance with id "i-06dfc0466b8f26695"
    26m         Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-7whkv                  AWS Secret entries containing userdata deleted
    27m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-ttgzv                  Created new node instance with id "i-0544fce0350fd41fb"
    26m         Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-ttgzv                  AWS Secret entries containing userdata deleted
    27m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-v2hrf                  Created new node instance with id "i-0498906edde162e59"
    26m         Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-v2hrf                  AWS Secret entries containing userdata deleted
    46m         Normal   SuccessfulCreate                                machinedeployment/eks-example-md-0                 Created MachineSet "eks-example-md-0-78fcd7c7b7"
    ```

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The Konvoy version used to create a bootstrap cluster must match the Konvoy version used to create a workload cluster.
- Konvoy supports deploying one workload cluster.
- Konvoy generates a set of objects for one Node Pool.
- Konvoy does not validate edits to cluster objects.

[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[bootstrap]: ../bootstrap
