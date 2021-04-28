---
layout: layout.pug
navigationTitle: Docker Hub rate limits
title: Manage Docker Hub rate limits
menuWeight: 25
excerpt: Prevent issues from imposed rate limits
beta: true
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 MD018 MD034 -->

You can configure your cluster to authenticate with registries (such as Docker Hub), and add registries, by defining each in the `ClusterConfiguration` `.spec.imageRegistries` list in the `cluster.yaml` file.

For Kommander, to add credentials for Docker Hub, set the options in your `cluster.yaml` as follows:

```yaml
- name: kommander
  enabled: true
  values: |
    kommander-federation:
      utilityApiserver:
        extraArgs:
          docker-registry-url: "https://registry-1.docker.io"
          docker-registry-username: <username>
          docker-registry-password: <password>
```

<p class="message--note"><strong>NOTE: </strong>You can use environment variables to specify <code>imageRegistries</code> values. For example, if your cluster.yaml file has <code>password: ${REGISTRY_PASSWORD}</code>, <code>password</code> is set to the <code>REGISTRY_PASSWORD</code> value in your environment.</p>

1. Apply the changes to your cluster. Enter the following command:

    ```bash
    konvoy up
    ```

1. Confirm the changes made to the cluster. You will need to ssh into any of your cluster's nodes. From there, enter the following command to check the contents of the `containerd` configuration file:

    ```bash
    $ cat /etc/containerd/config.toml
    ```
   
   You should see the output that contains your Docker Hub credentials:
   
    ```bash
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

For more information on configuring `imageRegistries` in the `cluster.yaml`, refer to the [API documentation (v1beta2) documentation][konvoy-api-docs].

[konvoy-api-docs]: /dkp/konvoy/1.8/reference/cluster-configuration/v1beta2/
