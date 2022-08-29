---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites for installing Kaptain
menuWeight: 6
excerpt: Review the prerequisites that must be met before installing Kaptain
beta: false
enterprise: false
---

## Prerequisites

- [`kubectl`][kubectl] on your installation machine 

- A DKP cluster, either one of the following, depending on your license 

  - An **Essential cluster** for customers with an [Essential license](../../../../kommander/2.2/licensing/essential/)
  - A **Managed** or **Attached** cluster for customers with an [Enterprise licence](../../../../kommander/2.2/licensing/enterprise/), in which case, said cluster needs to be the only one in its workspace

- The following **Platform applications** (dependencies) enabled in the cluster where you want to install Kaptain:

  - **Istio**
  - **MinIO Operator** (installed by default in some clusters, not on attached clusters) 
  - **Knative**, if you are running the [serverless installation of KServe](https://kserve.github.io/website/0.9/admin/serverless/), which is the default mode that comes pre-bundled with Kaptain. (Not required if you are using the [RawDeployment installation mode](https://kserve.github.io/website/0.9/admin/kubernetes_deployment/))

  You have two options to install these applications. For more instructions, refer to the [Install dependencies section](#install-dependencies).

- Refer to the [on premise installation](../on-premise/) page, if you are installing Kaptain on premises.

## Install dependencies 

### Install dependencies on any type of cluster (Essential and Enterprise)

To install any of the previous applications after you have installed DKP, follow the instructions in the [Application Deployment](../../../../kommander/2.2/workspaces/applications/platform-applications/application-deployment/) page.

<p class="message--note"><strong>NOTE: </strong>When installing these applications, set the environment variable to the workspace of the cluster where you want to install Kaptain. </p>

### Install dependencies during the installation of DKP (Essential only)

You can install the applications Kaptain requires during the installation of DKP by adapting the configuration file:

<p class="message--note"><strong>NOTE: </strong>All DKP commands in this section assume KUBECONFIG=clusterKubeconfig.conf is set.</p>

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

    This customized configuration file will enable these applications to deploy when installing DKP.

### Verify the deployment

Verify if the applications have been deployed successfully. For this, refer to the [Verify Applications](../../../../kommander/2.2/workspaces/applications/platform-applications/application-deployment#verify-applications) section.

Refer to the [installation overview](../../install#installation-overview) for next steps.

[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
