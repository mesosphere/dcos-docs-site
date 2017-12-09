---
layout: layout.pug
navigationTitle:  Install and Customize
title: Install and Customize
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


The default DC/OS Kubernetes package installation provides reasonable defaults for trying out the service.
As of this writing, this service is not certified for production use.

## Prerequisites

- Your cluster must have at least 3 private nodes with: 6 CPU | 5654 MB MEM | 615 MB Disk.  For larger deployments, refer to the resource requirements of each component, on each node.

|                   | cpu   | mem (MB) | disk (MB) |
| ----------------- | ----- | -------- | --------- |
| etcd              | 0.5   | 512MB    | 512       |
| kube-scheduler    | 0.5   | 256      | -         |
| kube-controller   | 0.5   | 256      | 256       |
| kube-apiserver    | 0.5   | 512      | -         |
| kube-proxy        | 0.1   | 128      | -         |
| kubelet           | 2     | 2048     | 1024      |
| Package scheduler | 1     | 1000     | -         |

# Installing from the DC/OS CLI

To start a basic test cluster of Kubernetes, run the following command:

```shell
dcos package install beta-kubernetes
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install beta-kubernetes --options=options.json
```

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](/latest/usage/managing-services/config-universe-service/) for service configuration access.

## Installng from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/latest/usage/managing-services/install/). If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.
From the DC/OS CLI, enter:

```shell
dcos package install beta-kubernetes --cli
```

Choose `ADVANCED INSTALLATION` to perform a custom installation.
