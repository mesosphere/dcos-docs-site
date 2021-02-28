---
navigationTitle: Custom dockerd configuration
title: Custom dockerd configuration
menuWeight: 10
excerpt: Configure the Docker daemon

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Configure the Docker daemon

For more details on available configuration options, please refer to [`dockerd` documentation](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file).

## Mandatory options

The following are the mandatory options to ensure the Docker daemon runs in the kube-nodes.

```json
{
    "bridge": "none",
    "iptables": false,
    "ip-masq": false,
    "storage-driver": "overlay2",
    "storage-opts": [ "overlay2.override_kernel_check=true" ]
}
```

## Configuring

To enable custom `dockerd` configuration perform the following steps:

1. Create a new file, for example `daemon.json`, that enables Docker daemon debug logging:

```json
{
    "bridge": "none",
    "iptables": false,
    "ip-masq": false,
    "storage-driver": "overlay2",
    "storage-opts": [ "overlay2.override_kernel_check=true" ],
    "debug": true
}
```

1. Create a DC/OS secret with the configuration file.

```shell
$ dcos security secrets create -f daemon.json kubernetes-cluster/dockerd-config
```

<p class="message--important"><strong>IMPORTANT: </strong>The service account for the Kubernetes cluster requires permissions to read the secret containing the Docker daemon configuration.</p>

1. To enable custom Docker configuration you need to set `.kubernetes.docker_daemon_config` with the name of the DC/OS secret where the configuration is stored.

```json
{
    "kubernetes": {
        "docker_daemon_config": "kubernetes-cluster/dockerd-config"
    }
}
```
