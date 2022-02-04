---
layout: layout.pug
navigationTitle: Advanced provisioning options - AWS
title: Advanced provisioning options - AWS
menuWeight: 5
excerpt: Configure advanced provisioning options for installing Konvoy on AWS
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes advanced provisioning and configuration options for Konvoy when deploying on AWS.

# Customize CA bundle

When using the Konvoy CLI, the AWS SDK and Terraform uses the default certificate authority (CA) built into the Konvoy docker image. In certain AWS environments, you may want Konvoy to use a different CA when communicating to the AWS API. Set the `AWS_CA_BUNDLE` environment variable to a valid path of the specific CA bundle.

# Customize VPC CIDR block

The default virtual private clouds (VPC) classless inter-domain routing (CIDR) block created by Konvoy is `10.0.0.0/16`. You can use a different block by setting `spec.aws.vpc.cidr` to a different value:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: aws
  aws:
    region: us-west-2
    vpc:
      cidr: "10.1.0.0/26"
```

# Customize region and availability zones

In Konvoy you can provision hosts across multiple availability zones in an AWS region.
For example, the following configuration file provisions hosts across the three zones in the `us-west-2` region.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
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

# Customize instance types, volumes and Amazon Machine Images

In your Konvoy clusters you can customize the following:

- Instance types

- Volume size and type

- Amazon machine images (AMI) images

Refer to the following configuration file:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
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
      imageID: ami-12345
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
      imageID: ami-12345
```

1. **Instance types:** For each [node pool][node_pools], you can customize the instance type (`type:`) for instances in that node pool. All instances in a single node pool must have the same instance type. Available instance types can be found [here][aws_instance_types].

1. **Instance volumes:** For each [node pool][node_pools], you can customize the instance volumes attached to the instances in that node pool. There are two instance volume types:

* Root volume: The root disk for providing [ephemeral storage][ephemeral_storage] for the Kubernetes node (except container images if `imagefs` volume is enabled).

* `imagefs` volume: The dedicated disk for providing storage for container image layers. `imagefs` volume is optional. If disabled, the root volume is used to store container image layers. You can customize the sizes (in GB) and [volume types][ebs_volume_types] (use API Name) of those volumes.

1. **AMI:** In AWS, different regions use unique AMI identifiers for the same operating system image. Depending on the region and operating system combination, you may need to specify an image identifier for the `ClusterProvisioner` setting before provisioning. The regions and corresponding Amazon Machine Image (AMI) identifiers that are predefined for Konvoy cluster deployments include the following:

| Region | AMI Id|
| -------------- | --------------------- |
| ap-northeast-1 | ami-0ddea5e0f69c193a4 |
| ap-northeast-2 | ami-0e4214f08b51e23cc |
| ap-south-1     | ami-0ffc7af9c06de0077 |
| ap-southeast-1 | ami-0adfdaea54d40922b |
| ap-southeast-2 | ami-03d56f451ca110e99 |
| ca-central-1   | ami-0a7c5b189b6460115 |
| eu-central-1   | ami-08b6d44b4f6f7b279 |
| eu-north-1     | ami-0358414bac2039369 |
| eu-west-1      | ami-04f5641b0d178a27a |
| eu-west-2      | ami-0b22fcaf3564fb0c9 |
| eu-west-3      | ami-072ec828dae86abe5 |
| sa-east-1      | ami-02334c45dd95ca1fc |
| us-east-1      | ami-00e87074e52e6c9f9 |
| us-east-2      | ami-00f8e2c955f7ffa9b |
| us-west-1      | ami-08d2d8b00f270d03b |
| us-west-2      | ami-0686851c4e7b1a8e1 |

If you deploy Konvoy to a region not in the identifiers list, you must specify the appropriate region-specific CentOS 7 or Red Hat Enterprise Linux 7 `imageID` in the `cluster.yaml` file. Konvoy is tested with the operating systems listed on the [Operating Systems](../../supported-operating-systems) page.

# Add custom Terraform resources for provisioning

You can create custom `*.tf` resource files to use with the default `*.tf` resource files during the provisioning process.

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

<p class="message--note"><strong>NOTE: </strong>During the provisioning process Konvoy merges the files in the <tt>extras/provisioner</tt> directory with the default <tt>*.tf</tt> resource files. If a file in the <tt>extras/provisioner</tt> directory already exists in the default <tt>*.tf</tt> resource files, this custom file overrides the contents of the default <tt>*.tf</tt> resource file.</p>

<p class="message--note"><strong>NOTE: </strong>Configuring the Terraform backend to store the Terraform state in S3 is not compatible with the <a href="../../../autoscaling">Autoscaling</a> feature. If you use the Terraform backend, then Autoscaling cannot be used and will result in errors if you attempt to use it. Because autoscaling stores the Terraform state in the cluster, you can instead use the <tt>konvoy pull</tt> command to access it after the cluster is deployed.</p>

1. Run the `konvoy up` command.

   As the command runs, Terraform merges the resource files and produces output similar to the following:

    ```text
    Successfully configured the backend "s3"! Terraform will automatically
    use this backend unless the backend configuration changes.
    ```

    The output in this example shows that Terraform has successfully merged content from the `backend.tf` resource file and stores the state file in an S3 bucket.

# Use security token service AssumeRole credentials

To use AWS security token service (STS) AssumeRole Credentials, which [allows sharing credentials across AWS Accounts][sts_assumerole], you must add additional fields to the terraform AWS provider by adding a file `extras/provisioner/main_override.tf` in the working directory:

```hcl-terraform
provider "aws" {
  assume_role {
    role_arn     = "arn:aws:iam::123123123123213213:role/the-role-name"
    session_name = "konvoy"
  }
}
```

By default, running `konvoy down` cleans resources such as load balancers and volumes created by Kubernetes. You can disable this using the `--skip-clean-kubernetes` flag.

To clean these resources, set the environment variable `AWS_SDK_LOAD_CONFIG=true` and have the following file as `$HOME/.aws/config`:

```text
[default]
role_arn = arn:aws:iam::123123123123213213:role/the-role-name
credential_source = Ec2InstanceMetadata
region = us-west-2
```

# Use existing infrastructure

<p class="message--note"><strong>NOTE: </strong> The following steps require the creation of a <tt>cluster.yaml</tt> configuration file. If the file does not already exist you can create it by running <tt>konvoy init</tt>.</p>

## VPC

To use an existing VPC you must modify the `cluster.yaml` file and change the `ClusterProvisioner` configuration file:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: aws
  # if your provider is AWS, you MUST also define the AWS field
  aws:
    region: us-west-2
    # the vpc must have enabled DNS Hostname and DNS Resolution
    vpc:
      ID: "vpc-0a0e1da174c837629"
      routeTableID: "rtb-012e0ee9392c58881"
      overrideDefaultRouteTable: true
...
```

It is necessary to define the `vpc.ID` and the `vpc.routeTableID`.

<p class="message--note"><strong>NOTE: </strong> When creating the VPC you must have the DNS resolution option enabled, unless <tt>vpc.enableInternetGateway: false</tt> is set.</p>

The default VPC CIDR block created by Konvoy is `10.0.0.0/16`, however you can set that to any appropriate block. If you change the default CIDR block, you must also set the same value in `vpc.cidr`.

<p class="message--note"><strong>NOTE: </strong> Optionally you can use an existing internet gateway by defining the <tt>vpc.internetGatewayID</tt> field.</p>

By default, Konvoy modifies the default route table in the VPC. It removes all existing routes, and adds a route for the internet gateway, with destination CIDR of `0.0.0.0/0`, even if one is specified with `vpc.routeTableID`. You can set `vpc.overrideDefaultRouteTable: false` to disable this behavior.

You can disable creation of the internet gateway by modifying options in the `cluster.yaml` configuration file. Doing this automatically sets the kube-apiserver Elastic Load Balancer (ELB) to `internal` and does not associate public IPs for all the EC2 instances.
Depending on your addon configuration you may need to add an annotation to use an `internal` ELB.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
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
      overrideDefaultRouteTable: true
      enableInternetGateway: false
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
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
      name: istio # is currently in Experimental status. More information: https://docs.d2iq.com/dkp/konvoy/latest/version-policy/#experimental-status
      values: |
        gateways:
          istio-ingressgateway:
            serviceAnnotations:
              service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    ...
```

## VPC Endpoints

Konvoy can automatically provision [AWS VPC Endpoints][aws_vpc_endpoints] for `ebs` and `elasticloadbalancing` services.
This allows for the Kubernetes AWS cloud-provider and AWS EBS CSI driver to function without needing access to the Internet.

The default configuration does not create these resources. You can create them by modifying the `cluster.yaml` file and changing the `ClusterProvisioner` configuration in the following way:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: aws
  aws:
    vpc:
      enableVPCEndpoints: true
...
```

<p class="message--note"><strong>NOTE: </strong>When using a custom VPC with these endpoints already present, you should leave the <code>enableVPCEndpoints: false</code> value set. Otherwise, Konvoy modifies existing resources which could prevent other workloads from accessing the AWS api.</p>

## Subnets

An existing VPC may already contain `subnets` for use. You may define them in the following way:

```yaml
...
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
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

The number of `ID`s in each subnet type must match the number of `aws.availabilityZones` defined and must be listed in the same order as the `aws.availabilityZones`.
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

<p class="message--important"><strong>IMPORTANT: </strong>If you are using the Kubernetes <a href="https://v1-20.docs.kubernetes.io/docs/concepts/cluster-administration/cloud-providers/">Cloud Providers feature</a> and creating a cluster spanning multiple availability zones(AZ), you must tag the subnets used by the <code>control-plane</code> nodepool. Kubernetes creates the ELBs for services of type <code>LoadBalancer</code>, in those subnets. Not tagging those subnets can cause the subnets to not receive an ELB and display an <code>Error syncing load balancer, failed to ensure load balancer; could not find any suitable subnets for creating the  ELB.</code> message.</p>

The tags should be as following, where `__CLUSTER_NAME__` corresponds to the `cluster_name` printed after running `konvoy provision`:

```text
kubernetes.io/cluster = __CLUSTER_NAME__
kubernetes.io/cluster/__CLUSTER_NAME__ = owned
```

If the subnet will be used for external and/or internal ELBs, ensure that the following tag is added to the subnet:

```text
kubernetes.io/role/elb = 1
```

Alternatively, if the subnet will only be used for internal ELBs, ensure that the following tag is added to the subnet:

```text
kubernetes.io/role/internal-elb = 1
```

## Security Groups

An existing VPC may already contain `security-groups` for use. You may define them in the following way:

```yaml
...
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  provider: aws
  aws:
    region: us-west-2
    # vpc must be defined
    vpc:
      ID: "vpc-0a0e1da174c837629"
      routeTableID: "rtb-012e0ee9392c58881"
      # VPC endpoints may have security groups, if they are enabled
      enableVPCEndpoints: true
      ec2SecurityGroupIDs:
        - sg-0e2300d267ff60ce8
      elbSecurityGroupIDs:
        - sg-0e2300d267ff60ce8
    elb:
       securityGroupIDs:
        - sg-0e2300d267ff60ce8
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
        securityGroupIDs:
          - sg-0e2300d267ff60ce8
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
        securityGroupIDs:
          - sg-0e2300d267ff60ce8
  - name: bastion
    bastion: true
    count: 0
    machine:
      rootVolumeSize: 10
      rootVolumeType: gp2
      type: m5.large
      aws:
        securityGroupIDs:
          - sg-0e2300d267ff60ce8
...
```

*NOTE* it is not necessary to use the same security group list, each section
could have a different list.

The list of security groups will override the konvoy created security groups.
When all `nodePools`, the `elb` and VPC API endpoints (if enabled) contain
security group ids, konvoy will not create any security groups. In order to
augment the default security groups with custom security groups, create the
following three security groups (shown in terraform syntax):

```hcl-terraform
resource "aws_security_group" "konvoy_ssh" {
  ...

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }
}
```

```hcl-terraform
resource "aws_security_group" "konvoy_private" {
  ...

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }
}
```

```hcl-terraform
resource "aws_security_group" "konvoy_egress" {
  ...

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

```hcl-terraform
resource "aws_security_group" "konvoy_lb_control_plane" {
  ...

  ingress {
    from_port = 6443
    to_port   = 6443
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

VPC endpoints should have the security group id from `konvoy_private` added to
their list.

The ELB should have the security group ids from `konvoy_private` and
`konvoy_lb_control_plane` added to their list.

Bastion `nodePool`s should have the security group ids from `konvoy_private`,
`konvoy_ssh`, and `konvoy_egress` added to their list.

If using a bastion, control plane `nodePool`s should have the security group
ids from `konvoy_private` and `konvoy_egress` added to their list.
If not using a bastion, control plane `nodePool`s should have the security
group ids from `konvoy_private`, `konvoy_ssh`, and `konvoy_egress`

If using a bastion, worker `nodePool`s should have the security group
ids from `konvoy_private` and `konvoy_egress` added to their list.
If not using a bastion, worker `nodePool`s should have the security
group ids from `konvoy_private`, `konvoy_ssh`, and `konvoy_egress`

## IAM Instance Profiles
An existing IAM instance profile can be used, provided that the right policies must be set:

```yaml
...
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
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
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
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

## EBS Volume Encryption

You can configure the AWS CSI driver, installed by Konvoy, to create encrypted EBS volumes.
Modify the `awsebscsiprovisioner` addon values in the following way:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    addonsList:
    - name: awsebscsiprovisioner
      enabled: true
      values: |
        storageclass:
          encrypted: true
```

This configures the AWS CSI driver to encrypt all of the EBS volumes it creates, using the default KMS key in each region.

You can also use a customer managed KMS key, by specifying the key's full ARN:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    addonsList:
    - name: awsebscsiprovisioner
      enabled: true
      values: |
        storageclass:
          encrypted: true
          kmsKeyId: arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab
```

<p class="message--note"><strong>NOTE: </strong>If you specify a value for <tt>kmsKeyId</tt>, you must add the IAM role used by the Konvoy worker nodepools to the KMS key's <tt>Key users</tt> before the CSI driver is able to use the key.</p>

You can read more about EBS encryption in the official [AWS documentation][ebs_encryption].

# Deploying Additional Kubernetes Resources

You can also provide additional Kubernetes resources that are deployed after the base cluster is provisioned, but before any of the addons are deployed.

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
[cloud_provider]: https://v1-20.docs.kubernetes.io/docs/concepts/cluster-administration/cloud-providers/
[aws_vpc_endpoints]: https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html
[sts_assumerole]: https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html
[ebs_encryption]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#EBSEncryption_key_mgmt
