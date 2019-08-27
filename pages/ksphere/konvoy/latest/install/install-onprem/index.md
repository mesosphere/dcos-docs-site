---
layout: layout.pug
navigationTitle: Install on-premise
title: Install on-premise
menuWeight: 30
excerpt: Install Konvoy in an on-premise environment
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

The topics in this section guide you through the basic steps to prepare your environment and install Konvoy in an on-premise environment.

# Before you begin

Before starting the installation, you should verify that your environment meets the following basic requirements:

* [Docker Desktop][install_docker] _version 18.09.2 or newer_

  You must have Docker Desktop installed on the host where the Konvoy command-line interface (CLI) will run.
  For example, if you installing Konvoy on your laptop computer, be sure the laptop has a supported version of Docker Desktop.

* [kubectl][install_kubectl] _v1.15.3 or newer_

  You must have for `kubectl` installed on the host where the Konvoy command-line interface (CLI) will run to enable interaction with the running cluster.

## Control plane nodes

* You should have at least three control plane nodes.

* Each control plane node should have at least:
  * 8 cores
  * 16 GiB memory
  * 80 GiB of free space in the root partition and the root partition must be less than 85% full.

## Worker nodes

* You should have at least three worker nodes.

  The specific number of worker nodes required for your environment can vary depending on the cluster workload and size of the nodes.

* Each worker node should have at least:
  * 8 cores
  * 16 GiB memory
  * 80 GiB of free space in the root partition and the root partition must be less than 85% full.

* If you plan to use **local volume provisioning** to provide [persistent volumes][persistent_volume] for the workloads, you must mount at least three volumes to `/mnt/disks/` mount point on each node.
  Each volume must have **at least** 55 GiB of capacity if the default addon configurations are used.

## Operating system and services for all nodes

For all hosts that are part of the cluster--that is, all hosts except the **deploy host**--you should verify the following configuration requirements:

* CentOS 7.6 is installed.
* Firewalld is disabled.
* Containerd is uninstalled.
* Docker-ce is uninstalled.
* Swap is disabled.

## Networking

Please make sure the following domains are accessible from the control plane nodes and worker nodes.

* k8s.gcr.io
* registry.hub.docker.com
* quay.io
* packages.cloud.google.com
* download.docker.com
* github.com
* grafana.com
* raw.githubusercontent.com
* mesosphere.github.io
* storage.googleapis.com

For the deploy host, make sure domain `registry.hub.docker.com`, `mesosphere.github.io`, `github.com` are accessible.

# Edit the inventory file

To start the Konvoy installation, you first need an [Ansible][ansible] [inventory file][ansible_inventory] in your current working directory to describe the hosts where you want to install Konvoy.
Konvoy will automatically generate the skeleton of the inventory file for you during initialization:

1. Create an empty working directory on the computer you are using as the deploy host.

   For example, you might run the following on your laptop:

   ```bash
   mkdir konvoy-deploy
   cd konvoy-deploy
   ```

1. Run the following commands to initialize Konvoy in the current working directory:

   ```bash
   konvoy init --provisioner=none [--cluster-name <your-specified-name>]
   ```

   Running the `konvoy init` command generates an inventory file skeleton `inventory.yaml` and a default `cluster.yaml` configuration file in the current working directory.

1. Open inventory file `inventory.yaml` in a text editor to specify the hosts.

The inventory file `inventory.yaml` follows the standard [Ansible inventory file yaml format][ansible_inventory] for hosts and groups.

For Konvoy, you need to specify two [groups][ansible_group]

* `control-plane`
* `node`

The `control-plane` group defines the host IP addresses for your control plane nodes.
The `node` group defines the host IP addresses for your worker nodes.

## Specifying IP addresses and host names

The IP addresses you specify in the inventory file can be the private IP addresses you use in your internal network.
The primary requirement is that all of the hosts in the cluster can communicate with each other using the IP addresses you specify.
You should keep in mind that placing all of the hosts in the same subnet (for example, 10.0.50.0/24), can simplify the cluster configuration significantly.

For each host, you can also optionally specify the `ansible_host` attribute if you want Ansible to use different host names to reach the hosts.

## Ensuring connectivity

You should make sure that the computer you are using as the **deploy host** can open secure shell (SSH) connections to communicate with each host specified in the inventory file.
To ensure a successful installation, the `ansible_user` account must be able to open a secure shell on each host without typing password.

You could to use `ssh-agent` to pass identity keys and passphrases for authentication.

## Sample inventory file

The following example illustrates a simple `inventory.yaml` file with three control plane nodes and three worker nodes.
In this example, the `ansible_user` is the `centos` user account that has administrative privileges:

```yaml
control-plane:
  hosts:
    10.0.50.232:
      ansible_host: 10.0.50.232
    10.0.50.233:
      ansible_host: 10.0.50.233
    10.0.50.234:
      ansible_host: 10.0.50.234

node:
  hosts:
    10.0.50.108:
      ansible_host: 10.0.50.108
      node_pool: worker
    10.0.50.109:
      ansible_host: 10.0.50.109
      node_pool: worker
    10.0.50.110:
      ansible_host: 10.0.50.110
      node_pool: worker

all:
  vars:
    version: v1beta1
    order: sorted
    ansible_user: "centos"
    ansible_port: 22
```

# Configure the Kubernetes cluster

After you edit the inventory file, you need to edit the generated `cluster.yaml` file.
The `cluster.yaml` file provides the configuration details for creating your Konvoy cluster.

## Configure the control plane

Konvoy supports Kubernetes control plane high availability (HA) out-of-the-box for on-premise deployments if you do not have a third-party load balancer.

The default control plane load balancer for Konvoy is based on [Keepalived][keepalived].

To use `keepalived` control plane load balancing:

* Identify and reserve a virtual IP (VIP) address from your networking infrastructure.

* Configure your networking infrastructure so that the reserved virtual IP address is reachable:
  * from all hosts specified in the inventory file.
  * from the computer you are using as the deploy host.

  If all cluster hosts and the reserved virtual IP address are in the same subnet, you typically do not need to perform any additional configuration to your networking infrastructure.
  If you are using more than one subnet for the cluster, however, you should work with your networking team to ensure connectivity between all hosts and the reserved virtual IP address.

The following example illustrates the configuration if the reserved virtual IP address is `10.0.50.20`:

```yaml
spec:
  kubernetes:
    controlPlane:
      controlPlaneEndpointOverride: "10.0.50.20:6443"
      keepalived:
        enabled: true
        interface: ens20f0 # optional
        vrid: 51           # optional
```

You could set `spec.kubernetes.controlPlane.keepalived.interface` to specify the network interface you want to use for the Keepalived VIP.
This field is optional.
If not set, Konvoy will automatically detect the network interface to use based on the route to the VIP.

You could also set `spec.kubernetes.controlPlane.keepalived.vrid` to specify the [Virtual Router ID][vrrp] used by Keepalived.
This field is optional.
If not set, Konvoy will randomly pick a Virtual Router ID for you.

## Configure pod and service networking

The following example illustrates how you can configure the pod subnet and service subnet in the `cluster.yaml` configuration file:

```yaml
spec:
  kubernetes:
    networking:
      podSubnet: 192.168.0.0/24
      serviceSubnet: 10.0.51.0/24
```

When configuring these settings, you should make sure that the values you set for `podSubnet` and `serviceSubnet` do not overlap with your node subnet and your `keepalived` virtual IP address.

## Configure MetalLB load balancing

Konvoy supports [Service][kubernetes_service] type `LoadBalancer` out-of-the-box for on-premise deployments if you do not have a third-party load balancer.

The default load balancer service for add-ons is based on [MetalLB][metallb].

To use MetalLB for add-on load balancing:

* Identify and reserve a range of virtual IP addresses (VIPs) from your networking infrastructure.

* Configure your networking infrastructure so that the reserved virtual IP addresses are reachable:
  * from all hosts specified in the inventory file.
  * from the computer you are using as the deploy host.

If all cluster hosts and the reserved virtual IP addresses are in the same subnet, you typically do not need to perform any additional configuration to your networking infrastructure.
If you are using more than one subnet for the cluster, however, you should work with your networking team to ensure connectivity between all hosts and the reserved range of virtual IP addresses.

MetalLB can be configured in two modes - layer2 and bgp.

The following example illustrates the layer2 configuration in the `cluster.yaml` configuration file:

```yaml
spec:
  addons:
    addonsList:
    - name: metallb
      enabled: true
      values: |-
        configInline:
          address-pools:
          - name: default
            protocol: layer2
            addresses:
            - 10.0.50.25-10.0.50.50
```

The following example illustrates the BGP configuration in the `cluster.yaml` configuration file:

```yaml
spec:
  addons:
    addonsList:
    - name: metallb
      enabled: true
      values: |-
        configInline:
          peers:
          - my-asn: 64500
            peer-asn: 64500
            peer-address: 172.17.0.4
          address-pools:
          - name: my-ip-space
            protocol: bgp
            addresses:
            - 172.40.100.0/24
```

The number of virtual IP addresses in the reserved range determines the maximum number of services with a type of `LoadBalancer` that you can create in the cluster.

# Add storage to worker nodes

Konvoy supports [local persistent volume][local_persistent_volume] provisioning out-of-the-box if you do not have a third-party storage vendor.

This default storage provisioning option allows operators to mount local volumes at a specific location on each host.
For a Konvoy cluster, the local volume mount point is `/mnt/disks`.

Mounted volumes in the `/mnt/disks` location are detected automatically.
Once detected, corresponding [persistent volume][persistent_volume] objects are created in the API server for your stateful workloads.
Konvoy uses the [static local volume provisioner][static_pv_provisioner] to perform this task.

To mount local volumes:

1. Format and mount the volume by running commands similar to the following:

    ```bash
    sudo mkfs.ext4 /dev/path/to/disk
    DISK_UUID=$(blkid -s UUID -o value /dev/path/to/disk)
    sudo mkdir /mnt/disks/$DISK_UUID
    sudo mount -t ext4 /dev/path/to/disk /mnt/disks/$DISK_UUID
    ```

1. Persistent the mount entry by adding it to `/etc/fstab` as follows:

    ```bash
    echo UUID=`sudo blkid -s UUID -o value /dev/path/to/disk` /mnt/disks/$DISK_UUID ext4 defaults 0 2 | sudo tee -a /etc/fstab
    ```

1. Verify local volumes stay mounted after the host is rebooted.

For more information about how to mount local volumes, see the [Operations][static_pv_provisioner_operations] guide for Kubernetes.

Note that if your stateful workload is using a [local persistent volume][local_persistent_volume], it cannot be moved to a different node.
If the node fails, the stateful workload might lose its data.
If you cannot tolerate this limitation, you should consider other storage options.

# Pre-flight checks

After you have completed the basic configuration in the `cluster.yaml` file, you should run the Konvoy pre-flight checks before you run the installation command.
The pre-flight checks help to ensure that your on-premise environment has everything ready for installing Konvoy.

To perform the pre-flight checks:

1. Run the following command:

   ```bash
   konvoy check preflight
   ```

1. Fix any issue reported by the pre-flight check.

1. Re-run the `konvoy check preflight` command.

1. Repeat the previous steps until pre-flight checks pass with a return status of `OK`.

# Install Konvoy

After verifying your infrastructure, you can create a Konvoy Kubernetes cluster by running the following command:

```yaml
konvoy up
```

This command installs Kubernetes, and installs default add-ons to support your Kubernetes cluster.

Specifically, the `konvoy up` command does the following:

* Deploys all of the following default add-ons:
  * [Calico][calico] to provide pod network, and policy-driven perimeter network security.
  * [CoreDNS][coredns] for DNS and service discovery.
  * [Helm][helm] to help you manage Kubernetes applications and application lifecycles.
  * [MetalLB][metallb] to expose [Layer 4][osi] services.
  * [Static local volume provisioner][static_lvp] to support local persistent volumes.
  * [Elasticsearch][elasticsearch] (including [Elasticsearch exporter][elasticsearch_exporter]) to enable scalable, high-performance logging pipeline.
  * [Kibana][kibana] to support data visualization for content indexed by Elasticsearch.
  * [Fluent Bit][fluentbit] to collect and collate logs from different sources and send logged messages to multiple destinations.
  * [Prometheus operator][prometheus_operator] (including [Grafana][grafana] AlertManager and [Prometheus Adaptor][promethsus_adapter]) to collect and evaluate metrics for monitoring and alerting.
  * [Traefik][traefik] to route [layer 7][osi] traffic as a reverse proxy and load balancer.
  * [Kubernetes dashboard][kubernetes_dashboard] to provide a general-purpose web-based user interface for the Kubernetes cluster.
  * Operations portal to centralize access to addon dashboards.
  * [Velero][velero] to back up and restore Kubernetes cluster resources and persistent volumes.
  * [Dex identity service][dex] to provide identity service (authentication) to the Kubernetes clusters.
  * [Dex Kubernetes client authenticator][dex_k8s_authenticator] to enable authentication flow to obtain `kubectl` token for accessing the cluster.
  * [Traefik forward authorization proxy][traefik_foward_auth] to provide basic authorization for Traefik ingress.
  * Kommander for multi-cluster management.

This set of configuration options is the recommended environment for small clusters.

As the `konvoy up` command runs, it displays information about the operations performed.
For example, you can view the command output to see when [Ansible][ansible] connects to the hosts and installs Kubernetes.
Once the Kubernetes cluster is up, the `konvoy up` command installs the add-ons specified for the cluster.

# Viewing cluster operations

You can access user interfaces to monitor your cluster through the [operations portal][ops_portal].

After you run the `konvoy up` command, if the installation is successful, the command output displays the information you need to access the operations portal.

For example, you should see information similar to this:

```text
Run `konvoy apply kubeconfig` to update kubectl credentials.

Navigate to the URL below to access various services running in the cluster.
  https://10.0.50.25/ops/landing
And login using the credentials below.
  Username: AUTO_GENERATED_USERNAME
  Password: SOME_AUTO_GENERATED_PASSWORD_12345

If the cluster was recently created, the dashboard and services may take a few minutes to be accessible.
```

# Checking the files installed

When the `konvoy up` completes its setup operations, the following files are generated:

* `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize your cluster and [your add-ons][addons_config].
* `admin.conf` - is a [kubeconfig file][kubeconfig], which contains credentials to [connect to the `kube-apiserver` of your cluster through `kubectl`][kubectl].
* `inventory.yaml` - is an [Ansible Inventory file][ansible_inventory].
* `runs` folder - which contains logging information.

[addons_config]: ./customize_addons.md
[kubectl]: ../operations/kubectl_basics.md
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[install_docker]: https://www.docker.com/products/docker-desktop
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[ansible]: https://www.ansible.com
[persistent_volume]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[ansible_inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[ansible_group]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#inventory-basics-hosts-and-groups
[keepalived]: https://www.keepalived.org/
[vrrp]: https://en.wikipedia.org/wiki/Virtual_Router_Redundancy_Protocol
[kubernetes_service]: https://kubernetes.io/docs/concepts/services-networking/service/
[metallb]: https://metallb.universe.tf
[ops_portal]: ../operations/ops_portal.md
[local_persistent_volume]: https://kubernetes.io/docs/concepts/storage/volumes/#local
[static_pv_provisioner]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[static_pv_provisioner_operations]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner/blob/master/docs/operations.md
[calico]: https://www.projectcalico.org/
[coredns]: https://coredns.io/
[aws_ebs_csi]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[elasticsearch]: https://www.elastic.co/products/elastic-stack
[elasticsearch_exporter]: https://www.elastic.co/guide/en/elasticsearch/reference/7.2/es-monitoring-exporters.html
[helm]: https://helm.sh/
[kibana]: https://www.elastic.co/products/kibana
[fluentbit]: https://fluentbit.io/
[prometheus_operator]: https://prometheus.io/
[grafana]: https://grafana.com/
[prometheus_adapter]: https://github.com/DirectXMan12/k8s-prometheus-adapter
[traefik]: https://traefik.io/
[osi]: https://en.wikipedia.org/wiki/OSI_model
[kubernetes_dashboard]: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
[velero]: https://velero.io/
[dex]: https://github.com/dexidp/dex
[dex_k8s_authenticator]: https://github.com/mintel/dex-k8s-authenticator
[traefik_foward_auth]: https://github.com/thomseddon/traefik-forward-auth
[static_lvp]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
