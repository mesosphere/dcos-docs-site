---
layout: layout.pug
navigationTitle: Create an AMI
title: Create an AMI
menuWeight: 9
excerpt: Create an AMI using the DKP image builder
enterprise: false
---

## Create an AMI to be used in an air-gapped cluster

<p class="message--note"><strong>NOTE: </strong>These Docker images include code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. The complete source code for MinIO is available for the <a href="https://github.com/minio/minio/tree/RELEASE.2020-12-03T05-49-24Z">2020 release</a> and the <a href="https://github.com/minio/minio/tree/RELEASE.2021-07-30T00-02-00Z">2021 release</a>.</p>

Using the [Konvoy Image Builder](../../../../image-builder), you can build an AMI without requiring access to the internet by providing an additional `--override` flag.

1.  Create the directories where you will place the air-gapped bundles:

    ```bash
    mkdir artifacts
    mkdir artifacts/images
    ```

1.  Define an environment variable for the Kubernetes version that corresponds with Konvoy release you are installing. You can find the correct Kubernetes version by checking the release notes for the release you are installing.

    ```bash
    export VERSION=1.21.6
    ```

1.  Download the OS packages bundle:

    ```bash
    curl --output artifacts/"$VERSION"_x86_64_rpms.tar.gz -O http://downloads.d2iq.com/konvoy/airgapped/os-packages_"$VERSION"_x86_64_rpms.tar.gz
    ```

1.  Download the Kubernetes images bundle. This bundle includes the necessary images for `kubeadm` to bootstrap a Kubernetes `Node`.

    ```bash
    curl --output artifacts/images/"$VERSION"_images.tar.gz -O http://downloads.d2iq.com/konvoy/airgapped/kubernetes_image_bundle_v"$VERSION"_linux_amd64.tar.gz
    ```

1.  Download the PIP packages. This bundle includes a few packages required by DKP to bootstrap machines.

    ```bash
    curl --output artifacts/pip-packages.tar.gz -O http://downloads.d2iq.com/konvoy/airgapped/pip-packages.tar.gz
    ```

1.  Follow the instructions to [build an AMI][kib_create_ami] in the setting an additional `--overrides overrides/offline.yaml` flag.

Then, you can [seed your docker registry][seed-a-registry].

[kib_create_ami]: ../../../../image-builder/create-ami/
[seed-a-registry]: ../seed-a-registry
