---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites for installing Kaptain
menuWeight: 2
excerpt: Ensure these prerequisites are met before installing Kaptain
beta: false
enterprise: false
---

<p class="message--important"><strong>IMPORTANT: </strong>Ensure the cluster that you want to use to deploy Kaptain is the only cluster in its workspace. <b>Kaptain is meant to be deployed on workspaces with a single cluster</b>.</p>

- [`kubectl`][kubectl] on your installation machine 

- A DKP cluster, either one of the following, depending on your license 

  - An **Essential cluster**. Refer to [this page][Essential_page] for more information on the Essential license.
  - A **Managed** or **Attached** cluster for Enterprise customers. Refer to [this page][Enterprise_page] for more information on the license. In this case, said cluster must be the only one in its workspace. 
    D2iQ recommends that you install it on a separate attached or managed cluster, as the management cluster is intended to be a pane of glass for running other clusters and is not intended for workloads.

- The following **Platform applications** (dependencies) enabled in the cluster where you want to install Kaptain:

  - **Istio**
  - **MinIO Operator** (installed by default in some clusters, not on attached clusters)
  - **Knative**, if you are running the [serverless installation of KServe](https://kserve.github.io/website/0.9/admin/serverless/), which is the default mode that comes pre-bundled with Kaptain. (Not required if you are using the [RawDeployment installation mode](https://kserve.github.io/website/0.9/admin/kubernetes_deployment/))

  You have two options to install these applications. For more instructions, refer to the [Install dependencies section](#install-dependencies).

- Refer to the [on-premise installation](../on-premise/) page, if you are installing Kaptain **on premises**.

<p class="message--warning"><strong>WARNING:</strong> Ensure that DKP Kommander is installed using the default certificate and not a customer-issued or ACME certificate. Otherwise, the installation of Kaptain can  break. Custom and ACME certificates are supported in Kaptain versions 2.2 and later, and DKP versions 2.3 and later.</p>

### Reference the cluster on which you must execute the commands

You can do this by setting the `KUBECONFIG` environment variable to the appropriate kubeconfig file's location (`KUBECONFIG=clusterKubeconfig.conf`), or by using the `--kubeconfig=cluster_name.conf` flag. For more information, refer to the [Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation.

## Install dependencies

### Install dependencies on any type of cluster (Essential and Enterprise)

To install any of the previous applications after you have installed DKP, follow the instructions in the [Application Deployment](../../../../kommander/2.2/workspaces/applications/platform-applications/application-deployment/) page.

<p class="message--note"><strong>NOTE: </strong>When installing these applications, set the environment variable to the workspace of the cluster where you want to install Kaptain. </p>

### Install dependencies during the installation of DKP (Essential only)

You can install the applications Kaptain requires during the installation of DKP by adapting the configuration file:

<p class="message--note"><strong>NOTE: </strong>When installing these applications, <a href="#reference_the_cluster_on_which_you_must_execute_the_commands">set the environment variable</a> to the workspace of the cluster where you will install Kaptain. For customers with an Essential license and a single-cluster experience, the <code>clusterKubeconfig.conf</code> is your Essential cluster. For customers with an Enterprise license and multi-cluster experience, your <code>clusterKubeconfig.conf</code> is the managed or attached cluster where Kaptain should be installed.</p>

1.  Ensure that your `kubectl` configuration [references the cluster on which you must execute the commands](#reference-the-cluster-on-which-you-must-execute-the-commands). For customers with an Essential license and a single-cluster experience, reference your Essential cluster.

1.  Use the existing Kommander configuration file `kommander.yaml`, or initialize the default one, if you have not done so yet:

    ```bash
    dkp install kommander --init > kommander-config.yaml
    ```

    Review the [Customizing the configuration file](../../../../kommander/2.2/install/configuration/) page to gain more understanding on how to use a configuration file to install DKP.

1.  Ensure the following applications are enabled in the config:

    ```bash
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    apps:
      ...
      dex:
      dex-k8s-authenticator:
      kube-prometheus-stack:
      istio:
     knative:
      minio-operator:
      traefik:
      nvidia:  # to enable GPU support
      [...]
    ```

    For GPU deployment, follow the instructions in the [Kommander GPU documentation](../../../../kommander/2.2/gpu/kommander-config/).

1.  Apply the new configuration to Kommander:

    ```bash
    dkp install kommander --installer-config kommander-config.yaml
    ```

    This customized configuration file will enable these applications to deploy when installing DKP. For more information, refer to the [Customizing the configuration file](../../../../kommander/2.2/install/configuration/) page.

### Verify the deployment

Verify if the applications have been deployed successfully. For this, refer to the [Verify Applications](../../../../kommander/2.2/workspaces/applications/platform-applications/application-deployment#verify-applications) section.

Refer to the [installation overview](../../install#installation-overview) for next steps.

[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[Essential_page]: ../../../../kommander/2.2/licensing/essential/
[Enterprise_page]: ../../../../kommander/2.2/licensing/enterprise/
