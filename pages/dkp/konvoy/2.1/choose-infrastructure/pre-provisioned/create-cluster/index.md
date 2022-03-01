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

<p class="message--note"><strong>NOTE: </strong>When specifying the <code>cluster-name</code>, you must use the same <code>cluster-name</code> as used when defining your inventory objects.</p>

```shell
dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME} --control-plane-endpoint-host <control plane endpoint host> --control-plane-endpoint-port <control plane endpoint port, if different than 6443>
```

<p class="message--note"><strong>NOTE: </strong>If you have <a href="../create-secrets-and-overrides">overrides for your clusters</a>, you must specify the secret as part of the create cluster command. If these are not specified, the overrides for your nodes will not be applied. </p>

```shell
dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME} --control-plane-endpoint-host <control plane endpoint host> --control-plane-endpoint-port <control plane endpoint port, if different than 6443> --override-secret-name=$CLUSTER_NAME-user-overrides
```

Depending on the cluster size, it will take a few minutes to be created. After the creation, use this command to get the Kubernetes kubeconfig for the new cluster and begin deploying workloads:

```shell
dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
```

### Confirming `calico` installation

Before exploring the new cluster, confirm your `calico` installation is correct.
By default, Calico automatically detects the IP to use for each node using the `first-found` [method][calico-method]. This may not be appropriate in your particular nodes, and you must modify Calico's configuration to use a different method.
One approach is to use the `interface` method by providing the interface ID to use. For example, let's assume that all your cluster nodes use `ens192` as the interface name, follow the steps outlined in this section to modify Calico configuration.

Get the pods running on your cluster with this command:

   ```bash
   kubectl get pods -A --kubeconfig ${CLUSTER_NAME}.conf
   ```

<p class="message--note"><strong>NOTE: </strong>If you see a <code>calico-node</code> pod not ready on your cluster, you need to edit the <code>installation</code> file.
</p>

To edit the installation file, run the command:

   ```bash
   kubectl edit installation default --kubeconfig ${CLUSTER_NAME}.conf
   ```

Change the value for `spec.calicoNetwork.nodeAddressAutodetectionV4` to `interface: ens192`, and save the file:

   ```yaml
   spec:
     calicoNetwork:
     ...
       nodeAddressAutodetectionV4:
         interface: ens192
   ```

After saving the file, you may need to delete the node feature discovery worker pod in the `node-feature-discovery` namespace, if it failed. After you delete it, Kubernetes replaces the pod as part of its normal reconciliation.

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

You will want to confirm your [`calico` installation is correct][calico-install].

## Provision on the Flatcar Linux OS

When provisioning onto the Flatcar Container Linux distribution, you must instruct the bootstrap cluster to make some changes related to the installation paths. To accomplish this, add the `--os-hint flatcar` flag to the above `create cluster` command.

### Flatcar Linux Example

```shell
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --os-hint flatcar
```

You will want to confirm your [`calico` installation is correct][calico-install].

## Use an HTTP Proxy

If you require HTTP proxy configurations, you can apply them during the `create` operation by adding the appropriate flags to the `create cluster` command:

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

You will want to confirm your [`calico` installation is correct][calico-install].

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

You will want to confirm your [`calico` installation is correct][calico-install].

## Use alternate pod or service subnets

In Konvoy, the default pod subnet is 192.168.0.0/16, and the default service subnet is 10.96.0.0/12. If you wish to change the subnets you can do so with the following steps:

1.  Generate the yaml manifests for the cluster using the `--dry-run` and `-o yaml` flags, along with the desired `dkp cluster create` command:

    ```shell
    dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME} --control-plane-endpoint-host <control plane endpoint host> --control-plane-endpoint-port <control plane endpoint port, if different than 6443> --dry-run -o yaml > cluster.yaml
    ```

1.  To modify the service subnet, add or edit the `spec.clusterNetwork.services.cidrBlocks` field of the `Cluster` object:

    ```yaml
    kind: Cluster
    spec:
      clusterNetwork:
        services:
          cidrBlocks:
          - 10.0.0.0/18
    ```

1.  To modify the pod subnet, edit the `Cluster` and calico-cni `ConfigMap` resources:

    Cluster: Add or edit the`spec.clusterNetwork.pods.cidrBlocks` field:

    ```yaml
    kind: Cluster
    spec:
      clusterNetwork:
        pods:
          cidrBlocks:
          - 172.16.0.0/16
    ```

    ConfigMap: Edit the `data."custom-resources.yaml".spec.calicoNetwork.ipPools.cidr` field with your desired pod subnet:

    ```yaml
    apiVersion: v1
    data:
      custom-resources.yaml: |
        apiVersion: operator.tigera.io/v1
        kind: Installation
        metadata:
          name: default
        spec:
          # Configures Calico networking.
          calicoNetwork:
            # Note: The ipPools section cannot be modified post-install.
            ipPools:
            - blockSize: 26
              cidr: 172.16.0.0/16
    kind: ConfigMap
    metadata:
      name: calico-cni-<cluter-name>
    ```

When you provision the cluster, the configured pod and service subnets will be applied.

You will want to confirm your [`calico` installation is correct][calico-install].

[calico-install]: #confirming-calico-installation
[calico-method]: https://projectcalico.docs.tigera.io/reference/node/configuration#ip-autodetection-methods
[create-secrets-and-overrides]: ../create-secrets-and-overrides
[define-control-plane-endpoint]: ../define-control-plane-endpoint
