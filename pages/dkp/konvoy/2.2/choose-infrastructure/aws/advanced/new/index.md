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

    In AWS it is critical that the name is unique, as no two clusters in the same AWS account can have the same name.

1.  Set the environment variable:

    ```bash
    export CLUSTER_NAME=aws-example
    ```

    <p class="message--note"><strong>NOTE: </strong>The cluster name may only contain the following characters: <code>a-z</code>, <code>0-9</code>, <code>.</code>, and <code>-</code>. Cluster creation will fail if the name has capital letters.
    See <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names/">Kubernetes</a> for more naming information.
    </p>

## Tips and Tricks
Below are a few ways to customize your setup. If you prefer to do a basic setup, skip Tips and Tricks and proceed to Create a New AWS Cluster section. 
1.  To get a list of names used in your AWS account, use the `aws` [CLI][download_aws_cli]. After downloading, use the following command:

    ```bash
    aws ec2 describe-vpcs --filter "Name=tag-key,Values=kubernetes.io/cluster" --query "Vpcs[*].Tags[?Key=='kubernetes.io/cluster'].Value | sort(@[*][0])"
    ```

    ```sh
        "alex-aws-cluster-afe98",
        "sam-aws-cluster-8if9q"
    ```

1.  (Optional) To create a cluster name that is unique, use the following command:

    ```bash
    export CLUSTER_NAME=aws-example-$(LC_CTYPE=C tr -dc 'a-z0-9' </dev/urandom | fold -w 5 | head -n1)
    echo $CLUSTER_NAME
    ```

    ```sh
    aws-example-pf4a3
    ```

    This will create a unique name every time you run it, so use it with forethought.

1.  (Optional) To create a cluster using a custom AMI built using [KIB][KIB], first that image must be built in KIB, then perform the export and name the custom AMI, and then set the environment variable for the AMI you choose: 

```bash
export AWS_AMI_ID=ami-<ami-id-here>
```

After export, run the following command:

```bash
dkp create cluster aws --cluster-name=${CLUSTER_NAME} \
--ami=${AWS_AMI_ID} \
--dry-run \
--output=yaml \
> ${CLUSTER_NAME}.yaml
```

## Create a new AWS Kubernetes cluster

1.  Ensure your AWS credentials are up to date. If you are using Static Credentials use the following command to refresh the credentials. Otherwise, proceed to Step 2:

    ```bash
    dkp update bootstrap credentials aws
    ```

1.  Generate the Kubernetes cluster objects:

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Dockerhub's rate limit</a> use your Dockerhub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

    ```bash
    dkp create cluster aws --cluster-name=${CLUSTER_NAME} \
    --dry-run \
    --output=yaml \
    > ${CLUSTER_NAME}.yaml
    ```
	```sh	
	Generating cluster resources
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

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Dockerhub's rate limit</a> use your Dockerhub credentials when creating the cluster, by setting flags <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> then running <code>dkp create cluster</code></p>

    ```bash
    dkp create cluster aws --cluster-name=${CLUSTER_NAME} \
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

        A _Cluster_ object has references to the infrastructure-specific and control plane objects. Because this is an AWS cluster, there is an _AWSCluster_ object that describes the infrastructure-specific cluster properties. Here, this means the AWS region, the VPC ID, subnet IDs, and security group rules required by the Pod network implementation.

    1.  Control Plane

        A _KubeadmControlPlane_ object describes the control plane, which is the group of machines that run the Kubernetes control plane components, which include the etcd distributed database, the API server, the core controllers, and the scheduler. The object describes the configuration for these components. The object also has a reference to an infrastructure-specific object that describes the properties of all control plane machines. Here, it references an _AWSMachineTemplate_ object, which describes the instance type, the type of disk used, and the size of the disk, among other properties.

    1.  Node Pool

        A Node Pool is a collection of machines with identical properties. For example, a cluster might have one Node Pool with large memory capacity, another Node Pool with GPU support. Each Node Pool is described by three objects: The MachinePool references an object that describes the configuration of Kubernetes components (for example, kubelet) deployed on each node pool machine, and an infrastructure-specific object that describes the properties of all node pool machines. Here, it references a _KubeadmConfigTemplate_, and an _AWSMachineTemplate_ object, which describes the instance type, the type of disk used, the size of the disk, among other properties.

    For in-depth documentation about the objects, read [Concepts][capi_concepts] in the Cluster API Book.

1.  Create the cluster from the objects.

    ```bash
    kubectl create -f ${CLUSTER_NAME}.yaml
    ```

    ```sh
	cluster.cluster.x-k8s.io/aws-example created
	awscluster.infrastructure.cluster.x-k8s.io/aws-example created
	kubeadmcontrolplane.controlplane.cluster.x-k8s.io/aws-example-control-plane created
	awsmachinetemplate.infrastructure.cluster.x-k8s.io/aws-example-control-plane created
	secret/aws-example-etcd-encryption-config created
	machinedeployment.cluster.x-k8s.io/aws-example-md-0 created
	awsmachinetemplate.infrastructure.cluster.x-k8s.io/aws-example-md-0 created
	kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/aws-example-md-0 created
	clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-aws-example created
	configmap/calico-cni-installation-aws-example created
	configmap/tigera-operator-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/aws-ebs-csi-aws-example created
	configmap/aws-ebs-csi-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-aws-example created
	configmap/cluster-autoscaler-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-aws-example created
	configmap/node-feature-discovery-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-aws-example created
	configmap/nvidia-feature-discovery-aws-example created
    ```

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

    ```sh
    cluster.cluster.x-k8s.io/aws-example condition met
    ```

    The `READY` status becomes `True` after the cluster control-plane becomes ready in one of the following steps.

1.  After the objects are created on the API server, the Cluster API controllers reconcile them. They create infrastructure and machines. As they progress, they update the Status of each object. Konvoy provides a command to describe the current status of the cluster:

    ```bash
    dkp describe cluster -c ${CLUSTER_NAME}
    ```

    ```sh
	NAME                                                              READY  SEVERITY  REASON  SINCE  MESSAGE
	Cluster/aws-example                                             True                     60s
	├─ClusterInfrastructure - AWSCluster/aws-example                True                     5m23s
	├─ControlPlane - KubeadmControlPlane/aws-example-control-plane  True                     60s
	│ ├─Machine/aws-example-control-plane-55jh4                     True                     4m59s
	│ ├─Machine/aws-example-control-plane-6sn97                     True                     2m49s
	│ └─Machine/aws-example-control-plane-nx9v5                     True                     66s
	└─Workers
	  └─MachineDeployment/aws-example-md-0                          True                     117s
		├─Machine/aws-example-md-0-cb9c9bbf7-hcl8z                  True                     3m1s
		├─Machine/aws-example-md-0-cb9c9bbf7-rtdqw                  True                     3m2s
		├─Machine/aws-example-md-0-cb9c9bbf7-t894m                  True                     3m1s
		└─Machine/aws-example-md-0-cb9c9bbf7-td29r                  True                     3m1s
    ```

1.  As they progress, the controllers also create Events. List the Events using this command:

    ```bash
    kubectl get events | grep ${CLUSTER_NAME}
    ```

    For brevity, the example uses `grep`. It is also possible to use separate commands to get Events for specific objects. For example, `kubectl get events --field-selector involvedObject.kind="AWSCluster"` and `kubectl get events --field-selector involvedObject.kind="AWSMachine"`.

    ```sh
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

[bootstrap]: ../bootstrap
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[download_aws_cli]: https://aws.amazon.com/cli/
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[KIB]: ../../../../image-builder/
