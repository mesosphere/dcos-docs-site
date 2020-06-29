---
layout: layout.pug
navigationTitle: Upgrade Konvoy CLI
title: Upgrade Konvoy CLI
menuWeight: 30
excerpt: Upgrade Konvoy image CLI version
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>Before upgrading, keep in mind that your Konvoy CLI version can only be upgraded to a compatible Konvoy version.</p>

## Konvoy CLI available versions

You can verify which version your CLI can be upgraded to by running the following command:

```bash
konvoy image list
  KONVOY VERSION | DEFAULT KUBERNETES VERSION
+----------------+----------------------------+
  v1.1.4         | 1.15.3
```

This command lists all the available versions to which your current CLI can be upgraded.
This list also shows the default Kubernetes version of each Konvoy version.

This command uses the Docker Hub to fetch all the available Konvoy versions.

<p class="message--note"><strong>NOTE: </strong>This functionality is only supported for CLI where the Konvoy version is greater or equal to <strong>v1.1.4</strong>.</p>

### Using a private Docker registry

If you are using a <a href="https://docs.docker.com/registry/deploying/" target="_blank">private Docker registry</a> for your clusters, you can list all the available versions, passing some additional arguments to the previous command.

For example, if your private Docker registry provides a basic authentication mechanism (username/password), you must pass the following arguments, where `docker-registry-skip-verify` is optional based on your TLS settings:

```bash
konvoy image list --docker-registry-url=https://localhost:6443 --docker-registry-username=testuser --docker-registry-password=testpassword --docker-registry-skip-verify
```

If you are using a Docker registry with <a href="https://docs.docker.com/registry/spec/auth/token/" target="_blank">v2 token authentication mechanism</a> enabled, then you should set the following arguments to be able to list the CLI versions from the Docker registry API.

For example, if you are running <a href="https://github.com/goharbor/harbor" target="blank">Harbor</a> Docker Registry, `konvoy image` talks to the <a href="https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md" target="_blank">API to authenticate</a> to get some data about the available versions.

```bash
konvoy image list --docker-registry-url=https://myregistry.com --docker-registry-username=admin --docker-registry-password=Harbor12345  --docker-registry-skip-verify
```

If you pulled and pushed the Konvoy Docker image under a different image name or Docker repository in your registry, you need to include an additional argument to the command `docker-registry-repository`.

As an example, we pushed the Konvoy image under the `library` public repository of our Docker repository `--docker-registry-repository=library/mesosphere/konvoy`:

```bash
konvoy image list --docker-registry-url=https://localhost:6443 --docker-registry-username=testuser --docker-registry-password=testpassword --docker-registry-skip-verify --docker-registry-repository=library/mesosphere/konvoy
```

## Konvoy CLI version upgrade

After you have the available Konvoy versions, you can upgrade your CLI by running the following command:

```bash
konvoy image upgrade --version=v1.1.4
Wrote Konvoy CLI version 'v1.1.4' to '.konvoy/cli_version'
```

After the upgrade command completes, you can start using the new Konvoy version.

## Before you begin: Prepare for Konvoy CLI upgrade

If you're using a newer version of the Konvoy CLI, it may require changes to your `cluster.yaml`.
These changes are highlighted in the Release Notes and in the following sections.

A Konvoy upgrade consists of a few distinct steps.

- Download the Konvoy binary and extract it in your environment in the same manner as the initial install. (Download the specific version of Konvoy by following the steps outlined in the [download](../../download) page.)
- You must also have access to the `cluster.yaml` file and the SSH keys that were generated during the initial install. Update the `cluster.yaml` file with the changes described below.
- Run `konvoy up --upgrade` which first upgrades the version of Kubernetes on all of the control-plane nodes. The command then upgrades the rest of the nodes, the platform service addons, and installs any additional addons specified in the `cluster.yaml` file.

### Upgrading Konvoy from v1.4.x to v1.5.0

**You must modify your `cluster.yaml` with these changes when upgrading from a previous Konvoy version:**

Konvoy 1.5 requires Calico 3.13.
If your `cluster.yaml` specifies an older version of Calico, update it with the changes in the partial `cluster.yaml` below.
Note that `apiVersion: konvoy.mesosphere.io/v1alpha1` has been modified to `apiVersion: konvoy.mesosphere.io/v1alpha2`

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  containerNetworking:
    calico:
      version: v3.13.3
```

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
    configRepository: https://github.com/mesosphere/kubernetes-base-addons
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

[docker_registry]: https://docs.docker.com/registry/deploying/
[docker_v2_auth_token]: https://docs.docker.com/registry/spec/auth/token/
[harbor]: https://github.com/goharbor/harbor
[docker_api_auth]: https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md
