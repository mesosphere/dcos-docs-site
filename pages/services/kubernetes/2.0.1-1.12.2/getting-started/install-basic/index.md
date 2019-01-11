---
layout: layout.pug
navigationTitle: Installing
title: Basic Installation
menuWeight: 15
excerpt: Installing a basic Kubernetes cluster
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->


# Basic Installation

This section will provide you with a basic installation of DC/OS Kubernetes.  For more advanced installation instructions, or to customize your installation of DC/OS Kubernetes, see the [Customizing](/services/kubernetes/2.0.1-1.12.2/operations/customizing-install/) section.

# Prerequisites

## Mesosphere Kubernetes Engine (MKE)

Prior to installing this package you must install the `kubernetes` package, referred to as Mesosphere Kubernetes Engine or MKE, otherwise the installation will fail.

<p class="message--warning"><strong>WARNING: </strong>The package <tt>kubernetes-cluster</tt> cannot be operated without the <tt>kubernetes</tt> package. Do not uninstall <tt>kubernetes</tt> at any time.
</p>

### Installing MKE on DC/OS Enterprise

In order to run the `kubernetes` package on DC/OS Enterprise, a [service account](/1.12/security/ent/service-auth/) with permissions to run tasks with the `kubernetes-role` is required.

1. To provision such a service account, you must first install the [DC/OS Enterprise CLI](/1.12/cli/). Then, run the following:

    ```shell
    dcos security org service-accounts keypair private-key.pem public-key.pem
    dcos security org service-accounts delete kubernetes
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
Create an `options.json` file, or edit an existing one:

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

### Installing MKE on DC/OS Open Source

Unlike on DC/OS Enterprise, running on DC/OS Open Source does not require a service account and can simply be installed using the default options:

  ```shell
  dcos package install --yes kubernetes
  ```

## Kubernetes Cluster

### Installing from the DC/OS CLI

To install a Kubernetes cluster on DC/OS Enterprise , you **must** specify a custom configuration in an `options.json` file where the options `service.service_account` and `service.service_account_secret` are properly set.
Follow [these instructions](
/services/kubernetes/2.0.1-1.12.2/operations/customizing-install/#tls-provisioning-in-dcos-enterprise) to configure that service account and service account secret.

Then to install, run `dcos kubernetes cluster create` using the `--options` parameter:

  ```shell
  dcos kubernetes cluster create --options=options.json
  ```

On the other hand, to install a Kubernetes cluster on DC/OS Open Source run the following command:

  ```shell
  dcos kubernetes cluster create
  ```

The default configuration does not set the options `service.service_account` and `service.service_account_secret`.
Consequently this configuration will only work on DC/OS Open Source.

Please note that any custom value of `service.name` must consist of alphanumeric characters, `'-'`, `'_'` or `'.'`, and must start and end with an alphanumeric characters, and be no longer than 24 characters.
It is also possible to install the package under a group (e.g., using `/dev/kubernetes` as the service name).
To do that, you need to give the user permissions for the folder (e.g. `/dev`) where you will install your service.

<p class="message--note"><strong>NOTE: </strong> We recommend that you store your custom configuration in source control.</p>

For more information on building the `options.json` file, see [DC/OS documentation](/1.12/deploying-services/config-universe-service/).

### Installing from the DC/OS Web Interface

You can [install Kubernetes from the DC/OS web interface](/1.12/deploying-services/install/).
If you install Kubernetes from the web interface, you must install the DC/OS Kubernetes CLI subcommands separately.  
From the DC/OS CLI, enter:

  ```shell
  dcos package install kubernetes --cli
  ```

# Resources

In order to run the framework with its default parameters, your cluster must have at least one private agent with the following available resources:

## Mesosphere Kubernetes Engine

|                               | Instances per cluster | CPUs per instance | MEM (MB) per instance | Disk (MB) per instance |
| ----------------------------- | --------------------- | ---------------- | --------------------- | ---------------------- |
| Package scheduler             | 1                     | 1                | 1024                  | -                      |
| mesosphere-kubernetes-engine  | 1                     | 0.6              | 1056                  | -                      |

Memory and CPU settings of the `mesosphere-kubernetes-engine` pod can be re-configured.
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
For DC/OS Enterprise you must specify the [required options](/services/kubernetes/2.0.1-1.12.2/getting-started/install-basic/#installing-mke-on-dcos-enterprise), in addition to those described above.

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

If support for [ingress](/services/kubernetes/2.0.1-1.12.2/getting-started/ingress/) is desirable, the `kubernetes.public_node_count` package option must be set to the number of desired public Kubernetes nodes. The `kubernetes-cluster` service requires the following resources per public Kubernetes node:

|                         | CPUs per instance | MEM (MB) per instance | Disk (MB) per instance |
| ----------------------- | ---------------- | --------------------- | ---------------------- |
| kube-node-public        | 1.6              | 1568                  | 2048                   |
