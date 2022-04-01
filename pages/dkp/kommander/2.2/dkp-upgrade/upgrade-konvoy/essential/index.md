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

* Follow the steps listed in the [DKP upgrade overview][dkpup].

* Ensure that all platform applications in the management cluster have been upgraded to avoid compatibility issues with the [Kubernetes version][releasenotes] included in this release. This is done automatically when [upgrading Kommander][upgradekomm], so ensure that Kommander has been upgraded prior to Konvoy.

* For air-gapped: Download the required bundles either at our [support site][supportsite] or [via the CLI][airgapbundle].

The following infrastructure environments are supported:

* Amazon Web Services (AWS)

* Microsoft Azure

* Pre-provisioned environments

## Overview

The Konvoy upgrade for DKP Essential encompasses the following three steps in sequential order:

1. Upgrade the Cluster API (CAPI) components
1. Upgrade the core addons
1. Upgrade the Kubernetes version

If you have more than one Essential license, repeat all of these steps for each Essential cluster (management cluster).

For a full list of DKP Essential features, see [DKP Essential][dkpessential].

## Upgrade the CAPI components

New versions of DKP come pre-bundled with newer versions of CAPI, newer versions of infrastructure providers or new infrastructure providers. When using a new version of the DKP CLI, upgrade all of these components first.

If you are running on more than one management cluster (Kommander cluster), you must upgrade the CAPI Components on each of these clusters. Ensure your `dkp` configuration references the management cluster where you want to run the upgrade by setting the KUBECONFIG environment variable [to the appropriate kubeconfig file’s location][kubeconfig].

<p class="message--note"><strong>NOTE:</strong> An alternative to initializing the KUBECONFIG environment variable is to use the <code>--kubeconfig=cluster_name.conf</code> flag, ensuring that Kommander upgrades on the workload cluster.</p>

1. Run the following upgrade command for the CAPI components.

```bash
dkp upgrade capi-components
```

The command should output something similar to the following:

```bash
✓ Upgrading CAPI components
✓ Waiting for CAPI components to be upgraded
✓ Initializing new CAPI components
✓ Deleting Outdated Global ClusterResourceSets
```

1. Once finished, verify that the components were upgraded using the `kubectl get provider` command.

```bash
kubectl get provider --all-namespaces
NAMESPACE                           NAME                            AGE     TYPE                     PROVIDER         VERSION
capa-system                         infrastructure-aws              5m54s   InfrastructureProvider   aws              v1.2.0-d2iq.0
capi-kubeadm-bootstrap-system       bootstrap-kubeadm               6m2s    BootstrapProvider        kubeadm          v1.1.3-d2iq.3
capi-kubeadm-control-plane-system   control-plane-kubeadm           5m58s   ControlPlaneProvider     kubeadm          v1.1.3-d2iq.3
capi-system                         cluster-api                     6m5s    CoreProvider             cluster-api      v1.1.3-d2iq.3
cappp-system                        infrastructure-preprovisioned   5m44s   InfrastructureProvider   preprovisioned   v0.5.0
capv-system                         infrastructure-vsphere          57s     InfrastructureProvider   vsphere          v1.1.1
capz-system                         infrastructure-azure            5m47s   InfrastructureProvider   azure                 v1.1.1
```
If the upgrade fails, review the prerequisites section and ensure that you've followed the steps in the [DKP upgrade overview][dkpup].

## Upgrade the core addons

To install the core addons, DKP relies on the `ClusterResourceSet` [Cluster API feature][CAPI]. In the CAPI component upgrade, we deleted the previous set of outdated global `ClusterResourceSets` because prior to DKP 2.2 some addons were installed using a global configuration. In order to support individual cluster upgrades, DKP 2.2 now installs all addons with a unique set of `ClusterResourceSet` and corresponding referenced resources, all named using the cluster’s name as a suffix. For example: `calico-cni-installation-my-aws-cluster`.

<p class="message--warning"><strong>WARNING:</strong> If you have modified any of the <code>clusterResourceSet</code> definitions, these changes will <strong>not</strong> be preserved when running the command <code>dkp upgrade addons</code>. You can use the <code>--dry-run -o yaml</code> options to save the new configuration to a file and remake the same changes upon each upgrade.</p>

Your cluster comes preconfigured with a few different core addons that provide functionality to your cluster upon creation. These include: CSI, CNI, Cluster Autoscaler, and Node Feature Discovery. New versions of DKP may come pre-bundled with newer versions of these addons. Perform the following steps to update these addons.

1. If you have more than one essential license, ensure your `dkp` configuration references the management cluster where you want to run the upgrade by setting the KUBECONFIG environment variable [to the appropriate kubeconfig file’s location][kubeconfig].

<p class="message--note"><strong>NOTE:</strong> An alternative to initializing the KUBECONFIG environment variable is to use the <code>--kubeconfig=cluster_name.conf</code> flag, ensuring that Kommander upgrades on the workload cluster.</p>

1. Replace `my-aws-cluster` with the name of the cluster.

```bash
export CLUSTER_NAME=my-aws-cluster
dkp upgrade addons aws --cluster-name=${CLUSTER_NAME}
```

The output should be similar to:

```bash
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

1. Monitor the pods for the core addons restarting in your cluster:

```bash
###DEV ADD OUTPUT HERE
```
Once complete, begin upgrading the Kubernetes version.

## Upgrade the Kubernetes version

When upgrading the Kubernetes version of a cluster, first upgrade the control plane and then the node pools.

1. Replace `my-aws-cluster` with the name of the cluster.

1. Upgrade the Kubernetes version of the control plane.

```bash
dkp update controlplane aws --cluster-name=${CLUSTER_NAME} --kubernetes-version=v1.22.8
```

The output should be similar to:

```bash
### DEV ENTER OUTPUT HERE
```

1. Upgrade the Kubernetes version of each of your node pools. Replace `my-nodepool` with the name of the node pool.

```bash
export NODEPOOL_NAME=my-nodepool
dkp update nodepool aws ${NODEPOOL_NAME} --cluster-name=${CLUSTER_NAME} --kubernetes-version=v1.22.8
```
The output should be similar to:

```bash
### DEV ENTER OUTPUT HERE
```
Repeat this step for each additional node pool.

[dkup]: .../dkp-upgrade/
[upgradekomm]: .../upgrade-kommander/
[supportsite]: https://support.d2iq.com/hc/en-us
[airgapbundle]: .../konvoy/2.2/choose-infrastructure/airgapbundle/
[dkpessential]: .../kommander/2.2/licensing/essential/
[kubeconfig]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[CAPI]: https://cluster-api.sigs.k8s.io/
[releasenotes]: ../../../release-notes
