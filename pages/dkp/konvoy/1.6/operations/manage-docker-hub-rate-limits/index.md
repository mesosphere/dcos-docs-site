---
navigationTitle: Docker Hub rate limits
title: Manage Docker Hub rate limits
menuWeight: 25
excerpt: Prevent issues from imposed rate limits
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 MD018 MD034 -->

Konvoy customers can configure their cluster to authenticate with registries (such as Docker Hub), and add registries, by defining each in the `ClusterConfiguration` `.spec.imageRegistries` list in the `cluster.yaml` file.

For Konvoy, to add credentials for Docker Hub, set the options in your `cluster.yaml` as follows:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  imageRegistries:
    - server: https://registry-1.docker.io
      username: "<username>"
      password: "<password>"
  autoProvisioning:
    config:
      webhook:
        extraArgs:
          konvoy.docker-registry-url: https://registry-1.docker.io
          konvoy.docker-registry-username: <username>
          konvoy.docker-registry-password: <password>
```

<p class="message--note"><strong>NOTE: </strong>You can use environment variables to specify `imageRegistries` values. For example, if your yaml file has `password: ${REGISTRY_PASSWORD}`, `password` is set to the `REGISTRY_PASSWORD` value in your environment.</p>

1. Apply the changes to your cluster. Enter the following command:

    ```bash
    konvoy up
    ```

1. Confirm the changes made to the cluster. Enter the following command to check the contents of the `containerd` configuration file:

    ```bash
    $ cat /etc/containerd/config.toml
    ...
    [plugins."io.containerd.grpc.v1.cri".registry]
          [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
            [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
              endpoint = ["https://registry-1.docker.io"]
          [plugins."io.containerd.grpc.v1.cri".registry.configs]
            [plugins."io.containerd.grpc.v1.cri".registry.configs."registry-1.docker.io".auth]
                username = "<username>"
                password = "<password>"
                auth = ""
                identitytoken = ""
    ...
    ```

For more information on configuring `imageRegistries` in the `cluster.yaml`, please refer to the following documentation: https://docs.d2iq.com/dkp/konvoy/1.6/reference/cluster-configuration/v1beta2/
