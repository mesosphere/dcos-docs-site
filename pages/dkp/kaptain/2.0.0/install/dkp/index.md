---
layout: layout.pug
navigationTitle: Add Kaptain to DKP Catalog Applications
title: Add Kaptain to DKP Catalog Applications
menuWeight: 8
excerpt: Add Kaptain to DKP Catalog Applications before deploying to clusters.
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>
You can deploy Kaptain to a cluster in a selected Workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the Workspace you are deploying to or move that cluster to another Workspace.
</p>

## Requirements

Before proceeding, verify that your environment meets the following basic requirements:

- Control plane
  - min. 3 nodes
  - min. 4 cores _per node_
  - min. 200 GiB free disk space _per node_
  - min. 16 GiB RAM _per node_
- Workers
  - min. 6 nodes
  - min. 8 cores _per node_
  - min. 200 GiB free disk space _per node_
  - min. 32 GiB RAM _per node_
- GPUs (optional)
  - NVIDIA only
  - min. 200 GiB free disk space per instance
  - min. 64 GiB RAM per instance
  - min. 12 GiB GPU RAM per instance

Please note that these numbers are for the bare minimum.
Running any real world machine learning workloads on Kaptain bumps these requirements for nodes, CPUs, RAM, GPUs, and persistent disks.
In particular, the number of CPU or GPU workers, or both, and RAM, must be increased considerably.
The amounts depend on the number, complexity, and size of the workloads, in addition to the amount of metadata and log data stored with each run.

For on premise installations, horizontal scalability is limited by the overall size of the cluster and its quotas.
For cloud installations, scaling out can be limited by resource quotas.

## Prerequisites for DKP 2.x

- A DKP cluster with the following Platform applications enabled:

  - Istio
  - Knative

- [`kubectl`][kubectl] on your installation machine

- For customers deploying in a multi-cluster environment (Enterprise): Ensure you have configured [Kaptain to authenticate with a Management Cluster][dex].

- For DKP 2.x, ensure the following applications are enabled in Kommander:

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
Use the following instructions to install Spark Operator from Kommander Catalog [DKP 2.x][install-spark-dkp2]

## Add Kaptain to your DKP Catalog Applications via CLI 

If you installed DKP with Kaptain as a Workspace application in the Kommander installation file, you do not need to create a Git Repository for Kaptain. 

If you added Kaptain after installing DKP, you must make it available by creating a Git Repository. Use the CLI to create the GitRepository resource and add a new repository. 

### Create a Git repository for Kaptain

1.  Refer to [air-gapped install instructions][airgapped_install], if you are running in air-gapped environment.

1.  Adapt the URL of your Git repository:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: kaptain-catalog-applications
      namespace: ${WORKSPACE_NAMESPACE}
      labels: 
        kommander.d2iq.io/gitrepository-type: catalog
    spec:
      interval: 1m0s
      ref: 
        tag: 2.0.0
      timeout: 20s
      url: https://github.com/mesosphere/kaptain-catalog-applications
    EOF
    ```

1.  Ensure the status of the `GitRepository` signals a ready state:

    ```bash
    kubectl get gitrepository kaptain-catalog-applications -n ${WORKSPACE_NAMESPACE}
    ```

    The repository commit displays the ready state:

    ```sh
    NAME         URL                                                        READY   STATUS                                                              AGE
    kaptain-catalog-applications https://github.com/mesosphere/kaptain-catalog-applications                True    Fetched revision: master/6c54bd1722604bd03d25dcac7a31c44ff4e03c6a   11m
    ```

### Add Kaptain 

Apply the modifications to the yaml file and make Kaptain available in the DKP Catalog apps section:

```bash
kubectl apply -f gitrepository.yaml
```

## Deploy Kaptain on selected Workspaces

You have installed Kaptain by adding it to the DKP Catalog applications. The next step is to enable and deploy Kaptain on all clusters in a selected Workspace. For this, refer to [Deploy Kaptain] instructions. 
<!-- Need to add link to this topic once it is created -->

[download]: ../../download/
[install-spark-dkp2]: /dkp/kommander/2.1/workspaces/applications/catalog-applications/dkp-applications/spark-operator/
[install-spark-konvoy1]: /dkp/kommander/1.4/projects/platform-services/platform-services-catalog/kudo-spark/
[kommander-install]: /dkp/kommander/latest/install/
[kommander-gpu]: /dkp/kommander/latest/gpu/
[konvoy-gpu]: /dkp/konvoy/1.8/gpu/
[konvoy_deploy_addons]: /dkp/konvoy/1.8/upgrade/upgrade-kubernetes-addons/#prepare-for-addons-upgrade
[kudo_cli]: https://kudo.dev/#get-kudo
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[dex]: https://docs.d2iq.com/dkp/kaptain/2.0.0/configuration/external-dex/
[airgapped_install]: ../air-gapped-dkp/
