---
layout: layout.pug
navigationTitle:  Install and Customize
title: Install and Customize
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


The default DC/OS Kubernetes package installation provides reasonable defaults for trying out the service.
As of this writing, this service is not certified for production use.

## Prerequisites

In order to run the framework with its default parameters, your cluster must have at least 3 private agents, each with at least the following available resources:

- 6 CPU
- 6272 MB RAM
- 4608 MB Disk.

For tailored deployments, refer to the table below for resource calculation:

|                   | instances per cluster | cpu   | mem (MB) | disk (MB)                   |
| ----------------- | --------------------- | ----- | -------- | --------------------------- |
| Package scheduler | 1                     | 1     | 1024     | -                           |
| etcd              | 3                     | 0.5   | 1024     | 3072 for data, 512 for logs |
| kube-apiserver    | 3                     | 0.5   | 1024     | -                           |
| kube-scheduler    | 3                     | 0.5   | 512      | -                           |
| kube-controller   | 3                     | 0.5   | 512      | -                           |
| kube-proxy        | 3                     | 0.1   | 128      | -                           |
| kubelet           | 3                     | 2     | 2048     | 1024                        |

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

For more information on building the `options.json` file, see the [DC/OS documentation](/1.10/deploying-services/config-universe-service/) for service configuration access.

## Installng from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/latest/usage/managing-services/install/). If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.
From the DC/OS CLI, enter:

```shell
dcos package install beta-kubernetes --cli
```

Choose `ADVANCED INSTALLATION` to perform a custom installation.
