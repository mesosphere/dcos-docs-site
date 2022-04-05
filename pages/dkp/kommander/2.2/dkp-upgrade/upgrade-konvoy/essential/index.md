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

* Create an [on-demand backup][backup] of your current configuration with Velero.

* Follow the steps listed in the [DKP upgrade overview][dkpup].

* Ensure that all platform applications in the management cluster have been upgraded to avoid compatibility issues with the [Kubernetes version][releasenotes] included in this release. This is done automatically when [upgrading Kommander][upgradekomm], so ensure that you upgrade Kommander prior to upgrading Konvoy.

* For air-gapped: Download the required bundles either at our [support site][supportsite] or by using the CLI.

* For Azure, set the required [environment variables][envariables].

* For AWS, set the required [environment variables][envariables2].


The following infrastructure environments are supported:

* Amazon Web Services (AWS)

* Microsoft Azure

* Pre-provisioned environments

## Overview

To upgrade Konvoy for DKP Essential:

1. Upgrade the Cluster API (CAPI) components
1. Upgrade the core addons
1. Upgrade the Kubernetes version

If you have more than one Essential license, repeat all of these steps for each Essential cluster (management cluster).

<p class="message--note"><strong>NOTE:</strong> For pre-provisioned air-gapped environments, you must run <code>konvoy-image upload artifacts</code>.</p>

For a full list of DKP Essential features, see [DKP Essential][dkpessential].

## Upgrade the CAPI components

New versions of DKP come pre-bundled with newer versions of CAPI, newer versions of infrastructure providers or new infrastructure providers. When using a new version of the DKP CLI, upgrade all of these components first.

<p class="message--warning"><strong>IMPORTANT:</strong>Ensure your <code>dkp</code> configuration references the management cluster where you want to run the upgrade by setting the <code>KUBECONFIG</code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

1. Run the following upgrade command for the CAPI components.

```bash
dkp upgrade capi-components
```

The command should output something similar to the following:

```text
✓ Upgrading CAPI components
✓ Waiting for CAPI components to be upgraded
✓ Initializing new CAPI components
✓ Deleting Outdated Global ClusterResourceSets
```

If the upgrade fails, review the prerequisites section and ensure that you've followed the steps in the [DKP upgrade overview][dkpup].

## Upgrade the core addons

To install the core addons, DKP relies on the `ClusterResourceSet` [Cluster API feature][CAPI]. In the CAPI component upgrade, we deleted the previous set of outdated global `ClusterResourceSets` because prior to DKP 2.2 some addons were installed using a global configuration. In order to support individual cluster upgrades, DKP 2.2 now installs all addons with a unique set of `ClusterResourceSet` and corresponding referenced resources, all named using the cluster’s name as a suffix. For example: `calico-cni-installation-my-aws-cluster`.

<p class="message--warning"><strong>WARNING:</strong> If you modified any of the <code>clusterResourceSet</code> definitions, these changes are <strong>not</strong> preserved when running the command <code>dkp upgrade addons</code>. You can use the <code>--dry-run -o yaml</code> options to save the new configuration to a file and make the same changes again upon each of the upgrades.</p>

Your cluster comes preconfigured with a few different core addons that provide functionality to your cluster upon creation. These include: CSI, CNI, Cluster Autoscaler, and Node Feature Discovery. New versions of DKP may come pre-bundled with newer versions of these addons. Perform the following steps to update these addons.

<p class="message--warning"><strong>IMPORTANT:</strong>If you have more than one essential cluster, ensure your <code>dkp</code> configuration references the management cluster where you want to run the upgrade by setting the <code>KUBECONFIG</code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

1. Replace `my-aws-cluster` with the name of the cluster.

```bash
export CLUSTER_NAME=my-aws-cluster
dkp upgrade addons aws --cluster-name=${CLUSTER_NAME}
```

The output should be similar to:

```text
Generating addon resources
clusterresourceset.addons.cluster.x-k8s.io/calico-cni-    installation-my-aws-cluster upgraded
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

Once complete, begin upgrading the Kubernetes version.

## Upgrade the Kubernetes version

When upgrading the Kubernetes version of a cluster, first upgrade the control plane and then the node pools.

<p class="message--note"><strong>NOTE:</strong> If an AMI was specified when initially creating a cluster, you must build a new one with <a href="/dkp/konvoy/2.2/image-builder/">Konvoy Image Builder</a> and pass it with <code>--ami</code>.

1. Replace `my-aws-cluster` with the name of the cluster.

2. Upgrade the Kubernetes version of the control plane.

```bash
dkp update controlplane aws --cluster-name=${CLUSTER_NAME} --kubernetes-version=v1.22.8
```

The output should be similar to:

```text
### DEV ENTER OUTPUT HERE
```

3. Upgrade the Kubernetes version of each of your node pools. Replace `my-nodepool` with the name of the node pool.

```bash
export NODEPOOL_NAME=my-nodepool
dkp update nodepool aws ${NODEPOOL_NAME} --cluster-name=${CLUSTER_NAME} --kubernetes-version=v1.22.8
```
The output should be similar to:

```text
### DEV ENTER OUTPUT HERE
```
Repeat this step for each additional node pool.

[dkpup]: /dkp/kommander/2.2/dkp-upgrade/
[upgradekomm]: ../../upgrade-kommander/
[supportsite]: https://support.d2iq.com/hc/en-us
[dkpessential]: /dkp/kommander/2.2/licensing/essential/
[kubeconfig]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[CAPI]: https://cluster-api.sigs.k8s.io/
[releasenotes]: ../../../release-notes
[backup]: ../../../backup-and-restore/#back-up-on-demand
[envariables]: /dkp/konvoy/2.2/choose-infrastructure/azure/quick-start-azure/#configure-azure-prerequisites
[envariables2]: /dkp/konvoy/2.2/choose-infrastructure/aws/quick-start-aws/#configure-aws-prerequisites
