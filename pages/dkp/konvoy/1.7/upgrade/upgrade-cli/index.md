---
layout: layout.pug
navigationTitle: Upgrade Konvoy CLI
title: Upgrade Konvoy CLI
menuWeight: 30
excerpt: Upgrade Konvoy image CLI version
beta: false
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>Before upgrading, keep in mind that your Konvoy CLI version can only be upgraded to a compatible Konvoy version. In general, you should upgrade Konvoy from the previous released minor version of Konvoy.</p>

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

If you are using a [private Docker registry][docker_registry] for your clusters, you can list all the available versions, passing some additional arguments to the previous command.

For example, if your private Docker registry provides a basic authentication mechanism (username/password), you must pass the following arguments, where `docker-registry-skip-verify` is optional based on your TLS settings:

```bash
konvoy image list --docker-registry-url=https://localhost:6443 --docker-registry-username=testuser --docker-registry-password=testpassword --docker-registry-skip-verify
```

If you are using a Docker registry with [v2 token authentication mechanism][docker_v2_auth_token] enabled, then you should set the following arguments to be able to list the CLI versions from the Docker registry API.

For example, if you are running [Harbor][harbor] Docker Registry, `konvoy image` talks to the [API to authenticate][docker_api_auth] to get some data about the available versions.

```bash
konvoy image list --docker-registry-url=https://myregistry.com --docker-registry-username=admin --docker-registry-password=Harbor12345 --docker-registry-skip-verify
```

If you pulled and pushed the Konvoy Docker image under a different image name or Docker repository in your registry, you need to include an additional argument to the command `docker-registry-repository`.

As an example, we pushed the Konvoy image under the `library` public repository of our Docker repository `--docker-registry-repository=library/mesosphere/konvoy`:

```bash
konvoy image list --docker-registry-url=https://localhost:6443 --docker-registry-username=testuser --docker-registry-password=testpassword --docker-registry-skip-verify --docker-registry-repository=library/mesosphere/konvoy
```

## Konvoy CLI version upgrade

After you have the available Konvoy versions, you can upgrade your CLI by running the following command:

```bash
konvoy image upgrade --version=v1.7.5
Wrote Konvoy CLI version 'v1.7.5' to '.konvoy/cli_version'
```

After the upgrade command completes, you can start using the new Konvoy version.

### Upgrading Konvoy from v1.6.x to v1.7.5

**You must modify your `cluster.yaml` with these changes when upgrading from a previous Konvoy version:**

Konvoy v1.7.x requires Calico version `3.17.x`. If your `cluster.yaml` file specifies an older version of Calico you must update to that version. The latest supported version is `v3.17.3`,

It is recommended to upgrade to the newest supported version of Kubernetes, set `spec.kubernetes.version: 1.19.15`.

It is recommended to upgrade to the newest supported version of Containerd, set `spec.containerRuntime.containerd.version: 1.3.9`.

The version of Kubernetes Base Addons changed if you use KBA, so you need to change your `configVersion` for your `configRepository`: `https://github.com/mesosphere/kubernetes-base-addons` to be `spec.addons.configVersion: stable-1.19-3.6.0`.

If you use Kommander, you need to change the `configVersion` for your `configRepository`: `https://github.com/mesosphere/kubeaddons-kommander` to be `spec.addons.configVersion: stable-1.19-1.3.4`.

The version of Konvoy is now `v1.7.5`, set `spec.version: v1.7.5`.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    version: 1.19.15
  ...
  containerNetworking:
    calico:
      version: v3.17.3
  ...
  containerRuntime:
    containerd:
      version: 1.3.9
  ...
  addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.19-3.6.0
  ...
    - configRepository: https://github.com/mesosphere/kubeaddons-kommander
      configVersion: stable-1.19-1.3.4
      addonsList:
        - name: kommander
          enabled: true
  ...
  version: v1.7.5
```

### [experimental]Upgrading the Istio addon while upgrading Konvoy from v1.6.x to v1.7.5[/experimental]

If the Istio addon is enabled while running Konvoy 1.6.x and you want to upgrade, you have to make [further changes][istio-upgrade] before running `konvoy up --upgrade`.

### Upgrading Konvoy from v1.5.x to v1.7.5

<p class="message--note"><strong>NOTE: </strong>You have to upgrade from Konvoy version 1.5.x to version 1.6.x before attempting an upgrade to Konvoy 1.7.</p>

First, complete the [upgrade from Konvoy version 1.5.x to version 1.6.x][15-to-16-upgrade].

After that's completed, you will need to locate and delete the `.terraform` directory in the state folder. You can delete the `.terraform` directory however you choose. One way you can do this is in the command line, starting at the Konvoy directory. From there, change directories to the `state` directory and run the following command:

```bash
rm -rf .terraform/
```

After deleting the `.terraform` directory, return to the main Konvoy folder with your Konvoy file, and [follow the steps to upgrade your cluster][upgrade-to-17].

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

[15-to-16-upgrade]: https://docs.d2iq.com/dkp/konvoy/1.6/upgrade/upgrade-cli/#upgrading-konvoy-from-v15x-to-v161
[docker_api_auth]: https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md
[docker_registry]: https://docs.docker.com/registry/deploying/
[docker_v2_auth_token]: https://docs.docker.com/registry/spec/auth/token/
[harbor]: https://github.com/goharbor/harbor
[istio-upgrade]: upgrade-cli-istio
[upgrade-to-17]: #upgrading-konvoy-from-v16x-to-v175
