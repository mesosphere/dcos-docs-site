---
layout: layout.pug
navigationTitle: Upgrade Kubernetes with Konvoy
title: Upgrade Kubernetes with Konvoy
menuWeight: 20
excerpt: Upgrade Kubernetes for your Konvoy cluster
enterprise: false
---

Before upgrading, keep in mind there is an inherent risk to upgrading any Kubernetes cluster because any failure or error could result in unexpected downtime or loss of data.
You should take whatever precautions are necessary before starting the upgrade process.
For example, you should be sure to back up the cluster state and all cluster-related files using [velero](https://github.com/heptio/velero) before you upgrade.

You should also keep in mind that cluster add-ons require a specific minimum version of Kubernetes to be installed.
You can verify the version you have installed before upgrading by running the `kubectl version --short=true` command.

## Konvoy upgrade

In the `cluster.yaml` file, a change to the `ClusterConfiguration` is necessary such that the `spec.kubernetes.version` matches the version information for the cluster you want deployed.

For example, assume the cluster was launched with the following `ClusterConfiguration` section:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: alejandro
  creationTimestamp: "2019-06-08T03:25:20.939527Z"
spec:
  kubernetes:
    version: 1.15.3
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
```

If you want to upgrade to a newer patch version of `1.15`, then you would change the version string like this:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: alejandro
  creationTimestamp: "2019-06-08T03:25:20.939527Z"
spec:
  kubernetes:
    version: 1.15.3
```

After you modify the version information, you can start the upgrade process by running the following Konvoy command:

```bash
konvoy up --upgrade -y
This process will take about 20 minutes to complete (additional time may be required for larger clusters)

STAGE [Determining Upgrade Safety]
...
```
