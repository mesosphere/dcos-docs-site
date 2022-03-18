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
    cluster.cluster.x-k8s.io/eks-example created
    awsmanagedcontrolplane.controlplane.cluster.x-k8s.io/eks-example-control-plane created
    clusterresourceset.addons.cluster.x-k8s.io/calico-installation-eks-example created
    configmap/calico-cni-eks-example created
    machinedeployment.cluster.x-k8s.io/eks-example-md-0 created
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/eks-example-md-0 created
    eksconfigtemplate.bootstrap.cluster.x-k8s.io/eks-example-md-0 created
    ```

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/eks-example condition met
    ```

    The `READY` status will become `True` after the cluster control-plane becomes ready in one of the following steps.

1.  Once the objects are created on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines. As they progress, they update the Status of each object. Konvoy provides a command to describe the current status of the cluster:

    ```bash
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```text
    NAME                                                                  READY  SEVERITY  REASON  SINCE  MESSAGE
    /eks-example                                                          True                     9m4s
    ├─ControlPlane - AWSManagedControlPlane/eks-example-control-plane     True                     9m4s
    └─Workers
      └─MachineDeployment/eks-example-md-0                                True                     7m39s
        └─4 Machines...                                                   True                     8m24s
    ```

1.  As they progress, the controllers also create Events. List the Events using this command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AWSCluster"` and `kubectl get events --field-selector involvedObject.kind="AWSMachine"`.

    ```sh
    24m         Normal   SuccessfulCreateVPC                             awsmanagedcontrolplane/eks-example-control-plane   Created new managed VPC "vpc-0d5f41c645c7c6b98"
    24m         Normal   SuccessfulSetVPCAttributes                      awsmanagedcontrolplane/eks-example-control-plane   Set managed VPC attributes for "vpc-0d5f41c645c7c6b98"
    24m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-08d795f7f61b4c45c"
    24m         Normal   SuccessfulModifySubnetAttributes                awsmanagedcontrolplane/eks-example-control-plane   Modified managed Subnet "subnet-08d795f7f61b4c45c" attributes
    24m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-025b963cb7b3c42b9"
    24m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-0bea7db9735b647af"
    24m         Normal   SuccessfulModifySubnetAttributes                awsmanagedcontrolplane/eks-example-control-plane   Modified managed Subnet "subnet-0bea7db9735b647af" attributes
    24m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-0025d52a41d9ca901"
    24m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-02b7d46fbb044e2f1"
    24m         Normal   SuccessfulModifySubnetAttributes                awsmanagedcontrolplane/eks-example-control-plane   Modified managed Subnet "subnet-02b7d46fbb044e2f1" attributes
    24m         Normal   SuccessfulCreateSubnet                          awsmanagedcontrolplane/eks-example-control-plane   Created new managed Subnet "subnet-031ff53aae8da27ab"
    24m         Normal   SuccessfulCreateInternetGateway                 awsmanagedcontrolplane/eks-example-control-plane   Created new managed Internet Gateway "igw-03993e04cee3fc57b"
    24m         Normal   SuccessfulAttachInternetGateway                 awsmanagedcontrolplane/eks-example-control-plane   Internet Gateway "igw-03993e04cee3fc57b" attached to VPC "vpc-0d5f41c645c7c6b98"
    24m         Normal   SuccessfulCreateNATGateway                      awsmanagedcontrolplane/eks-example-control-plane   Created new NAT Gateway "nat-07b1bf537aac56688"
    24m         Normal   SuccessfulCreateNATGateway                      awsmanagedcontrolplane/eks-example-control-plane   Created new NAT Gateway "nat-0677e665b2019c726"
    24m         Normal   SuccessfulCreateNATGateway                      awsmanagedcontrolplane/eks-example-control-plane   Created new NAT Gateway "nat-0afd0e1fea275d3b0"
    22m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-050db62d744a8d614"
    22m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    22m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-050db62d744a8d614" with subnet "subnet-08d795f7f61b4c45c"
    22m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-01650d4aa0551f70c"
    22m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    22m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-01650d4aa0551f70c" with subnet "subnet-025b963cb7b3c42b9"
    22m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-04e91e2d7688e3a47"
    22m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    22m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-04e91e2d7688e3a47" with subnet "subnet-0bea7db9735b647af"
    22m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-0f4bb2cb4e3da7515"
    22m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    22m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-0f4bb2cb4e3da7515" with subnet "subnet-0025d52a41d9ca901"
    22m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-03af4834c7c8c2d5f"
    22m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    22m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-03af4834c7c8c2d5f" with subnet "subnet-02b7d46fbb044e2f1"
    22m         Normal   SuccessfulCreateRouteTable                      awsmanagedcontrolplane/eks-example-control-plane   Created managed RouteTable "rtb-049093fd28c082deb"
    22m         Normal   SuccessfulCreateRoute                           awsmanagedcontrolplane/eks-example-control-plane   Created route {...
    22m         Normal   SuccessfulAssociateRouteTable                   awsmanagedcontrolplane/eks-example-control-plane   Associated managed RouteTable "rtb-049093fd28c082deb" with subnet "subnet-031ff53aae8da27ab"
    22m         Normal   SuccessfulCreateSecurityGroup                   awsmanagedcontrolplane/eks-example-control-plane   Created managed SecurityGroup "sg-0d668ab6a67b5f806" for Role "bastion"
    22m         Normal   SuccessfulCreateSecurityGroup                   awsmanagedcontrolplane/eks-example-control-plane   Created managed SecurityGroup "sg-09c050536025c517f" for Role "node-eks-additional"
    22m         Normal   SuccessfulAuthorizeSecurityGroupIngressRules    awsmanagedcontrolplane/eks-example-control-plane   Authorized security group ingress rules [{SSH tcp 22 22 [0.0.0.0/0] []}] for SecurityGroup "sg-0d668ab6a67b5f806"
    22m         Normal   SuccessfulAuthorizeSecurityGroupIngressRules    awsmanagedcontrolplane/eks-example-control-plane   Authorized security group ingress rules [{SSH tcp 22 22 [] [sg-0d668ab6a67b5f806]}] for SecurityGroup "sg-09c050536025c517f"
    22m         Normal   InitiatedCreateEKSControlPlane                  awsmanagedcontrolplane/eks-example-control-plane   Initiated creation of a new EKS control plane default_eks-example-control-plane
    10m         Normal   SuccessfulCreateEKSControlPlane                 awsmanagedcontrolplane/eks-example-control-plane   Created new EKS control plane default_eks-example-control-plane
    10m         Normal   SucessfulCreateKubeconfig                       awsmanagedcontrolplane/eks-example-control-plane   Created kubeconfig for cluster "eks-example"
    10m         Normal   SucessfulCreateUserKubeconfig                   awsmanagedcontrolplane/eks-example-control-plane   Created user kubeconfig for cluster "eks-example"
    10m         Normal   DeletedVPCCNI                                   awsmanagedcontrolplane/eks-example-control-plane   The AWS VPC CNI has been removed from the cluster. Ensure you enable a CNI via another mechanism
    9m41s       Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-6645677545-5drlr          ip-10-0-94-48.us-west-2.compute.internal
    9m41s       Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-6645677545-g9ngw          ip-10-0-117-5.us-west-2.compute.internal
    9m45s       Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-6645677545-klpm9          ip-10-0-81-221.us-west-2.compute.internal
    9m50s       Normal   SuccessfulSetNodeRef                            machine/eks-example-md-0-6645677545-ldcrj          ip-10-0-115-179.us-west-2.compute.internal
    24m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-6645677545             Created machine "eks-example-md-0-6645677545-5drlr"
    24m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-6645677545             Created machine "eks-example-md-0-6645677545-g9ngw"
    24m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-6645677545             Created machine "eks-example-md-0-6645677545-ldcrj"
    24m         Normal   SuccessfulCreate                                machineset/eks-example-md-0-6645677545             Created machine "eks-example-md-0-6645677545-klpm9"
    10m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-sq4q9                  Created new node instance with id "i-0074f255b40d0374a"
    9m41s       Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-sq4q9                  AWS Secret entries containing userdata deleted
    10m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-tbv7c                  Created new node instance with id "i-0064878f89bd2a521"
    9m45s       Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-tbv7c                  AWS Secret entries containing userdata deleted
    10m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-zrgg2                  Created new node instance with id "i-07fb4ba5103e4d6ef"
    9m41s       Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-zrgg2                  AWS Secret entries containing userdata deleted
    10m         Normal   SuccessfulCreate                                awsmachine/eks-example-md-0-zw56b                  Created new node instance with id "i-0ced4184741b7ded6"
    9m49s       Normal   SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/eks-example-md-0-zw56b                  AWS Secret entries containing userdata deleted
    24m         Normal   SuccessfulCreate                                machinedeployment/eks-example-md-0                 Created MachineSet "eks-example-md-0-6645677545"

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
