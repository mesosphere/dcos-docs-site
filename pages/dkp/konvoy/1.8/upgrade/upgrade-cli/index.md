---
layout: layout.pug
navigationTitle: Upgrade Konvoy CLI
title: Upgrade Konvoy CLI
menuWeight: 30
excerpt: Upgrade Konvoy image CLI version
beta: false
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>Before upgrading, keep in mind that your Konvoy CLI version can only be upgraded to a compatible Konvoy version.</p>

## Before you begin: Prepare for Konvoy CLI upgrade

If you're using a newer version of the Konvoy CLI, it may require changes to your `cluster.yaml`, as described below.

A Konvoy upgrade consists of a few distinct steps.

1. [Download](../../download) the Konvoy binary and extract it in your environment in the same manner as the initial install.
1. Gain access to the `cluster.yaml` file, and the SSH keys that were generated during the initial install.
1. Update the `cluster.yaml` file with the changes described below.
1. Run `konvoy up --upgrade`, which upgrades the version of Kubernetes on all of the control-plane nodes, then upgrades the rest of the nodes and platform services, and installs any addons specified in the `cluster.yaml` file.

## Konvoy CLI available versions

You can verify which version your CLI can be upgraded to by running the following command:

```bash
konvoy image list
```

This command lists all the available versions to which your current CLI can be upgraded.
This list also shows the default Kubernetes version of each Konvoy version.

This command uses Docker Hub to fetch all the available Konvoy versions.

### Using a private Docker registry

If you are using a [private Docker registry][docker_registry] for your clusters, you will have to follow the [private Docker registry steps][private-docker-konvoy] to pull the Konvoy images.

## Konvoy CLI version upgrade

After you have the available Konvoy versions, you can upgrade your CLI by running the following command:

```bash
konvoy image upgrade --version=v1.8.5
Wrote Konvoy CLI version 'v1.8.5' to '.konvoy/cli_version'
```

After the upgrade command completes, you can start using the new Konvoy version.

### Upgrading Konvoy from v1.7.x to v1.8.5

**You must modify your `cluster.yaml` with these changes when upgrading from a previous Konvoy version:**

It is recommended to upgrade to the newest supported version of Kubernetes. Set `spec.kubernetes.version: 1.20.13` for kind: ClusterConfiguration.

The version of Calico was bumped in Konvoy v1.8.4, from Calico v3.17.3 to v3.20.2. When upgrading, set `spec.containerNetworking.calico.version: v3.20.2` for kind: ClusterConfiguration.

The version of Kubernetes Base Addons changed if you use KBA, so you need to change your `configVersion` for your `configRepository`: `https://github.com/mesosphere/kubernetes-base-addons` to be `spec.addons.configVersion: stable-1.20-4.4.0` for of kind: ClusterConfiguration.

If you use Kommander, you need to change the `configVersion` for your `configRepository`: `https://github.com/mesosphere/kubeaddons-kommander` to be `spec.addons.configVersion: stable-1.20-1.4.4` for kind: ClusterConfiguration.

If you have Dispatch enabled, you need to change the `configVersion` for your `configRepository`: `https://github.com/mesosphere/kubeaddons-dispatch` to be `configVersion: stable-1.20-1.4.6` for kind: ClusterConfiguration

The version of Konvoy is now `v1.8.5`, set `spec.version: v1.8.5` for both of kind: ClusterProvisioner and of kind: ClusterConfiguration.

```yaml
kind: ClusterProvisioner
...
  version: v1.8.5
...
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    version: 1.20.13
  ...
  containerNetworking:
    calico:
      version: v3.20.2
  ...
  addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.20-4.4.0
  ...
    - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
      configVersion: stable-1.20-1.4.6
      addonsList:
        - name: dispatch
          enabled: true
...
    - configRepository: https://github.com/mesosphere/kubeaddons-kommander
      configVersion: stable-1.20-1.4.4
      addonsList:
        - name: kommander
          enabled: true
  ...
  version: v1.8.5
```

## Upgrades and Running Workloads

<p class="message--note"><strong>NOTE: </strong>During the upgrade process, if the cluster has certain types of workloads running, the Konvoy CLI displays a warning. These warnings report skipped nodes in the upgrade process.</p>

Konvoy preserves the availability of applications in the cluster by detecting:

- All replicas of a `ReplicaSet` run on a single node. Draining that node interrupts the application.
- `ReplicaSets` having a replica count less than 2. Draining this node interrupts the application.
- Pods using an `EmptyDir` volume, or other host-based storage that binds the pod to a specific node, preventing it from migrating to another node.

To force the node to upgrade, you can run `konvoy up --upgrade --force-upgrade`, which upgrades all the nodes and ignores the safety checks. This can result in temporary interruptions to application availability.

During the `node drain` stage, Konvoy may exhibit a time-out error, while waiting for workloads to reschedule. Users can bypass this process during upgrade by using `konvoy up --upgrade --force-upgrade --without-draining`. This usage can result in undefined behavior,  interruptions to application availability and service downtime.

Konvoy avoids interrupting applications by default, and displays these warnings while deferring upgrade operations.

To avoid these warnings, and reduce risks to application availability:

- Configure the application's deployment to run multiple replicas for fault tolerance.
- Using distributed or remote storage solutions instead of host-based storage.
- Set Pod anti-affinity to ensure pods distribute across nodes for better fault tolerance.

[docker_registry]: https://docs.docker.com/registry/deploying/
[istio-upgrade]: upgrade-cli-istio
[private-docker-konvoy]: upgrade-cli-docker
