---
layout: layout.pug
navigationTitle: Install and Customize
title: Install and Customize
menuWeight: 10
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


The default DC/OS Kubernetes package installation provides reasonable defaults for trying out the service.
However, there are many levers that will enable opt-in features or allow you to change the resources
allocated to your Kubernetes cluster. This page describes them.

# Prerequisites

## Package Manager

Prior to installing this package you are required to install the `beta-mke` package, otherwise the installation will fail. To install using the default options:

```shell
dcos package install --yes beta-mke
```

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>When running on a strict DC/OS cluster additional options are required to be set to secure the communication with the DC/OS components:</p>
</div>

```json
{
  "configuration": {
    "dcos_url": "https://leader.mesos/",
    "dcos_ca_bundle": "$MESOS_SANDBOX/.ssl/ca-bundle.crt",
  }
}
```

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>The package beta-kubernetes cannot be operated without beta-mke, you must not uninstall beta-mke at any time.</p>
</div>

## Resources

In order to run the framework with its default parameters, your cluster must have at least one private agent with at least the available resources needed to run the tasks described in the table below:

|                         | instances per cluster | cpu per instance | mem (MB) per instance | disk (MB) per instance      |
| ----------------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| Package scheduler       | 1                     | 1                | 1024                  | -                           |
| etcd                    | 1                     | 0.5              | 1024                  | 3072 for data, 512 for logs |
| kube-control-plane      | 1                     | 1.5              | 4096                  | -                           |
| kube-node               | 1                     | 3.0              | 3072                  | 10240                       |

If high-availability is desirable, the `kubernetes.high_availability` package
option must be enabled, and a minimum of three private agents is highly recommended (although not strictly necessary). In
the high-availability mode the resources needed to run the tasks are the
following:

|                         | instances per cluster | cpu per instance | mem (MB) per instance | disk (MB) per instance      |
| ----------------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| Package scheduler       | 1                     | 1                | 1024                  | -                           |
| etcd                    | 3                     | 0.5              | 1024                  | 3072 for data, 512 for logs |
| kube-control-plane      | 3                     | 1.5              | 4096                  | -                           |
| kube-node               | 1                     | 3.0              | 3072                  | 10240                       |

To enable high-availablity, create a JSON options file, or edit an existing one:

```json
{
  "kubernetes": {
    "high_availability": true,
  }
}
```

Assuming you save the file as `options.json`, install the package as follows:

```shell
dcos package install beta-kubernetes --options=options.json
```

## Software

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

To start a Kubernetes cluster using the default configuration, run the following command:

```shell
dcos package install beta-kubernetes
```

You can, instead, specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter:

```shell
dcos package install beta-kubernetes --options=options.json
```

Please note that any custom value of `service.name` must consist of alphanumeric
characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters,
and be no longer than 24 characters. Additionally to that, it is now possible
to install the package under a group (e.g., using `/dev/kubernetes` as the
service name). To do that, you need to give the user permissions for the folder (e.g. `/dev`)
where you will install your service.

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](/1.12/deploying-services/config-universe-service/).



# Basic Installation

## Installing from the DC/OS CLI

To start a Kubernetes cluster using the default configuration, run the following command:

```shell
dcos package install beta-kubernetes
```

You can, instead, specify a custom configuration in an `options.json` file and pass it to `dcos package install` using the `--options` parameter:

```shell
dcos package install beta-kubernetes --options=options.json
```

Please note that any custom value of `service.name` must consist of alphanumeric
characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters,
and be no longer than 24 characters. Additionally to that, it is now possible
to install the package under a group (e.g., using `/dev/kubernetes` as the
service name). To do that, you need to give the user permissions for the folder (e.g. `/dev`)
where you will install your service.

**Recommendation:** Store your custom configuration in source control.

For more information on building the `options.json` file, see [DC/OS documentation](/1.12/deploying-services/config-universe-service/).

## Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/1.12/deploying-services/install/). If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.
From the DC/OS CLI, enter:

```shell
dcos package install beta-kubernetes --cli
```

Please note that any custom value of "Service/Name" must consist of alphanumeric
characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters,
 and be no longer than 24 characters. Additionally to that, it is now possible
to install the package under a group (e.g., using `/dev/kubernetes` as the
service name). To do that, you need to give the user permissions for the folder (e.g. `/dev`)
where you will install your service.

See below to learn how to perform a custom installation, including how
to set-up proxy, improve TLS, enable Kubernetes cloud-provider integration, backup/restore
and high-availability.

# Advanced Installation

## Change the Kubernetes nodes resource specification

The default, as mentioned above, is 3 CPUs, 3GB of RAM, and 10GB of disk. However, the kubelet and the container runtime will have reserved 1 CPU and 1GB of RAM. This means that each Kubernetes node will have 2 CPUs, 2 GB of RAM, and 10GB of disk allocatable to Kubernetes pods.

For more information, read the official documentation for [Kubernetes node-allocatable](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

DC/OS Kubernetes allows you to specify the resources for public and private nodes separately.

As an example, we are going to request two private Kubernetes nodes with 1 CPU, 1GB of RAM and 512MB of disk, and one public Kubernetes node with 1 CPU, 1GB of RAM and 512MB of disk.

**Note:** This requires at least **one** DC/OS private agent with at least 3.4 CPUs, 5184MB of RAM and 512MB of disk, and **one** DC/OS public agent with at least 1.2 CPUs, 1568MB of RAM and 512MB of disk not allocated to any other tasks. Alternatively, one can use **two** DC/OS private agents and **one** DC/OS public agent, each with at least 1.2 CPUs, 1568MB of RAM and 512MB of disk not allocated to any other tasks. The extra resources are used by kubernetes system daemons like the kubelet and the container runtime.

Create a JSON options file, or edit an existing one:

```json
{
  "kubernetes": {
    "node_count": 2,
    "reserved_resources": {
      "kube_cpus": 1,
      "kube_mem": 1024,
      "kube_disk": 512
    },
    "public_node_count": 1,
    "public_reserved_resources": {
      "kube_cpus": 1,
      "kube_mem": 1024,
      "kube_disk": 512
    },  
  }
}
```

Assuming you save the file as `options.json`, install the package as follows:

```shell
dcos package install beta-kubernetes --options=options.json
```

## Change the number of Kubernetes nodes

DC/OS Kubernetes allows you to specify the number of private and public Kubernetes nodes in your cluster.

### Private nodes

The default private node count is 1. To change this value, specify `kubernetes.node_count` in a JSON options file, as shown below.

As an example, we are going to request 10 private Kubernetes nodes.

Create a JSON options file, or edit an existing one:

```json
{
  "kubernetes": {
    "node_count": 10
  }
}
```

Assuming you save the file as `options.json`, install the package as follows:

```shell
dcos package install beta-kubernetes --options=options.json
```

### Public nodes

The default public node count is 0. To change this value, specify `kubernetes.public_node_count` in a JSON options file, as shown below.

As an example, we are going to request 2 additional public Kubernetes nodes to the previous 10 private Kubernetes nodes.

Edit the existing options file as follows:

```json
{
  "kubernetes": {
    "node_count": 10,
    "public_node_count": 2
  }
}
```

## Placement Constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster.
Placement constraints use the [Marathon operators](http://mesosphere.github.io/marathon/docs/constraints.html) syntax.
For example, `[["hostname", "UNIQUE"]]` ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:

`[["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]`

**Note**: Be sure to include excess capacity in such a scenario so that if one of the whitelisted systems goes down, there is still enough capacity to repair your service.

Options example:

```json
{
  "kubernetes": {
    "control_plane_placement": "[[\"disk\",\"IS\",\"fast-ssd\"]]",
    "node_placement": "[\"hostname\",\"UNIQUE\"]",
    "public_node_placement": "[\"hostname\",\"UNIQUE\"]"
  }
}
```

### Updating Placement Constraints

Clusters change, and as such, so will your placement constraints. However, already running service pods will not be affected by changes in placement constraints.
This is because altering a placement constraint might invalidate the current placement of a running pod, and the pod will not be relocated automatically, as doing
so is a destructive action. We recommend using the following procedure to update the placement constraints of a pod:

- Update the placement constraint definition in the service.
- For each affected pod, one at a time, perform a pod replace. This will (destructively) move the pod to be in accordance with the new placement constraints.

## TLS

This package enforces TLS for mutual-authentication and communications encryption wherever
possible. Below, you can find more details where, when, and how it happens.

### Encryption and mutual-authentication

TLS for mutual-authentication and communications encryption implemented as:

- `etcd` cluster peers - only encryption is enabled but not mutual-authentication since `etcd`
  doesn't validate peer certificates based on the provided hostname but rather on the IP addresses
  the peer sees as peers, or DNS SRV discovery which DC/OS doesn't support.
- `etcd` client-server - both encryption and mutual-authentication are enabled. The only client
  in place is the `kube-control-plane`, meaning that the communication between the Kubernetes API
  and `etcd` is secured.
- All Kubernetes components have encryption and mutual-authentication enabled, including
  `kube-control-plane`, `kube-proxy` and the `kubelet`.
- All included (mandatory) add-ons, including on-demand backup/restore, respect mutual-authentication
  against the Kubernetes API.

**Note:** We expose an insecure Kubernetes API endpoint. This is a temporary
solution for providing external applications - outside of the scope of this package - access
to the Kubernetes API. This is currently used to provide access to the [Kubernetes Dashboard](../kubernetes-dashboard).

This is a beta feature, and subject to deprecation in future releases of the Kubernetes package.

### TLS Open vs Enterprise DC/OS

TLS artifacts, such as key pairs (private and public)
and certificates, are created, signed, and exchanged in order to prove identity of entities like
people, organizations, applications, etc., with the purpose of establishing trust.
For this trust establishment to happen, one needs a [Public Key Infrastructure or PKI](https://en.wikipedia.org/wiki/Public_key_infrastructure).

In the past, this package supported TLS in full only when running atop DC/OS Enterprise because
only this version provides the mechanisms needed for PKI:

- [DC/OS CA](/1.12/security/ent/tls-ssl/) - a centralized certificate-authority
  (CA) for validating and, eventually, signing certificate signing requests (CSRs).
- [DC/OS Secrets](/1.12/security/ent/secrets/) - a centralized and secure way
  to distribute TLS artifacts to package components, such as the Kubernetes components, and other
  applications living in the same DC/OS cluster.
- [DC/OS Service Accounts](/1.12/security/ent/service-auth/) - needed for
  our package and applications to authenticate against the services named above.

As you may have guessed by now, Open doesn't provide such functionality. So the question is how did we
implement TLS on Open DC/OS? The answer comes in the form of the diagram below:

![alt text](/services/beta-kubernetes/2.0.0-1.12.0-beta/img/tls.png "TLS design")

### Leveraging Enterprise DC/OS PKI

In order to fully leverage the DC/OS Enterprise PKI infrastructure when setting up TLS,
a [service account](/1.12/security/ent/service-auth/)
with permissions to manage CA and secrets is required. It **must** be provisioned before installing
the Kubernetes package.

In order to provision such service account, first you need to install the [DC/OS Enterprise CLI](/1.12/cli/enterprise-cli/). Then, run the following:

```shell
dcos security org service-accounts keypair private-key.pem public-key.pem
dcos security org service-accounts delete kubernetes
dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes
dcos security secrets delete kubernetes/sa
dcos security secrets create-sa-secret private-key.pem kubernetes kubernetes/sa
dcos security org groups add_user superusers kubernetes
```

Next, you need to [grant](/1.12/security/ent/perms-management/)
the service account the correct permissions.

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

where `<service name>` is the name of the service to be installed, e.g. `kubernetes`.

Finally, you need to tell the package installer about the service-account you just created and where to
find its credentials. Create an options JSON file, or edit an existing one:

```json
{
  "service": {
    "service_account": "kubernetes",
    "service_account_secret": "kubernetes/sa"
  }
}
```

Assuming you save the file as `options.json`, install the package as follows:

```shell
dcos package install beta-kubernetes --options=options.json
```

## When you have a proxy

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

## When 10.100.0.0/16 is in use

By default, the Kubernetes cluster will use `10.100.0.0/16` as the service CIDR.
If this CIDR is already in use on your network, a change to the Kubernetes cluster service CIDR is required.

Create an options JSON file, or edit an existing one:

```json
{
  "kubernetes": {
    "service_cidr": "<YOUR_CIDR_HERE>"
  }
}
```

**Attention:** replace `<YOUR_CIDR_HERE>` above with a CIDR block that is not
already assigned somewhere in your network, e.g. `10.90.0.0/16`.

Now, assuming you save the file as `options.json`, install the package as follows:

```shell
dcos package install beta-kubernetes --options=options.json
```
