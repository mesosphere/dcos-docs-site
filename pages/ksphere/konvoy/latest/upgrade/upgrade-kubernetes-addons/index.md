---
layout: layout.pug
navigationTitle: Upgrade Kubernetes with Konvoy
title: Upgrade Kubernetes and Addons
menuWeight: 20
excerpt: Upgrade the Kubernetes version and platform service addons
enterprise: false
---

Before upgrading, keep in mind there is inherent risk in upgrading any Kubernetes cluster. Any failure or error can result in unexpected downtime or loss of data.
Take necessary precautions before starting the upgrade process.
For example, back up the cluster state and all cluster-related files using [velero](../../backup) before you upgrade.

Also keep in mind that cluster addons require a specific minimum version of Kubernetes to be installed.
You can verify your installed version before upgrading by running the following command:

```bash
kubectl version --short=true
```

A Konvoy upgrade consists of a few distinct steps.

- Download the Konvoy binary and extract it in your environment in the same manner as the initial install.  
- Update the `cluster.yaml` file with the changes outlined below.
- Run `konvoy up --upgrade` which first upgrades the version of Kubernetes on all of the control-plane nodes. The command then upgrades the rest of the nodes, the platform service addons, and installs any additional addons specified in the `cluster.yaml` file.

## Before you begin

Before upgrading your Kubernetes cluster, or any of the addons, you must download the specific version of Konvoy by following the steps outlined in the [download](../../download) page.

You must also have access to the `cluster.yaml` file and the SSH keys that were generated during the initial install.
If you are using one of the public cloud provisioners you must also have access to the `state/` directory that was generated during the initial install.

## Prepare for Kubernetes upgrade

In the `cluster.yaml` file, modify the `spec.kubernetes.version` value in `ClusterConfiguration` to the desired Kubernetes version.

For example, assume the cluster was launched with the following `ClusterConfiguration` section:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    version: 1.15.6
```

If you want to upgrade to a newer patch version of `1.16.x`, change the version string like the following:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    version: 1.16.4
```

<p class="message--note"><strong>NOTE: </strong>For certain Konvoy releases you might be required to change the versions for `containerNetworking` or `containerRuntime`. These changes are highlighted in the Release Notes and in the section further down this page.</p>

During the Kubernetes upgrade process, Konvoy:

-   Determines which nodes do not have the required configuration and OS package versions.
-   During stage `STAGE [Determining Upgrade Safety ...]`, checks for any user workloads that may be impacted by the upgrade and marks the nodes, where the workloads are running, to be "unsafe" to upgrade, skipping the upgrade process on them.
    - You can force Konvoy to upgrade all of nodes by using the `--force-upgrade` flag.
    - Otherwise you can resolve the safety issues after the initial upgrade and rerun the upgrade process to let Konvoy perform the upgrade on the remaining nodes.
-   Upgrades all of the control-plane nodes.
-   Upgrades the remaining nodes sequentially, upgrading all of the nodes in a NodePool before continuing onto a different NodePool.
    - The workloads are moved to a different node with `kubectl drain`. This process may take a few minutes before all the workloads are scheduled onto different nodes. It is also possible to disable this behavior by passing the flag `--without-draining` when running `konvoy up`, `konvoy deploy` or `konvoy deploy kubernetes`. When `--without-draining` is specified, because no workloads will be rescheduled, all nodes will be upgraded, even when there are workloads that are "unsafe" to upgrade.  
    - The Kubernetes and Containerd OS packages are upgraded.
    - The node is uncordoned allowing for workloads to be scheduled on it again.

## Prepare for addons upgrade

Konvoy platform service addons are managed by a library that pulls default configuration details from the [kubernetes-base-addons](https://github.com/mesosphere/kubernetes-base-addons) repository.

Versioning for the platform service addons is managed by [git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) and [github releases](https://help.github.com/en/articles/creating-releases) within the [kubernetes-base-addons](https://github.com/mesosphere/kubernetes-base-addons) repository.

Addons are deployed to the cluster as part of the `konvoy up`, `konvoy deploy` or `konvoy deploy addons` commands.
These commands use the version of `kubernetes-base-addons` declared in the `cluster.yaml` configuration file using the `spec.addons.version` setting.

For example, assume the cluster was launched with the following `ClusterConfiguration` section:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.15.6-1
    addonsList:
    ...
```

If you want to upgrade to a newer version of addons, then you must change the version string like the following:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16-1.2.0
    addonsList:
    ...
```

During the addons upgrade process, Konvoy upgrades the platform service addons or installs any additional addons specified in the `cluster.yaml` file.

## Upgrading your cluster

After you have modified the `cluster.yaml` file, you can start the upgrade process by running the following Konvoy command:

```bash
konvoy up --upgrade -y
This process will take about 20 minutes to complete (additional time may be required for larger clusters)

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

The steps above outline the general process for performing an upgrade of Kubernetes and addons. For some releases, the process might differ slightly. The steps below outline the process when upgrading to specific versions of Konvoy.

### Upgrading from v1.2.x to v1.3.0

**You must modify your `cluster.yaml` with these changes when upgrading from a previous version.**

Below is a partial `cluster.yaml` that contains the required changes.
Note that `apiVersion: konvoy.mesosphere.io/v1alpha1` has not been modified.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  kubernetes:
    version: 1.16.4
  containerNetworking:
    calico:
      version: v3.10.1
  addons:
    configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16-1.2.0
    addonsList:
    ...
    - name: helm
      enabled: false # Must change to false or remove from the list
    - name: defaultstorageclass-protection
      enabled: true
    - name: external-dns
      enabled: true
      values: |
        aws:
          region:
        domainFilters: []
    - name: gatekeeper
      enabled: true
    - name: kube-oidc-proxy
      enabled: true
    - name: reloader
      enabled: true
```

Depending on the version you are upgrading from you may need to include additional addons. For the full list of addons refer to the [refernce document](../../reference/cluster-configuration).

After modifying the `cluster.yaml` file, you can run `konvoy up --upgrade` to upgrade the Kubernetes and all of the addons.

#### Upgrading from v1.0.x/v1.1.x to v1.2.0

**You must modify your `cluster.yaml` with these changes when upgrading from a previous version:**

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  kubernetes:
    version: 1.15.4
  addons:
    configVersion: stable-1.15.4-1
    addonsList:
    ...
    - name: cert-manager
      enabled: true
    ...
```
