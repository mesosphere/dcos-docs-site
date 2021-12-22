---
layout: layout.pug
navigationTitle: Create a New AKS Cluster
title: Create a New AKS Cluster
menuWeight: 20
excerpt: Use Konvoy to create a new AKS cluster
enterprise: false
---

Before you start, make sure you have completed the steps in [Bootstrap][bootstrap].

## Create a new AWS Kubernetes cluster

1.  Set the environment variable to a name for this cluster.

    ```sh
    CLUSTER_NAME=my-aks-cluster
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

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (e.g., kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

1.  Create the cluster from the objects.

    ```sh
    dkp create cluster aks --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

    ```sh
    cluster.cluster.x-k8s.io/my-aks-cluster created
    awscluster.infrastructure.cluster.x-k8s.io/my-aks-cluster created
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/my-aks-cluster-control-plane created
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/my-aks-cluster-control-plane created
    machinedeployment.cluster.x-k8s.io/my-aks-cluster-mp-0 created
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/my-aks-cluster-mp-0 created
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/my-aks-cluster-mp-0 created
    ```

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```text
    cluster.cluster.x-k8s.io/aws-example condition met
    ```

    The `READY` status will become `True` after the cluster control-plane becomes ready. You can follow along in the following steps.

1.  Once the objects are created on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines. As they progress, they update the Status of each object. Konvoy provides a command to describe the current status of the cluster:

    ```sh
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```text
    NAME                                                            READY  SEVERITY  REASON  SINCE  MESSAGE
    /my-aks-cluster                                                    True                     35s
    ├─ClusterInfrastructure - AKSCluster/my-aks-cluster                True                     4m47s
    ├─ControlPlane - KubeadmControlPlane/my-aks-cluster-control-plane  True                     36s
    │   └─3 Machine...                                              True                     4m20s
    └─Workers
        └─MachineDeployment/my-aks-cluster-md-0
    ```

1.  As they progress, the controllers also create Events. List the Events using this command:

    ```sh
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AKSCluster"` and `kubectl get events --field-selector involvedObject.kind="AKSMachine"`.

    ```text
    7m26s       Normal    SuccessfulSetNodeRef                            machine/aws-example-control-plane-2wb9q      ip-10-0-182-218.us-west-2.compute.internal
    11m         Normal    SuccessfulCreate                                awsmachine/aws-example-control-plane-vcjkr   Created new control-plane instance with id "i-0dde024e80ae3de7a"
    11m         Normal    SuccessfulAttachControlPlaneELB                 awsmachine/aws-example-control-plane-vcjkr   Control plane instance "i-0dde024e80ae3de7a" is registered with load balancer
    7m25s       Normal    SuccessfulDeleteEncryptedBootstrapDataSecrets   awsmachine/aws-example-control-plane-vcjkr   AWS Secret entries containing userdata deleted
    7m6s        Normal    FailedDescribeInstances                         awsmachinepool/aws-example-mp-0              No Auto Scaling Groups with aws-example-mp-0 found
    7m3s        Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    7m1s        Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    6m59s       Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    6m57s       Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    6m55s       Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    6m53s       Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    6m51s       Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    6m49s       Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    6m47s       Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    74s         Warning   FailedLaunchTemplateReconcile                   awsmachinepool/aws-example-mp-0              (combined from similar events): Failed to reconcile launch template: ValidationError: AutoScalingGroup name not found - AutoScalingGroup aws-example-mp-0 not found
    16m         Normal    SuccessfulCreateVPC                             awscluster/aws-example                       Created new managed VPC "vpc-032fff0fe06a85035"
    16m         Normal    SuccessfulSetVPCAttributes                      awscluster/aws-example                       Set managed VPC attributes for "vpc-032fff0fe06a85035"
    16m         Normal    SuccessfulCreateSubnet                          awscluster/aws-example                       Created new managed Subnet "subnet-0677a4fbd7d170dfe"
    16m         Normal    SuccessfulModifySubnetAttributes                awscluster/aws-example                       Modified managed Subnet "subnet-0677a4fbd7d170dfe" attributes
    16m         Normal    SuccessfulCreateSubnet                          awscluster/aws-example                       Created new managed Subnet "subnet-04fc9deb4fa9f8333"
    16m         Normal    SuccessfulCreateSubnet                          awscluster/aws-example                       Created new managed Subnet "subnet-0a266c15dd211ce6c"
    16m         Normal    SuccessfulModifySubnetAttributes                awscluster/aws-example                       Modified managed Subnet "subnet-0a266c15dd211ce6c" attributes
    16m         Normal    SuccessfulCreateSubnet                          awscluster/aws-example                       Created new managed Subnet "subnet-06269d5b52d50840f"
    16m         Normal    SuccessfulCreateSubnet                          awscluster/aws-example                       Created new managed Subnet "subnet-0fc41ffef7dceface"
    16m         Normal    SuccessfulModifySubnetAttributes                awscluster/aws-example                       Modified managed Subnet "subnet-0fc41ffef7dceface" attributes
    16m         Normal    SuccessfulCreateSubnet                          awscluster/aws-example                       Created new managed Subnet "subnet-0725068cca16ad9f9"
    16m         Normal    SuccessfulCreateInternetGateway                 awscluster/aws-example                       Created new managed Internet Gateway "igw-07cd7ad3e6c7c1ca7"
    16m         Normal    SuccessfulAttachInternetGateway                 awscluster/aws-example                       Internet Gateway "igw-07cd7ad3e6c7c1ca7" attached to VPC "vpc-032fff0fe06a85035"
    16m         Normal    SuccessfulCreateNATGateway                      awscluster/aws-example                       Created new NAT Gateway "nat-0a0cf17d29150cf9a"
    16m         Normal    SuccessfulCreateNATGateway                      awscluster/aws-example                       Created new NAT Gateway "nat-065e5e383e6f23320"
    16m         Normal    SuccessfulCreateNATGateway                      awscluster/aws-example                       Created new NAT Gateway "nat-01c4a6fed2a31ed4c"
    13m         Normal    SuccessfulCreateRouteTable                      awscluster/aws-example                       Created managed RouteTable "rtb-09f4e2eecb7462d22"
    13m         Normal    SuccessfulCreateRoute                           awscluster/aws-example                       Created route {
    13m         Normal    SuccessfulAssociateRouteTable                   awscluster/aws-example                       Associated managed RouteTable "rtb-09f4e2eecb7462d22" with subnet "subnet-0677a4fbd7d170dfe"
    13m         Normal    SuccessfulCreateRouteTable                      awscluster/aws-example                       Created managed RouteTable "rtb-0007b98b36f37d1e4"
    13m         Normal    SuccessfulCreateRoute                           awscluster/aws-example                       Created route {
    13m         Normal    SuccessfulAssociateRouteTable                   awscluster/aws-example                       Associated managed RouteTable "rtb-0007b98b36f37d1e4" with subnet "subnet-04fc9deb4fa9f8333"
    13m         Normal    SuccessfulCreateRouteTable                      awscluster/aws-example                       Created managed RouteTable "rtb-079a1d7d3667c2525"
    13m         Normal    SuccessfulCreateRoute                           awscluster/aws-example                       Created route {
    13m         Normal    SuccessfulAssociateRouteTable                   awscluster/aws-example                       Associated managed RouteTable "rtb-079a1d7d3667c2525" with subnet "subnet-0a266c15dd211ce6c"
    13m         Normal    SuccessfulCreateRouteTable                      awscluster/aws-example                       Created managed RouteTable "rtb-0e5ebc8ec29848a17"
    13m         Normal    SuccessfulCreateRoute                           awscluster/aws-example                       Created route {
    13m         Normal    SuccessfulAssociateRouteTable                   awscluster/aws-example                       Associated managed RouteTable "rtb-0e5ebc8ec29848a17" with subnet "subnet-06269d5b52d50840f"
    13m         Normal    SuccessfulCreateRouteTable                      awscluster/aws-example                       Created managed RouteTable "rtb-087f0c400675c4bce"
    13m         Normal    SuccessfulCreateRoute                           awscluster/aws-example                       Created route {
    13m         Normal    SuccessfulAssociateRouteTable                   awscluster/aws-example                       Associated managed RouteTable "rtb-087f0c400675c4bce" with subnet "subnet-0fc41ffef7dceface"
    13m         Normal    SuccessfulCreateRouteTable                      awscluster/aws-example                       Created managed RouteTable "rtb-05a05080bbb3cead9"
    13m         Normal    SuccessfulCreateRoute                           awscluster/aws-example                       Created route {
    13m         Normal    SuccessfulAssociateRouteTable                   awscluster/aws-example                       Associated managed RouteTable "rtb-05a05080bbb3cead9" with subnet "subnet-0725068cca16ad9f9"
    13m         Normal    SuccessfulCreateSecurityGroup                   awscluster/aws-example                       Created managed SecurityGroup "sg-0379bf77211472854" for Role "bastion"
    13m         Normal    SuccessfulCreateSecurityGroup                   awscluster/aws-example                       Created managed SecurityGroup "sg-0a4e0635f68a2f57d" for Role "apiserver-lb"
    13m         Normal    SuccessfulCreateSecurityGroup                   awscluster/aws-example                       Created managed SecurityGroup "sg-022da9dfc21ef3d5e" for Role "lb"
    13m         Normal    SuccessfulCreateSecurityGroup                   awscluster/aws-example                       Created managed SecurityGroup "sg-00db2e847c0b49d6e" for Role "controlplane"
    13m         Normal    SuccessfulCreateSecurityGroup                   awscluster/aws-example                       Created managed SecurityGroup "sg-01fe3426404f94708" for Role "node"
    13m         Normal    SuccessfulAuthorizeSecurityGroupIngressRules    awscluster/aws-example                       Authorized security group ingress rules [protocol=tcp/range=[22-22]/description=SSH] for SecurityGroup "sg-0379bf77211472854"
    13m         Normal    SuccessfulAuthorizeSecurityGroupIngressRules    awscluster/aws-example                       Authorized security group ingress rules [protocol=tcp/range=[6443-6443]/description=Kubernetes API] for SecurityGroup "sg-0a4e0635f68a2f57d"
    13m         Normal    SuccessfulAuthorizeSecurityGroupIngressRules    awscluster/aws-example                       Authorized security group ingress rules [protocol=tcp/range=[5473-5473]/description=typha (calico) protocol=tcp/range=[179-179]/description=bgp (calico) protocol=4/range=[-1-65535]/description=IP-in-IP (calico) protocol=tcp/range=[22-22]/description=SSH protocol=tcp/range=[6443-6443]/description=Kubernetes API protocol=tcp/range=[2379-2379]/description=etcd protocol=tcp/range=[2380-2380]/description=etcd peer] for SecurityGroup "sg-00db2e847c0b49d6e"
    13m         Normal    SuccessfulAuthorizeSecurityGroupIngressRules    awscluster/aws-example                       Authorized security group ingress rules [protocol=tcp/range=[5473-5473]/description=typha (calico) protocol=tcp/range=[179-179]/description=bgp (calico) protocol=4/range=[-1-65535]/description=IP-in-IP (calico) protocol=tcp/range=[22-22]/description=SSH protocol=tcp/range=[30000-32767]/description=Node Port Services protocol=tcp/range=[10250-10250]/description=Kubelet API] for SecurityGroup "sg-01fe3426404f94708"
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
