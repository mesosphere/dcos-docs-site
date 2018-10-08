---
layout: layout.pug
navigationTitle: Install and Customize
title: Install and Customize
menuWeight: 10
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


The default DC/OS Kubernetes package installation provides reasonable defaults for trying out the service.

## Prerequisites

### Resources

In order to run the framework with default parameters, your cluster must have at least one private agent with at least the available resources needed to run the tasks described in the table below.

|                         | instances per cluster | cpu per instance | mem (MB) per instance | disk (MB) per instance      |
| ----------------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| Package scheduler       | 1                     | 1                | 1024                  | -                           |
| etcd                    | 1                     | 0.5              | 1024                  | 3072 for data, 512 for logs |
| kube-apiserver          | 1                     | 0.5              | 1024                  | -                           |
| kube-scheduler          | 1                     | 0.5              | 512                   | -                           |
| kube-controller-manager | 1                     | 0.5              | 512                   | -                           |
| kube-proxy              | 1                     | 0.1              | 512                   | -                           |
| kubelet                 | 1                     | 3                | 3072                  | 10240                       |

For instructions on how to run a highly-available cluster please referr to
[Advanced Installation](../advanced-install).

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>Failing to meet these prerequisites will lead to tasks failing to be
scheduled. These tasks won't show up in the DC/OS UI or CLI and installation
will seem to be stuck.</p>
</div>

### Software

Each DC/OS agent (both private and public) must have the following binaries
installed and available in `$PATH`:

| Binary     |
| ---------- |
| `awk`      |
| `base64`   |
| `bash`     |
| `cat`      |
| `chmod`    |
| `cp`       |
| `cut`      |
| `dirname`  |
| `echo`     |
| `envsubst` |
| `grep`     |
| `host`     |
| `ip`       |
| `kill`     |
| `lscpu`    |
| `mkdir`    |
| `mount`    |
| `printf`   |
| `pwd`      |
| `rm`       |
| `sed`      |
| `sleep`    |
| `umount`   |
| `wc`       |

These binaries may already be bundled in the Linux distro in use, or they may
need to be installed using a package manager. For instance, installing these
binaries in CentOS would correspond to running the following command:

```shell
$ yum install -y \
    bash \
    bind-utils \
    coreutils \
    gawk \
    gettext \
    grep \
    iproute \
    util-linux \
    sed
```

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>Failing to meet these prerequisites will lead to tasks either failing to
start or erroring during execution, causing disruption in the cluster.</p>
</div>

# Installing from the DC/OS CLI

To start a Kubernetes cluster using the default configuration, run the following command:

```shell
dcos package install kubernetes
```

You can, instead, specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter:

```shell
dcos package install kubernetes --options=options.json
```

Please note that any custom value of `service.name` must consist of alphanumeric
characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters,
and be no longer than 24 characters. Additionally to that, it is now possible
to install the package under a group (e.g., using `/dev/kubernetes` as the
service name). To do that, you need to give the user permissions for the folder (e.g. `/dev`)
where you will install your service.

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](/1.11/deploying-services/config-universe-service/).

# Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/1.11/deploying-services/install/). If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.
From the DC/OS CLI, enter:

```shell
dcos package install kubernetes --cli
```
Please note that any custom value of "Service/Name" must consist of alphanumeric
characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters,
 and be no longer than 24 characters. Additionally to that, it is now possible
to install the package under a group (e.g., using `/dev/kubernetes` as the
service name). To do that, you need to give the user permissions for the folder (e.g. `/dev`)
where you will install your service.

Choose [Advanced Installation](../advanced-install) to learn how to perform a custom installation, including how
to set-up proxy, improve TLS, enable Kubernetes cloud-provider integration, backup/restore
and high-availability.
