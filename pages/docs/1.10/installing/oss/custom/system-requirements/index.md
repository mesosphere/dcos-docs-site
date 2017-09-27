---
layout: layout.pug
navigationTitle:  System Requirements
excerpt:
title: System Requirements
menuWeight: 000
---

# Hardware Prerequisites

You must have a single bootstrap node, an odd number of Mesos master nodes, and any number Mesos of agent nodes.

## Bootstrap node

1 node with 2 cores, 16 GB RAM, 60 GB HDD. This is the node where DC/OS installation is run. This bootstrap node must also have:

*   A high-availability (HA) TCP/Layer 3 load balancer, such as HAProxy, to balance the following TCP ports to all master nodes: 80, 443, 8080, 8181, 2181, 5050.
*  An unencrypted SSH key that can be used to authenticate with the cluster nodes over SSH. Encrypted SSH keys are not supported.

**Important:** The bootstrap node must be separate from your cluster nodes.

## Cluster nodes

The cluster nodes are designated Mesos masters and agents during installation.

### Master nodes

You must have an odd number of master nodes.

Here are the master node hardware requirements.

|             | Minimum   | Recommended |
|-------------|-----------|-------------|
| RHEL/CentOS | 7.2, 7.3  | 7.2, 7.3    |
| CoreOS      | 1235.9.0  | 1235.9.0    |
| Nodes       | 1         | 3 or 5   |
| Processor   | 4 cores   | 4 cores     |
| Memory      | 32 GB RAM | 32 GB RAM   |
| Hard disk   | 120 GB    | 120 GB      |

There are many mixed workloads on the masters, for example Mesos replicated log and ZooKeeper. Some of these require fsync()ing every so often, and this can generate a lot of very expensive random I/O. We recommend the following: 

- Solid-state drive (SSD)
- RAID controllers with a BBU
- RAID controller cache configured in writeback mode

### Agent nodes

Here are the agent node hardware requirements.

|             | Minimum   | Recommended |
|-------------|-----------|-------------|
| RHEL/CentOS | 7.2, 7.3  | 7.2, 7.3    |
| CoreOS      | 1235.9.0  | 1235.9.0    |
| Nodes       | 1         | 6 or more   |
| Processor   | 2 cores   | 2 cores     |
| Memory      | 16 GB RAM | 16 GB RAM   |
| Hard disk   | 60 GB     | 60 GB       |

The agent nodes must also have: 

- A `/var` directory with 10 GB or more of free space. This directory is used by the sandbox for both [Docker and DC/OS Universal container runtime](/docs/1.10/deploying-services/containerizers/).
- Network Access to a public Docker repository or to an internal Docker registry.

*   On RHEL 7 and CentOS 7, firewalld must be stopped and disabled. It is a known <a href="https://github.com/docker/docker/issues/16137" target="_blank">Docker issue</a> that firewalld interacts poorly with Docker. For more information, see the <a href="https://github.com/docker/docker/blob/v1.6.2/docs/sources/installation/centos.md#firewalld" target="_blank">Docker CentOS firewalld</a> documentation.

    ```bash
    sudo systemctl stop firewalld && sudo systemctl disable firewalld
    ```
*   DC/OS is installed to `/opt/mesosphere`. `/opt/mesosphere` cannot be on a partition that is on an LVM logical volume or shared storage.
*   The Mesos master and agent persistent information of the cluster is stored in the `/var/lib/mesos` directory.
    
    **Important:** Do not remotely mount `/var/lib/mesos` or the Docker storage directory (by default `/var/lib/docker`).
    
*   Do not mount `/tmp` with `noexec`. This will prevent Exhibitor and ZooKeeper from running.    

### Port and Protocol Configuration

*   Secure Shell (SSH) must be enabled on all nodes.
*   Internet Control Message Protocol (ICMP) must be enabled on all nodes.
*   Each node is network accessible from the bootstrap node.
*   Each node has unfettered IP-to-IP connectivity from itself to all nodes in the DC/OS cluster.
*   UDP must be open for ingress to port 53 on the masters. To attach to a cluster, the Mesos agent node service (`dcos-mesos-slave`) uses this port to find `leader.mesos`.

### High Speed Internet Access

High speed internet access is recommended for DC/OS installation. A minimum 10 MBit per second is required for DC/OS services. The installation of some DC/OS services will fail if the artifact download time exceeds the value of MESOS_EXECUTOR_REGISTRATION_TIMEOUT within the file `/opt/mesosphere/etc/mesos-slave-common`. The default value for MESOS_EXECUTOR_REGISTRATION_TIMEOUT is 10 minutes.

# Software Prerequisites

**Tip:** Refer to [this shell script](https://raw.githubusercontent.com/dcos/dcos/docs/1.10/cloud_images/centos7/install_prereqs.sh) for an example of how to install the software requirements for DC/OS masters and agents on a CentOS 7 host.

## All Nodes

### Docker

Docker must be installed on all bootstrap and cluster nodes. The supported versions of Docker are:

- 1.13.x
- 1.12.x
- 1.11.x

**Recommendations**

* Docker 1.11.x - 1.13.x is recommended <a href="https://github.com/docker/docker/issues/9718" target="_blank">for stability reasons</a>.

* Do not use Docker `devicemapper` storage driver in `loop-lvm` mode. For more information, see [Docker and the Device Mapper storage driver](https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/).

* Prefer `OverlayFS` or `devicemapper` in `direct-lvm` mode when choosing a production storage driver. For more information, see Docker's <a href="https://docs.docker.com/engine/userguide/storagedriver/selectadriver/" target="_blank">Select a Storage Driver</a>.

* Manage Docker on CentOS with systemd. systemd handles starting Docker on boot and restarting it when it crashes.

* Run Docker commands as the root user (with `sudo`) or as a user in the <a href="https://docs.docker.com/engine/installation/linux/centos/#create-a-docker-group" target="_blank">docker user group</a>.

**Distribution-Specific Installation**

Each Linux distribution requires Docker to be installed in a specific way:

*   **CentOS** - [Install Docker from Docker's yum repository][2].
*   **RHEL** - Install Docker by using a subscription channel. For more information, see <a href="https://access.redhat.com/articles/881893" target="_blank">Docker Formatted Container Images on Red Hat Systems</a>. <!-- curl -sSL https://get.docker.com | sudo sh -->
*   **CoreOS** - Comes with Docker pre-installed and pre-configured.

For more more information, see Docker's <a href="http://docs.docker.com/engine/installation/" target="_blank">distribution-specific installation instructions</a>.

### Disable sudo password prompts

To use the [GUI][4] or [CLI][1] installation methods, you must disable password prompts for sudo.

Add the following line to your `/etc/sudoers` file. This disables the sudo password prompt.

```bash
%wheel ALL=(ALL) NOPASSWD: ALL
```

Alternatively, you can SSH as the root user.

### Enable NTP

Network Time Protocol (NTP) must be enabled on all nodes for clock synchronization. By default, during DC/OS startup you will receive an error if this is not enabled. You can check if NTP is enabled by running one of these commands, depending on your OS and configuration:

```bash
ntptime
adjtimex -p
timedatectl
```

## Bootstrap node

Before installing DC/OS, you must ensure that your bootstrap node has the following prerequisites.

**Important:** 

* If you specify `exhibitor_storage_backend: zookeeper`, the bootstrap node is a permanent part of your cluster. With `exhibitor_storage_backend: zookeeper` the leader state and leader election of your Mesos masters is maintained in Exhibitor ZooKeeper on the bootstrap node. For more information, see the configuration parameter [documentation](/docs/1.10/installing/oss/custom/configuration/configuration-parameters/).
* The bootstrap node must be separate from your cluster nodes.

### DC/OS setup file

Download and save the [DC/OS setup file][3] to your bootstrap node. This file is used to create your customized DC/OS build file.

### Docker NGINX (advanced installer)

For advanced install only, install the Docker NGINX image with this command:

```bash
sudo docker pull nginx
```

## Cluster nodes

For advanced install only, your cluster nodes must have the following prerequisites. The cluster nodes are designated as Mesos masters and agents during installation.

### Data compression (advanced installer)

You must have the <a href="http://www.info-zip.org/UnZip.html" target="_blank">UnZip</a>, <a href="https://www.gnu.org/software/tar/" target="_blank">GNU tar</a>, and <a href="http://tukaani.org/xz/" target="_blank">XZ Utils</a> data compression utilities installed on your cluster nodes.

To install these utilities on CentOS7 and RHEL7:

```bash
sudo yum install -y tar xz unzip curl ipset
```


### Cluster permissions (advanced installer)

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

    **Tip:** It may take a few minutes for your node to come back online after reboot.

### Locale requirements
You must set the `LC_ALL` and `LANG` environment variables to `en_US.utf-8`.  

# Next steps

- [GUI DC/OS Installation Guide][4]
- [CLI DC/OS Installation Guide][1]
- [Advanced DC/OS Installation Guide][5]

[1]: /docs/1.10/installing/oss/custom/cli/
[2]: /docs/1.10/installing/oss/custom/system-requirements/install-docker-centos/
[3]: https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh
[4]: /docs/1.10/installing/oss/custom/gui/
[5]: /docs/1.10/installing/oss/custom/advanced/
