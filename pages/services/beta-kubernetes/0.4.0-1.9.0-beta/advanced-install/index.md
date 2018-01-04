---
layout: layout.pug
navigationTitle:  Advanced Installation
title: Advanced Installation
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

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

Refer to the table above for tailored resource calculation.

## Change the Kubernetes worker nodes spec

The default, as shown in the table above, is 3 CPUs, 3GB of RAM, and 1GB of disk. However, the kubelet and the container runtime will have reserved 1 CPU and 1GB of RAM. This means that each Kubernetes node will have 2 CPUs, 2 GB of RAM, and 1GB of disk allocatable to Kubernetes pods.

For more information, read the official documentation for [Kubernetes node-allocatable](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

DC/OS Kubernetes allows you to specify the Kubernetes worker nodes' resource specification.

As an example, we are going to request Kubernetes worker nodes with 1 CPU, 1GB of RAM and 512MB of disk.

**Note:** This requires at least 3 DC/OS agents, each with at least 2 CPUs, 3GB of RAM, and 512MB of disk not
allocated to any other tasks. The extra resources are used by kubernetes system daemons like the kubelet and
container runtime.

Create a JSON options file, or edit an existing one, with the following contents:

```
{
  "kubernetes": {
    "reserved_resources": {
      "kube_cpus": 1,
      "kube_mem": 1024,
      "kube_disk": 512
    }
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

**Note:** This requires at least 10 DC/OS agents, each with 3 CPUs, 4GB of RAM and 1GB of disk.

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

Enabling TLS for mutual-authentication and encryption between Kubernetes components on Enterprise DC/OS
requires a [service-account](https://docs.mesosphere.com/latest/security/service-auth/custom-service-auth/) with
superuser privileges to:

- Generate and sign TLS certificates and keys with [DC/OS Certificate Authority](https://docs.mesosphere.com/1.10/networking/tls-ssl/).
- Securely store and distribute TLS certificates and keys artifacts with [DC/OS Secrets](https://docs.mesosphere.com/1.10/security/secrets/).

The instructions below require you to install the
[Enterprise CLI](https://docs.mesosphere.com/1.10/cli/enterprise-cli/) before installing the DC/OS Kubernetes package.
You must have `superuser` permissions to execute the following commands.

```
dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts delete kubernetes
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes
dcos security secrets delete kubernetes/sa
dcos security secrets create-sa-secret private-key.pem kubernetes kubernetes/sa
dcos security org groups add_user superusers kubernetes
```

Next, pass the created service-account and its secret credentials to the package installation.

Create an options JSON file, or edit an existing oney, with the following contents:

```
{
  "service": {
    "service_account": "kubernetes",
    "service_account_secret": "kubernetes/sa"
  }
}
```

Save the JSON file as `options.json` and install as follows:

```
dcos package install beta-kubernetes --options=options.json
```

# When you have a proxy

Some users may have a proxy setup between their DC/OS cluster(s) and the Internet.
This has resulted in issues installing this package, namely failing to run `kube-dns`
and other add-ons pods.
Below is an example of such failure:

```
Normal Created 5m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Created container
Normal Started 5m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Started container
Normal Pulled 5m (x2501 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Container image "gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.5" already present on machine
Warning BackOff 3m (x32719 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Back-off restarting failed container
Warning Unhealthy 3m (x10009 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Liveness probe failed: Get http://9.0.6.3:10054/healthcheck/dnsmasq: net/http: request canceled (Client.Timeout exceeded while awaiting headers)
Normal Pulled 3m (x2645 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Container image "gcr.io/google_containers/k8s-dns-sidecar-amd64:1.14.5" already present on machine
Normal Created 3m (x2646 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Created container
Normal Killing 3m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes.mesos Killing container with id docker://dnsmasq:pod "kube-dns-2102953216-qwvtn_kube-system(fd285861-ce3a-11e7-9ca9-005056945d21)" container "dnsmasq" is unhealthy, it will be killed and re-created.
(...)
```

Looking closely, the issue here is that the `kubelet` is not able to HTTP GET the
`kube-dns` endpoints used for liveness and readiness probing and therefore the containers
are always restarting.
But why does this happen? Well, setting `HTTP_PROXY` and/or
`HTTPS_PROXY` on a DC/OS agent causes the `kubelet` task to inherit the same values
and therefore forces the `kubelet` to try and use the proxy in order to reach the
containers it manages.

A solution is to specify another environment variables, `NO_PROXY`, in order for the `kubelet`
to know it shouldn't use the proxy for HTTP GET from Kubernetes pod containers, e.g. setting
the `NO_PROXY` value to the Kubernetes pod overlay subnet, `NO_PROXY=9.0.0.0/8`.
