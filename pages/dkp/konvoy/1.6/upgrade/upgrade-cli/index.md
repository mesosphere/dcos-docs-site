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

If you're using a newer version of the Konvoy CLI, it may require changes to your `cluster.yaml`.
These changes are highlighted in the Release Notes and in this section.

A Konvoy upgrade consists of a few distinct steps.

- Download the Konvoy binary and extract it in your environment in the same manner as the initial install. (Download the specific version of Konvoy by following the steps outlined in the [download](../../download) page.)
- You must also have access to the `cluster.yaml` file and the SSH keys that were generated during the initial install. Update the `cluster.yaml` file with the changes described below.
- When you run `konvoy up --upgrade`, it upgrades the version of Kubernetes on all of the control-plane nodes. The command then upgrades the rest of the nodes, the platform service addons, and installs any additional addons specified in the `cluster.yaml` file.

## Konvoy CLI available versions

You can verify which version your CLI can be upgraded to by running the following command:

```bash
konvoy image list
```

This command lists all the available versions to which your current CLI can be upgraded.
This list also shows the default Kubernetes version of each Konvoy version.

This command uses the Docker Hub to fetch all the available Konvoy versions.

<p class="message--note"><strong>NOTE: </strong>This functionality is only supported for CLI where the Konvoy version is greater or equal to <strong>v1.1.4</strong>.</p>

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
konvoy image upgrade --version=v1.6.3
Wrote Konvoy CLI version 'v1.6.3' to '.konvoy/cli_version'
```

After the upgrade command completes, you can start using the new Konvoy version.

### Upgrading Konvoy from v1.5.x to v1.6.3

<p class="message--note"><strong>NOTE: </strong>Do not modify the <code>apiVersion: konvoy.mesosphere.io/v1beta1</code>. If you update this to <code>apiVersion: konvoy.mesosphere.io/v1beta2</code> and are using the default <code>us-west-2</code> region, this upgrade recreates all the machines in the Kubernetes cluster. You may want to enforce the same machine IDs by adding the appropriate value for <code>spec.nodePools.machine.imageId</code>, setting it to <code>spec.nodePools.machine.imageID: ami-01ed306a12b7d1c96</code>.</p>

**You must modify your `cluster.yaml` with these changes when upgrading from a previous Konvoy version:**

Konvoy v1.6.x requires Calico version `3.16.x`, if your `cluster.yaml` specifies an older version of Calico you must update it, the latest supported version is `v3.16.8`,

It is recommended to upgrade to the newest supported version of Kubernetes, set `spec.kubernetes.version: 1.18.18`.

It is recommended to upgrade to the newest supported version of Containerd, set `spec.containerRuntime.containerd.version: 1.3.9`.

The version of Kubernetes Base Addons changed if you use KBA, so you need to change your `configVersion` for your `configRepository`: `https://github.com/mesosphere/kubernetes-base-addons` to be `spec.addons.configVersion: stable-1.18-3.3.0`.

<p class="message--note"><strong>NOTE: </strong>A note on upgrading from 1.5.x to 1.6.1: There are some limitations upgrading to this Konvoy version due to the migration of Helm v2 to Helm v3 of large ConfigMaps to Helm v3 Secrets for Prometheus and the need to delete and redeploy this addon.
For more information, see <a href="../../addons/helmv2-to-v3-migration/">Helm v2 to v3 migration</a>.</p>

If you use Kommander, you need to change the `configVersion` for your `configRepository`: `https://github.com/mesosphere/kubeaddons-kommander` to be `spec.addons.configVersion: stable-1.18-1.2.2`.

The version of Konvoy is now `v1.6.3`, set `spec.version: v1.6.3`.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    version: 1.18.18
  ...
  containerNetworking:
    calico:
      version: v3.16.8
  ...
  containerRuntime:
    containerd:
      version: 1.3.9
  ...
  addons:
    - configRepository: https://github.com/mesosphere/kubernetes-base-addons
      configVersion: stable-1.18-3.3.0
  ...
    - configRepository: https://github.com/mesosphere/kubeaddons-kommander
      configVersion: stable-1.18-1.2.2
      addonsList:
        - name: kommander
          enabled: true
  ...
  version: v1.6.3
```

<p class="message--note"><strong>NOTE: </strong>During the upgrade process, if the cluster has certain types of workloads running, the Konvoy CLI displays a warning. These warnings report skipped nodes in the upgrade process.</p>

Konvoy preserves the availability of applications in the cluster, by detecting:

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

### Upgrading Konvoy from v1.2.x to v1.3.0

**You must modify your `cluster.yaml` with these changes when upgrading from a previous Konvoy version:**

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
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16.4-2
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

<p class="message--note"><strong>NOTE: </strong>Depending on the addon version you are upgrading to, you may need to include additional addons, and additional resources (CPU) to accommodate the increased needs. For the full list of addons refer to the <a href="../../reference/cluster-configuration">reference document</a>).</p>

### Upgrading Konvoy from v1.0.x/v1.1.x to v1.2.0

**You must modify your `cluster.yaml` with these changes when upgrading from a previous Konvoy version:**

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

[docker_api_auth]: https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md
[docker_registry]: https://docs.docker.com/registry/deploying/
[docker_v2_auth_token]: https://docs.docker.com/registry/spec/auth/token/
[harbor]: https://github.com/goharbor/harbor
