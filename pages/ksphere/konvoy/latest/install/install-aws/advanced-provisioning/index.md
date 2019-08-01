---
layout: layout.pug
navigationTitle: Advanced provisioning options (AWS)
title: Advanced provisioning options (AWS)
menuWeight: 5
excerpt: Configure advanced provisioning options for installing Konvoy on a public cloud infrastructure (AWS)
enterprise: false
---

The topics in this section describe advanced provisioning and configuration options for Konvoy when deploying on a public AWS cloud instance.

## Using region-specific Amazon Machine Image (AMI) identifiers

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
For example, you would modify the `ClusterProvisioner` section of the `cluster.yaml` file to specify the `region`, `availabilityZones`, and `imageID`:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: dkkonvoy201
  creationTimestamp: "2019-06-03T16:21:18.5149792Z"
spec:
  provider: aws
  providerOptions:
    region: __some_region__
    availabilityZones:
    - __some_region_az__
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
      imageID: __some_id__
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
      imageID: __some_id__
```

Konvoy is tested with the [CentOS Linux 7](https://aws.amazon.com/marketplace/pp/B00O7WM7QW) image.

## Adding custom Terraform resources for provisioning

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

## Using a bastion node pool for SSH

It is possible to use a set of nodes that are not part of the cluster to proxy SSH connections to the rest of the nodes.
To do this, you can specify a `bastion` node name in the `nodePool` section of the `cluster.yaml` file.
For example:

```yaml
  - name: bastion
    bastion: true
    count: 2
    machine:
      rootVolumeSize: 10
      rootVolumeType: gp2
      type: t3.small
```

If you are using `aws` as the cluster provisioner, this setting automatically creates two new EC2 instances with security groups configured to:

- allow proxy SSH connections to the rest of the nodes.
- block remote SSH access to the the cluster EC2 instances.

If you use this setting, the `inventory.yaml` file is generated with new vars similar to the following:

```yaml
all:
  vars:
    bastion_hosts: [ec2-18-237-7-198.us-west-2.compute.amazonaws.com, ec2-34-221-251-83.us-west-2.compute.amazonaws.com]
    bastion_user: "centos"
    bastion_port: 22
```

In this example:

- `bastion_hosts:` lists the hosts through which a proxy secure shell connection can be made. A host from this list is selected randomly for each SSH connection.
- `bastion_user` specifies the user account used to open the secure shell connection into the hosts listed as `bastion_hosts`.
- `bastion_port` specifies the port used to open the secure shell connection into the hosts listed as `bastion_hosts`.

If you are using bastion nodes, keep in mind that `ssh-agent` is required and you should not specify `ssh_private_key_file` in `inventory.yaml`.
When you run `konvoy up`, Konvoy validates that a valid private key has been loaded in the `ssh-agent` for the provided public key.

## Addon configuration

Most of the addons in `cluster.yaml` are managed by [Helm](https://Helm.sh).
You can modify the Helm values of these addons as illustrated in the following example:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: konvoy
  creationTimestamp: "2019-05-31T18:00:00.844964-04:00"
spec:
  kubernetes:
    version: 1.15.0
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
    cloudProvider:
      provider: aws
    podSecurityPolicy:
      enabled: false
  containerRuntime:
    containerd:
      version: 1.2.5
  addons:
    configVersion: v0.0.11
    addonList:
    - name: velero
      enabled: false
    - name: helm
      enabled: true
    - name: awsebsprovisioner
      enabled: false
    - name: awsebscsiprovisioner
      enabled: true
    - name: opsportal
      enabled: true
    - name: elasticsearch
      enabled: true
    - name: fluentbit
      enabled: true
    - name: kibana
      enabled: true
    - name: prometheus
      enabled: true
      values: |
        prometheus:
          prometheusSpec:
            tolerations:
              - key: "dedicated"
                operator: "Equal"
                value: "monitoring"
                effect: "NoExecute"
            nodeSelector:
              dedicated: "monitoring"
            resources:
              limits:
                cpu: "4"
                memory: "28Gi"
              requests:
                cpu: "2"
                memory: "8Gi"
          storageSpec:
            volumeClaimTemplate:
              spec:
                resources:
                  requests:
                    storage: "100Gi"
    - name: traefik
      enabled: true
    - name: dashboard
      enabled: true
  version: v0.0.15-10-g57dff48
---
```

To find the proper keys and values, you must identify the associated Helm chart for each addon in the [kubeaddons-configs][kubeaddons-configs_templates] repository.

For example, the `kibana` addon points to [`stable/kibana@3.0.0`][helm_kibana] in [this file][kubeaddons-configs_kibana].

Addons like `prometheus` and `elasticsearch` can point to multiple Helm charts outside of the `kubeaddons-configs`.

## Labels and taints

You can use `cluster.yaml` to configure and taint nodes.

1. Run the `konvoy init` command.

1. Modify `cluster.yaml` and add a new pool:

    ```yaml
    kind: ClusterProvisioner
    apiVersion: konvoy.mesosphere.io/v1alpha1
    spec:
      nodePools:
      - name: monitoring
        count: 2
        machine:
          rootVolumeSize: 80
          rootVolumeType: gp2
          imagefsVolumeEnabled: true
          imagefsVolumeSize: 160
          imagefsVolumeType: gp2
          type: t3.xlarge
    ---
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1alpha1
    spec:
      nodePools:
      - name: monitoring
        labels:
        - key: dedicated
          value: monitoring
        taints:
        - key: dedicated
          value: monitoring
          effect: NoExecute
    ```

    If using pre-provisioned `inventory.yaml` file, specify the `node_pool` var:

    ```yaml
    node:
      hosts:
        172.17.0.1:
          node_pool: worker
        172.17.0.2:
          node_pool: monitoring
    ```

1. Enable Prometheus and set custom values similar to the example in [Addon configuration](#addon-configuration):

    ```yaml
      - name: prometheus
        enabled: true
        values: |
          prometheus:
            prometheusSpec:
              tolerations:
                - key: "dedicated"
                  operator: "Equal"
                  value: "monitoring"
                  effect: "NoExecute"
              nodeSelector:
                dedicated: "monitoring"
    ```

1. Run the `konvoy up` command.

    This `konvoy up` command then create a cluster with an additional two nodes labeled with `dedicated=monitoring` and a matching taint and the Prometheus addon is modified to use those labels for `nodeSelector` and to tolerate those taints.

[kubeaddons-configs_templates]: https://github.com/mesosphere/kubeaddons-configs/tree/master/templates
[helm_kibana]: https://github.com/helm/charts/blob/bca1e989ee38cb95815760188e8aee4286b0df1c/stable/kibana/Chart.yaml#L2-L3
[kubeaddons-configs_kibana]: https://github.com/mesosphere/kubeaddons-configs/blob/65d7a7ae26d4bebd7035d713a5ea5db656ac2659/templates/kibana.yaml#L11-L12
