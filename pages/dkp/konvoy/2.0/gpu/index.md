---
layout: layout.pug
navigationTitle: GPUs
title: Konvoy GPU Caveats
menuWeight: 150
excerpt: Konvoy GPU issues
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

For Konvoy users there are certain issues and caveats you should know when preparing to use GPU nodes. These are:

- [GPU node labeling specifications](#how-to-use-konvoy-automatic-gpu-node-labels)

- [Creating GPU enabled on-premises configurations](#install-gpu-support-on-supported-distributions-on-premise)

Kommander can also access [GPU](https://docs.d2iq.com/dkp/kommander/2.0/gpu/) resources.

## How to use Konvoy automatic GPU node labels

Node feature discovery, (NFD), by default labels PCI hardware as:

```yaml
"feature.node.kubernetes.io/pci-<device label>.present": "true"
```

where `<device label>` is by default:

```bash
< class > _ < vendor >
```

as [defined here:](https://kubernetes-sigs.github.io/node-feature-discovery/v0.7/get-started/features.html#pci)

However, due to the wide variety in devices and their assigned PCI classes, you may find that the labels assigned to your GPU nodes do not always properly identify them as containing an nVidia GPU.

For now, if the default detection does not work, you can manually change the configmap "nvidia-feature-discovery.yaml" before creating the cluster and change the lines:

```yaml
          nodeSelector:
            feature.node.kubernetes.io/pci-< class > _ < vendor>.present: "true"
```

where `class` is any 4 digit number starting with `03xy` and the vendor for Nvidia is `10de`. If this is already deployed, you can always change the `daemonset` and change the `nodeSelector` field so that it will deploy to the right nodes.

## Install GPU support on supported distributions on-premise

Using the [Konvoy Image Builder](../image-builder), you can build an image that has support to use Nvidia GPU hardware to support GPU workloads.

1. In your `overrides/nvidia.yaml` file add the following to enable GPU builds. You can also access and use the overrides [repo.](https://github.com/mesosphere/konvoy-image-builder/tree/main/overrides)

    ```yaml
    gpu:
      type: nvidia
    ```

1. Use the following Konvoy image builder command to build your image:

    ```bash
    konvoy-image build --region us-west-2 --source-ami=ami-12345abcdef images/ami/centos-7.yaml --overrides overrides/nvidia.yaml
    ```

    By default it builds in the `us-west-2` region. To specify another region set the `--region` flag:

    ```bash
    konvoy-image build --region us-east-1 --overrides override-source-ami.yaml --overrides override-images.yaml images/ami/centos-7.yaml
    ```

    When the command is complete the `ami` id is printed and written to `./manifest.json`.

    To use the built `ami` with Konvoy, specify it with the `--ami` flag when calling cluster create.

    ```bash
    dkp create cluster aws --cluster-name=$(whoami)-aws-cluster --region us-west-2 --ami ami-0123456789
    ```
