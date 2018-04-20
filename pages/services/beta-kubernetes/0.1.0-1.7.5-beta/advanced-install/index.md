---
layout: layout.pug
navigationTitle:  Advanced Installation
title: Advanced Installation
menuWeight: 30
excerpt:
featureMaturity:
enterprise: false
---

# Advanced Installation

For larger deployments, refer to the resource requirements of each component, on each node.

|                   | cpu   | mem   | disk |
| ----------------- | ----- | ----- | ---- |
| etcd	            | 0.5	  | 512	  | 512  |
| kube-scheduler	  | 0.5	  | 256   |    - |
| kube-controller	  |   -   | 0.5	  | 256  |
| kube-apiserver	  | 0.5	  | 512   | -    |
| kube-proxy	      | 0.1	  | 128   |    - |
| kubelet	          |  -    | 2	    | 2048 |
| Kubernetes package|	1	    | 1000  |   -  |

The Kubernetes package allows you to specify the number of worker nodes you would like in your cluster. To increase the kubelet count from the default 3, create this JSON options file.

```
{
   "kubernetes":{
      "node_count":10
   }
}
```

Then, install Kubernetes with your custom configuration.

```
dcos package install beta-kubernetes --options=options.json
```

# Enabling TLS for Kubernetes Components (Enterprise DC/OS Only)

**Prerequisites**
- The [DC/OS CLI](/1.10/cli/install/) and [Enterprise CLI](/1.10/cli/enterprise-cli/) installed.

To enable TLS, you must first create the service accounts you need, and then a secret store to bootstrap the PKI of the Kubernetes cluster.

```shell
dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts delete kubernetes
dcos security org service-accounts create -p public-key.pem -d 'My service account' kubernetes
dcos security secrets delete kubernetes/sa
dcos security secrets create-sa-secret private-key.pem kubernetes kubernetes/sa
```

Next, enter the values below in a JSON options file to pass to DC/OS when you install Kubernetes.

```
{
  "service": {
    "service_account": "kubernetes",
    "service_account_secret": "kubernetes/sa"
  }
}
```

Create a TLS-enabled Kubernetes cluster.

```
dcos package install beta-kubernetes --options=options.json
```
