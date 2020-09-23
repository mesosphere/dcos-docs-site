---
layout: layout.pug
navigationTitle: Upgrade Konvoy CLI
title: Upgrade Konvoy CLI
menuWeight: 30
excerpt: Upgrade Konvoy image CLI version
enterprise: false
---

Before upgrading, you should also keep in mind that your Konvoy CLI version can only
be upgraded to compatible Konvoy versions.

## Konvoy CLI available versions

You can verify to which version your CLI can be upgraded by running the following command:

```bash
konvoy image list
  KONVOY VERSION | DEFAULT KUBERNETES VERSION
+----------------+----------------------------+
  v1.1.4         | 1.15.3
```

This command lists all the available versions to which your current CLI can be upgraded.
This list also shows the default Kubernetes version of each Konvoy version.

This command uses the Docker Hub to fetch all the available Konvoy versions.

**NOTE:** This functionality is only supported for CLI where the Konvoy version is greater
or equal to **v1.1.4**.

### Using a private Docker registry

If you are using a [private Docker registry][docker_registry] for your clusters, you can list all the
available versions, passing some additional arguments to the previous command.

For instance, if your private Docker registry provides a basic authentication mechanism (username/password).
You need to pass the following arguments, where `docker-registry-skip-verify` is optional
based on your TLS settings:

```bash
konvoy image list --docker-registry-url=https://localhost:6443 --docker-registry-username=testuser --docker-registry-password=testpassword --docker-registry-skip-verify
```

If you are using a Docker registry with [v2 token authentication mechanism][docker_v2_auth_token] enabled, then you should
set the following arguments to be able to list the CLI versions from the Docker registry API.

For instance,
if you are running [Harbor][harbor] Docker Registry, `konvoy image` talks to the [API to
authenticate][docker_api_auth] to get some data about the available versions.

```bash
konvoy image list --docker-registry-url=https://myregistry.com --docker-registry-username=admin --docker-registry-password=Harbor12345  --docker-registry-skip-verify
```

If you pulled and pushed the Konvoy Docker image under a different image name or Docker
repository in your registry, you need to include an additional argument to the command `docker-registry-repository`.

As an example, we pushed the Konvoy image under the `library` public repository of our
Docker repository `--docker-registry-repository=library/mesosphere/konvoy`:

```bash
konvoy image list --docker-registry-url=https://localhost:6443 --docker-registry-username=testuser --docker-registry-password=testpassword --docker-registry-skip-verify --docker-registry-repository=library/mesosphere/konvoy
```

## Konvoy CLI version upgrade

Once you listed the available Konvoy versions, you can upgrade your CLI by running
the following command:

```bash
konvoy image upgrade --version=v1.1.4
Wrote Konvoy CLI version 'v1.1.4' to '.konvoy/cli_version'
```

Once the upgrade command completed, you can start using the new Konvoy version.

### Using a private Docker registry

If you are using a [private Docker registry][docker_registry] for your clusters, you can upgrade your
CLI passing some arguments to authenticate against a private registry.

For instance, if the Docker registry provides a basic authentication mechanism (username/password).
You need to pass the following arguments, where `docker-registry-skip-verify` is optional
based on your TLS settings:

```bash
konvoy upgrade --version=v1.1.4 --docker-registry-url=https://localhost:6443 --docker-registry-username=testuser --docker-registry-password=testpassword --docker-registry-skip-verify
```

Analogously to listing the available versions, if you are using a Docker registry with [v2 token authentication mechanism][docker_v2_auth_token], then you should
set the following arguments.

In this example, we add the required arguments to authenticate to a [Harbor][harbor] Docker repository:

```bash
konvoy upgrade --version=v1.1.4 --docker-registry-url=https://myregistry.com --docker-registry-username=admin --docker-registry-password=Harbor12345  --docker-registry-skip-verify
```

Likewise if you pulled and pushed the Konvoy Docker image under a different image name, you need to include an additional argument to the previous command `docker-registry-repository`.

```bash
konvoy upgrade --version=v1.1.4 --docker-registry-url=https://myregistry.com --docker-registry-username=admin --docker-registry-password=Harbor12345  --docker-registry-skip-verify --docker-registry-repository=library/mesosphere/konvoy
```

[docker_registry]: https://docs.docker.com/registry/deploying/
[docker_v2_auth_token]: https://docs.docker.com/registry/spec/auth/token/
[harbor]: https://github.com/goharbor/harbor
[docker_api_auth]: https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md
