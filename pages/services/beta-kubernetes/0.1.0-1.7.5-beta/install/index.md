---
layout: layout.pug
navigationTitle:  Install and Customize
title: Install and Customize
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

The default DC/OS Kubernetes Service installation provides reasonable defaults for trying out the service. This service is not currently certified for production use.

## Prerequisites

- If you are using Enterprise DC/OS, you must install the [Enterprise CLI](/1.9/cli/enterprise-cli/) and [provision a service account](/latest/security/service-auth/custom-service-auth/) before installing DC/OS Kubernetes Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/1.10/security/ent/service-auth/) requires a service account.
  - In `permissive` security mode, a service account is optional.
  - `disabled` security mode does not require a service account.
- Your cluster must have at least 3 private nodes with: 6 CPU | 5654 MB MEM | 615 MB Disk. For larger deployments, refer to the resource requirements of each component, on each node.

|                   | cpu   | mem   | disk |
| ----------------- | ----- | ----- | ---- |
| etcd	            | 0.5	  | 512	  | 512  |
| kube-scheduler	  | 0.5	  | 256   |    - |
| kube-controller	  |   -   | 0.5	  | 256  |
| kube-apiserver	  | 0.5	  | 512   | -    |
| kube-proxy	      | 0.1	  | 128   |    - |
| kubelet	          |  -    | 2	    | 2048 |
| Kubernetes package|	1	    | 1000  |   -  |

# Installing from the DC/OS CLI

To start a basic test cluster of Kubernetes, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing Kubernetes on Enterprise DC/OS](/latest/security/service-auth/custom-service-auth/).

```shell
dcos package install beta-kubernetes
```

You can specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter.

```shell
dcos package install beta-kubernetes --options=options.json
```

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](/1.10/deploying-services/config-universe-service/) for service configuration access.

## Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/latest/usage/managing-services/install/). If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately. From the DC/OS CLI, enter:

```shell
dcos package install beta-kubernetes --cli
```

Go to the [Advanced Installation](/services/beta-kubernetes/v0.1.0-1.7.5-beta/advanced-install) for details on performing a custom installation.
