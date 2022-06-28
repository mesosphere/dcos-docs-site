---
layout: layout.pug
navigationTitle: Create the Cluster
title: Create the Cluster
menuWeight: 70
excerpt: Create a Kubernetes cluster using the infrastructure definition
beta: false
enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>When specifying the <code>control-plane-endpoint</code>, if the endpoint is a fully-qualified domain name (FQDN), we recommend you make that explicit by adding a period to the end. This helps avoid unnecessary DNS queries using search paths. For example, <code>--control-plane-endpoint-host endpoint.example.com</code>.</p>

1.  With the inventory, and the control plane endpoint defined, use the `dkp` binary to create a Konvoy cluster. The following command relies on the pre-provisioned cluster API infrastructure provider to initialize the Kubernetes control plane and worker nodes on the hosts defined in the inventory.

    <p class="message--note"><strong>NOTE: </strong>When specifying the <code>cluster-name</code>, you must use the same <code>cluster-name</code> as used when defining your inventory objects.</p>

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Docker Hub's rate limit</a> use your Docker Hub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

    ```bash
    dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME} --control-plane-endpoint-host <control plane endpoint host> --control-plane-endpoint-port <control plane endpoint port, if different than 6443>
    ```

    ```bash
    Generating cluster resources
    cluster.cluster.x-k8s.io/preprovisioned-example created
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/preprovisioned-example-control-plane created
    preprovisionedcluster.infrastructure.cluster.konvoy.d2iq.io/preprovisioned-example created
    preprovisionedmachinetemplate.infrastructure.cluster.konvoy.d2iq.io/preprovisioned-example-control-plane created
    secret/preprovisioned-example-etcd-encryption-config created
    machinedeployment.cluster.x-k8s.io/preprovisioned-example-md-0 created
    preprovisionedmachinetemplate.infrastructure.cluster.konvoy.d2iq.io/preprovisioned-example-md-0 created
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/preprovisioned-example-md-0 created
    clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-preprovisioned-example created
    configmap/calico-cni-installation-preprovisioned-example created
    configmap/tigera-operator-preprovisioned-example created
    clusterresourceset.addons.cluster.x-k8s.io/local-volume-provisioner-preprovisioned-example created
    configmap/local-volume-provisioner-preprovisioned-example created
    clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-preprovisioned-example created
    configmap/node-feature-discovery-preprovisioned-example created
    clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-preprovisioned-example created
    configmap/nvidia-feature-discovery-preprovisioned-example created
    clusterresourceset.addons.cluster.x-k8s.io/metallb-preprovisioned-example created
    configmap/metallb-installation-preprovisioned-example created
    ```

1.  Use the wait command to monitor the cluster control-plane readiness:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=30m
    ```

    ```sh
    cluster.cluster.x-k8s.io/preprovisioned-example condition met
    ```

1.  (Optional) If you have <a href="../create-secrets-and-overrides">overrides for your clusters</a>, you must specify the secret as part of the create cluster command.

    <p class="message--note"><strong>NOTE: </strong> If these are not specified, the overrides for your nodes will not be applied. </p>

    ```bash
    dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME} --control-plane-endpoint-host <control plane endpoint host> --control-plane-endpoint-port <control plane endpoint port, if different than 6443> --override-secret-name=$CLUSTER_NAME-user-overrides
    ```

    <p class="message--note"><strong>NOTE: </strong>If your cluster is air-gapped or you have a local docker registry you must provide additional arguments when creating the cluster.</p>

    ```bash
    export DOCKER_REGISTRY_URL="<https/http>://<registry-address>:<registry-port>"
    export DOCKER_REGISTRY_CA="<path to the CA on the bastion>"
    export DOCKER_REGISTRY_USERNAME="<username>"
    export DOCKER_REGISTRY_USERNAME="<password>"
    ```

    - `DOCKER_REGISTRY_URL`: the address of an existing Docker registry accessible in the VPC that the new cluster nodes will be configured to use a mirror registry when pulling images.
    - `DOCKER_REGISTRY_CA`: (optional) the path on the bastion machine to the Docker registry CA. Konvoy will configure the cluster nodes to trust this CA. This value is only needed if the registry is using a self-signed certificate and the AMIs are not already configured to trust this CA.
    - `DOCKER_REGISTRY_USERNAME`: optional, set to a user that has pull access to this registry.
    - `DOCKER_REGISTRY_PASSWORD`: optional if username is not set.

    ```bash
    dkp create cluster preprovisioned --cluster-name ${CLUSTER_NAME} \
    --control-plane-endpoint-host <control plane endpoint host> \
    --control-plane-endpoint-port <control plane endpoint port, if different than 6443> \
    --registry-mirror-url=${DOCKER_REGISTRY_URL} \
    --registry-mirror-cacert=${DOCKER_REGISTRY_CA} \
    --registry-mirror-username=${DOCKER_REGISTRY_USERNAME} \
    --registry-mirror-password=${DOCKER_REGISTRY_PASSWORD}
    ```

1.  Depending on the cluster size, it will take a few minutes to create. After the creation, use this command to get the Kubernetes kubeconfig for the new cluster and begin deploying workloads:

    ```bash
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

### Modify the Calico installation

### Set the interface

Before exploring the new cluster, confirm your `calico` installation is correct.
By default, Calico automatically detects the IP to use for each node using the `first-found` [method][calico-method]. This is not always appropriate for your particular nodes. In that case, you must modify Calico's configuration to use a different method.
An alternative is to use the `interface` method by providing the interface ID to use. Follow the steps outlined in this section to modify Calico's configuration. In this example, all cluster nodes use `ens192` as the interface name.

Get the pods running on your cluster with this command:

   ```bash
   kubectl get pods -A --kubeconfig ${CLUSTER_NAME}.conf
   ```

   ```sh
   NAMESPACE                NAME                                                                READY   STATUS            RESTARTS        AGE
   calico-system            calico-kube-controllers-57fbd7bd59-vpn8b                            1/1     Running           0               16m
   calico-system            calico-node-5tbvl                                                   1/1     Running           0               16m
   calico-system            calico-node-nbdwd                                                   1/1     Running           0               4m40s
   calico-system            calico-node-twl6b                                                   0/1     PodInitializing   0               9s
   calico-system            calico-node-wktkh                                                   1/1     Running           0               5m35s
   calico-system            calico-typha-54f46b998d-52pt2                                       1/1     Running           0               16m
   calico-system            calico-typha-54f46b998d-9tzb8                                       1/1     Running           0               4m31s
   default                  cuda-vectoradd                                                      0/1     Pending           0               0s
   kube-system              coredns-78fcd69978-frwx4                                            1/1     Running           0               16m
   kube-system              coredns-78fcd69978-kkf44                                            1/1     Running           0               16m
   kube-system              etcd-ip-10-0-121-16.us-west-2.compute.internal                      0/1     Running           0               8s
   kube-system              etcd-ip-10-0-46-17.us-west-2.compute.internal                       1/1     Running           1               16m
   kube-system              etcd-ip-10-0-88-238.us-west-2.compute.internal                      1/1     Running           1               5m35s
   kube-system              kube-apiserver-ip-10-0-121-16.us-west-2.compute.internal            0/1     Running           6               7s
   kube-system              kube-apiserver-ip-10-0-46-17.us-west-2.compute.internal             1/1     Running           1               16m
   kube-system              kube-apiserver-ip-10-0-88-238.us-west-2.compute.internal            1/1     Running           1               5m34s
   kube-system              kube-controller-manager-ip-10-0-121-16.us-west-2.compute.internal   0/1     Running           0               7s
   kube-system              kube-controller-manager-ip-10-0-46-17.us-west-2.compute.internal    1/1     Running           1 (5m25s ago)   15m
   kube-system              kube-controller-manager-ip-10-0-88-238.us-west-2.compute.internal   1/1     Running           0               5m34s
   kube-system              kube-proxy-gclmt                                                    1/1     Running           0               16m
   kube-system              kube-proxy-gptd4                                                    1/1     Running           0               9s
   kube-system              kube-proxy-mwkgl                                                    1/1     Running           0               4m40s
   kube-system              kube-proxy-zcqxd                                                    1/1     Running           0               5m35s
   kube-system              kube-scheduler-ip-10-0-121-16.us-west-2.compute.internal            0/1     Running           1               7s
   kube-system              kube-scheduler-ip-10-0-46-17.us-west-2.compute.internal             1/1     Running           3 (5m25s ago)   16m
   kube-system              kube-scheduler-ip-10-0-88-238.us-west-2.compute.internal            1/1     Running           1               5m34s
   kube-system              local-volume-provisioner-2mv7z                                      1/1     Running           0               4m10s
   kube-system              local-volume-provisioner-vdcrg                                      1/1     Running           0               4m53s
   kube-system              local-volume-provisioner-wsjrt                                      1/1     Running           0               16m
   node-feature-discovery   node-feature-discovery-master-84c67dcbb6-m78vr                      1/1     Running           0               16m
   node-feature-discovery   node-feature-discovery-worker-vpvpl                                 1/1     Running           0               4m10s
   tigera-operator          tigera-operator-d499f5c8f-79dc4                                     1/1     Running           1 (5m24s ago)   16m
   ```

<p class="message--note"><strong>NOTE: </strong>If a <code>calico-node</code> pod is not ready on your cluster, you must edit the <code>installation</code> file.
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

Save this file. You may need to delete the node feature discovery worker pod in the `node-feature-discovery` namespace if that pod has failed. After you delete it, Kubernetes replaces the pod as part of its normal reconciliation.

### Change the encapsulation type

Calico can leverage different network encapsulation methods to route traffic for your workloads. Encapsulation is useful when running on top of an underlying network that is not aware of workload IPs. Common examples of this include:

    - public cloud environments where you don’t own the hardware
    - AWS across VPC subnet boundaries
    - environments where you cannot peer Calico over BGP to the underlay or easily configure static routes.

IPIP is the default encapsulation method.

To change the encapsulation, run the following command:

   ```bash
   kubectl edit installation default --kubeconfig ${CLUSTER_NAME}.conf
   ```

Change the value for `spec.calicoNetwork.ipPools[0].encapsulation`

  ```yaml
    spec:
    calicoNetwork:
      ipPools:
        - encapsulation: VXLAN
  ```

The supported values are "IPIPCrossSubnet", "IPIP", "VXLAN", "VXLANCrossSubnet", and "None".

#### VXLAN

VXLAN is a tunneling protocol that encapsulates layer 2 Ethernet frames in UDP packets, enabling you to create virtualized layer 2 subnets that span Layer 3 networks. It has a slightly larger header than IP-in-IP which creates a slight reduction in performance over IP-in-IP.

#### IPIP

IP-in-IP is an IP tunneling protocol that encapsulates one IP packet in another IP packet. An outer packet header is added with the tunnel entrypoint and the tunnel exit point. The calico implementation of this protocol uses BGP to determine the exit point making this protocol unusable on networks that don’t pass BGP.

**Be aware that switching encapsulation modes can cause disruption to in-progress connections. Plan accordingly.**

For more information, see:

  - [Calico Overlay Networking][calico-overlay]
  - [IP-in-IP RFC 2003][ipip]
  - [VXLAN RFC 7348][vxlan]

## Use the built-in Virtual IP

As explained in [Define the Control Plane Endpoint][define-control-plane-endpoint], we recommend using an external load balancer for the control plane endpoint, but provide a built-in virtual IP when an external load balancer is not available. The control planes  are members of the the same L2 network, the network interface which must be provided. The built-in virtual IP uses the [kube-vip][kube-vip] project.

To use the virtual IP, add these flags to the `create cluster` command:

| Virtual IP Configuration                 | Flag                                 |
| ---------------------------------------- | ------------------------------------ |
| Network interface to use for Virtual IP. _Must exist on all control plane machines._ | `--virtual-ip-interface string`             |
| IPv4 address. _Reserved for use by the cluster._ | `--control-plane-endpoint string` |

### Virtual IP Example

Example
If we have the following networking configurations on the control plane nodes:

```bash
Control plane node 1:
 eth0: 1.2.3.4/29
 eth1: 10.1.2.1/24
Control plane node 2:
 eth0: 5.6.7.8/25
 eth1: 10.1.2.2/24
Control plane node 3:
 eth0: 9.10.11.12/30
 eth1: 10.1.2.3/24
```
Then the following command should look like: 

```bash
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --control-plane-endpoint-host 10.1.2.0 \
    --virtual-ip-interface eth1
```
Verify that any L2 switches in your infrastructure are not configured to block Gratuitous ARP packets. kube-vip uses Gratutious ARP to advertise the Virtual-IP (VIP) for the control plane; if the switch blocks these packets fail-over between control plane nodes will not work.

Confirm that your [Calico installation is correct][calico-install].

## Provision on the Flatcar Linux OS

When provisioning onto the Flatcar Container Linux distribution, you must instruct the bootstrap cluster to make some changes related to the installation paths. To accomplish this, add the `--os-hint flatcar` flag to the above `create cluster` command.

### Flatcar Linux Example

```bash
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --os-hint flatcar
```

Confirm that your [Calico installation is correct][calico-install].

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

<p class="message--note"><strong>NOTE: </strong>You must also add the same configuration as an <a href="../create-secrets-and-overrides#create_overrides">override</a>. For more information, refer to <a href="../../../image-builder/override-files/create-custom-or-files/proxy-or-files">this documentation</a>.</p>

### HTTP Proxy Example

<p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Docker Hub's rate limit</a> use your Docker Hub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

```bash
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --control-plane-http-proxy http://proxy.example.com:8080 \
    --control-plane-https-proxy https://proxy.example.com:8080 \
    --control-plane-no-proxy "127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local" \
    --worker-http-proxy http://proxy.example.com:8080 \
    --worker-https-proxy https://proxy.example.com:8080 \
    --worker-no-proxy "127.0.0.1,10.96.0.0/12,192.168.0.0/16,kubernetes,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local"
```

Confirm that your [Calico installation is correct][calico-install].

## Use an alternative mirror

To apply Docker registry configurations during the create operation, add the appropriate flags to the `create cluster` command:

| Docker registry configuration                                | Flag                            |
| ------------------------------------------------------------ | ------------------------------- |
| CA certificate chain to use while communicating with the registry mirror using TLS | `--registry-mirror-cacert file` |
| URL of a container registry to use as a mirror in the cluster | `--registry-mirror-url string`  |

This is useful when using an internal registry and when Internet access is not available (air-gapped installations).

When the cluster is up and running, you can deploy and test workloads.

### Alternative Mirror Example

```bash
dkp create cluster preprovisioned \
    --cluster-name ${CLUSTER_NAME} \
    --registry-mirror-cacert /tmp/registry.pem \
    --registry-mirror-url https://registry.example.com
```

Confirm that your [Calico installation is correct][calico-install].

## Use alternate pod or service subnets

In Konvoy, the default pod subnet is 192.168.0.0/16, and the default service subnet is 10.96.0.0/12. If you wish to change the subnets you can do so with the following steps:

1.  Generate the yaml manifests for the cluster using the `--dry-run` and `-o yaml` flags, along with the desired `dkp cluster create` command:

    ```bash
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

Confirm that your [Calico installation is correct][calico-install].

[calico-install]: #set-the-interface
[calico-method]: https://projectcalico.docs.tigera.io/reference/node/configuration#ip-autodetection-methods
[calico-overlay]: https://docs.projectcalico.org/networking/vxlan-ipip
[ipip]: https://datatracker.ietf.org/doc/html/rfc2003
[vxlan]: https://datatracker.ietf.org/doc/html/rfc7348
[create-secrets-and-overrides]: ../create-secrets-and-overrides
[define-control-plane-endpoint]: ../define-control-plane-endpoint
[kube-vip]: https://kube-vip.chipzoller.dev
