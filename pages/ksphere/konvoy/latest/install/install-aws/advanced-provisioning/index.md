---
layout: layout.pug
navigationTitle: Advanced provisioning options (AWS)
title: Advanced provisioning options (AWS)
menuWeight: 5
excerpt: Configure advanced provisioning options for installing Konvoy on AWS
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

The topics in this section describe advanced provisioning and configuration options for Konvoy when deploying on AWS.

# Customize region and availability zones

Konvoy supports provisioning hosts across multiple availability zones in an AWS region.
For instance, the following configuration will instruct Konvoy to provision hosts across the three zones in `us-west-2` region.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy
spec:
  provider: aws
  aws:
    region: us-west-2
    availabilityZones:
    - us-west-2a
    - us-west-2b
    - us-west-2c
```

# Customize instance types, volumes and Amazon Machine Images (AMI)

Konvoy allows users to customize instance types, volumes and AMI images for their clusters like the following.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy
spec:
  provider: aws
  aws:
    provider: aws
    aws:
      region: us-west-2
      availabilityZones:
      - us-west-2a
      - us-west-2b
      - us-west-2c
  nodePools:
  - name: node
    count: 4
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeType: gp2
      imagefsVolumeSize: 160
      imagefsVolumeDevice: xvdb
      type: m5.2xlarge
      imageID: ami-01ed306a12b7d1c96
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: io1
      rootVolumeIOPS: 1000
      imagefsVolumeEnabled: true
      imagefsVolumeType: gp2
      imagefsVolumeSize: 160
      imagefsVolumeDevice: xvdb
      type: m5.xlarge
      imageID: ami-01ed306a12b7d1c96
```

## Instance types

For each [node pool][node_pools], you can customize the instance type for instances in that node pool (i.e., `type` field).
All instances in a single node pool must have the same instance type.

All the available instance types can be found [here][aws_instance_types].

## Instance volumes

For each [node pool][node_pools], you can customize the instance volumes attached to the instances in that node pool.
There are two types of instance volumes:

* Root volume: this is the root disk for providing [ephemeral storage][ephemeral_storage] for the Kubernetes node (except container images if `imagefs` volume is enabled).
* `imagefs` volume: this is the dedicated disk for providing storage for container image layers.

`imagefs` volume is optional.
If disabled, the root volume will be used to storage container image layers.

Users can customize the sizes (in GB) and [types][ebs_volume_types] (use API Name) of those volumes.

## Amazon Machine Images (AMI)

In AWS, different regions use unique Amazon Machine Image (AMI) identifiers for the same operating system image.
Depending on your region and operating system combination, you might need to specify an image identifier for the `ClusterProvisioner` setting before provisioning.

The regions and corresponding Amazon Machine Image (AMI) identifiers that are predefined for Konvoy cluster deployments include the following:

```text
ap-south-1     = "ami-02e60be79e78fef21"
eu-west-3      = "ami-0e1ab783dc9489f34"
eu-west-2      = "ami-0eab3a90fc693af19"
eu-west-1      = "ami-0ff760d16d9497662"
ap-northeast-2 = "ami-06cf2a72dadf92410"
ap-northeast-1 = "ami-045f38c93733dd48d"
sa-east-1      = "ami-0b8d86d4bf91850af"
ca-central-1   = "ami-033e6106180a626d0"
ap-southeast-1 = "ami-0b4dd9d65556cac22"
ap-southeast-2 = "ami-08bd00d7713a39e7d"
eu-central-1   = "ami-04cf43aca3e6f3de3"
us-east-1      = "ami-02eac2c0129f6376b"
us-east-2      = "ami-0f2b4fc905b0bd1f1"
us-west-1      = "ami-074e2d6769f445be5"
us-west-2      = "ami-01ed306a12b7d1c96"
```

If you are deploying Konvoy in a region that is not included in the predefined identifiers listed, you must specify the appropriate region-specific CentOS 7 or Red Hat Enterprise Linux 7 `imageID` in the `cluster.yaml` file.

Konvoy is tested with the [CentOS Linux 7][ami_centos7] image.

# Adding custom Terraform resources for provisioning

It is possible to provide custom `*.tf` resource files when provisioning.
If you create additional resource files, they are used along with the default `*.tf` resource files during the provisioning process.

To add custom resource files for provisioning:

1. Create a new directory named `extras/provisioner/` to contain your custom resource files.

    ```bash
    mkdir -p extras/provisioner
    ```

1. Create a file in the `extras/provisioner/` directory to include your custom backend settings.

    ```bash
    cat <<EOF > extras/provisioner/backend.tf
    terraform {
      backend "s3" {
        bucket = "mybucket"
        key    = "kubernetes"
        region = "us-west-2"
      }
    }
    EOF
    ```

<p class="message--note"><strong>NOTE: </strong>Konvoy merges any files you add to the <tt>extras/provisioner</tt> directory with the default <tt>*.tf</tt> resource files during the provisioning process.
    If you add a file name to the <tt>extras/provisioner</tt> directory that already exists in the default <tt>*.tf</tt> resource files, the contents of the default <tt>*.tf</tt> resource file are replaced with the contents from the custom file you added to the <tt>extras/provisioner</tt> directory.</p>

1. Run the `konvoy up` command.

    As the command runs, the Terraform program merges the resource files and produces output similar to the following:

    ```text
    Successfully configured the backend "s3"! Terraform will automatically
    use this backend unless the backend configuration changes.
    ```

    The output in this example indicates that Terraform has successfully merged content from the `backend.tf` resource file and will store the state file in an S3 bucket.

## Using existing infrastructure

<p class="message--note"><strong>NOTE: </strong> The following steps require the creation of a <tt>cluster.yaml</tt> configuration file. If you do not already have that file, create it by running <tt>konvoy init</tt>.</p>

### VPC
It is possible to use an existing VPC if so desired.
To do so you must modify the `cluster.yaml` file and change the `ProvisionerConfig` in the following way:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy
spec:
  provider: aws
  # if your provider is aws, you MUST also define the aws field
  aws:
    region: us-west-2
    # the vpc must have enabled DNS Hostname and DNS Resolution
    vpc:
      ID: "vpc-0a0e1da174c837629"
      routeTableID: "rtb-012e0ee9392c58881"
...
```

It is necessary to define the `vpc.ID` and the `vpd.routeTableID`.

<p class="message--note"><strong>NOTE: </strong> When creating the VPC you must have the DNS resolution option enabled, unless you are setting <tt>vpc.internetGatewayDisabled: true</tt>.</p>

The default VPC CIDR block that is created by Konvoy is `10.0.0.0/16`, however you may choose to set that to any appropriate block.

<p class="message--note"><strong>NOTE: </strong> Optionally you can use an existing internet gateway by defining the <tt>vpc.internetGatewayID</tt> field.</p>

It is also possible to disable creating the internet gateway by modifying a few options in the `cluster.yaml` configuration file.
Doing so will also automatically set the kube-apiserver ELB to be `internal` and will not associate public IPs for all the EC2 instances.
Depending on how you addons are configured, you may also need to add an annotation to use an `internal` ELB.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy
spec:
  provider: aws
  aws:
    region: us-west-2
    # the vpc must have enabled DNS Hostname and DNS Resolution
    vpc:
      ID: "vpc-0a0e1da174c837629"
      routeTableID: "rtb-012e0ee9392c58881"
      enableInternetGateway: false
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy
spec:
  ...
  addons:
    addonsList:
    - name: traefik
      enabled: true
      values: |
        service:
          annotations:
            "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
    - name: velero
      enabled: true
      values: |
        minioBackendConfiguration:
          service:
            annotations:
              "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
    - enabled: true
      name: istio
      values: |
        gateways:
          istio-ingressgateway:
            serviceAnnotations:
              service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    ...
```

### VPC Endpoints
Konvoy will automatically provision [AWS VPC Endpoints][aws_vpc_endpoints] for `ebs` and `elasticloadbalancing` services.
This allows for the Kubernetes AWS cloud-provider and AWS EBS CSI driver to function without requiring access to the Internet.

If desired you can disable creating these resources by modifying the `cluster.yaml` file and changing the `ProvisionerConfig` in the following way:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy
spec:
  provider: aws
  aws:
    vpc:
      enableVPCEndpoints: false
...
```

### Subnets
An existing VPC may already contain `subnets` for use. You may define them in the following way:

```yaml
...
spec:
  provider: aws
  aws:
    region: us-west-2
    # vpc must be defined and it must have enabled DNS hostname and resolution
    vpc:
      ID: "vpc-0a0e1da174c837629"
      routeTableID: "rtb-012e0ee9392c58881"
    # the ELB that will be used by the kube-apiserver
    elb:
      internal: false
      subnetIDs:
        - subnet-0f95d617b26dab1d1
    availabilityZones:
        - us-west-2c
  nodePools:
  - name: worker
     count: 4
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: m5.2xlarge
      aws:
        # Each pool now has subnets, they must match the number of availabilityZones and in the same order as the `availabilityZones`
        subnetIDs:
        - subnet-04c6fb3908305d4ca
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: io1
      rootVolumeIOPS: 1000
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: m5.xlarge
      aws:
        # Subnets should be private
        subnetIDs:
        - subnet-0eae44ba52375f398
  - name: bastion
    bastion: true
    count: 0
    machine:
      rootVolumeSize: 10
      rootVolumeType: gp2
      type: m5.large
      aws:
        # Should be a subnet with public ips, this is required to access your bastion
        subnetIDs:
        - subnet-0g95d316n26daask29
...
```

The number of `ID`s in each type of subnet must match the number of `aws.availabilityZones` defined and they must be listed in the same order as the `aws.availabilityZones`.
The public subnet must be set to automatically set up public IPs on launch.

Failure to define any subnets will mean that Konvoy will attempt to create subnets to cover missing nodepools.
That could lead to collisions in CIDR blocks and failure to deploy. If this happens, we recommend that a full list of subnets be known along with the nodepools desired.

For the most part the nodepools created should exist in a private network configuration, which is Konvoy's default approach.
Bastion hosts allow for secure access to your cluster, but since they do need to be accessed externally they should be deployed with a subnet where public IPs are created.

The default Subnet CIDR blocks that are created by Konvoy are as follows:

* Public Subnet: `10.0.64.0/18`
* Private Subnet: `10.0.128.0/18`
* ControlPlane Subnet: `10.0.192.0/18`

Similarly to the VPC, you may choose to use these blocks or define any other appropriate block.

<p class="message--note"><strong>NOTE: </strong>Keep in mind that the default value of <tt>spec.kubernetes.networking.serviceSubnet</tt> is set to <tt>10.0.0.0/18</tt>. The blocks you choose must not overlap with the <tt>serviceSubnet</tt>.</p>

If you are relying on the Kubernetes [Cloud Providers feature][cloud_provider] and are creating a cluster spanning multiple availability zones(AZ), you must tag the subnets that are being used by the `control-plane` nodepool, doing so will result in Kubernetes creating the ELBs for services of type `LoadBalancer` in those Subnets.
The tags should be as following, where `__CLUSTER_NAME__` corresponds to the `cluster_name` printed after running `konvoy provision`:

```text
kubernetes.io/cluster = __CLUSTER_NAME__
kubernetes.io/cluster/__CLUSTER_NAME__ = owned
```

### IAM Instance Profiles
An existing IAM instance profile can be used, provided that the right policies must be set:

```yaml
...
spec:
  provider: aws
  nodePools:
  - name: worker
     count: 1
    machine:
      aws:
        iam:
          instanceProfile:
            name: "some-k8s-instance-profile"
...
```

or you may instead use the ARN:

```yaml
...
spec:
  provider: aws
  nodePools:
  - name: worker
     count: 1
    machine:
      aws:
        iam:
          instanceProfile:
            arn: "arn:aws:iam::273854932432:instance-profile/some-k8s-instance-profile"
...
```

# Deploying Additional Kubernetes Resources

It is possible to provide additional Kubernetes resources that will be deployed after the base cluster is provisioned but before any of the addons are deployed.

To add custom resource files:

1. Create a new directory named `extras/kubernetes/` to contain your custom resource files.

    ```bash
    mkdir -p extras/kubernetes
    ```

1. Create the desired Kubernetes resource files in the `extras/kubernetes/` directory.

1. Run the `konvoy up`, `konvoy deploy` or `konvoy deploy kubernetes` command.

    After `[Deploying Kubernetes]` and `[Adding Node Labels and Taints]` phases, a phase will run that will deploy all the resource files provided in `extras/kubernetes/:

    ```bash
    STAGE [Deploying Additional Kubernetes Resources]

    secrets/my-secret created
    ...
    ```

[ami_centos7]: https://aws.amazon.com/marketplace/pp/B00O7WM7QW
[node_pools]: ../../node-pools/
[aws_instance_types]: https://aws.amazon.com/ec2/instance-types/
[ephemeral_storage]: ../../../storage/
[ebs_volume_types]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
[cloud_provider]: https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/
[aws_vpc_endpoints]: https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html
