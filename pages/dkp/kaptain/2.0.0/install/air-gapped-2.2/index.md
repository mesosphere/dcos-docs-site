---
layout: layout.pug
navigationTitle: Add Kaptain air-gapped for DKP 2.2
title: Add Kaptain to your DKP Catalog applications on air-gapped environments for DKP 2.2
menuWeight: 12
excerpt: Add Kaptain to your DKP Catalog applications on air-gapped environments for DKP 2.2
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>
You can deploy Kaptain to a cluster in a selected workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the workspace you are deploying to or move that cluster to another workspace.
</p>

## Requirements

For reference values of the required number of worker nodes, CPU, RAM, and storage resources, refer to the [requirements](../requirements/) section.

## Prerequisites

Ensure you meet all [prerequisites](../prerequisites/).

<p class="message--note"><strong>NOTE: </strong>Starting from the 1.3 release, Spark Operator is no longer installed by default with Kaptain.</p>

If you need to run Spark jobs on Kubernetes using Spark Operator, you must install it separately. Use the following instructions to install Spark Operator from Kommander Catalog for [DKP 2.x][install-spark-dkp2].

## DKP 2.2 air-gapped installation

Refer to [DKP install instructions][dkp_install], if you want to deploy Kaptain in a networked environment or to [DKP 2.1 air-gapped instructions][2.1_air] if you are deploying with DKP 2.1.

<p class="message--note"><strong>NOTE: </strong>All DKP commands in this page assume <code>KUBECONFIG=clusterKubeconfig.conf</code> is set.</p>

Kaptain supports installation on an air-gapped (a.k.a. offline or private) DKP managed cluster. Before installing Kaptain, please follow the [air-gapped installation guide][konvoy-air-gap] to set up the air-gapped DKP managed cluster. The cluster admin is responsible for configuring the DKP cluster correctly and ensuring container images have been pre-loaded to the private registry before installing Kaptain.

## Add Kaptain to your Kommander Install

Add the Kaptain catalog to the Kommander install configuration file along with the DKP applications catalog:

```yaml
catalog:
---
repositories:
  - name: dkp-catalog-applications
    labels:
      kommander.d2iq.io/gitapps-gitrepository-type: dkp
      kommander.d2iq.io/workspace-default-catalog-repository: "true"
    path: ./dkp-catalog-applications
  - name: kaptain-catalog-applications
    labels:
      kommander.d2iq.io/gitapps-gitrepository-type: dkp
      kommander.d2iq.io/workspace-default-catalog-repository: "true"
    path: ./kaptain-catalog-applications
```

If you added Kaptain after installing DKP, you must make it available by rerunning the Kommander installation with the updated configuration file.

### Load the Docker images into your Docker registry

1.  Download the image bundle file:

    - Download `kaptain-air-gapped.tar.gz` that will contain the required artifacts to perform an air-gapped installation. Extract the image bundle archive and other files before use:

      ```bash
      mkdir bundle && tar -xvf kaptain-air-gapped.tar.gz -C bundle/
      ```

    - (Optional) Download the custom image artifacts `kaptain-air-gapped-2.0.0_cpu.tar.gz` or `kaptain-air-gapped-2.0.0_gpu.tar.gz` based on whether you need CPU or GPU for your workloads. Extract the image bundle archive and other files before use:

      ```bash
      mkdir bundle-cpu && tar -xvf kaptain-air-gapped-cpu.tar.gz -C bundle-cpu/
      mkdir bundle-gpu && tar -xvf kaptain-air-gapped-gpu.tar.gz -C bundle-gpu/
      ```

1.  Place the bundle in a location where you can load and push the images to your private Docker registry.

1.  Ensure you set the `REGISTRY_URL` and `AIRGAPPED_TAR_FILE` variable appropriately, then use the following script to load the air-gapped image bundle and the cpu or gpu bundle:

    ```bash
    dkp push image-bundle --image-bundle ${AIRGAPPED_TAR_FILE} --to-registry ${REGISTRY_URL}
    ```

    _Note: this command is new in DKP 2.2._

    Based on the network latency between the environment of script execution, the Docker registry, and the disk speed, this can take a while to upload all the images to your image registry.

1.  Download the application bundles and chart archive (get links from support)

1.  Extract the application bundle to the location referenced in the Kommander configuration file above.

    ```bash
    mkdir kaptain-catalog-applications
    tar -xvf kaptain-catalog-applications.tar.gz --strip-components 1 -C kaptain-catalog-applications
    ```

1.  Load the Kaptain chart archive after the Kommander installation:

    ```bash
    dkp push chart kaptain-2.0.0.tgz
    ```

Refer to the [installation overview](../../install#installation-overview) for next steps.

## Deploy Kaptain on selected workspaces

You have installed Kaptain by adding it to the DKP Catalog applications. The next step is to enable and deploy Kaptain on all clusters in a selected workspace. For this, refer to [Deploy Kaptain][deploy] instructions.

[dkp_install]: ../dkp
[2.1_air]: ../air-gapped-2.1
[kommander-install]: /dkp/kommander/2.2/install/air-gapped/catalog/
[install-spark-dkp2]: /dkp/kommander/2.2/workspaces/applications/catalog-applications/dkp-applications/spark-operator/
[deploy]: ../deploy-kaptain/
[konvoy-air-gap]: /dkp/konvoy/2.2/choose-infrastructure/aws/air-gapped/
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[dex]: ../../configuration/external-dex/
[dkp-install]: /dkp/konvoy/2.2/choose-infrastructure/
