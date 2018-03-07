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


For larger deployments, refer to the resource requirements of each component, on each node.

|                   | cpu   | mem (MB) | disk (MB) |
| ----------------- | ----- | -------- | --------- |
| etcd              | 0.5   | 512MB    | 512       |
| kube-scheduler    | 0.5   | 256      | -         |
| kube-controller   | 0.5   | 256      | 256       |
| kube-apiserver    | 0.5   | 512      | -         |
| kube-proxy        | 0.1   | 128      | -         |
| kubelet           | 2     | 2048     | 1024      |
| Package scheduler | 1     | 1000     | -         |

DC/OS Kubernetes allows you to specify the number of Kubernetes worker nodes in your cluster.

The default worker node count is 3. To change this value, specify `node_count` in a JSON options file, as shown below.

As an example, we are going to request 10 Kubernetes worker nodes.

**Note:** This requires at least 10 DC/OS agents, each with 2 CPUs and 2 GB of RAM.

Create a JSON options file, or edit an existing one, with the following contents:

```
{ "kubernetes":
    {
      "node_count": 10
    }
}
```

Save the file as `options.json` and install as follows:

```
dcos package install kubernetes --options=options.json
```

## Enabling TLS for Kubernetes components (Enterprise-only)

Enabling TLS for mutual-authentication and encryption between Kubernetes components requires Enterprise DC/OS
and a [service-account](/latest/security/service-auth/custom-service-auth/) with
superuser privileges to:
- Generate and sign TLS certificates and keys with [DC/OS Certificate Authority](/1.10/networking/tls-ssl/), and
- Securely store and distribute TLS certificates and keys artifacts with [DC/OS Secrets](/1.10/security/ent/secrets/).

The instructions we are about to provide you below require you to install the
[enterprise CLI](/1.10/cli/enterprise-cli/) before installing the DC/OS Kubernetes package.
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
dcos package install kubernetes --options=options.json
```
