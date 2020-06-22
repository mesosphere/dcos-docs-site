---
layout: layout.pug
navigationTitle: Encrypt Data
title: Encrypt Data
menuWeight: 10
excerpt: How to enable and configure encryption of Kubernetes secret data at rest.

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Encrypt Secret data at Rest

For more details and examples, please refer to [upstream documentation](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).

## Configuring

To enable secret encryption at rest perform the following steps:

1. Create a new encryption config file, for example `kubernetes-encryption-config.yaml`:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: <BASE 64 ENCODED SECRET>
    - identity: {}
```

1. Generate a 32 byte random key and base64 encode it. If you’re on Linux or macOS, run the following command:

```
head -c 32 /dev/urandom | base64
```

1. Place that value in the secret field of the configuration file.

1. Create a DC/OS secret with the encryption configuration file.

```shell
$ dcos security secrets create -f kubernetes-encryption-config.yaml kubernetes-cluster/encryption-config
```

<p class="message--important"><strong>IMPORTANT: </strong>The service account for the Kubernetes cluster requires permissions to read the secret containing the encryption configuration.</p>

1. To enable Kubernetes secret encryption at rest you need to set `.kubernetes.encryption_config` with the name of the DC/OS secret where the configuration is stored.

```json
{
    "kubernetes": {
        "encryption_config": "kubernetes-cluster/encryption-config"
    }
}
```

## Ensure all secrets are encrypted

Secrets are encrypted on write, performing an update on a secret will encrypt the content.

```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

The command reads all secrets and then updates them to apply server side encryption. If an error occurs due to a conflicting write, retry the command. For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
