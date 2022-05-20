---
layout: layout.pug
navigationTitle: Install air-gapped
title: Install air-gapped
menuWeight: 35
excerpt: Install Konvoy in an air-gapped environment
beta: false
enterprise: false
---

<!-- markdownlint-disable MD018 -->

## Before you begin

Before installing, verify that your environment meets the following basic requirements:

-   [Docker][install_docker] version 18.09.2 or later

    You must have Docker installed on the host where the Konvoy command line interface (CLI) will run.
    For example, if you are installing Konvoy on your laptop, be sure the laptop has a supported version of Docker.

-   [kubectl][install_kubectl] v1.20.6 or later

    To enable interaction with the running cluster, you must have `kubectl` installed on the host where the Konvoy command line interface (CLI) will run.

-   The `konvoy_air_gapped.tar.bz2` that will contain the required artifacts to perform an air-gapped installation.

<!-- vale Vale.Spelling = NO -->
- If you would like to use Kommander for multi-cluster management capabilities, you need to exercise additional configuration steps. Refer to the [Kommander air gapped environment installation documentation][kommander_ag_install].
<!-- vale Vale.Spelling = YES -->

### Control plane nodes

-   You should have at least three control plane nodes.

-   Each control plane node should have at least:
    - 4 cores
    - 16 GiB memory
    - Approximately 80 GiB of free space for the volume used for `/var/lib/kubelet` and `/var/lib/containerd`.
    - Disk usage must be below 85% on the root volume.

### Worker nodes

-   You should have at least four worker nodes.

    The specific number of worker nodes required for your environment can vary depending on the cluster workload and size of the nodes.

-   Each worker node should have at least:
    - 8 cores
    - 32 GiB memory
    - Approximately 80 GiB of free space for the volume used for `/var/lib/kubelet` and `/var/lib/containerd`.
    - Disk usage must be below 85% on the root volume.

-   If you plan to use **local volume provisioning** to provide [persistent volumes][persistent_volume] for the workloads, you must mount at least four volumes to `/mnt/disks/` mount point on each node.
  Each volume must have **at least** 55 GiB of capacity if the default addon configurations are used.

### Operating system and services for all nodes

#include /dkp/konvoy/1.8/include/os-svc-nodes.tmpl

The following requirement is specific to air-gapped environments:

- Python is installed and the `python` executable can be found in the standard `PATH`.

## Initialize Konvoy configuration files

To start the Konvoy installation, you first need an [Ansible][ansible] [inventory file][ansible_inventory] in your current working directory to describe the hosts where you want to install Konvoy.
Konvoy will automatically generate the skeleton of the inventory file for you during initialization:

1.  Create an empty working directory on the computer you are using as the deploy host.

    For example, you might run the following on your laptop:

    ```bash
    mkdir konvoy-deploy
    cd konvoy-deploy
    ```

1.  Run the following commands to initialize Konvoy in the current working directory:

    ```bash
    konvoy init --provisioner=<provisioner type> --addons-repositories /opt/konvoy/artifacts/kubernetes-base-addons,/opt/konvoy/artifacts/kubeaddons-kommander,/opt/konvoy/artifacts/kubeaddons-dispatch [--cluster-name <your-specified-name>]
    ```

    In case of on-premises, the `provisioner type` should be equal to `none`, for AWS it is `aws`.

    <p class="message--note"><strong>NOTE: </strong>The cluster name may only contain the following characters: <code>a-z, 0-9, . - and _</code>.</p>

    Running the `konvoy init` command generates an inventory file skeleton `inventory.yaml` and a default `cluster.yaml` configuration file in the current working directory.

    The additional `--addons-repositories` flag results in the generated `cluster.yaml` setting the corresponding values to use locally available addon configs instead of using the default ones that are usually reachable over the Internet.
    The path `/opt/konvoy/artifacts/...` is the directory path where the `konvoy` binary is mounted from the host into the container.

    <p class="message--note"><strong>NOTE: </strong> This should not be changed unless you are referencing a different repo than the one provided in the tar.</p>

    ```yaml
    kind: ClusterConfiguration
    apiVersion: konvoy.mesosphere.io/v1beta2
    spec:
    ...
      addons:
      - configRepository: /opt/konvoy/artifacts/kubernetes-base-addons
        addonsList:
        ...
     - configRepository: /opt/konvoy/artifacts/kubeaddons-dispatch
       addonsList:
       - name: dispatch
         enabled: false
     - configRepository: /opt/konvoy/artifacts/kubeaddons-kommander
       addonsList:
       - name: kommander
         enabled: true
    ```

1.  Open inventory file `inventory.yaml` in a text editor to specify the hosts.

The inventory file `inventory.yaml` follows the standard [Ansible inventory file yaml format][ansible_inventory] for hosts and groups.

For Konvoy, specify two [groups][ansible_group]

- `control-plane`
- `node`

The `control-plane` group defines the host IP addresses for your control plane nodes.
The `node` group defines the host IP addresses for your worker nodes.

### Specifying IP addresses and host names

The IP addresses you specify in the inventory file can be the private IP addresses you use in your internal network.
The primary requirement is that all of the hosts in the cluster can communicate with each other using the IP addresses you specify.
Note that placing all of the hosts in the same subnet (for example, 10.0.50.0/24) can simplify the cluster configuration significantly.

For each host, you can also optionally specify the `ansible_host` attribute if you want Ansible to use different host names to reach the hosts.

### Ensuring connectivity

Make sure that the computer you are using as the **deploy host** can open secure shell (SSH) connections to communicate with each host specified in the inventory file.
To ensure a successful installation, the `ansible_user` account must be able to open a secure shell on each host without typing password.

You can use `ssh-agent` to pass identity keys and passphrases for authentication.

### Sample inventory file

The following `inventory.yaml` file will be generated after running `konvoy init`:

```yaml
control-plane:
  hosts:
    <ip-address>:
      ansible_host: <ssh-address>
      ansible_port: <optional>
      node_pool: control-plane
node:
  hosts:
    <ip-address>:
      ansible_host: <ssh-address>
      ansible_port: <optional>
      node_pool: worker
bastion: {}
all:
  vars:
    ansible_port: 22
    ansible_ssh_private_key_file: ""
    ansible_user: ""
    control_plane_endpoint: ""
    order: sorted
    version: v1beta1
```

-   `<ip-address>` is the host's private IP address that will be used by Kubernetes for the Node's identity.
-   `ansible_host` is the IP used by Konvoy to SSH into the host, if removed the `<ip-address>` will be used instead.
-   `ansible_port` is an optional port used by Konvoy to SSH into the host, the default value is 22.
-   `node_pool` is used to group nodes into pools, Konvoy will apply a Kubernetes label based on this value and use it internally when selecting Nodes based on their pool.

-   `ansible_ssh_private_key_file` is the name of the private SSH key used by Konvoy to SSH into the hosts.
-   `ansible_user` is the user used by Konvoy to SSH into the hosts.
-   `control_plane_endpoint` is an address for a load balancer used by all of the Nodes to reach the Kubernetes API.
-   The values of `order: sorted` and `version: v1beta1` should not be modified.

The following example illustrates a simple `inventory.yaml` file with three control plane nodes and three worker nodes.

```yaml
control-plane:
  hosts:
    10.0.50.232:
    10.0.50.233:
    10.0.50.234:

node:
  hosts:
    10.0.50.108:
      node_pool: worker
    10.0.50.109:
      node_pool: worker
    10.0.50.110:
      node_pool: worker
    10.0.50.111:
      node_pool: worker

all:
  vars:
    ansible_port: 22
    ansible_ssh_private_key_file: "mysshkey.pem"
    ansible_user: "centos"
    control_plane_endpoint: "10.0.50.100"
    order: sorted
    version: v1beta1
```

In this example:

- The keys `ansible_host` and `ansible_port` were removed, the IPs will be used instead to SSH into the hosts on the default port `22`.
- The `ansible_ssh_private_key_file` is set to `mysshkey.pem` and is expected to be in working directory.
- The `ansible_user` is the `centos` user account that has administrative privileges.

## Configure the Kubernetes cluster

After you edit the inventory file, edit the generated `cluster.yaml` file.
The `cluster.yaml` file provides the configuration details for creating your Konvoy cluster.

### Configure the RPM and DEB package repository

By default Konvoy adds new RPM and DEB repositories to the control-plane and worker hosts that are required to install a container runtime and a Kubernetes cluster.
In an air-gapped environment these repos will not be available, but instead the packages will be copied from the konvoy directory.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  osPackages:
    enableAdditionalRepositories: false
```

The RPM packages installed by Konvoy:

- chrony
- conntrack
- containerd.io
- container-selinux, on RHEL you can install the [CentOS RPM][selinux-rpm] directly
- cri-tools
- ebtables
- ethtool
- iproute
- iptables
- kubeadm
- kubectl
- kubelet
- kubernetes-cni
- libblkid
- libnetfilter_cthelper
- libnetfilter_cttimeout
- libnetfilter_queue
- libseccomp
- libuuid
- nfs-utils
- nvidia-container-runtime (for GPU enabled machines)
- nvme-cli (only on AWS)
- openssl
- socat
- util-linux
- yum-plugin-versionlock

<p class="message--note"><strong>NOTE: </strong>The above list of RPM packages is sufficient for the default CentOS 7 AMI used in Konvoy. There may be additional dependencies that need to be installed that can be found in the standard CentOS/RHEL repositories.</p>

The DEB packages installed by Konvoy:

- apt-transport-https
- chrony
- openssl
- libseccomp2
- containerd.io
- nfs-common
- kubectl
- kubernetes-cni
- kubelet
- cri-tools
- kubeadm
- nvme-cli (only on AWS)
- xfsprogs (only on AWS)
- nvidia-container-runtime (for GPU enabled machines)

The RPM and Deb packages artifacts provided in Konvoy's air-gapped bundle may not be sufficient for your version of the OS.
In that case, you may either configure a local OS package repository on the Kubernetes nodes where the missing Linux dependencies can be downloaded from,
or replace the provided `rpms.tar.gz` or `debs.tar.gz` with a set of updated tar artifacts.

For example on `Ubuntu 18.04`, you must replace the following Deb packages and their dependencies:

-   nfs-common
    - keyutils_1.5.9-9.2ubuntu2_amd64.deb
    - libevent-2.1-6_2.1.8-stable-4build1_amd64.deb
    - libnfsidmap2_0.25-5.1_amd64.deb
    - libtirpc1_0.2.5-1.2ubuntu0.1_amd64.deb
    - nfs-common_1%3a1.3.4-2.1ubuntu5.3_amd64.deb
    - rpcbind_0.2.3-0.6ubuntu0.18.04.1_amd64.deb
-   libseccomp2
    - libseccomp2_2.5.1-1ubuntu1~18.04.1_amd64.deb
-   chrony
    - chrony_3.2-4ubuntu4.5_amd64.deb
    - libnspr4_2%3a4.18-1ubuntu1_amd64.deb
    - libnss3_2%3a3.35-2ubuntu2.12_amd64.deb

<!-- vale Vale.Spelling = NO -->
#### Enterprise Linux 8 air gapped packages

The air gapped bundle contains package archives for both EL7 and EL8. The installer, however, is configured to copy only one set of packages, and it defaults to the EL7 packages. If you are using EL8 (CentOS 8 or RHEL 8), copy the EL8 package archive to the default location:
<!-- vale Vale.Spelling = YES -->
<!-- NEW TAR because of Minio -->


```bash
# backup the centos 7 archive (optional)
cp konvoy_<konvoy-version>_x86_64_rpms.tar.gz konvoy_<konvoy-version>_el7_x86_64_rpms.tar.gz

# move the el8 packages to the default package location
mv konvoy_<konvoy-version>_el8_x86_64_rpms.tar.gz konvoy_<konvoy-version>_x86_64_rpms.tar.gz
```

### Configure the image registry

In an air-gapped environment your cluster nodes will not have access to any public Docker registries, therefore you are required to provide your own that is accessible on the local network.

Set the options in your `cluster.yaml` as follows:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  imageRegistries:
    - server: https://myregistry:443
      username: "myuser"
      password: "mypassword"
      default: true
```

This will configure containerd with the provided credentials.
The presence of `default: true` also instructs Konvoy to configure [containerd mirrors][containerd_mirrors] with all the repositories of the images that are used during installation.
The file `images.json` contains the full list of images, and the corresponding image tars will be located in the `images/` directory in the air-gapped distribution.

The values for `imageRegistries` can also be specified as environment variables, for example when the file contains `password: ${REGISTRY_PASSWORD}`, the value of `password` will be set to what `REGISTRY_PASSWORD` is in your environment.
You are also able to not substitute a value from your environment by escaping it with a `$` prefix, for example `$${SHOULD_NOT_SUBSTITUTE}`.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  imageRegistries:
  - server: https://myregistry:443
    username: "myuser"
    password: |-
      ${REGISTRY_PASSWORD}
    default: true
```

The above assumes that the certificate used by `myregistry` is signed by a trusted authority.
If you are using a self-signed certificate, you must add that trusted root certificate to all the Kubernetes hosts before running `konvoy up`.

- On CentOS/RHEL:

1. Install the ca-certificates package: `yum install ca-certificates`
1. Enable the dynamic CA configuration feature: `update-ca-trust force-enable`
1. Add the CA as a new file to `/etc/pki/ca-trust/source/anchors/`: `cp myregistry.crt /etc/pki/ca-trust/source/anchors/myregistry.crt`
1. Update the CA trust: `update-ca-trust extract`

- On Ubuntu/Debian:

1. Copy your CA to dir `/usr/local/share/ca-certificates/`: `cp myregistry.crt /usr/local/share/ca-certificates/myregistry.crt`
1. Update the CA store: `sudo update-ca-certificates`

Konvoy provides a convenient CLI command to setup your registry with the required images which you must run in order to populate your registry with all necessary images prior to installing Konvoy.
Running the command below loads all of the images, retags them, and pushes them to the specified image registry:

```text
konvoy config images seed
```

In addition to the default `images.json` file and `images/` directory, it is also possible to use the same `konvoy config images seed` with additional images.
In your working directory, create an `extras/images/<some-directory>/` and place an `images.json` and the corresponding image tars.

### Configure the control plane

Konvoy supports Kubernetes control plane high availability (HA) out-of-the-box for on-premises deployments if you do not have a third-party load balancer.

The default control plane load balancer for Konvoy is based on [Keepalived][keepalived], which will be deployed on all control-plane nodes as static Kubernetes pods.

To use `keepalived` control plane load balancing:

-   Identify and reserve an unused virtual IP (VIP) address from your networking infrastructure. During the installation, the Konvoy installer will check if the designated IP is free to use as a Keepalived's VIP by pinging it.

-   Configure your networking infrastructure so that the reserved virtual IP address is reachable:
    - from all hosts specified in the inventory file.
    - from the computer you are using as the deploy host.

    If all cluster hosts and the reserved virtual IP address are in the same subnet, you typically do not need to perform any additional configuration to your networking infrastructure.
    If you are using more than one subnet for the cluster, however, you should work with your networking team to ensure connectivity between all hosts and the reserved virtual IP address.

The following example illustrates the configuration if the reserved virtual IP address is `10.0.50.20`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    controlPlane:
      controlPlaneEndpointOverride: "10.0.50.20:6443"
      keepalived:
        interface: ens20f0 # optional
        vrid: 51           # optional
```

You could set `spec.kubernetes.controlPlane.keepalived.interface` to specify the network interface you want to use for the Keepalived VIP.
This field is optional.
If not set, Konvoy will try to automatically detect the network interface to use based on the route to the VIP. If Konvoy fails to detect the correct network interface, the Konvoy installation may fail when deploying kubeadm.

You could also set `spec.kubernetes.controlPlane.keepalived.vrid` to specify the [Virtual Router ID][vrrp] used by Keepalived.
This field is optional.
If not set, Konvoy will randomly pick a Virtual Router ID for you.

If you are not setting any of the optional values, use `spec.kubernetes.controlPlane.keepalived: {}` to enable it with the default values.

### Configure pod and service networking

The following example illustrates how you can configure the pod subnet and service subnet in the `cluster.yaml` configuration file:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    networking:
      podSubnet: 192.168.0.0/24
      serviceSubnet: 10.0.51.0/24
```

When configuring these settings, you should make sure that the values you set for `podSubnet` and `serviceSubnet` do not overlap with your node subnet and your `keepalived` virtual IP address.

### Configure autoscaling and the Docker registry

Konvoy provides an [autoscaling feature that works at the node pool level][autoscaling]. When installing Konvoy in an air-gapped environment, you have to configure auto-provisioning with a local Docker registry.

Assuming you have a private registry `https://myregistry:443` that requires authentication and uses a custom certificate, you must specify it as follows:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: clustername
spec:
  autoProvisioning:
    config:
      konvoy:
        imageRepository: myregistry:443/mesosphere/konvoy
      webhook:
        dockerRegistryCaBundle: |
          -----BEGIN CERTIFICATE-----
          [...]
          ----END CERTIFICATE-----
        extraArgs:
          konvoy.docker-registry-url: https://myregistry:443
          konvoy.docker-registry-username: "myuser"
          konvoy.docker-registry-password: "mypassword"
      clusterAutoscaler:
        chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
      kubeaddonsRepository:
        versionMap:
          1.20.6: stable-1.20-4.3.0
        versionStrategy: mapped-kubernetes-version
```

The `imageRepository: myregistry:443/mesosphere/konvoy` refers to the image that should be present in your registry after running `konvoy config images seed`. The autoscaler queries the registry and finds the latest `konvoy` image to use in the autoscaling process.

If you wish to disable the Docker registry certificate verification, set `konvoy.docker-registry-insecure-skip-tls-verify` to `true` in the auto-provisioning's `webhook.extraArgs`. We encourage you to keep the certificate verification enabled to validate all TLS connections to the registry.

If you are using a registry that has the notion of projects such as [Harbor][harbor], make sure that you prepend the project name to the value of `konvoy.docker-registry-repository` while not adding it to the `konvoy.docker-registry-url`. Here is an example of `autoProvisioning` spec using a Harbor registry with a project called `library`:

```yaml
spec:
  autoProvisioning:
    config:
      konvoy:
        imageRepository: myregistry:443/library/mesosphere/konvoy
      webhook:
        extraArgs:
          konvoy.docker-registry-url: https://myregistry:443
          konvoy.docker-registry-repository: "library/mesosphere/konvoy"
          #konvoy.docker-registry-insecure-skip-tls-verify: false
          konvoy.docker-registry-username: "myuser"
          konvoy.docker-registry-password: "mypassword"
      clusterAutoscaler:
        chartRepo: http://konvoy-addons-chart-repo.kubeaddons.svc:8879
```

Details regarding the autoscaler are provided in [the autoscaling documentation][autoscaling-air].

#### Autoscaling on AWS

<!-- vale Vale.Spelling = NO -->
In an air gapped environment, accessing AWS services requires setting up VPC endpoints. These are gateways/interfaces which enable direct access to services like EC2, without going through the public Internet.
<!-- vale Vale.Spelling = YES -->

To enable the VPC endpoints needed to make autoscaler work on AWS, apply the following changes in the `cluster.yaml`:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  aws:
    vpc:
      enableVPCEndpoints: true
```

### Configure Addon repository

<!-- vale Vale.Spelling = NO -->
In a non-air-gapped deployment, your cluster has access to publicly hosted Helm chart repos for all of the addons.
This is not the case for air-gapped installations, therefore Konvoy can be configured to host the required Helm charts in the cluster.
Modify the `addons` section and specify the image containing the Helm charts:
<!-- vale Vale.Spelling = YES -->

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
...
  addons:
    - configRepository: /opt/konvoy/artifacts/kubernetes-base-addons
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:v1.8.5
      addonsList:
      ...
    - configRepository: /opt/konvoy/artifacts/kubeaddons-dispatch
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:v1.8.5
      addonsList:
      - name: dispatch
        enabled: false
    - configRepository: /opt/konvoy/artifacts/kubeaddons-kommander
      addonRepository:
        image: mesosphere/konvoy-addons-chart-repo:v1.8.5
      addonsList:
      - name: kommander
        enabled: false
```

### Load balancing

<!-- vale Vale.Spelling = NO -->
Some of the aspects of Konvoy load balancing configuration depend on the type of air gapped environment where Konvoy is being deployed.
<!-- vale Vale.Spelling = YES -->

#### Load balancing on-premises

If you do not have a third-party load balancer Konvoy supports [Service][kubernetes_service] type `LoadBalancer` out-of-the-box for on-premises deployments.

The default load balancer service for addons is based on [MetalLB][metallb].

To use MetalLB for addon load balancing:

-   Identify and reserve a range of virtual IP addresses (VIPs) from your networking infrastructure.

-   Configure your networking infrastructure so that the reserved virtual IP addresses are reachable:
    - from all hosts specified in the inventory file.
    - from the computer you are using as the deploy host.

If all cluster hosts and the reserved virtual IP addresses are in the same subnet, you typically do not need to perform any additional configuration to your networking infrastructure.
If you are using more than one subnet for the cluster, however, you should work with your networking team to ensure connectivity between all hosts and the reserved range of virtual IP addresses.

MetalLB can be configured in two modes - `layer2` and `bgp`.

The following example illustrates the layer2 configuration in the `cluster.yaml` configuration file:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
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
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
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

#### Load balancing on AWS

<!-- vale Vale.Spelling = NO -->
Air gapped AWS clusters cannot use externally-visible load balancers as they would be unavailable for the VPC. Instead, use internal load balancers by updating the `cluster.yaml`.
<!-- vale Vale.Spelling = YES -->

- Enabling internal load balancing for apiserver's endpoint:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  aws:
    elb:
      internal: true
```

-   Enabling internal load balancing for addons requires modifying the `values` field for each of the addons mentioned below, if they were enabled.

    - Velero addon:

    ```yaml
    - name: velero
      values: |-
        minioBackendConfiguration:
          service:
            annotations:
              "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
    ```

    - [experimental] Istio addon:[/experimental]

    ```yaml
    - name: istio
      values: |-
        gateways:
          istio-ingressgateway:
            serviceAnnotations:
              "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
    ```

    - Traefik addon:

    ```yaml
    - name: traefik
      values: |-
        service:
          annotations:
            "service.beta.kubernetes.io/aws-load-balancer-internal": "true"
    ```

## Storage

### Storage on AWS

<!-- vale Vale.Spelling = NO -->
In case of AWS provider, volumes by default are provisioned automatically in an air gapped environment, provided that VPC endpoints are enabled.
See the [Autoscaling on AWS](#autoscaling-on-aws) section.
<!-- vale Vale.Spelling = YES -->

### Storage on-premises

Konvoy supports [local persistent volume][local_persistent_volume] provisioning out-of-the-box if you do not have a third-party storage vendor.

This default storage provisioning option allows operators to mount local volumes at a specific location on each host.
For a Konvoy cluster, the local volume mount point is `/mnt/disks`.

Mounted volumes in the `/mnt/disks` location are detected automatically.
Once detected, corresponding [persistent volume][persistent_volume] objects are created in the API server for your stateful workloads.
Konvoy uses the [static local volume provisioner][static_pv_provisioner] to perform this task.

To mount local volumes:

1.  Format and mount the volume by running commands similar to the following:

    ```bash
    sudo mkfs.ext4 /dev/path/to/disk
    DISK_UUID=$(blkid -s UUID -o value /dev/path/to/disk)
    sudo mkdir /mnt/disks/$DISK_UUID
    sudo mount -t ext4 /dev/path/to/disk /mnt/disks/$DISK_UUID
    ```

1.  Persist the mount entry by adding it to `/etc/fstab` as follows:

    ```bash
    echo UUID=`sudo blkid -s UUID -o value /dev/path/to/disk` /mnt/disks/$DISK_UUID ext4 defaults 0 2 | sudo tee -a /etc/fstab
    ```

1.  Verify that local volumes stay mounted after the host is rebooted.

For more information on how to mount local volumes, see the [Operations][static_pv_provisioner_operations] guide for Kubernetes.

Note that if your stateful workload is using a [local persistent volume][local_persistent_volume], it cannot be moved to a different node.
If the node fails, the stateful workload might lose its data.
You should consider another storage option if this limitation is unacceptable.

## Pre-flight checks

After you have completed the basic configuration in the `cluster.yaml` file, you should run the Konvoy pre-flight checks before you run the installation command.
The pre-flight checks help to ensure that your on-premises environment has everything ready for installing Konvoy.

To perform the pre-flight checks:

1.  Run the following command:

    ```bash
    konvoy check preflight
    ```

1.  Fix any issue reported by the pre-flight check.

1.  Re-run the `konvoy check preflight` command.

1.  Repeat the previous steps until pre-flight checks pass with a return status of `OK`.

## Install Konvoy

After verifying your infrastructure, you create a Konvoy Kubernetes cluster by running the following command:

```yaml
konvoy deploy
```

This command installs Kubernetes and the enabled Addons from `cluster.yaml`. The set of Addons enabled by default (after running `konvoy init`) is the recommended setup for small clusters.

As the `konvoy deploy` command runs, it displays information about the operations performed.
For example, you can view the command output to see when [Ansible][ansible] connects to the hosts and installs Kubernetes.
Once the Kubernetes cluster is up, the `konvoy deploy` command installs the addons specified for the cluster.

This is the set of Addons deployed by default:

- [Calico][calico] to provide pod network, and policy-driven perimeter network security.
- [CoreDNS][coredns] for DNS and service discovery.
- [Helm][helm] to help you manage Kubernetes applications and application lifecycles.
- [MetalLB][metallb] to expose [Layer 4][osi] services.
- [Static local volume provisioner][static_lvp] to support local persistent volumes.
- [Elasticsearch][elasticsearch] (including [Elasticsearch exporter][elasticsearch_exporter]) to enable scalable, high-performance logging pipeline.
- [Kibana][kibana] to support data visualization for content indexed by Elasticsearch.
- [Fluent Bit][fluentbit] to collect and collate logs from different sources and send logged messages to multiple destinations.
- [Prometheus operator][prometheus_operator] (including [Grafana][grafana] AlertManager and [Prometheus Adaptor][prometheus_adapter]) to collect and evaluate metrics for monitoring and alerting.
- [Traefik][traefik] to route [layer 7][osi] traffic as a reverse proxy and load balancer.
- [Kubernetes dashboard][kubernetes_dashboard] to provide a general-purpose web-based user interface for the Kubernetes cluster.
- Operations portal to centralize access to addon dashboards.
- [Velero][velero] to back up and restore Kubernetes cluster resources and persistent volumes.
- [Dex identity service][dex] to provide identity service (authentication) to the Kubernetes clusters.
- [Dex Kubernetes client authenticator][dex_k8s_authenticator] to enable authentication flow to obtain `kubectl` token for accessing the cluster.
- [Traefik forward authorization proxy][traefik_foward_auth] to provide basic authorization for Traefik ingress.
- Kommander for multi-cluster management.

## Viewing cluster operations

You can access user interfaces to monitor your cluster through the [operations portal][ops_portal].

After you run the `konvoy deploy` command, if the installation is successful, the command output displays the information you need to access the operations portal.

You should see information similar to this:

```text
Run `konvoy apply kubeconfig` to update kubectl credentials.

Navigate to the URL below to access various services running in the cluster.
  https://10.0.50.25/ops/landing
And login using the credentials below.
  Username: AUTO_GENERATED_USERNAME
  Password: SOME_AUTO_GENERATED_PASSWORD_12345

If the cluster was recently created, the dashboard and services may take a few minutes to be accessible.
```

## Checking the files installed

When the `konvoy deploy` completes its setup operations, the following files are generated:

- `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize [your cluster configuration][cluster_configuration].
- `admin.conf` - is a [kubeconfig file][kubeconfig], which contains credentials to [connect to the `kube-apiserver` of your cluster through `kubectl`][kubectl].
- `inventory.yaml` - is an [Ansible Inventory file][ansible_inventory].
- `runs` folder - which contains logging information.

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the GNU Affero General Public License 3.0. The complete source code for the version of MinIO packaged with DKP/Konvoy 1.8/Kommander 1.4 is available at this URL: https://github.com/minio/minio/tree/RELEASE.2020-12-03T05-49-24Z

For a full list of attributed 3rd party software, see [D2IQ Legal](https://d2iq.com/legal//3rd).

[ansible]: https://www.ansible.com
[ansible_group]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#inventory-basics-hosts-and-groups
[ansible_inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[autoscaling]: ../../autoscaling/
[autoscaling-air]: ../../autoscaling#autoscaling-an-air-gapped-cluster
[aws_ebs_csi]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[calico]: https://www.projectcalico.org/
[cluster_configuration]: ../../reference/cluster-configuration/
[containerd_mirrors]: https://github.com/containerd/cri/blob/master/docs/registry.md#configure-registry-endpoint
[coredns]: https://coredns.io/
[dex]: https://github.com/dexidp/dex
[dex_k8s_authenticator]: https://github.com/mesosphere/dex-k8s-authenticator
[elasticsearch]: https://www.elastic.co/products/elastic-stack
[elasticsearch_exporter]: https://www.elastic.co/guide/en/elasticsearch/reference/7.2/es-monitoring-exporters.html
[fluentbit]: https://fluentbit.io/
[grafana]: https://grafana.com/
[harbor]: https://goharbor.io/
[helm]: https://helm.sh/
[install_docker]: https://www.docker.com/products/docker-desktop
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[kommander_ag_install]: /dkp/kommander/1.4/install-airgapped/
[keepalived]: https://www.keepalived.org/
[kibana]: https://www.elastic.co/products/kibana
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[kubectl]: ../../access-authentication/access-konvoy#using-kubectl
[kubernetes_dashboard]: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
[kubernetes_service]: https://kubernetes.io/docs/concepts/services-networking/service/
[local_persistent_volume]: https://kubernetes.io/docs/concepts/storage/volumes/#local
[metallb]: https://metallb.universe.tf
[ops_portal]: ../../access-authentication/access-konvoy#using-the-operations-portal
[osi]: https://en.wikipedia.org/wiki/OSI_model
[persistent_volume]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[prometheus_adapter]: https://github.com/DirectXMan12/k8s-prometheus-adapter
[prometheus_operator]: https://prometheus.io/
[selinux-rpm]: http://mirror.centos.org/centos/7/extras/x86_64/Packages/container-selinux-2.107-3.el7.noarch.rpm
[static_lvp]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[static_pv_provisioner]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[static_pv_provisioner_operations]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner/blob/master/docs/operations.md
[traefik]: https://traefik.io/
[traefik_foward_auth]: https://github.com/thomseddon/traefik-forward-auth
[velero]: https://velero.io/
[vrrp]: https://en.wikipedia.org/wiki/Virtual_Router_Redundancy_Protocol
