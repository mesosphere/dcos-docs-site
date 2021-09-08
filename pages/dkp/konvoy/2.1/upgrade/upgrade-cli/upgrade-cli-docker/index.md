---
layout: layout.pug
navigationTitle: Upgrade Konvoy Using a Private Docker Registry
title: Upgrade Konvoy Using a Private Docker Registry
menuWeight: 2
excerpt: Upgrade Konvoy Using a Private Docker Registry
beta: false
enterprise: false
---

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

[docker_api_auth]: https://github.com/docker/distribution/blob/master/docs/spec/auth/token.md
[docker_registry]: https://docs.docker.com/registry/deploying/
[docker_v2_auth_token]: https://docs.docker.com/registry/spec/auth/token/
[harbor]: https://github.com/goharbor/harbor
