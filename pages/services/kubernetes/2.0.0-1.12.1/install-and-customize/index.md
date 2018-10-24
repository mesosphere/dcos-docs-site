---
layout: layout.pug
navigationTitle: Install and Customize
title: Install and Customize
menuWeight: 10
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

The default DC/OS Kubernetes package installation provides reasonable defaults.
However, there are many available options for advanced to further modify the installation, this page describes those options.

# Prerequisites

## Mesosphere Kubernetes Engine

Prior to installing this package you are required to install the `kubernetes` package, referred to as Mesosphere Kubernetes Engine or MKE, otherwise the installation will fail.

<p class="message--warning"><strong>WARNING: </strong>The package <tt>kubernetes-cluster</tt> cannot be operated without the <tt>kubernetes</tt> package, you must not uninstall <tt>kubernetes</tt> at any time.
</p>

### Installing on DC/OS Open

To install using the default options:

```shell
dcos kubernetes cluster create --yes
```

### Installing on DC/OS Enterprise

In order to run the `kubernetes` package on DC/OS Enterprise, a [service account](/1.12/security/ent/service-auth/) with permissions to run tasks with the `kubernetes-role` is required.

To provision such a service account, you first need to install the [DC/OS Enterprise CLI](/1.12/cli/).
Then, run the following:

```shell
dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts delete kubernetes
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes
dcos security secrets delete kubernetes/sa
dcos security secrets create-sa-secret private-key.pem kubernetes kubernetes/sa
```

Next, you need to [grant](/1.12/security/ent/perms-management/) the service account the correct permissions:

```shell
dcos security org users grant kubernetes dcos:mesos:master:reservation:role:kubernetes-role create
dcos security org users grant kubernetes dcos:mesos:master:framework:role:kubernetes-role create
dcos security org users grant kubernetes dcos:mesos:master:task:user:nobody create
```

Finally, you need to tell the package installer about the service-account you just created and where to find its credentials.
Create an `options.json` file, or edit an existing one:

```json
{
  "service": {
    "service_account": "kubernetes",
    "service_account_secret": "kubernetes/sa"
  }
}
```

Install the package:

```shell
dcos kubernetes cluster create --options=options.json
```

## Resources

In order to run the framework with its default parameters, your cluster must have at least one private agent with the following available resources:

### Mesosphere Kubernetes Engine

|                               | instances per cluster | cpu per instance | mem (MB) per instance | disk (MB) per instance |
| ----------------------------- | --------------------- | ---------------- | --------------------- | ---------------------- |
| Package scheduler             | 1                     | 1                | 1024                  | -                      |
| mesosphere-kubernetes-engine  | 1                     | 0.6              | 1056                  | -                      |

Memory and CPU settings of the `mesosphere-kubernetes-engine` pod can be re-configured.
Create an `options.json` file, or edit an existing one:

```json
{
  "mesosphere_kubernetes_engine":{
    "mem": 2048,
    "cpus": 1
  }
}
```

Install the package:

```shell
dcos kubernetes cluster create --options=options.json
```

### Kubernetes Cluster

The `kubernetes-cluster` service requires the following resources to run the tasks described in the table below:

|                         | instances per cluster | cpu per instance | mem (MB) per instance | disk (MB) per instance |
| ----------------------- | --------------------- | ---------------- | --------------------- | ---------------------- |
| Package scheduler       | 1                     | 1.1              | 1056                  | -                      |
| etcd                    | 1                     | 0.6              | 1056                  | 3584                   |
| kube-control-plane      | 1                     | 1.6              | 4128                  | 10240                  |
| kube-node               | 1                     | 3.1              | 3104                  | 10240                  |

If high-availability is desirable, the `kubernetes.high_availability` package option must be set to `true` and a minimum of three private agents is required. The new resource requirements described in the table below:

|                         | instances per cluster | cpu per instance | mem (MB) per instance | disk (MB) per instance |
| ----------------------- | --------------------- | ---------------- | --------------------- | ---------------------- |
| Package scheduler       | 1                     | 1.1              | 1056                  | -                      |
| etcd                    | 3                     | 0.6              | 1056                  | 3584                   |
| kube-control-plane      | 3                     | 1.6              | 4128                  | 10240                  |
| kube-node               | 1                     | 3.1              | 3104                  | 10240                  |

To enable high-availablity, create a `options.json` file, or edit an existing one:

```json
{
  "kubernetes": {
    "high_availability": true
  }
}
```

Install the package:

```shell
dcos kubernetes cluster create --options=options.json
```

If support for [ingress](../ingress) is desirable, the `kubernetes.public_node_count` package option must be set to the number of desired public Kubernetes nodes. The `kubernetes-cluster` service requires the following resources per public Kubernetes node:

|                         | cpu per instance | mem (MB) per instance | disk (MB) per instance |
| ----------------------- | ---------------- | --------------------- | ---------------------- |
| kube-node-public        | 1.6              | 1568                  | 2048                   |

# Basic Installation

## Installing from the DC/OS CLI

To install a Kubernetes cluster on DC/OS Enterprise Edition, you **must** specify a custom configuration in an `options.json` file where the options `service.service_account` and `service.service_account_secret` are properly set.
To do so, run `dcos kubernetes cluster create` using the `--options` parameter:

```shell
dcos kubernetes cluster create --options=options.json
```

On the other hand, to install a Kubernetes cluster on DC/OS Open Edition run the following command:

```shell
dcos kubernetes cluster create
```

The default configuration does not set the options `service.service_account`
and `service.service_account_secret`. Consequently this configuration will only work
on DC/OS Open Edition.

Please note that any custom value of `service.name` must consist of alphanumeric characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters, and be no longer than 24 characters.
It is also possible to install the package under a group (e.g., using `/dev/kubernetes` as the service name).
To do that, you need to give the user permissions for the folder (e.g. `/dev`) where you will install your service.

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](/1.12/deploying-services/config-universe-service/).

## Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/1.12/deploying-services/install/).
If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.  
From the DC/OS CLI, enter:

```shell
dcos package install kubernetes --cli
```

# Advanced Installation

## Change the Kubernetes nodes resource specification

The default, as mentioned above, is 3 CPUs, 3GB of RAM, and 10GB of disk.
However, the kubelet and the container runtime will reserve 1 CPU and 1GB of RAM.
This means that each Kubernetes node will have 2 CPUs, 2 GB of RAM, and 10GB of disk allocatable to Kubernetes pods.

For more information, read the official documentation for [Kubernetes node-allocatable](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

DC/OS Kubernetes allows you to specify the resources for public and private nodes separately.

As an example, we are going to request 2 private Kubernetes nodes with 4 CPU, 8GB of RAM and 100GB of disk, and 1 public Kubernetes node with 2 CPU, 4GB of RAM and 10GB of disk allocatable to Kubernetes pods.

Create an `options.json` file, or edit an existing one:

```json
{
  "kubernetes": {
    "private_node_count": 2,
    "private_reserved_resources": {
      "kube_cpus": 4,
      "kube_mem": 8192,
      "kube_disk": 102400,
    },
    "public_node_count": 1,
    "public_reserved_resources": {
      "kube_cpus": 2,
      "kube_mem": 1024,
      "kube_disk": 512
    }
  }
}
```

See [Cluster Sizing](../cluster-sizing) page for a more detailed explanation.

## Change the number of Kubernetes nodes

DC/OS Kubernetes allows you to specify the number of private and public Kubernetes nodes in your cluster.

### Private nodes

The default private node count is 1. To change this value, specify `kubernetes.private_node_count` in a JSON options file, as shown below.

As an example, we are going to request 10 private Kubernetes nodes.

Create an `options.json` file, or edit an existing one and install:

```json
{
  "kubernetes": {
    "private_node_count": 10
  }
}
```

### Public nodes

The default public node count is 0. To change this value, specify `kubernetes.public_node_count` in a JSON options file, as shown below.

As an example, we are going to request 2 additional public Kubernetes nodes to the previous 10 private Kubernetes nodes.

Create an `options.json` file, or edit an existing one and install:

```json
{
  "kubernetes": {
    "private_node_count": 10,
    "public_node_count": 2
  }
}
```

## Placement Constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster.

Placement constraints use the [Marathon operators](http://mesosphere.github.io/marathon/docs/constraints.html) syntax.
For example, `[["hostname", "UNIQUE"]]` ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to and can be achieved using the following:

`[["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]`

**Note**: Be sure to include excess capacity in such a scenario so that if one of the whitelisted systems goes down, there is still enough capacity to repair your service.

Create an `options.json` file, or edit an existing one and install:

```json
{
  "kubernetes": {
    "control_plane_placement": "[[\"disk\",\"IS\",\"fast-ssd\"]]",
    "private_node_placement": "[\"hostname\",\"UNIQUE\"]",
    "public_node_placement": "[\"hostname\",\"UNIQUE\"]"
  }
}
```

### Updating Placement Constraints

**Note**: already running service pods will not be affected by changes in placement constraints.
This is because altering a placement constraint might invalidate the current placement of a running pod; the pod will not be relocated automatically as doing so is a destructive action.
We recommend using the following procedure to update the placement constraints of a pod:

* Update the placement constraint definition in the service.
* For each affected pod, one at a time, perform a pod replace. This will (destructively) move the pod to be in accordance with the new placement constraints.

## TLS

This package enforces TLS for mutual-authentication and communications encryption wherever possible.
Below, you can find more details where, when, and how it happens.

### Encryption and mutual-authentication

TLS for mutual-authentication and communications encryption implemented as:

* `etcd` cluster peers - only encryption is enabled but not mutual-authentication since `etcd` doesn't validate peer certificates based on the provided hostname but rather on the IP addresses the peer sees as peers, or DNS SRV discovery which DC/OS doesn't support.
* `etcd` client-server - both encryption and mutual-authentication are enabled. The only client in place is the `kube-control-plane`, meaning that the communication between the Kubernetes API and `etcd` is secured.
* All Kubernetes components have encryption and mutual-authentication enabled, including `kube-control-plane`, `kube-proxy` and the `kubelet`.
* All included (mandatory) add-ons, including on-demand backup/restore, respect mutual-authentication against the Kubernetes API.

### TLS Open vs Enterprise DC/OS

TLS artifacts, such as key pairs (private and public) and certificates, are created, signed, and exchanged in order to prove identity of entities like people, organizations, applications, etc., with the purpose of establishing trust. For this trust establishment to happen, [Public Key Infrastructure or PKI](https://en.wikipedia.org/wiki/Public_key_infrastructure) is required.

In the past, this package supported TLS only when running on DC/OS Enterprise which provides the mechanisms needed for PKI:

* [DC/OS CA](/1.12/security/ent/tls-ssl/) - a centralized certificate-authority (CA) for validating and, eventually, signing certificate signing requests (CSRs).
* [DC/OS Secrets](/1.12/security/ent/secrets/) - a centralized and secure way to distribute TLS artifacts to package components, such as the Kubernetes components, and other applications living in the same DC/OS cluster.
* [DC/OS Service Accounts](/1.12/security/ent/service-auth/) - needed for our package and applications to authenticate against the services named above.

DC/OS Open doesn't provide the functionality describe above. The following diagram describes how this was achieved on DC/OS Open.

![alt text](/services/kubernetes/2.0.0-1.12.1/img/tls.png "TLS design")

### TLS Provisioning in DC/OS Enterprise

When installing DC/OS Kubernetes on a DC/OS Enterprise cluster, a [service account](/1.12/security/ent/service-auth/) is mandatory.

This service account must be setup with adequate permissions in order to manage CA and secrets, and it **MUST** be provisioned before installing DC/OS Kubernetes.

In order to provision such service account, first you need to install the [DC/OS Enterprise CLI](/1.12/cli/). Then, run the following:

```shell
dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts delete kubernetes-cluster
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes-cluster
dcos security secrets delete kubernetes-cluster/sa
dcos security secrets create-sa-secret private-key.pem kubernetes-cluster kubernetes-cluster/sa
```

Next, you need to [grant](/1.12/security/ent/perms-management/) the service account the correct [permissions](/1.11/security/ent/perms-reference/).

The required permissions are:

```shell
dcos:mesos:master:framework:role:<service name>-role create
dcos:mesos:master:task:user:root create
dcos:mesos:agent:task:user:root create
dcos:mesos:master:reservation:role:<service name>-role create
dcos:mesos:master:reservation:principal:<service name> delete
dcos:mesos:master:volume:role:<service name>-role create
dcos:mesos:master:volume:principal:<service name> delete

dcos:secrets:default:/<service name>/* full
dcos:secrets:list:default:/<service name> read
dcos:adminrouter:ops:ca:rw full
dcos:adminrouter:ops:ca:ro full

dcos:mesos:master:framework:role:slave_public/<service name>-role create
dcos:mesos:master:framework:role:slave_public/<service name>-role read
dcos:mesos:master:reservation:role:slave_public/<service name>-role create
dcos:mesos:master:volume:role:slave_public/<service name>-role create
dcos:mesos:master:framework:role:slave_public read
dcos:mesos:agent:framework:role:slave_public read
```

where `<service name>` is the name of the service to be installed, e.g. `kubernetes-cluster`.
It should be noted that failing to adequately grant these permissions to the service account will cause the framework scheduler to enter a crash loop and the installation to fail.

Finally, to tell the package installer about the service-account you just created and where to find its credentials.
Create an `options.json` file, or edit an existing one:

```json
{
  "service": {
    "service_account": "kubernetes-cluster",
    "service_account_secret": "kubernetes-cluster/sa"
  }
}
```

Install the package:

```shell
dcos kubernetes cluster create --options=options.json
```

<p class="message--warning"><strong>WARNING: </strong>It is not possible to install DC/OS Kubernetes in DC/OS Enterprise without specifying adequate values for <tt>service.service_account</tt> and <tt>service.service_account_secret</tt>. Attempting to install the package without specifying these values or while specifying a service account with inadequate permissions will cause the framework scheduler to enter a crash loop, and hence the installation to fail.
</p>

## When you have a proxy

When there is a proxy setup between the DC/OS cluster(s) and the Internet, improper configuration may result in issues installing this package, namely failing to run `kube-dns` and other add-ons pods.  
Below is an example of such failure:

```text
Normal Created 5m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Created container
Normal Started 5m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Started container
Normal Pulled 5m (x2501 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Container image "gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.5" already present on machine
Warning BackOff 3m (x32719 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Back-off restarting failed container
Warning Unhealthy 3m (x10009 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Liveness probe failed: Get http://9.0.6.3:10054/healthcheck/dnsmasq: net/http: request canceled (Client.Timeout exceeded while awaiting headers)
Normal Pulled 3m (x2645 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Container image "gcr.io/google_containers/k8s-dns-sidecar-amd64:1.14.5" already present on machine
Normal Created 3m (x2646 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Created container
Normal Killing 3m (x2502 over 8d) kubelet, kube-node-5-kubelet.kubernetes-cluster.mesos Killing container with id docker://dnsmasq:pod "kube-dns-2102953216-qwvtn_kube-system(fd285861-ce3a-11e7-9ca9-005056945d21)" container "dnsmasq" is unhealthy, it will be killed and re-created.
(...)
```

Looking closely, the issue here is that the `kubelet` is not able to HTTP GET the `kube-dns` endpoints used in liveness and readiness probes causing containers to restart.  
This occurs when `HTTP_PROXY` and/or `HTTPS_PROXY` on a DC/OS agent are set, causing the `kubelet` task to inherit these settings and inadvertently use the proxy when connecting to the containers it manages.

The solution is to set `NO_PROXY` environment variables with the pod overlay value, eg. `NO_PROXY=9.0.0.0/8`.

## When 10.100.0.0/16 is in use

By default, the Kubernetes cluster will use `10.100.0.0/16` as the service CIDR. If this CIDR is already in use on your network, a change to the Kubernetes cluster service CIDR is required.

Create an `options.json` file, or edit an existing one and install:

```json
{
  "kubernetes": {
    "service_cidr": "<YOUR_CIDR_HERE>"
  }
}
```

**Attention:** replace `<YOUR_CIDR_HERE>` above with a CIDR block that is not already assigned somewhere in your network, e.g. `10.90.0.0/16`.
