---
layout: layout.pug
navigationTitle: Create the Cluster
title: Create the Cluster
menuWeight: 70
excerpt: Create a Kubernetes cluster using the infrastructure definition
beta: false
enterprise: false
---

With the inventory, and the control plane endpoint defined, use the `dkp` binary to create a Konvoy cluster. The following command relies on the pre-provisioned cluster API infrastructure provider to initialize the Kubernetes control plane and worker nodes on the hosts defined in the inventory.

<p class="message--note"><strong>NOTE: </strong>When specifying the `cluster-name`, you must use the same `cluster-name` as used when defining your inventory objects.</p>

```shell
dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME} --control-plane-endpoint-host <control plane endpoint host> --control-plane-endpoint-port <control plane endpoint port, if different than 6443>
```

Depending on the cluster size, it will take a few minutes to be created. After the creation, use this command to get the Kubernetes kubeconfig for the new cluster and begin deploying workloads:

```shell
dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
```

## Use the built-in Virtual IP

As explained in [Define the Control Plane Endpoint][define-control-plane-endpoint], we recommend using an external load balancer for the control plane endpoint, but provide a built-in virtual IP when an external load balancer is not available. To use the virtual IP, add these flags to the `create cluster` command:

| Virtual IP Configuration                 | Flag                                 |
| ---------------------------------------- | ------------------------------------ |
| Network interface to use for Virtual IP. _Must exist on all control plane machines._ | `--virtual-ip-interface string`             |
| IPv4 address. _Reserved for use by the cluster._ | `--control-plane-endpoint string` |

### Virtual IP Example

```shell
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --control-plane-endpoint-host 196.168.1.10 \
    --virtual-ip-interface eth1
```

## Provision on the Flatcar Linux OS

When provisioning onto the Flatcar Container Linux distribution, you must instruct the bootstrap cluster to make some changes related to the installation paths. To accomplish this, add the `--os-hint flatcar` flag to the above `create cluster` command.

### Flatcar Linux Example

```shell
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --os-hint flatcar
```

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

### HTTP Proxy Example

```shell
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --control-plane-http-proxy http://proxy.example.com:8080 \
    --control-plane-https-proxy https://proxy.example.com:8080 \
    --control-plane-no-proxy "127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local" \
    --worker-http-proxy http://proxy.example.com:8080 \
    --worker-https-proxy https://proxy.example.com:8080 \
    --worker-no-proxy "127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local"
```

## Use an alternative mirror

To apply Docker registry configurations during the create operation, add the appropriate flags to the `create cluster` command:

| Docker registry configuration                                | Flag                            |
| ------------------------------------------------------------ | ------------------------------- |
| CA certificate chain to use while communicating with the registry mirror using TLS | `--registry-mirror-cacert file` |
| URL of a container registry to use as a mirror in the cluster | `--registry-mirror-url string`  |

This is useful when using an internal registry and when Internet access is not available (air-gapped installations).

When the cluster is up and running, you can deploy and test workloads.

### Alternative Mirror Example

```shell
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --registry-mirror-cacert /tmp/registry.pem \
    --registry-mirror-url https://registry.example.com
```

[define-control-plane-endpoint]: ../define-control-plane-endpoint
