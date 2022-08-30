---
layout: layout.pug
navigationTitle: Add Kaptain to DKP Catalog Apps
title: Add Kaptain to DKP Catalog Applications
menuWeight: 5
excerpt: Add Kaptain to DKP Catalog Applications in networked environments before deploying to clusters.
beta: false
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>
<strong>All DKP commands on this page</strong> assume <code>KUBECONFIG=clusterKubeconfig.conf</code> is set.
</p>

<p class="message--important"><strong>IMPORTANT: </strong>Ensure the cluster that you want to use to deploy Kaptain is the only cluster in its workspace. <bold>Kaptain is meant to be deployed on workspaces with a single cluster**</bold>.</p>

## Requirements

For reference values of the required number of worker nodes, CPU, RAM, and storage resources, refer to the [requirements](../requirements/) section.

## Prerequisites

Ensure you meet all [prerequisites](../prerequisites/).

<p class="message--note"><strong>NOTE: </strong>Starting from the 1.3 release, Spark Operator is no longer installed by default with Kaptain.</p>

In case you need to run Spark jobs on Kubernetes using Spark Operator, it needs to be installed separately.
Use the following instructions to install Spark Operator from Kommander Catalog [DKP 2.x][install-spark-dkp2].

## Add Kaptain to your DKP Catalog Applications via CLI

If you installed DKP with Kaptain as a workspace application in the Kommander installation file, you do not need to create a Git Repository for Kaptain.

If you added Kaptain after installing DKP, you must make it available by creating a Git Repository. Use the CLI to create the GitRepository resource and add a new repository.

### Create a Git repository for Kaptain

1.  Ensure the `KUBECONFIG=clusterKubeconfig.conf` is set.

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

Refer to the [installation overview](../../install#installation-overview) for next steps.

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
