---
layout: layout.pug
navigationTitle: Customizing
title: Customizing your installation
menuWeight: 20
excerpt: Customizing your installation of Kubernetes on DC/OS
---

The default DC/OS Kubernetes package installation provides reasonable defaults.
However, there are many available options for advanced users to further modify the installation. This section describes those options.

This section continues on from the instructions given in the [Basic Installation](/services/kubernetes/2.1.0-1.12.3/getting-started/provision-install/) section.

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

See the [Cluster Sizing](/services/kubernetes/2.1.0-1.12.3/operations/cluster-sizing/) page for a more detailed explanation.

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

## Region Selection

By default, region placement is set to the `local region` of the DC/OS installation.
If DC/OS spans multiple regions then it is possible to launch Kubernetes in one and only one region of choice.
It is possible that the region may not have the resources required, make sure to read and understand [Cluster Sizing](/services/kubernetes/2.1.0-1.12.3/operations/cluster-sizing/) before attempting a deployment.

There are two ways to deploy a Kubernetes cluster to a region:

- The drop down under the `service` tab of the UI.
- Through the CLI define the options json as follows:

  ```json
  {
    "service": {
      "name": "kubernetes-cluster",
      "region": "RegionName"
    }
  }
  ```

Considerations:
- An empty string means deploy to the local region of DC/OS.
- Regions are case sensitive.
- Once deployed, region changes are not supported and can leave the scheduler in a crash loop.


**NOTE:** Multi-Region deployment is not supported, see [Limitations](/services/kubernetes/2.1.0-1.12.3/limitations/index).

## Placement Constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster.

Placement constraints use the [Marathon operators](http://mesosphere.github.io/marathon/docs/constraints.html) syntax.
For example, `[["hostname", "UNIQUE"]]` ensures that at most one pod instance is deployed per agent.

A common task is to specify a list of whitelisted systems to deploy to and can be achieved using the following:

`[["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]`

<p class="message--note"><strong>NOTE: </strong>Be sure to include excess capacity in such a scenario so that if one of the whitelisted systems goes down, there is still enough capacity to repair your service.</p>

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

<p class="message--note"><strong>NOTE: </strong>Already-running service pods will not be affected by changes in placement constraints. This is because altering a placement constraint might invalidate the current placement of a running pod; the pod will not be relocated automatically as doing so is a destructive action.</p>

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

### TLS Open Source vs Enterprise DC/OS

TLS artifacts, such as key pairs (private and public) and certificates, are created, signed, and exchanged in order to prove identity of entities like people, organizations, applications, etc., with the purpose of establishing trust. For this trust establishment to happen, you need a [Public Key Infrastructure or PKI](https://en.wikipedia.org/wiki/Public_key_infrastructure).

In the past, this package supported TLS only when running on DC/OS Enterprise which provides the mechanisms needed for PKI:

* [DC/OS CA](/1.12/security/ent/tls-ssl/) - a centralized certificate-authority (CA) for validating and, eventually, signing certificate signing requests (CSRs).
* [DC/OS Secrets](/1.12/security/ent/secrets/) - a centralized and secure way to distribute TLS artifacts to package components, such as the Kubernetes components, and other applications living in the same DC/OS cluster.
* [DC/OS Service Accounts](/1.12/security/ent/service-auth/) - needed for our package and applications to authenticate against the services named above.

DC/OS does not provide the functionality describe above. The following diagram describes how this was achieved on DC/OS.

![alt text](/services/kubernetes/2.1.0-1.12.3/img/tls.png "TLS design")

Figure 1. TLS Design

### TLS Provisioning in DC/OS Enterprise

When installing DC/OS Kubernetes on a DC/OS Enterprise cluster, a [service account](/1.12/security/ent/service-auth/) is mandatory.

This service account must be setup with adequate permissions in order to manage CA and secrets, and it **MUST** be provisioned before installing DC/OS Kubernetes.

1. In order to provision such service account, first you need to install the [DC/OS Enterprise CLI](/1.12/cli/). Then, run the following:

    ```shell
    dcos security org service-accounts keypair private-key.pem public-key.pem
    dcos security org service-accounts delete kubernetes-cluster
    dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes-cluster
    dcos security secrets delete kubernetes-cluster/sa
    dcos security secrets create-sa-secret private-key.pem kubernetes-cluster kubernetes-cluster/sa
    ```
1. Next, you need to [grant](/1.12/security/ent/perms-management/) the service account the correct [permissions](/1.12/security/ent/perms-reference/). The required permissions are:

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

    where `<service name>` is the name of the service to be installed, for example, `kubernetes-cluster`. It should be noted that failing to adequately grant these permissions to the service account will cause the framework scheduler to enter a crash loop and the installation to fail.
1. Finally, to tell the package installer about the service-account you just created and where to find its credentials.
Create an `options.json` file, or edit an existing one:
    ```json
    {
      "service": {
        "service_account": "kubernetes-cluster",
        "service_account_secret": "kubernetes-cluster/sa"
      }
    }
    ```
1. Install the package:
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

<p class="message--note"><strong>NOTE: </strong> Replace <tt>&lt;YOUR_CIDR_HERE&gt;</tt> with a CIDR block that is not already assigned somewhere in your network, such as <tt>10.90.0.0/16</tt>.</p>
