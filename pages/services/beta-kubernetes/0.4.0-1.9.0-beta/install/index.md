---
post_title: Install and Customize
menu_order: 20
feature_maturity: ""
enterprise: 'no'
---

The default DC/OS Kubernetes package installation provides reasonable defaults for trying out the service.
As of this writing, this service is not certified for production use.

## Prerequisites
In order to run the framework with its default parameters, your cluster must have at least 3 private agents, each with at least the available resources needed to run the tasks described in the table below.

|                   | instances per cluster | cpu   | mem (MB) | disk (MB)                   |
| ----------------- | --------------------- | ----- | -------- | --------------------------- |
| Package scheduler | 1                     | 1     | 1024     | -                           |
| etcd              | 3                     | 0.5   | 1024     | 3072 for data, 512 for logs |
| kube-apiserver    | 3                     | 0.5   | 1024     | -                           |
| kube-scheduler    | 3                     | 0.5   | 512      | -                           |
| kube-controller   | 3                     | 0.5   | 512      | -                           |
| kube-proxy        | 3                     | 0.1   | 128      | -                           |
| kubelet           | 3                     | 3     | 3072     | 1024                        |

# Installing from the DC/OS CLI

To start a Kubernetes cluster, run the following command:

```shell
dcos package install beta-kubernetes
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install beta-kubernetes --options=options.json
```

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](https://docs.mesosphere.com/latest/usage/managing-services/config-universe-service/) for service configuration access.

# Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](https://docs.mesosphere.com/latest/usage/managing-services/install/). If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.
From the DC/OS CLI, enter:

```shell
dcos package install beta-kubernetes --cli
```

Choose `ADVANCED INSTALLATION` to perform a custom installation.
