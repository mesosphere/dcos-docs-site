---
layout: layout.pug
navigationTitle: Create an AMI
title: Create an AMI
menuWeight: 9
excerpt: Create an AMI using the DKP image builder
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>Docker image downloads on this page include code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. Complete source code for MinIO is available <a href="https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z">here</a> and <a href="https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z">here</a>.</p>

## Create an AMI to be used in an air-gapped cluster

Using the [Konvoy Image Builder](../../../../image-builder), you can build an AMI without requiring access to the internet by providing an additional `--override` flag.

1.  Create the directories where you will place the air-gapped bundles:

    ```bash
    mkdir artifacts
    mkdir artifacts/images
    ```

1.  Define an environment variable for the Kubernetes version that corresponds with Konvoy release you are installing. You can find the correct Kubernetes version by checking the release notes for the release you are installing.

    ```bash
    export VERSION=1.22.8
    ```

1.  Set an environment variable for the AMI's OS you are will be using.
    The OS packages bundles will contain the RPMs for Containerd, Kubernetes and all of their dependencies required to install these packages without access to any external RPM repositories.
    The available options are:

    * `centos_7_x86_64`
    * `centos_7_x86_64_fips`
    * `redhat_7_x86_64`
    * `redhat_7_x86_64_fips`
    * `redhat_8_x86_64`
    * `redhat_8_x86_64_fips`

    ```bash
    export BUNDLE_OS=centos_7_x86_64
    ```

1.  Download the OS packages bundle:

    ```bash
    curl --output artifacts/"$VERSION"_"$BUNDLE_OS".tar.gz -O https://downloads.d2iq.com/dkp/airgapped/os-packages/"$VERSION"_"$BUNDLE_OS".tar.gz
    ```

1.  Download the Kubernetes images bundle. This bundle includes the necessary images for `kubeadm` to bootstrap a Kubernetes `Node`.

    The available options for each Kubernetes version are:

    * `<version>_images.tar.gz`
    * `<version>_images_fips.tar.gz`

    ```bash
    curl --output artifacts/images/"$VERSION"_images.tar.gz -O https://downloads.d2iq.com/dkp/airgapped/kubernetes-images/"$VERSION"_images.tar.gz
    ```

1.  Download the PIP packages. This bundle includes a few packages required by DKP to bootstrap machines.

    ```bash
    curl --output artifacts/pip-packages.tar.gz -O https://downloads.d2iq.com/dkp/airgapped/pip-packages/pip-packages.tar.gz
    ```

1.  Follow the instructions to [build an AMI][kib_create_ami] in the setting an additional `--overrides overrides/offline.yaml` flag.

Then, you can [seed your docker registry][seed-a-registry].

[kib_create_ami]: ../../../../image-builder/create-ami/
[seed-a-registry]: ../seed-a-registry
