---
layout: layout.pug
navigationTitle: Upgrade Kubernetes and Addons with Konvoy
title: Upgrade Kubernetes and Addons with Konvoy
menuWeight: 20
excerpt: Upgrade the Kubernetes version and platform service addons
beta: false
enterprise: false
---

Before upgrading, keep in mind there is inherent risk in upgrading any Kubernetes cluster. Any failure or error can result in unexpected downtime or loss of data.
Take necessary precautions before starting the upgrade process.
For example, back up the cluster state and all cluster-related files using [Velero](../../backup) before you upgrade.

Also keep in mind that cluster addons require a specific minimum version of Kubernetes to be installed.
You can verify your installed version before upgrading by running the following command:

```bash
kubectl version --short=true
```

A Kubernetes version upgrade using Konvoy CLI consists of a few distinct steps.

- Update the `cluster.yaml` file with the changes outlined below.
- Run `konvoy up --upgrade` which first upgrades the version of Kubernetes on all of the control-plane nodes. The command then upgrades the rest of the nodes, the platform service addons, and installs any additional addons specified in the `cluster.yaml` file.

## Supported Kubernetes version upgrades

Upgrading Kubernetes is supported when upgrading to a newer release in the current or next minor version.
Upgrading to a newer minor release of Kubernetes, requires a new Konvoy minor release.
Upgrades that skip one or more minor versions are not supported.
Downgrades are not supported.

For example, Konvoy supports upgrading Kubernetes v1.17.x directly to a newer v1.17.x (Konvoy v1.5.x) or v1.18.x (Konvoy v1.6.x).
Upgrading a v1.16 release directly to a v1.18 release is unsupported, but v1.16 may be upgraded to v1.17 and again to v1.18.

This support policy applies to every node in the cluster.
When upgrading a cluster running a mix of Kubernetes versions, each node upgrade must be supported for the cluster upgrade to be supported.

If you attempt an unsupported upgrade, Konvoy exits with an error.
To force an unsupported upgrade, use the `--force-upgrade` flag.

## Before you begin

Before upgrading your Kubernetes cluster, or any of the addons, you must download the specific version of Konvoy by following the steps outlined in the [download](../../download) page.

You must also have access to the `cluster.yaml` file and the SSH keys that were generated during the initial install.
If you are using one of the public cloud provisioners you must also have access to the `state/` directory that was generated during the initial install.

## Prepare for Kubernetes upgrade

In the `cluster.yaml` file, modify the `spec.kubernetes.version` value in `ClusterConfiguration` to the desired Kubernetes version.

For example, assume the cluster was launched with the following `ClusterConfiguration` section:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    version: 1.17.12
```

If you want to upgrade to a newer minor version of `1.18.x`, change the version string like the following:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    version: 1.18.18
```

## Prepare for addons upgrade

Konvoy platform service addons are managed by a library that pulls default configuration details from the [kubernetes-base-addons][addons_repo] repository.

Versioning for the platform service addons is managed by [git tags][git_tags] and [github releases][git_releases] within the [kubernetes-base-addons][addons_repo] repository.

Addons are deployed to the cluster as part of the `konvoy up`, `konvoy deploy` or `konvoy deploy addons` commands.
These commands use the version of `kubernetes-base-addons` declared in the `cluster.yaml` configuration file using the `spec.addons.version` setting.

For example, assume the cluster was launched with the following `ClusterConfiguration` section:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16-1
    addonsList:
    ...
```

If you want to upgrade to a newer version of addons, you must then change the version string like the following:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.17-1.2.0
    addonsList:
    ...
```

<p class="message--note"><strong>NOTE: </strong>The <code>configVersion</code> string value is of the form: <code>stable-a.b-x.y.z</code>.</p>

<p class="message--note"><strong>NOTE: </strong>Depending on the addon version you are upgrading to, you may need to include additional addons. For the full list of addons refer to the <a href="../../reference/cluster-configuration">reference document</a>.</p>

During the addons upgrade process, Konvoy upgrades the platform service addons or installs any additional addons specified in the `cluster.yaml` file.

## Upgrade the cluster

During the Kubernetes upgrade process, Konvoy:

-   Determines which nodes do not have the required configuration and OS package versions.
-   Determines if upgrading these nodes from their current state to the provided cluster configuration is supported.
    - To force an unsupported upgrade, use the `--force-upgrade` flag.
-   During stage `STAGE [Determining Upgrade Safety ...]`, checks for any user workloads that can be impacted by the upgrade and marks the nodes, where the workloads are running, as "unsafe" to upgrade, skipping the upgrade process on them.
    - To ignore the safety check _for worker nodes only_, use the `--force-upgrade` flag.
    - Otherwise you can resolve the safety issues after the initial upgrade and rerun the upgrade process to let Konvoy perform the upgrade on the remaining nodes.
-   Upgrades all the control-plane nodes serially.
-   Upgrades the remaining nodes sequentially, upgrading all of the nodes in a node pool before continuing onto a different node pool.
    -   By default, konvoy upgrades every node pool. To upgrade a subset of node pools, specify a comma-separated list of node pool names, with the `--target-node-pools` flag.
    -   By default, `15%` of all nodes in each node pool (except those in the control-plane) are upgraded in parallel.
        To change this behavior, pass the flag `--max-parallel-nodes` when running `konvoy up`, `konvoy deploy` or `konvoy deploy kubernetes`.
        The value can be an integer, representing the number of nodes, or a percentage of nodes in the node pool (e.g. `--max-parallel-nodes 20%`).
        Passing a value of `1` upgrades the nodes serially.
        If some nodes in a batch fail to upgrade, Konvoy continues to upgrade the other nodes in the batch, but exits with an error. Fix the error manually and retry the process.
    -   The workloads are moved to a different node with `kubectl drain`. This process takes a few minutes before all workloads are scheduled onto different nodes. You can disable this behavior by passing the flag `--without-draining` when running `konvoy up`, `konvoy deploy` or `konvoy deploy kubernetes`. When `--without-draining` is specified, because no workloads are rescheduled, all nodes are upgraded, even when there are workloads that are "unsafe" to upgrade.
    -   <p class="message--warning"><strong>WARNING: </strong> Using the <code>--without-draining</code> flag is volatile and can result in undefined behavior, downtime, and outages for your services during an upgrade. For production systems, notify your end users of cluster maintenance prior to upgrading with this flag.</p>
    -   The Kubernetes and Containerd OS packages are upgraded.
    -   The node is uncordoned allowing for workloads to be scheduled on it again.

After you have modified the `cluster.yaml` file, you can start the upgrade process. You can upgrade all nodes, or choose to upgrade specific node pools.

### Upgrade all nodes

Start the upgrade process by running the following Konvoy command:

```bash
konvoy up --upgrade -y
This process will take about 15 minutes to complete (additional time may be required for larger clusters)

...

STAGE [Determining Upgrade Safety For Control Plane Nodes]
...

STAGE [Upgrading Kubernetes]
...

STAGE [Determining Upgrade Safety For Nodes In Pool "worker"]
...

STAGE [Upgrading Kubernetes]
...

STAGE [Determining Upgrade Safety For Nodes]
...

STAGE [Upgrading Kubernetes]
...

STAGE [Deploying Enabled Addons]
...
```

You can also separate the above process by first running `konvoy deploy kubernetes --upgrade` and then running `konvoy deploy addons`.

## Upgrade specific node pools

You can have more control over the upgrade process by upgrading specific node pools. For example, you can upgrade only your control plane node pool, or only the control plane node pool and a single worker node pool.

<p class="message--note"><strong>NOTE: </strong>Node pools allow the cluster administrator to use different configurations for different sets of worker nodes in a heterogeneous environment. For more, see the <a href="../../install/node-pools/">Node Pools</a> page.</p>

For example, if your cluster has three worker node pools, `red`, `yellow`, and `green`, you can upgrade the `red` and `yellow` worker node pools. To start the upgrade process, perform the following Konvoy command:

```bash
konvoy up --upgrade -y --target-node-pools red,yellow
```

<p class="message--note"><strong>NOTE: </strong>Kubernetes requires that the control plane version be  greater than or equal to the version of any worker node, so the control plane node pool must be upgraded before any worker node pools.

If you choose to upgrade a worker node pool, and the control plane node pool has not yet been upgraded, Konvoy automatically upgrades the control plane node pool first.
</p>

You can upgrade all remaining nodes by running the following Konvoy command:

```bash
konvoy up --upgrade -y
```

[addons_repo]: https://github.com/mesosphere/kubernetes-base-addons
[git_releases]: https://help.github.com/en/github/administering-a-repository/managing-releases-in-a-repository
[git_tags]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
