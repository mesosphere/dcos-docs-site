---
layout: layout.pug
navigationTitle: Create the Cluster
title: Create the Cluster
menuWeight: 70
excerpt: Create a Kubernetes cluster using the infrastructure definition
beta: true
enterprise: false
---

<!-- markdownlint-disable MD030 MD034 -->
With the inventory defined, use Konvoy to build the cluster. The following command uses the pre-provisioned cluster API provider to initialize the Kubernetes control plane and join your inventory to the cluster.

<p class="message--note"><strong>NOTE: </strong>When specifying the `cluster-name`, you must use the same `cluster-name` as used when defining your inventory objects.</p>

```shell
`dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME}` --apiserver-host <API server endpoint> --apiserver-port <API server port, if different than 6443>
```

The cluster begins to initialize. After the initialization, use this command to download the Kubernetes configuration for the new cluster and begin deploying workloads:

```shell
dkp get kubeconfig --cluster-name ${CLUSTER_NAME}
```

The output appears similar to this sample:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: DATA+OMITTED
    server: https://domain.dom:6443
  name: konvoy-mycluster
contexts:
- context:
    cluster: konvoy-mycluster
    user: kubernetes-admin
  name: kubernetes-admin@konvoy-mycluster
current-context: kubernetes-admin@konvoy-mycluster
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
```

## Provision on the Flatcar Linux OS

When provisioning onto the Flatcar Container Linux distribution, you must instruct the bootstrap cluster to make some changes related to the installation paths. To accomplish this, add the `--os-hint flatcar` flag to the above `create cluster` command.

## Use an HTTP Proxy

If you require http proxy configurations, you can apply them during the `create` operation by adding the appropriate flags to the `create cluster` command:

| Proxy configuration                      | Flag                                 |
| ---------------------------------------- | ------------------------------------ |
| HTTP proxy for control plane machines    | `--control-plane-http-proxy string`  |
| HTTPS proxy for control plane machines   | `--control-plane-https-proxy string` |
| No Proxy list for control plane machines | `--control-plane-no-proxy strings`   |
| HTTP proxy for worker machines           | `--worker-http-proxy string`         |
| HTTPS proxy for worker machines          | `--worker-https-proxy string`        |
| No Proxy list for worker machines        | `--worker-no-proxy strings`          |

## Use an alternative mirror

To apply Docker registry configurations during the create operation, add the appropriate flags to the `create cluster` command:

| Docker registry configuration                                | Flag                            |
| ------------------------------------------------------------ | ------------------------------- |
| CA certificate chain to use while communicating with the registry mirror using TLS | `--registry-mirror-cacert file` |
| URL of a container registry to use as a mirror in the cluster | `--registry-mirror-url string`  |

This is useful when using an internal registry and when Internet access is not available (air-gapped installations).

When the cluster is up and running, you can deploy and test workloads.
