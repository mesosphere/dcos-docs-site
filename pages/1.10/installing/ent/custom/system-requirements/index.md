---
layout: layout.pug
navigationTitle:  System Requirements
title: System Requirements
menuWeight: 0
excerpt: Understanding system requirements for node settings

enterprise: true
---

# System Requirements

## Hardware Prerequisites

The hardware prerequisites are a single bootstrap node, Mesos master nodes, and Mesos agent nodes.

### Bootstrap node


You will need a single boostrap node with two cores, 16 GB RAM, 60 GB HDD. This is the node where DC/OS installation is run. This bootstrap node must also have:

*  A high-availability (HA) TCP/Layer 3 load balancer, such as HAProxy, to balance the following TCP ports to all master nodes: 80, 443.
*  An unencrypted SSH key that can be used to authenticate with the cluster nodes over SSH. Encrypted SSH keys are not supported.


### Cluster nodes


The cluster nodes are designated Mesos masters and agents during installation.

The supported operating systems and environments are listed on the [version policy page](https://docs.mesosphere.com/version-policy/).

#### Master nodes

The table below shows the master node hardware requirements:

|             | Minimum   | Recommended |
|-------------|-----------|-------------|
| Nodes       | 1*        | 3 or 5      |
| Processor   | 4 cores   | 4 cores     |
| Memory      | 32 GB RAM | 32 GB RAM   |
| Hard disk   | 120 GB    | 120 GB      |
&ast; For business critical deployments, three master nodes are required rather than one master node.

There are many mixed workloads on the masters. Workloads that are expected to be continuously available or considered business critical should only be run on a DC/OS cluster with at least three masters. For more information about high availability requirements see the [High Availability documentation][0].

[0]: https://docs.mesosphere.com/1.10/overview/high-availability/

Examples of mixed workloads on the masters are: Mesos replicated log and ZooKeeper. Some of these require fsync()ing every so often, and this can generate a lot of very expensive random I/O.

Thus, the following hardware is recommended:

- Solid-state drive (SSD)
- RAID controllers with a BBU
- RAID controller cache configured in writeback mode

#### Agent nodes

The table below shows the agent node hardware requirements.

|             | Minimum   | Recommended |
|-------------|-----------|-------------|
| Nodes       | 1         | 6 or more   |
| Processor   | 4 cores   | 4 cores     |
| Memory      | 16 GB RAM | 16 GB RAM   |
| Hard disk   | 60 GB     | 60 GB       |

The agent nodes must also have:

- A `/var` directory with 20 GB or more of free space. This directory is used by the sandbox for both [Docker and DC/OS Universal container runtime](/1.10/deploying-services/containerizers/).
- Network Access to a public Docker repository or to an internal Docker registry.

*   On RHEL 7 and CentOS 7, `firewalld` must be stopped and disabled. It is a known <a href="https://github.com/docker/docker/issues/16137" target="_blank">Docker issue</a> that `firewalld` interacts poorly with Docker. For more information, see the <a href="https://docs.docker.com/v1.6/installation/centos/#firewalld" target="_blank">Docker CentOS firewalld</a> documentation.

    ```bash
    sudo systemctl stop firewalld && sudo systemctl disable firewalld
    ```

*   DC/OS is installed to `/opt/mesosphere`. `/opt/mesosphere` must be on the same mountpoint as `/`.  This is required because DC/OS installs systemd unit files under `/opt/mesosphere`. All systemd units must be available for enumeration during the initializing of the initial ramdisk at boot. If `/opt` is on a different partition or volume, systemd will fail to discover these units during the initialization of the ramdisk and DC/OS will not automatically restart upon reboot.

*   The Mesos master and agent persistent information of the cluster is stored in the `var/lib/mesos` directory.

    **Important:** Do not remotely mount `/var/lib/mesos` or the Docker storage directory (by default `/var/lib/docker`).

*   Do not mount `/tmp` with `noexec`. This will prevent Exhibitor and ZooKeeper from running.

#### <a name="port-and-protocol"></a>Port and Protocol Configuration

*   Secure Shell (SSH) must be enabled on all nodes.
*   Internet Control Message Protocol (ICMP) must be enabled on all nodes.
*   All hostnames (FQDN and short hostnames) must be resolvable in DNS; both forward and reverse lookups must succeed.
*   Each node is network accessible from the bootstrap node.
*   Each node has unfettered IP-to-IP connectivity from itself to all nodes in the DC/OS cluster.
*   All ports should be open for communication from the master nodes to the agent nodes and vice versa.
*   UDP must be open for ingress to port 53 on the masters. To attach to a cluster, the Mesos agent node service (`dcos-mesos-slave`) uses this port to find `leader.mesos`.

#### High Speed Internet Access

High speed internet access is recommended for DC/OS installation. A minimum 10 MBit per second is required for DC/OS services. The installation of some DC/OS services will fail if the artifact download time exceeds the value of MESOS_EXECUTOR_REGISTRATION_TIMEOUT within the file `/opt/mesosphere/etc/mesos-slave-common`. The default value for MESOS_EXECUTOR_REGISTRATION_TIMEOUT is 10 minutes.

## Software Prerequisites

* Refer to [install_prereqs.sh](https://raw.githubusercontent.com/dcos/dcos/1.10/cloud_images/centos7/install_prereqs.sh) script for an example of how to install the software requirements for DC/OS masters and agents on a CentOS 7 host.[enterprise type="inline" size="small" /]

* When using OverlayFS over XFS, the XFS volume should be created with the -n ftype=1 flag. Please see the [Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.2_release_notes/technology-preview-file_systems) and [Mesos](http://mesos.apache.org/documentation/latest/container-image/#provisioner-backends) documentation for more details.

### All Nodes

#### Docker

Docker must be installed on all bootstrap and cluster nodes. The supported Docker versions are listed on the [version policy page](https://docs.mesosphere.com/version-policy/).

**Recommendations**

* Do not use Docker `devicemapper` storage driver in `loop-lvm` mode. For more information, see [Docker and the Device Mapper storage driver](https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/).

* Prefer `OverlayFS` or `devicemapper` in `direct-lvm` mode when choosing a production storage driver. For more information, see Docker's [Select a Storage Driver] (https://docs.docker.com/engine/userguide/storagedriver/selectadriver/).

* Manage Docker on CentOS with systemd. systemd handles starting Docker on boot and restarting it when it crashes.

* Run Docker commands as the root user (with `sudo`) or as a user in the [docker user group](https://docs.docker.com/engine/installation/linux/centos/#create-a-docker-group).

**Distribution-Specific Installation**

Each Linux distribution requires Docker to be installed in a specific way:

*   **CentOS** - [Install Docker from Docker's yum repository][2].
*   **RHEL** - Install Docker by using a subscription channel. For more information, see [Docker Formatted Container Images on Red Hat Systems](https://access.redhat.com/articles/881893)<!-- curl -sSL https://get.docker.com | sudo sh -->
*   **CoreOS** - Comes with Docker pre-installed and pre-configured.

For more more information, see Docker's [distribution-specific installation instructions](http://docs.docker.com/engine/installation/)

#### Disable sudo password prompts

To use the [GUI][4] or [CLI][1] installation methods, you must disable password prompts for sudo.

Add the following line to your `/etc/sudoers` file. This disables the sudo password prompt.

```bash
%wheel ALL=(ALL) NOPASSWD: ALL
```

Alternatively, you can SSH as the root user.

#### Enable NTP

Network Time Protocol (NTP) must be enabled on all nodes for clock synchronization. By default, during DC/OS startup you will receive an error if this is not enabled. You can check if NTP is enabled by running one of these commands, depending on your OS and configuration:

```bash
ntptime
adjtimex -p
timedatectl
```

### Bootstrap node

Before installing DC/OS, you must ensure that your bootstrap node has the following prerequisites.

**Important:**

* If you specify `exhibitor_storage_backend: zookeeper`, the bootstrap node is a permanent part of your cluster. With `exhibitor_storage_backend: zookeeper` the leader state and leader election of your Mesos masters is maintained in Exhibitor ZooKeeper on the bootstrap node. For more information, see the configuration parameter [documentation](/1.10/installing/ent/custom/configuration/configuration-parameters/).
* The bootstrap node must be separate from your cluster nodes.

#### <a name="setup-file"></a>DC/OS setup file

[Download and save](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads) the DC/OS setup file to your bootstrap node. This file is used to create your customized DC/OS build file. Contact your sales representative or <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> for access to this file.

#### Docker NGINX (advanced installer)

For advanced install only, install the Docker NGINX image with this command:

```bash
sudo docker pull nginx
```

### Cluster nodes

For advanced install only, your cluster nodes must have the following prerequisites. The cluster nodes are designated as Mesos masters and agents during installation.

#### Data compression (advanced installer)

You must have the [UnZip](http://www.info-zip.org/UnZip.html),[GNU tar](https://www.gnu.org/software/tar/),[XZ Utils](http://tukaani.org/xz/) data compression utilities installed on your cluster nodes.

To install these utilities on CentOS7 and RHEL7:

```bash
sudo yum install -y tar xz unzip curl ipset
```


#### Cluster permissions (advanced installer)

On each of your cluster nodes, use the following command to:

*   Disable SELinux or set it to permissive mode.
*   Add `nogroup` and `docker` to each of your Mesos masters and agents.
*   Reboot your cluster for the changes to take effect.

    ```bash
    sudo sed -i s/SELINUX=enforcing/SELINUX=permissive/g /etc/selinux/config &&
    sudo groupadd nogroup &&
    sudo groupadd docker &&
    sudo reboot
    ```


    **Note:** It may take a few minutes for your node to come back online after reboot.

   

### Locale requirements

You must set the `LC_ALL` and `LANG` environment variables to `en_US.utf-8`.    

# Interoperability Matrix

You can see the matrix for the certified packages [here](https://gist.github.com/ToddGreenstein/3f4601ec0bae5a0355ccdc0bcd516547).


# Install Docker on CentOS

## Requirements and Recommendations

Before installing Docker on CentOS, review the general [requirements and recommendations for running Docker on DC/OS][1] and the following CentOS-specific recommendations:

* Use the Docker yum repository to install Docker on CentOS. The yum repository makes it easy to upgrade and automatically manages dependency installation.

* Prefer the OverlayFS storage driver. OverlayFS avoids known issues with `devicemapper` in `loop-lvm` mode and allows containers to use docker-in-docker, if they want.

  * Use CentOS 7.2 or greater. OverlayFS support was improved in 7.2 to fix [a bug with XFS](https://github.com/docker/docker/issues/10294)

* Format node storage as XFS with the `ftype=1` option. As of CentOS 7.2, [only XFS is currently supported for use as a lower layer file system](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/7.2_Release_Notes/technology-preview-file_systems.html).

  ```bash
  mkfs -t xfs -n ftype=1 /dev/sdc1
  ```

# Installation Procedure

Follow the Docker [CentOS-specific installation instructions](https://docs.docker.com/engine/installation/linux/centos/).


# Example: Installing Docker with OverlayFS

The following instructions demonstrate how to use Docker with OverlayFS on CentOS 7.

1.  Upgrade CentOS to 7.4:

    ```bash
    sudo yum upgrade --assumeyes --tolerant
    sudo yum update --assumeyes
    ```

1.  Verify that the kernel is at least 3.10:

    ```
    uname -r
    3.10.0-327.10.1.el7.x86_64
    ```

1.  Enable OverlayFS:

    ```bash
    sudo tee /etc/modules-load.d/overlay.conf <<-'EOF'
    overlay
    EOF
    ```

1.  Reboot to reload kernel modules:

    ```bash
    reboot
    ```

1.  Verify that OverlayFS is enabled:

    ```bash
    lsmod | grep overlay
    overlay
    ```

1.  Configure yum to use the Docker yum repo:

    ```bash
    sudo tee /etc/yum.repos.d/docker.repo <<-'EOF'
    [dockerrepo]
    name=Docker Repository
    baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
    enabled=1
    gpgcheck=1
    gpgkey=https://yum.dockerproject.org/gpg
    EOF
    ```

1.  Configure systemd to run the Docker Daemon with OverlayFS:

    ```bash
    sudo mkdir -p /etc/systemd/system/docker.service.d && sudo tee /etc/systemd/system/docker.service.d/override.conf <<- EOF
    [Service]
    ExecStart=
    ExecStart=/usr/bin/dockerd --storage-driver=overlay
    EOF
    ```

1.  Install the Docker engine, daemon, and service.

    ```bash
    sudo yum install -y docker-engine-1.13.1 docker-engine-selinux-1.13.1
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

    When the process completes, you should see:

    ```
    Complete!
    Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.
    ```

1. Test that Docker is properly installed:

    ```bash
    sudo docker ps
    ```

For more generic Docker requirements, see [System Requirements: Docker][1].

[1]: /1.10/installing/ent/custom/system-requirements/#docker


# Next steps

- [GUI DC/OS Installation Guide][4]
- [CLI DC/OS Installation Guide][1]
- [Advanced DC/OS Installation Guide][5]

[1]: /1.10/installing/ent/custom/cli/
[2]: /1.10/installing/ent/custom/system-requirements/install-docker-centos/
[4]: /1.10/installing/ent/custom/gui/
[5]: /1.10/installing/ent/custom/advanced/
