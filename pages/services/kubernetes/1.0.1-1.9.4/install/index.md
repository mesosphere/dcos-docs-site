---
layout: layout.pug
navigationTitle: Install and Customize
title: Install and Customize
menuWeight: 10
excerpt:
---

<!-- The source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


The default DC/OS Kubernetes package installation provides reasonable defaults for trying out the service.
As of this writing, this service is not certified for production use.

## Prerequisites

In order to run the framework with its default parameters, your cluster must have at least one private agent with at least the available resources needed to run the tasks described in the table below.

|                   | instances per cluster | cpu per instance | mem (MB) per instance | disk (MB) per instance      |
| ----------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| Package scheduler | 1                     | 1                | 1024                  | -                           |
| etcd              | 1                     | 0.5              | 1024                  | 3072 for data, 512 for logs |
| kube-apiserver    | 1                     | 0.5              | 1024                  | -                           |
| kube-scheduler    | 1                     | 0.5              | 512                   | -                           |
| kube-controller   | 1                     | 0.5              | 512                   | -                           |
| kube-proxy        | 1                     | 0.1              | 128                   | -                           |
| kubelet           | 1                     | 3                | 3072                  | 10240                       |

For instructions on how to run a highly-available cluster please referr to
[Advanced Installation](../advanced-install).

# Installing from the DC/OS CLI

To start a Kubernetes cluster, run the following command:

```shell
dcos package install kubernetes
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install kubernetes --options=options.json
```

Please note that any custom value of `service.name` must start and end with an
alphanumeric character, be composed only of alphanumeric characters, underscores
and dashes, and be no longer than 24 characters. In particular, this means that
installing the package under a group (e.g., using `/dev/kubernetes` as the
service name) is not supported.

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](/latest/usage/managing-services/config-universe-service/) for service configuration access.

# Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/latest/usage/managing-services/install/). If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.
From the DC/OS CLI, enter:

```shell
dcos package install kubernetes --cli
```

Please note that any custom value of "Service/Name" must start and end with an
alphanumeric character, be composed only of alphanumeric characters, underscores
and dashes, and be no longer than 24 characters. In particular, this means that
installing the package under a group (e.g., using `/dev/kubernetes` as the
service name) is not supported.

Choose [Advanced Installation](../advanced-install) to learn how to perform a custom installation, including how
to set-up proxy, improve TLS, enable Kubernetes cloud-provider integration, backup/restore
and high-availability.
