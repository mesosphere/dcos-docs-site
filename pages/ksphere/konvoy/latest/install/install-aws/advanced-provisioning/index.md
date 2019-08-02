---
layout: layout.pug
navigationTitle: Advanced provisioning options (AWS)
title: Advanced provisioning options (AWS)
menuWeight: 5
excerpt: Configure advanced provisioning options for installing Konvoy on AWS
enterprise: false
---

The topics in this section describe advanced provisioning and configuration options for Konvoy when deploying on AWS.

# Customize region and availability zones

Konvoy supports provisioning hosts across multiple availability zones in an AWS region.
For instance, the following configuration will instruct Konvoy to provision hosts across the three zones in `us-west-2` region.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
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
apiVersion: konvoy.mesosphere.io/v1alpha1
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
      type: t3.xlarge
      imageID: ami-01ed306a12b7d1c96
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeType: gp2
      imagefsVolumeSize: 160
      type: t3.large
      imageID: ami-01ed306a12b7d1c96
```

## Instance types

For each [node pool][node_pools], the user can customize the instance type for instances in that node pool (i.e., `type` field).
All instances in a single node pool must have the same instance type.

All the available instance types can be found [here][aws_instance_types].

## Instance volumes

For each [node pool][node_pools], the user can customize the instance volumes attached to the instances in that node pool.
There are two types of instance volumes:

* Root volume: this is the root disk for providing [ephemeral storage][ephemeral_storage] for the Kubernetes node (except container images if imagefs volume is enabled).
* Imagefs volume: this is the dedicated disk for providing storage for container image layers.

Imagefs volume is optional.
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

If you are deploying Konvoy in a region that is not included in the predefined listed, you must specify the appropriate region-specific CentOS 7 or Red Hat Enterprise Linux 7 `imageID` in the `cluster.yaml` file.

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

    Keep in mind that Konvoy merges any files you add to the `extras/provisioner` directory with the default `*.tf` resource files during the provisioning process.
    If you add a file name to the `extras/provisioner` directory that already exists in the default `*.tf` resource files, the contents of the default `*.tf` resource file are replaced with the contents from the custom file you added to the `extras/provisioner` directory.

1. Run the `konvoy up` command.

    As the command runs, the Terraform program merges the resource files and produces output similar to the following:

    ```text
    Successfully configured the backend "s3"! Terraform will automatically
    use this backend unless the backend configuration changes.
    ```

    This output in this example indicates that Terraform has successfully merged content from the `backend.tf` resource file and will store the state file in an S3 bucket.

[ami_centos7]: https://aws.amazon.com/marketplace/pp/B00O7WM7QW
[node_pools]: ../../node-pools/
[aws_instance_types]: https://aws.amazon.com/ec2/instance-types/
[ephemeral_storage]: ../../../storage/
[ebs_volume_types]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
