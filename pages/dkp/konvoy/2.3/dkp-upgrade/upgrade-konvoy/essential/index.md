---
layout: layout.pug
navigationTitle: DKP Essential
title: Upgrade Konvoy for DKP Essential
excerpt: Upgrade your Konvoy environment within the DKP Essential License.
beta: false
enterprise: false
menuWeight: 30
---

## Prerequisites

-   Create an [on-demand backup][backup] of your current configuration with Velero.

-   Follow the steps listed in the [DKP upgrade overview][dkpup].

-   Ensure that all platform applications in the management cluster have been upgraded to avoid compatibility issues with the [Kubernetes version][releasenotes] included in this release. This is done automatically when [upgrading Kommander][upgradekomm], so ensure that you upgrade Kommander prior to upgrading Konvoy.

-   For air-gapped: Download the required bundles either at our [support site][supportsite] or by using the CLI.

-   For Azure, set the required [environment variables][envariables].

-   For AWS, set the required [environment variables][envariables2].

-   For vSphere, set the required [environment variables][envariables3].

-   For EKS, set the required [environment variables][envariables4].

The following infrastructure provider environments are supported:

-   Amazon Web Services (AWS)

-   Microsoft Azure

-   Pre-provisioned environments

-   vSphere

-   Google Cloud Platform

-   EKS

## Overview

To upgrade Konvoy for DKP Essential:

1. Upgrade the Cluster API (CAPI) components
1. Upgrade the core addons
1. Upgrade the Kubernetes version

If you have more than one Essential cluster, repeat all of these steps for each Essential cluster (management cluster).

<p class="message--note"><strong>NOTE:</strong> For pre-provisioned air-gapped environments, you must run <code>konvoy-image upload artifacts</code>.</p>

For a full list of DKP Essential features, see [DKP Essential][dkpessential].

## Upgrade the CAPI components

New versions of DKP come pre-bundled with newer versions of CAPI, newer versions of infrastructure providers or new infrastructure providers. When using a new version of the DKP CLI, upgrade all of these components first.

<p class="message--warning"><strong>IMPORTANT:</strong>Ensure your <code>dkp</code> configuration references the management cluster where you want to run the upgrade by setting the <code>KUBECONFIG</code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

1.  If your cluster was upgraded to 2.1 from 1.8, prepare the old cert-manager installation for upgrade:

    ```bash
    helm -n cert-manager get manifest cert-manager-kubeaddons | kubectl label -f - clusterctl.cluster.x-k8s.io/core=cert-manager
    kubectl delete validatingwebhookconfigurations/cert-manager-kubeaddons-webhook mutatingwebhookconfigurations/cert-manager-kubeaddons-webhook
    ```

1.  For <strong>all</strong> clusters, upgrade capi-components:

    ```bash
    dkp upgrade capi-components
    ```

1.  If your cluster was upgraded to 2.1 from 1.8, remove the remaining old cert-manager resources from 1.8:

    ```bash
    helm -n cert-manager delete cert-manager-kubeaddons
    ```

The command should output something similar to the following:

```sh
✓ Upgrading CAPI components
✓ Waiting for CAPI components to be upgraded
✓ Initializing new CAPI components
✓ Deleting Outdated Global ClusterResourceSets
```

If the upgrade fails, review the prerequisites section and ensure that you've followed the steps in the [DKP upgrade overview][dkpup].

## Upgrade the core addons

To install the core addons, DKP relies on the `ClusterResourceSet` [Cluster API feature][CAPI]. In the CAPI component upgrade, we deleted the previous set of outdated global `ClusterResourceSets` because prior to DKP 2.3 some addons were installed using a global configuration. In order to support individual cluster upgrades, DKP 2.3 now installs all addons with a unique set of `ClusterResourceSet` and corresponding referenced resources, all named using the cluster’s name as a suffix. For example: `calico-cni-installation-my-aws-cluster`.

<p class="message--warning"><strong>WARNING:</strong> If you modified any of the <code>clusterResourceSet</code> definitions, these changes are <strong>not</strong> preserved when running the command <code>dkp upgrade addons</code>. You can use the <code>--dry-run -o yaml</code> options to save the new configuration to a file and make the same changes again upon each of the upgrades.</p>

Your cluster comes preconfigured with a few different core addons that provide functionality to your cluster upon creation. These include: CSI, CNI, Cluster Autoscaler, and Node Feature Discovery. New versions of DKP may come pre-bundled with newer versions of these addons. Perform the following steps to update these addons.

<p class="message--warning"><strong>IMPORTANT:</strong>If you have more than one essential cluster, ensure your <code>dkp</code> configuration references the management cluster where you want to run the upgrade by setting the <code>KUBECONFIG</code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

Upgrade the core addons in a cluster using the 'dkp upgrade addons' command specifying the cluster infrastructure (choose [`aws`, `azure`, `vsphere`, `gcp`, `eks`, `preprovisioned`]) and the name of the cluster. In the examples below, replace infrastructure provider in command at the location with corresponding provider name as shown in brackets above.

Examples:

```bash
export CLUSTER_NAME=my-azure-cluster
dkp upgrade addons azure --cluster-name=${CLUSTER_NAME}
```
OR

```bash
export CLUSTER_NAME=my-aws-cluster
dkp upgrade addons aws --cluster-name=${CLUSTER_NAME}
```


The output for the AWS example should be similar to:

```sh
Generating addon resources
clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-my-aws-cluster upgraded
configmap/calico-cni-installation-my-aws-cluster upgraded
clusterresourceset.addons.cluster.x-k8s.io/tigera-operator-my-aws-cluster upgraded
configmap/tigera-operator-my-aws-cluster upgraded
clusterresourceset.addons.cluster.x-k8s.io/aws-ebs-csi-my-aws-cluster upgraded
configmap/aws-ebs-csi-my-aws-cluster upgraded
clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-my-aws-cluster upgraded
configmap/cluster-autoscaler-my-aws-cluster upgraded
clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-my-aws-cluster upgraded
configmap/node-feature-discovery-my-aws-cluster upgraded
clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-my-aws-cluster upgraded
configmap/nvidia-feature-discovery-my-aws-cluster upgraded
```
Flags:
    -h, --help  Help for addons

Global Flags:
    -v, --verbose int   Output verbosity

For more information about a command, use:

```sh
dkp ugrade addons [command] --help
```
    
### See also ###

[DKP upgrade addons](/../../dkp/konvoy/2.3/cli/dkp/upgrade/addons/)

Once complete, begin upgrading the Kubernetes version.

## Upgrade the Kubernetes version

When upgrading the Kubernetes version of a cluster, first upgrade the control plane and then the node pools.


1. Build a new image if applicable.  
    - If an AMI was specified when initially creating a cluster for AWS, you must build a new one with <a href="/dkp/konvoy/2.3/image-builder/create-ami/">Konvoy Image Builder</a>.
    - If an Azure Machine Image was specified for Azure, you must build a new one with <a href="/dkp/konvoy/2.3/image-builder/create-azure-image/">Konvoy Image Builder</a>.

1.  Upgrade the Kubernetes version of the control plane. As shown in update addons section above, replace infrastructure provider name in the command [`aws`, `azure`, `vsphere`, `gcp`, `eks`, `preprovisioned`].

    ```bash
    dkp update controlplane aws --cluster-name=${CLUSTER_NAME} --kubernetes-version=v1.23.7
    ```

    The output should be similar to:

    ```sh
    Updating control plane resource controlplane.cluster.x-k8s.io/v1beta1, Kind=KubeadmControlPlane default/my-aws-cluster-control-plane
    Waiting for control plane update to finish.
     ✓ Updating the control plane
    ```

1.  Upgrade the Kubernetes version of each of your node pools. Replace `my-nodepool` with the name of the node pool. Also, replace the name of the infrastructure provider in the command [`aws`, `azure`, `vsphere`, `gcp`, `eks`, `preprovisioned`].

    ```bash
    export NODEPOOL_NAME=my-nodepool
    dkp update nodepool aws ${NODEPOOL_NAME} --cluster-name=${CLUSTER_NAME} --kubernetes-version=v1.23.7
    ```

    The output should be similar to below with the name of the infrastructure provider shown accordingly:

    ```sh
    Updating node pool resource cluster.x-k8s.io/v1beta1, Kind=MachineDeployment default/my-aws-cluster-my-nodepool
    Waiting for node pool update to finish.
     ✓ Updating the my-aws-cluster-my-nodepool node pool
    ```

Repeat this step for each additional node pool.

For the overall process for upgrading to the latest version of DKP, refer back to [DKP Upgrade][dkpup]

[dkpup]: ../../
[upgradekomm]: ../../upgrade-kommander/
[supportsite]: https://support.d2iq.com/hc/en-us
[dkpessential]: ../../../../../kommander/2.3/licensing/essential/
[kubeconfig]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[CAPI]: https://cluster-api.sigs.k8s.io/
[releasenotes]: ../../../release-notes
[backup]: ../../../../../kommander/2.3/backup-and-restore#back-up-on-demand
[envariables]: ../../../choose-infrastructure/azure/quick-start-azure#configure-azure-prerequisites
[envariables2]: ../../../choose-infrastructure/aws/quick-start-aws#configure-aws-prerequisites
[envariables3]: ../../../choose-infrastructure/vsphere/new#create-a-new-vsphere-kubernetes-cluster
[envariables4]: ../../../choose-infrastructure/eks/quick-start#configure-eks-prerequisites