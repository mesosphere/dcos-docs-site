---
layout: layout.pug
navigationTitle: Create AMI
title: Create a custom AMI
excerpt: Learn how to build a custom AMI for use with Konvoy
beta: true
enterprise: false
menuWeight: 60
---

This procedure describes how to use the Konvoy Image Builder to create [Cluster API](https://cluster-api.sigs.k8s.io/) a compliant Amazon Machine Image (AMI). AMI images contain configuration information and software to create a specific, pre-configured, operating environment. For example, you can create an AMI image of your current computer system settings and software. The AMI image can then be replicated and distributed, creating your computer system for other users. The Konvoy Image Builder uses variable `overrides` to specify base image and container images to use in your new AMI.

## Prerequisites

Before you begin, you must:

- Download the latest [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder/releases) bundle (prefixed with `konvoy-image-bundle`) for your OS. Do not use the release prefixed with `konvoy-image-builder`.
- Create a working `Docker` setup:

Extract the bundle and `cd` into the extracted `konvoy-image-bundle-$VERSION_$OS` folder. The bundled version of `konvoy-image` contains an embedded `docker` image that contains all the requirements for building.

<p class="message--note"><strong>NOTE: </strong> The <code>konvoy-image</code> binary and all supporting folders are also extracted. When run, <code>konvoy-image</code> bind mounts the current working directory (<code>${PWD}</code>) into the container to be used.</p>

-   Set environment variables for [AWS access](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). The following variables must be set using your credentials:

    ```bash
    export AWS_ACCESS_KEY_ID
    export AWS_SECRET_ACCESS_KEY
    export AWS_DEFAULT_REGION
    ```

## Override files

The Konvoy Image Builder uses yaml `override` files to configure specific attributes of your AMI file. These files provide information to override default values for certain parts of your AMI file.
`override` files can modify the version and parameters of the image description and the ansible playbook. Common overrides are found in the [repo](https://github.com/mesosphere/konvoy-image-builder/tree/main/overrides). The parts these files address are:

- **Base image:** The specific AMI image used as the base for your new AMI image.
- **Container images:** The container images that will be used in your AMI image.

### Base image override files

Currently the Konvoy Image Builder supports `ami` images based on Red Hat Enterprise Linux (RHEL) Centos  7, only. By default, Konvoy Image Builder searches for the latest Centos 7 `ami` for the base image. The current base image description, at `images/ami/centos-7.yaml`, is similar to the following:

```yaml
---
# Example images/ami/centos-7.yaml
download_images: true
packer:
  ami_filter_name: "CentOS 7.9.2009 x86_64"
  ami_filter_owners: "125523088429"
  distribution: "CentOS"
  distribution_version: "7"
  source_ami: ""
  ssh_username: "centos"
  root_device_name: "/dev/sda1"
build_name: "centos-7"
packer_builder_type: "amazon"
python_path: ""
```

<p class="message--note"><strong>NOTE: </strong>You can specify a base image to build on, using the <code>--source-ami</code> command line flag:<br />
<code>konvoy-image build --source-ami=ami-12345abcdef &lt;path/to/image.yaml&gt;</code></p>

To override the above base image with another base image, you can create an `override` file. Create a new file and set the `source_ami` under the `packer` key. This overrides the image search and forces the use of the specified `source_ami`.

```yaml
# Example override-source-ami.yaml
---
packer:
  source_ami: "ami-0123456789"
```

### Container image override files

The ansible playbooks pull a minimal set of [container images](https://github.com/mesosphere/konvoy-image-builder/blob/main/ansible/roles/images/defaults/main.yaml) for use. Additional images can be added or deleted by specifying an `override` file for the `extra_images` variable.

Konvoy requires several additional images be present in the image. Create a new override file and specify the following `extra_images`:

```yaml
# Example override-images.yaml
---
extra_images:
  - gcr.io/k8s-staging-cluster-api-aws/cluster-api-aws-controller:v0.6.4
  - gcr.io/kubebuilder/kube-rbac-proxy:v0.4.1
  - gcr.io/kubebuilder/kube-rbac-proxy:v0.8.0
  - quay.io/jetstack/cert-manager-cainjector:v1.1.0
  - quay.io/jetstack/cert-manager-controller:v1.1.0
  - quay.io/jetstack/cert-manager-webhook:v1.1.0
  - us.gcr.io/k8s-artifacts-prod/cluster-api-azure/cluster-api-azure-controller:v0.4.12
  - us.gcr.io/k8s-artifacts-prod/cluster-api/cluster-api-controller:v0.3.15
  - us.gcr.io/k8s-artifacts-prod/cluster-api/kubeadm-bootstrap-controller:v0.3.15
  - us.gcr.io/k8s-artifacts-prod/cluster-api/kubeadm-control-plane-controller:v0.3.15
  - mcr.microsoft.com/oss/azure/aad-pod-identity/nmi:v1.6.3
  - k8s.gcr.io/provider-aws/aws-ebs-csi-driver:v0.9.1
  - k8s.gcr.io/sig-storage/csi-attacher:v3.0.0
  - k8s.gcr.io/sig-storage/csi-node-driver-registrar:v2.0.1
  - k8s.gcr.io/sig-storage/csi-provisioner:v2.0.2
  - k8s.gcr.io/sig-storage/livenessprobe:v2.1.0
  - quay.io/tigera/operator:v1.15.0
  - calico/cni:v3.18.0
  - calico/kube-controllers:v3.18.0
  - calico/node:v3.18.0
  - calico/pod2daemon-flexvol:v3.18.0
  - calico/typha:v3.18.0
```

<p class="message--note"><strong>NOTE: </strong>These are the current versions from the Konvoy repo. The Azure images are not required for AWS AMIs but are included here as examples.

## Build the image

Run the `konvoy-image` command to build and validate the image.

```sh
konvoy-image build --overrides override-source-ami.yaml --overrides override-images.yaml images/ami/centos-7.yaml
```

By default it builds in the `us-west-2` region. to specify another region set the `--region` flag:

```sh
konvoy-image build --region us-east-1 --overrides override-source-ami.yaml --overrides override-images.yaml images/ami/centos-7.yaml
```

When the command is complete the `ami` id is printed and written to `./manifest.json`.

## Launch a Konvoy cluster with a custom AMI

To use the built `ami` with Konvoy, specify it with the `--ami` flag when calling cluster create.

```sh
konvoy create cluster aws --cluster-name=$(whoami)-aws-cluster --ami ami-0123456789
```

## Launch a Konvoy cluster with custom AMI lookup

By default `konvoy-image` will name the AMI in such a way that `konvoy` can discover the latest AMI for a base OS and Kubernetes version. To create a cluster that will use the latest AMI, specify the `--ami-format`, `--ami-base-os` and `--ami-owner` flags:

```sh
konvoy create cluster aws --cluster-name=$(whoami)-aws-cluster --ami-format "konvoy-ami-{{.BaseOS}}-?{{.K8sVersion}}-*" --ami-base-os centos-7 --ami-owner 123456789012
```

<!--- ## Air Gapped

TBD (for air gapped a larger set of `extra_images` are required.) -->
