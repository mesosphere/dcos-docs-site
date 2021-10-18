---
layout: layout.pug
navigationTitle: Configure Konvoy Automatic GPU Node Labels
title: Configure Konvoy Automatic GPU Node Labels
menuWeight: 10
excerpt: Configure Konvoy Automatic GPU Node Labels
beta: true
enterprise: false
---
## Configure Konvoy Automatic GPU Node Labels

When using GPU nodes, it is important they have the proper label identifying them as Nvidia GPU nodes. Node feature discovery (NFD), by default labels PCI hardware as:

```shell
"feature.node.kubernetes.io/pci-<device label>.present": "true"
```

where `<device label>` is by default:

```shell
< class > _ < vendor >
```

as [defined here:](https://kubernetes-sigs.github.io/node-feature-discovery/v0.7/get-started/features.html#pci)

However, due to the wide variety in devices and their assigned PCI classes, you may find that the labels assigned to your GPU nodes do not always properly identify them as containing an nVidia GPU.

If the default detection does not work, you can manually change the configmap "nvidia-feature-discovery.yaml" before creating the cluster and change the lines:

```yaml
          nodeSelector:
            feature.node.kubernetes.io/pci-< class > _ < vendor>.present: "true"
```

where `class` is any 4 digit number starting with `03xy` and the vendor for Nvidia is `10de`. If this is already deployed, you can always change the `daemonset` and change the `nodeSelector` field so that it will deploy to the right nodes.
