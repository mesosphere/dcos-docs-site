---
layout: layout.pug
navigationTitle: Add Kaptain to DKP Catalog Apps
title: Add Kaptain to DKP Catalog Applications
menuWeight: 5
excerpt: Add Kaptain to DKP Catalog Applications in networked environments before deploying to clusters.
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>
You can deploy Kaptain to a cluster in a selected workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the workspace you are deploying to or move that cluster to another workspace.
</p>

## Requirements

Before proceeding, verify that your cluster has the following resources freely available:

- Cluster consists of at least 3 worker nodes
- 25 CPU cores
- 32 GiB of RAM
- 170 GiB of Storage
- NVIDIA GPU instances are supported only

Please note that these numbers are for the bare minimum.
Running any real world machine learning workloads on Kaptain bumps these requirements for nodes, CPUs, RAM, GPUs, and persistent disks.
In particular, the number of CPU or GPU workers, or both, and RAM, must be increased considerably.
The amounts depend on the number, complexity, and size of the workloads, in addition to the amount of metadata and log data stored with each run.

For on premise installations, horizontal scalability is limited by the overall size of the cluster and its quotas.
For cloud installations, scaling out can be limited by resource quotas.

## Prerequisites

- [A DKP cluster][dkp-install] with the following Platform applications enabled:

  - Istio
  - Knative (optional, if KServe is configured to work in `RawDeployment` mode)

- [`kubectl`][kubectl] on your installation machine

- For customers deploying in a multi-cluster environment (Enterprise): Ensure you have configured [Kaptain to authenticate with a Management Cluster][dex].

- Ensure you enable the following applications in Kommander:

  1. Use the existing Kommander configuration file, or initialize the default one:

     ```bash
     dkp install kommander --init > kommander-config.yaml
     ```

  1. Ensure the following applications are enabled in the config:

     ```yaml
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
     	...
     ```

  1. For GPU deployment, follow the instructions in [Kommander GPU documentation][kommander-gpu].

  1. Apply the new configuration to Kommander:

     ```bash
     dkp install kommander --installer-config kommander-config.yaml
     ```

  Check [Kommander installation documentation][kommander-install] for more information.

<p class="message--note"><strong>NOTE: </strong>Starting from the 1.3 release, Spark Operator is no longer installed by default with Kaptain.</p>

In case you need to run Spark jobs on Kubernetes using Spark Operator, it needs to be installed separately.
Use the following instructions to install Spark Operator from Kommander Catalog [DKP 2.x][install-spark-dkp2].

## Add Kaptain to your DKP Catalog Applications via CLI

If you installed DKP with Kaptain as a workspace application in the Kommander installation file, you do not need to create a Git Repository for Kaptain.

If you added Kaptain after installing DKP, you must make it available by creating a Git Repository. Use the CLI to create the GitRepository resource and add a new repository.

### Create a Git repository for Kaptain

1.  Refer to [air-gapped for DKP 2.1][air2.1_install] or [air-gapped for DKP 2.2][air2.2_install] install instructions, if you are deploying in an air-gapped environment.

1.  Add the Flux GitRepository to your Kommander install:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: kaptain-catalog-applications
      namespace: kommander
      labels:
        kommander.d2iq.io/gitrepository-type: catalog
        kommander.d2iq.io/gitapps-gitrepository-type: dkp
        kommander.d2iq.io/workspace-default-catalog-repository: "true"
    spec:
      interval: 1m0s
      ref:
        tag: v2.0.0
      timeout: 20s
      url: https://github.com/mesosphere/kaptain-catalog-applications
    EOF
    ```

1.  Ensure the status of the `GitRepository` signals a ready state:

    ```bash
    kubectl get gitrepository kaptain-catalog-applications -n kommander
    ```

    The repository commit displays the ready state:

    ```sh
    NAME         URL                                                        READY   STATUS                                                              AGE
    kaptain-catalog-applications https://github.com/mesosphere/kaptain-catalog-applications                True    Fetched revision: master/6c54bd1722604bd03d25dcac7a31c44ff4e03c6a   11m
    ```

## Deploy Kaptain on selected workspaces

You have now added Kaptain to your DKP Catalog applications. The next step is to enable and deploy Kaptain on all clusters in a selected workspace. For this, refer to [Deploy Kaptain][deploy] instructions.

[download]: ../../download/
[install-spark-dkp2]: /dkp/kommander/2.2/workspaces/applications/catalog-applications/dkp-applications/spark-operator/
[kommander-install]: /dkp/kommander/latest/install/
[kommander-gpu]: /dkp/kommander/latest/gpu/
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[dex]: ../../configuration/external-dex/
[air2.1_install]: ../air-gapped-2.1/
[air2.2_install]: ../air-gapped-2.2/
[deploy]: ../deploy-kaptain/
[dkp-install]: /dkp/konvoy/2.2/choose-infrastructure/
