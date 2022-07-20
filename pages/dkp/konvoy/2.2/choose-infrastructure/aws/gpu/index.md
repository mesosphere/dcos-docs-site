---
layout: layout.pug
navigationTitle: GPUs
title: GPUs in an AWS environment
menuWeight: 60
excerpt: Konvoy GPUs
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Before working with GPUs, ensure you are familiar with the following:

- [Install GPU support on supported distributions on AWS](#install-gpu-support-on-supported-distributions-on-aws)

- [GPU node labeling specifications](./gpu-node-labels)

Kommander also accesses [GPU](/dkp/kommander/2.1/gpu/) resources.

<p class="message--note"><strong>NOTE: GPUs in an air-gapped on-premises environment are not currently supported.</p>

## Install GPU support on supported distributions on AWS

Using the [Konvoy Image Builder](../../../image-builder), you can build an image that has support to use Nvidia GPU hardware to support GPU workloads. The DKP supported Nvidia driver versions is 470.x.

1. In your `overrides/nvidia.yaml` file add the following to enable GPU builds. You can also access and use the overrides [repo.](https://github.com/mesosphere/konvoy-image-builder/tree/main/overrides)

    ```yaml
    gpu:
      type: nvidia
    ```

1. Build your image using the following Konvoy image builder commands:

    ```bash
    konvoy-image build --region us-west-2 --source-ami=ami-12345abcdef images/ami/centos-7.yaml --overrides overrides/nvidia.yaml
    ```

    By default, your image builds in the `us-west-2` region. To specify another region, set the `--region` flag:

    ```bash
    konvoy-image build --region us-east-1 --overrides override-source-ami.yaml images/ami/<Your OS>.yaml
    ```

    <p class="message--note"><strong>NOTE: </strong>Ensure that an AMI file is available for your OS selection.</p>

    When the command is complete the `ami` id is printed and written to `./manifest.json`.

    To use the built `ami` with Konvoy, specify it with the `--ami` flag when calling cluster create.

    ```bash
    dkp create cluster aws --cluster-name=$(whoami)-aws-cluster --region us-west-2 --ami <ami>
    ```

More helpful information can be found in the [Nvidia Device](https://github.com/NVIDIA/k8s-device-plugin/blob/master/README.md) Plug-in for Kubernetes instructions and the [Installation Guide of Supported Platforms](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html).

See also: [Nvidia documentation](https://nvidia.custhelp.com/app/answers/detail/a_id/131/kw/driver%20installation%20docs/related/1)
