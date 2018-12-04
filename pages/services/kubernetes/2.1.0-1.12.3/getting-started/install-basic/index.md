---
layout: layout.pug
navigationTitle: Installing
title: Basic Installation
menuWeight: 15
excerpt: Installing a basic Kubernetes cluster
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->


# Basic Installation

Mesosphere Kubernetes Engine (MKE) allows you to manage multiple Kubernetes clusters from a centralized platform. MKE requires a package, named `kubernetes`, to manage multiple Kubernetes clusters. Once installed, you can provision multiple Kubernetes clusters using the `kubernetes-cluster` package. 

This section will provide you with a basic installation of Mesosphere Kubernetes Engine on DC/OS Open Source and DC/OS Enterprise. For more advanced installation instructions, or to customize your installation of MKE, see the [Customizing](/services/kubernetes/__VERSION__/operations/customizing-install/) section.

# Install MKE on DC/OS Open Source

<p class="message--warning"><strong>WARNING: </strong> The documentation in this section will only work on DC/OS Open Source. because the default configuration does not set the service account options <tt>service.service_account</tt> and <tt>service.service_account_secret</tt>. 
For DC/OS Enterprise documentation, scroll to the `Install MKE on DC/OS Enterprise` below. 
</p>

## Prerequisites

<p class="message--warning"><strong>WARNING: </strong> Mesosphere Kubernetes Engine requires the installation of a package named <tt>kubernetes</tt> that will manage your Kubernetes clusters. 
Do not uninstall the <tt>kubernetes</tt> manager package at any time.
</p>

MKE requires the initial installation of a package named `kubernetes` that manages the life cycle of your Kubernetes clusters. 
If you do not install the `kubernetes` package, the installation of your Kubernetes clusters packages will fail. 

To install the `kubernetes` package run the following command:

  ```shell
  dcos package install --yes kubernetes
  ```

## Install Kubernetes Clusters

To install a single Kubernetes cluster (`kubernetes-cluster` package) on DC/OS Open Source run the following command:

  ```shell
  dcos kubernetes cluster create
  ```

By default, the Kubernetes cluster (`kubernetes-cluster` package) is installed with a service name of kubernetes-cluster. You may specify a different name by creating an `options.json` file, or edit an existing one with the following:

  ```json
  {
    "service": {
      "name": "kubernetes-other"
    }
  }
  ```
<p class="message--warning"><strong>WARNING: </strong>You need to give each Kubernetes cluster a unique name. If you start another cluster with the same name, it will fail with an error message saying <bb style="color:red;">"The DC/OS service has already been started."</bb>
</p>

<p class="message--warning"><strong>WARNING: </strong>The service name cannot be changed after initial install. 
Changing the service name would require installing a new instance of the service against the new name, then copying over any data as necessary to the new instance.
</p>

For more information on building the `options.json` file, see [DC/OS documentation](/1.12/deploying-services/config-universe-service/).

When the above JSON configuration is passed to the package install command via the --options argument, the new service will use the name specified in that JSON configuration:

  ```shell
  dcos kubernetes cluster create --options=options.json
  ```
To monitor your `kubernetes` package during installation until the status is COMPLETE run the following:

  ```shell
  dcos kubernetes manager plan show deploy
  ```

# Install MKE on DC/OS Enterprise

## Prerequisites

<p class="message--warning"><strong>WARNING: </strong> Mesosphere Kubernetes Engine requires the installation of a package named <tt>kubernetes</tt> that will manage your Kubernetes clusters. 
Do not uninstall the <tt>kubernetes</tt> management package at any time.
</p>

### Enterprise CLI

If you have not done so already, install the [DC/OS Enterprise CLI](/1.12/cli/)

  ```
  dcos package install dcos-enterprise-cli --yes
  ```
Note that you need to install the DC/OS Enterprise CLI for every new DC/OS cluster.

### Service Accounts
Because of the enhanced security in DC/OS Enterprise, you must create a service accounts with permissions to run the packages. 

Follow [these instructions](
/services/kubernetes/__VERSION__/operations/customizing-install/#tls-provisioning-in-dcos-enterprise) to configure that service account and service account secret.

Please note that any custom value of `service.name` must consist of alphanumeric characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters, and be no longer than 24 characters.

It is also possible to install the packages under a group (e.g., using `/dev/kubernetes` as the service name).
To do that, you need to give the user permissions for the folder (e.g. `/dev`) where you will install your service.

You can find more information on setting up service accounts at the [service accounts documentation](/1.12/security/ent/service-auth/) page.

### Kubernetes Manager

MKE requires the initial installation of a package named `kubernetes` that manages the life cycle of your Kubernetes clusters. 
If you do not install the `kubernetes` package, the installation of your Kubernetes clusters packages will fail.

<p class="message--note"><strong>NOTE: </strong> We recommend that you store your custom configuration in source control.</p>

1. To provision such a service account run the following:

    ```shell
    dcos security org service-accounts keypair private-key.pem public-key.pem
    dcos security org service-accounts create -p public-key.pem -d 'Kubernetes service account' kubernetes
    dcos security secrets delete kubernetes/sa
    dcos security secrets create-sa-secret private-key.pem kubernetes kubernetes/sa
    ```

1. [Grant](/1.12/security/ent/perms-management/) the service account the correct permissions:

    ```shell
    dcos security org users grant kubernetes dcos:mesos:master:reservation:role:kubernetes-role create
    dcos security org users grant kubernetes dcos:mesos:master:framework:role:kubernetes-role create
    dcos security org users grant kubernetes dcos:mesos:master:task:user:nobody create
    ```

1. Tell the package installer about the service account you just created and where to find its credentials.
Create an `options.json` file, or edit an existing one (for information on building your `options.json` file, see [DC/OS documentation](/1.12/deploying-services/config-universe-service/)):

    ```json
    {
      "service": {
        "service_account": "kubernetes",
        "service_account_secret": "kubernetes/sa"
      }
    }
    ```

1. Install the package:

    ```shell
    dcos package install --yes kubernetes --options=options.json
    ```

To monitor your `kubernetes` package during installation until the status is COMPLETE run the following:

  ```shell
  $ dcos kubernetes manager plan show deploy
      deploy (serial strategy) (COMPLETE)
      └─ mesosphere-kubernetes-engine (serial strategy) (COMPLETE)
        └─ mesosphere-kubernetes-engine-0:[cosmos-adapter] (COMPLETE)
  ```

## Install the First Kubernetes Cluster

Follows is an example of how to set up service accounts and install your first cluster. 

1. To provision such a service account run the following:

    ```shell
    dcos security org service-accounts keypair private-key1.pem public-key1.pem
    dcos security org service-accounts create -p public-key1.pem -d 'Kubernetes service account' kubernetes-cluster1
    dcos security secrets create-sa-secret private-key1.pem kubernetes-cluster1 kubernetes-cluster1/sa
    ```

1. [Grant](/1.12/security/ent/perms-management/) the service account the correct permissions:

    ```shell
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:task:user:root create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:task:user:root create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:principal:kubernetes-cluster1 delete
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:principal:kubernetes-cluster1 delete
    ```
    ```shell
    dcos security org users grant kubernetes-cluster1 dcos:secrets:default:/kubernetes-cluster1/* full
    dcos security org users grant kubernetes-cluster1 dcos:secrets:list:default:/kubernetes-cluster1 read
    dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:rw full
    dcos security org users grant kubernetes-cluster1 dcos:adminrouter:ops:ca:ro full
    ```
    ```shell
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster1-role read
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:volume:role:slave_public/kubernetes-cluster1-role create
    dcos security org users grant kubernetes-cluster1 dcos:mesos:master:framework:role:slave_public read
    dcos security org users grant kubernetes-cluster1 dcos:mesos:agent:framework:role:slave_public read
    ```

1. Tell the package installer about the service account you just created and where to find its credentials.
Create an `options1.json` file, or edit an existing one:

    ```json
    {
      "service": {
        "name": "kubernetes-cluster1",
        "service_account": "kubernetes-cluster1",
        "service_account_secret": "kubernetes-cluster1/sa"
      }
    }
    ```

1. Install the package:

    ```shell
    dcos kubernetes cluster create --options=options1.json --yes
    ```

To monitor your Kubernetes cluster creation, use the DC/OS Kubernetes CLI:

```shell
  dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster1
```
A complete cluster plan is shown below:

```Shell
$ dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster1
  Using Kubernetes cluster: kubernetes-cluster1
    deploy (serial strategy) (COMPLETE)
    ├─ etcd (serial strategy) (COMPLETE)
    │  └─ etcd-0:[peer] (COMPLETE)
    ├─ control-plane (dependency strategy) (COMPLETE)
    │  └─ kube-control-plane-0:[instance] (COMPLETE)
    ├─ mandatory-addons (serial strategy) (COMPLETE)
    │  └─ mandatory-addons-0:[instance] (COMPLETE)
    ├─ node (dependency strategy) (COMPLETE)
    │  └─ kube-node-0:[kubelet] (COMPLETE)
    └─ public-node (dependency strategy) (COMPLETE)
```

## Install Multiple Kubernetes Clusters

<p class="message--warning"><strong>WARNING: </strong>You need to give each Kubernetes cluster a unique name. If you start another cluster with the same name, it will fail with an error message saying <bb style="color:red;">"The DC/OS service has already been started."</bb>
</p>

Before you proceed, follow the instructions to install the Kubernetes Manager and your first cluster above. 

Follows is an example of how to set up service accounts and install your second cluster.  

1. Create the `kubernetes-cluster2` Service Account:

```
  dcos security org service-accounts keypair private-key2.pem public-key2.pem
  dcos security org service-accounts create -p public-key2.pem -d 'Kubernetes service account' kubernetes-cluster2
  dcos security secrets create-sa-secret private-key2.pem kubernetes-cluster2 kubernetes-cluster2/sa
```

1. Grant the `kubernetes-cluster2` Service Account permissions:
  ```shell
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:kubernetes-cluster2-role create
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:task:user:root create
  dcos security org users grant kubernetes-cluster2 dcos:mesos:agent:task:user:root create
  ```
  ```shell
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:role:kubernetes-cluster2-role create
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:principal:kubernetes-cluster2 delete
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:role:kubernetes-cluster2-role create
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:principal:kubernetes-cluster2 delete
  ```
  ```shell
  dcos security org users grant kubernetes-cluster2 dcos:secrets:default:/kubernetes-cluster2/* full
  dcos security org users grant kubernetes-cluster2 dcos:secrets:list:default:/kubernetes-cluster2 read
  ```
  ```shell
  dcos security org users grant kubernetes-cluster2 dcos:adminrouter:ops:ca:rw full
  dcos security org users grant kubernetes-cluster2 dcos:adminrouter:ops:ca:ro full
  ```
  ```shell
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster2-role create
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public/kubernetes-cluster2-role read
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:reservation:role:slave_public/kubernetes-cluster2-role create
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:volume:role:slave_public/kubernetes-cluster2-role create
  dcos security org users grant kubernetes-cluster2 dcos:mesos:master:framework:role:slave_public read
  dcos security org users grant kubernetes-cluster2 dcos:mesos:agent:framework:role:slave_public read
  ```

1. Create `options2.json`, note that this options JSON provides examples of how to set cluster size. For our example we will be deploying a `"kube_cpus": 1,` instead of the default `"kube_cpus": 2`
```
{
    "service": {
        "name": "kubernetes-cluster2",
        "service_account": "kubernetes-cluster2",
        "service_account_secret": "kubernetes-cluster2/sa"
    },
    "kubernetes": {
        "authorization_mode": "AlwaysAllow",
        "control_plane_placement": "[[\"hostname\", \"UNIQUE\"]]",
        "control_plane_reserved_resources": {
            "cpus": 1.5,
            "disk": 10240,
            "mem": 4096
        },
        "high_availability": false,
        "private_node_count": 1,
        "private_node_placement": "",
        "private_reserved_resources": {
            "kube_cpus": 1,
            "kube_disk": 10240,
            "kube_mem": 2048,
            "system_cpus": 1,
            "system_mem": 1024
        }
    },
    "etcd": {
        "cpus": 0.5,
        "mem": 1024
    }
}
```

Install `kubernetes-cluster2` Cluster:

```
  dcos kubernetes cluster create --options=options2.json --yes
```

To monitor your Kubernetes cluster creation, use the DC/OS Kubernetes CLI:

```shell
  dcos kubernetes cluster debug plan status deploy --cluster-name=kubernetes-cluster2
```

## Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/1.12/deploying-services/install/).
If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI sub-commands separately.  

From the DC/OS CLI, enter:

  ```shell
  dcos package install kubernetes --cli
  ```

# Resources

In order to run the framework with its default parameters, your cluster must have at least one private agent with the following available resources:

## Kubernetes Manager

|                               | Instances per cluster | CPUs per instance | MEM (MB) per instance | Disk (MB) per instance |
| ----------------------------- | --------------------- | ---------------- | --------------------- | ---------------------- |
| Package scheduler             | 1                     | 1                | 1024                  | -                      |
| mesosphere-kubernetes-engine  | 1                     | 0.6              | 1056                  | -                      |

Memory and CPU settings of the `kubernetes` Mesosphere Kubernetes Engine manager can be re-configured.
1. Create an `options.json` file, or edit an existing one:

    ```json
    {
      "mesosphere_kubernetes_engine":{
        "mem": 2048,
        "cpus": 1
      }
    }
    ```
1. Install the package:
    ```shell
    dcos package install --yes kubernetes --options=options.json
    ```

Please note that the above example does not set the options `service.service_account` and `service.service_account_secret`.
Consequently this configuration will only work on DC/OS Open Source.
For DC/OS Enterprise you must specify the [required options](services/kubernetes/__VERSION__/getting-started/install-basic/#installing-mke-on-dcos-enterprise), as detailed in the `Install Multiple Kubernetes Cluster` section above. 

## Kubernetes Cluster

The `kubernetes-cluster` service requires the following resources to run the tasks described in the table below:

|                         | Instances per cluster | CPUs per instance | MEM (MB) per instance | Disk (MB) per instance |
| ----------------------- | --------------------- | ---------------- | --------------------- | ---------------------- |
| Package scheduler       | 1                     | 1.1              | 1056                  | -                      |
| etcd                    | 1                     | 0.6              | 1056                  | 3584                   |
| kube-control-plane      | 1                     | 1.6              | 4128                  | 10240                  |
| kube-node               | 1                     | 3.1              | 3104                  | 10240                  |

If high-availability is desirable, the `kubernetes.high_availability` package option must be set to `true` and a minimum of three private agents is required. The new resource requirements described in the table below:

|                         | Instances per cluster | CPUs per instance | MEM (MB) per instance | Disk (MB) per instance |
| ----------------------- | --------------------- | ---------------- | --------------------- | ---------------------- |
| Package scheduler       | 1                     | 1.1              | 1056                  | -                      |
| etcd                    | 3                     | 0.6              | 1056                  | 3584                   |
| kube-control-plane      | 3                     | 1.6              | 4128                  | 10240                  |
| kube-node               | 1                     | 3.1              | 3104                  | 10240                  |

To enable high-availability, create a `options.json` file, or edit an existing one:

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

If support for [ingress](../operations/ingress) is desirable, the `kubernetes.public_node_count` package option must be set to the number of desired public Kubernetes nodes. The `kubernetes-cluster` service requires the following resources per public Kubernetes node:

|                         | CPUs per instance | MEM (MB) per instance | Disk (MB) per instance |
| ----------------------- | ---------------- | --------------------- | ---------------------- |
| kube-node-public        | 1.6              | 1568                  | 2048                   |