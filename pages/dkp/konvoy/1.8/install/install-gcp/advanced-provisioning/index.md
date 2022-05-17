---
layout: layout.pug
navigationTitle: Advanced provisioning options Google Cloud Platform (GCP)
title: Advanced provisioning options Google Cloud Platform (GCP)
menuWeight: 5
excerpt: Configure advanced provisioning options for installing Konvoy on Google Cloud Platform (GCP)
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

The topics in this section describe advanced provisioning and configuration options for deploying Konvoy on the Google Cloud Platform (GCP).

This section covers the following topics:

* Generating a generic deployment file
* Customize region and availability zones
* Customize instance types, volumes, and OS Image
* Define VM Images

# Generating a generic deployment file for advanced provisioning

This section shows how to generate a deployment file. It is the basis for the entire Advanced provisioning options sections. It is also good practice to version this `cluster.yaml` file for repeatable and traceable provisioning.

  ```bash
  konvoy init --provisioner gcp --cluster-name <YOUR_SPECIFIED_NAME>
  ```

This command will automatically download the Konvoy docker image and generate 3 files:

* `cluster.yaml` file
* Konvoy private / public keys (pem / pub) for reaching out to Kubernetes nodes.

<p class="message--note"><strong>NOTE: </strong>This docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. Complete source code for MinIO is available <a href="https://github.com/minio/minio">here</a>.</p>

Once `cluster.yaml` file is customized with advanced options, you could start a cluster by using this command:

  ```bash
  konvoy up
  ```

Or tear down the resources by using this command:

  ```bash
  konvoy down
  ```

# Customize region and availability zones

Konvoy supports provisioning hosts across multiple zones in a [GCP region][gcp_regions].
By default, Konvoy will generate a deployment in region `us-west1` across the three zones (`a,b,c`). Indeed, one Kubernetes master will be deployed in each zone, for resilience.

  ```yaml
  kind: ClusterProvisioner
  apiVersion: konvoy.mesosphere.io/v1beta1
  metadata:
    name: konvoy
  spec:
    provider: gcp
    gcp:
      region: us-west1
      zones:
      - us-west1-a
      - us-west1-b
      - us-west1-c
  ```

<p class="message--note"><strong>NOTE: </strong>You should have as many zones as Kubernetes Masters. Indeed, instance groups will be created per zone.</p>

# Customize instance types, volumes, and OS Image

In Konvoy, users can customize instance types, volumes, and OS images for their clusters like the following:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: gcp
  gcp:
    region: us-west1
    zones:
    - us-west1-a
    - us-west1-b
    - us-west1-c
  nodePools:
  - name: worker
    count: 8
    machine:
      rootVolumeSize: 80
      rootVolumeType: pd-ssd
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: pd-ssd
      type: n1-standard-8
      imageID: rhel-7
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: pd-ssd
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: pd-ssd
      type: n1-standard-4
      imageID: rhel-7
```

## Instance types

For each [node pool][node_pools], users can customize the instance type for instances, in that node pool, using the `type` field.

All available virtual machine types can be found [here][virtual_machine_types].

## Instance volumes

For each [node pool][node_pools], users can customize the instance volumes attached to the instances in that node pool. There are two types of instance volumes:

* Root volume: This is the root disk for providing [ephemeral storage][ephemeral_storage] for the Kubernetes node (except container images if imagefs volume is enabled).
* Imagefs volume: This is the dedicated disk for providing storage for container image layers.

Imagefs volume is optional. If disabled, the root volume is used to store container image layers.

Users can customize the sizes (in GB) and [types][disks] of those volumes.

## GCP VM Images

In GCP, you can define already available [public images][public_images] as `imageID` or your own images from an available image self link.

The default GCP Image used for Konvoy cluster deployments is the latest available `centos-7`

Konvoy is tested with the `CentOS Linux 7` image.

# Adding custom Terraform resources for provisioning

You can provide custom `*.tf` resource files when provisioning.
If you create additional resource files, they are used with the default `*.tf` resource files during the provisioning process.

To add custom resource files for provisioning:

1. Create a new directory named `extras/provisioner/` to contain your custom resource files.

    ```bash
    mkdir -p extras/provisioner
    ```

1. Create a file in the `extras/provisioner/` directory to include your custom backend settings.

    ```bash
    cat <<EOF > extras/provisioner/backend.tf
    terraform {
      backend "gcs" {
        bucket  = "konvoy"
        prefix  = "${local.cluster_name}-terraform/state"
      }
    }
    EOF
    ```

    <p class="message--note"><strong>NOTE: </strong>Konvoy merges any files you add to the <code>extras/provisioner</code> directory with the default <code>*.tf</code> resource files during the provisioning process. If you add a file name to the <code>extras/provisioner</code> directory that already exists in the default <code>*.tf</code> resource files, the contents of the default <code>*.tf</code> resource file are replaced with the contents from the custom file you added to the <code>extras/provisioner</code> directory.</p>

1. Run the `konvoy up` command.

    As the command runs, the Terraform program merges the resource files and produces output similar to the following:

    ```text
    Successfully configured the backend "gcs"! Terraform will automatically
    use this backend unless the backend configuration changes.
    ```

    The output, in this example, indicates that Terraform has successfully merged content from the `backend.tf` resource file and will store the state file in Google Cloud Storage.

## Network
You can also use an existing network.
To do so you must modify the `cluster.yaml` file and change the `ProvisionerConfig` in the following way:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: gcp
  gcp:
    region: us-west1
    zones:
    - us-west1-a
    - us-west1-b
    - us-west1-c
    network:
      selfLink: projects/my-project-id/global/networks/my-predefined-network
...
```

### Internal only kube-apiserver LB / Forwarding rule

It is **not** possible to set the kube-apiserver LB to be `internal`.
The GCP forwarding rules do not allow a request, from a backend member, to be directed to another backend member internally.
This behaviour is documented [here][forwading_rules_internal].

### Subnets
An existing network may already contain `subnets` for use. You can define them in the following way:

```yaml
...
spec:
  provider: gcp
  gcp:
    region: us-west1
    zones:
    - us-west1-a
    - us-west1-b
    - us-west1-c
    network:
      selfLink: projects/my-project-id/global/networks/my-predefined-network
  nodePools:
  - name: worker
    count: 8
    machine:
      rootVolumeSize: 80
      rootVolumeType: pd-ssd
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: pd-ssd
      type: n1-standard-8
      gcp:
        subnetIDs:
        - existing-subnet-for-konvoy
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: pd-ssd
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: pd-ssd
      type: n1-standard-4
      gcp:
        subnetIDs:
        - existing-subnet-for-control-plane-konvoy
  - name: bastion
    bastion: true
    count: 1
    machine:
      rootVolumeSize: 80
      rootVolumeType: pd-ssd
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: pd-ssd
      type: n1-standard-4
      gcp:
        subnetIDs:
        - other-subnet
...
```

If no subnets are defined, Konvoy attempts to create subnets to cover missing nodepools.
This can lead to collisions in CIDR blocks and deploy failures. In this case we recommend a full list of subnets be known along with the nodepools needed.

For the most part, the nodepools created should exist in a private network configuration. This is Konvoy's default approach.
Bastion hosts allow for secure access to your cluster. Since they need to be accessed externally, they should be deployed with a subnet where public IPs are created.

The default Subnet CIDR blocks that are created by Konvoy are as follows:

* Public Subnet: `10.0.64.0/18`
* Private Subnet: `10.0.128.0/18`
* ControlPlane Subnet: `10.0.192.0/18`

Like the network, you can choose to use these blocks or define other appropriate blocks.

<p class="message--note"><strong>NOTE: </strong>Keep in mind that the default value of <tt>spec.kubernetes.networking.serviceSubnet</tt> is set to <tt>10.0.0.0/18</tt>. The blocks you choose must not overlap with the <tt>serviceSubnet</tt>.</p>

### IAM Service Account and project role

The aim of this section is to avoid using logged in credentials. Instead, we will be delegating to google iam keys, roles, and services policies to deploy clusters. At the prerequisite step, we have already created a Konvoy **role** and **granted permissions** (see [here][install_gcp]).

Now, in further steps you will be creating a **service-account** (Konvoy), binding both **roles** to **service-account**, and generating an **application key**.

  ```bash
  gcloud iam service-accounts create konvoy --description "Management of Konvoy clusters" --display-name "Konvoy Management"
  gcloud projects add-iam-policy-binding ${GOOGLE_PROJECT} --member serviceAccount:konvoy@${GOOGLE_PROJECT}.iam.gserviceaccount.com --role projects/${GOOGLE_PROJECT}/roles/konvoy
  gcloud iam service-accounts keys create ${HOME}/.config/gcloud/konvoy-sa-${GOOGLE_PROJECT}.json --iam-account konvoy@${GOOGLE_PROJECT}.iam.gserviceaccount.com
  export GOOGLE_APPLICATION_CREDENTIALS="${HOME}/.config/gcloud/konvoy-sa-${GOOGLE_PROJECT}.json"
  ```

You then need to add an IAM **Service Account** and project **Role** can be used in the `cluster.yaml file`, provided that the right policies are set:

  ```yaml
  ...
  spec:
    provider: gcp
    nodePools:
    - name: worker
      count: 4
      machine:
        gcp:
          iam:
            serviceAccount:
              name: "service-account-name@GCPPROJECTNAME.iam.gserviceaccount.com"
              role: "project-role-name-to-be-used"
  …
    - name: master
      count: 3
      machine:
        gcp:
          iam:
            serviceAccount:
              name: "service-account-name@GCPPROJECTNAME.iam.gserviceaccount.com"
              role: "project-role-name-to-be-used"
  ...
  ```

[disks]: https://cloud.google.com/compute/docs/disks/
[ephemeral_storage]: ../../../storage/
[forwading_rules_internal]: https://cloud.google.com/load-balancing/docs/internal/setting-up-internal#test-from-backend-vms
[gcp_regions]: https://cloud.google.com/compute/docs/regions-zones
[install_gcp]: ../../install-gcp#before-you-begin
[node_pools]: ../../node-pools/
[public_images]: https://cloud.google.com/compute/docs/images
[virtual_machine_types]: https://cloud.google.com/compute/docs/machine-types
