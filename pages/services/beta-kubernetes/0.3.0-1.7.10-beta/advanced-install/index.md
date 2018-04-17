---
layout: layout.pug
navigationTitle:  Advanced Installation
title: Advanced Installation
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


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

## Change the Kubernetes worker nodes spec

DC/OS Kubernetes allows you to specify the Kubernetes worker nodes' resource specification.
The default, as shown in the table above, is 2 CPUs, 2GB of RAM, and 1GB of disk.

As an example, we are going to request Kubernetes worker nodes with 1 CPU, 1GB of RAM, and 512MB of disk.

**Note:** This requires at least 3 DC/OS agents, each with at least 1 CPU, 1 GB of RAM, and 512MV of disk not allocated to any other tasks.

Create a JSON options file, or edit an existing one, with the following contents:

```
{
  "kubernetes": {
    "node_cpus": 1,
    "node_mem": 1024,
    "node_disk": 512
  }
}
```

Save the file as `options.json` and install as follows:

```
dcos package install beta-kubernetes --options=options.json
```

## Change the number of Kubernetes worker nodes

DC/OS Kubernetes allows you to specify the number of Kubernetes worker nodes in your cluster.

The default worker node count is 3. To change this value, specify `node_count` in a JSON options file, as shown below.

As an example, we are going to request 10 Kubernetes worker nodes.

**Note:** This requires at least 10 DC/OS agents, each with 2 CPUs, 2 GB of RAM and 1GB of disk.

Create a JSON options file, or edit an existing one, with the following contents:

```
{
  "kubernetes": {
    "node_count": 10
  }
}
```

Save the file as `options.json` and install as follows:

```
dcos package install beta-kubernetes --options=options.json
```

## Enabling TLS for Kubernetes components (Enterprise-only)

Enabling TLS for mutual-authentication and encryption between Kubernetes components requires Enterprise DC/OS
and a [service-account](/latest/security/service-auth/custom-service-auth/) with
superuser privileges to:

- Generate and sign TLS certificates and keys with [DC/OS Certificate Authority](/1.10/networking/tls-ssl/), and
- Securely store and distribute TLS certificates and keys artifacts with [DC/OS Secrets](/1.10/security/ent/secrets/).

The instructions below require you to install the [Enterprise CLI](/1.10/cli/enterprise-cli/) before installing the DC/OS Kubernetes package.

Only someone with `superuser` permissions will be able to execute successfully the following:

```
dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts delete kubernetes
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes
dcos security secrets delete kubernetes/sa
dcos security secrets create-sa-secret private-key.pem kubernetes kubernetes/sa
dcos security org groups add_user superusers kubernetes
```

Next, you must pass the created service-account and its secret credentials to the package installation.

First create an options JSON file, or edit an existing one if any, with the following contents:

```
{
  "service": {
    "service_account": "kubernetes",
    "service_account_secret": "kubernetes/sa"
  }
}
```

Now, save the JSON file as `options.json` and install as follows:

```
dcos package install beta-kubernetes --options=options.json
```
