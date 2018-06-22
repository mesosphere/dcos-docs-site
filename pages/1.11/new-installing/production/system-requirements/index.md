---
layout: layout.pug
navigationTitle:  System Requirements
title: System Requirements
menuWeight: 5
excerpt:

---

The basic requirements for all installation methods are below:

- All ports are open within a cluster. 
- External ports are 80 and 443.


# Hardware Prerequisites

The hardware prerequisites are a single bootstrap node, Mesos master nodes, and Mesos agent nodes.

## Bootstrap node

*  DC/OS installation is run on a Bootstrap node. 1 node with 2 cores, 16 GB RAM, 60 GB HDD. 
*  The bootstrap node is only used during the installation and upgrade process, so there are no specific recommendations for high performance storage or separated mount points.

 **Important:** The bootstrap node must be separate from your cluster nodes.

## Cluster nodes

The cluster nodes are designated Mesos masters and agents during installation.

The supported operating systems and environments are listed on [version policy page](https://docs.mesosphere.com/version-policy/).

DC/OS is installed to `/opt/mesosphere` on cluster nodes. `/opt/mesosphere` may be created prior to installing DC/OS, but it must be either an empty directory or a symlink to an empty directory. DC/OS may be installed on a separate volume mount by creating an empty directory on the mounted volume, creating a symlink at `/opt/mesosphere` that targets the empty directory, and then installing DC/OS.


### Master nodes

The table below shows the master node hardware requirements.

|             | Minimum   | Recommended |
|-------------|-----------|-------------|
| Nodes       | 1*         | 3 or 5     |
| Processor   | 4 cores   | 4 cores     |
| Memory      | 32 GB RAM | 32 GB RAM   |
| Hard disk   | 120 GB    | 120 GB      |
&ast; For business critical deployments, three master nodes are required rather than one master node.

There are many mixed workloads on the masters. Workloads that are expected to be continuously available or considered business critical should only be run on a DC/OS cluster with at least 3 masters. For more information about high availability requirements see the [High Availability documentation][0].

[0]: https://docs.mesosphere.com/1.10/overview/high-availability/


Examples of mixed workloads on the masters are Mesos replicated logs and ZooKeeper. Some of these require fsync()ing quite often and this can generate a lot of very expensive random I/O. 

The following is recommended:

- Solid-state drive (SSD)
- RAID controllers with a BBU
- RAID controller cache configured in writeback mode
- If separation of storage mount points is possible, the following storage mount points are recommended on the master node. These recommendations will optimize the performance of a busy DC/OS cluster by isolating the I/O of various services.
  | Directory Path | Description |
  |:-------------- | :---------- |
  | _/var/lib/dcos_ | A majority of the I/O on the master nodes will occur within this directory structure. If you are planning a cluster with hundreds of nodes or intend to have a high rate of deploying and deleting workloads, isolating this directory to dedicated SSD storage is recommended.

- Further breaking down this directory structure into individual mount points for specific services is recommended for a cluster which will grow to thousands of nodes.

  | Directory Path | Description |
  |:-------------- | :---------- |
  | _/var/lib/dcos/mesos/master_ | Logging directories |
  | _/var/lib/dcos/cockroach_ | CockroachDB |
  | _/var/lib/dcos/navstar_ | Mnesia database |
  | _/var/lib/dcos/secrets_ | Secrets vault [enterprise type="inline" size="small" /] | 
  | _/var/lib/dcos/exhibitor_ | Zookeeper database |

### Agent nodes

The table below shows the agent node hardware requirements.

|             | Minimum   | Recommended |
|-------------|-----------|-------------|
| Nodes       | 1         | 6 or more   |
| Processor   | 2 cores   | 2 cores     |
| Memory      | 16 GB RAM | 16 GB RAM   |
| Hard disk   | 60 GB     | 60 GB       |

The agent nodes must also have the following:

- A `/var` directory with 10 GB or more of free space. This directory is used by the sandbox for both [Docker and DC/OS Universal container runtime](/1.11/deploying-services/containerizers/).
- Network Access to a public Docker repository or to an internal Docker registry.

*   On RHEL 7 and CentOS 7, `firewalld` must be stopped and disabled. It is a known <a href="https://github.com/docker/docker/issues/16137" target="_blank">Docker issue</a> that `firewalld` interacts poorly with Docker. For more information, see the <a href="https://docs.docker.com/v1.6/installation/centos/#firewalld" target="_blank">Docker CentOS firewalld</a> documentation.

    ```bash
    sudo systemctl stop firewalld && sudo systemctl disable firewalld
    ```

*   The Mesos master and agent persistent information of the cluster is stored in the `var/lib/mesos` directory.

    **Important:** Do not remotely mount `/var/lib/mesos` or the Docker storage directory (by default `/var/lib/docker`).

*   Do not mount `/tmp` with `noexec`. This will prevent Exhibitor and ZooKeeper from running.

*   It is recommended to isolate `var/lib/mesos` directory to dedicated SSD storage; when you want to have a cluster with hundreds of agent nodes or include a high rate of deploying and deleting services.

    | Directory Path | Description |
    |:-------------- | :---------- |
    | _/var/lib/mesos/_ | Most of the I/O from the Agent nodes will be directed at this directory. Also, The disk space that Apache Mesos advertises in its UI is the sum of the space advertised by filesystem(s) underpinning _/var/lib/mesos_ |

*  Further breaking down this directory structure into individual mount points for specific services is recommended for a cluster which will grow to thousands of nodes.

   | Directory path | Description |
   |:-------------- |:----------- |
   | _/var/lib/mesos/slave/slaves_ | sandbox directories for tasks |
   | _/var/lib/mesos/slave/volumes_ | Used by frameworks that consume ROOT persistent volumes |
   | _/var/lib/mesos/docker/store_ | Stores Docker image layers that are used to provision URC containers |
   | _/var/lib/docker_ | Stores Docker image layers that are used to provision Docker containers |

### Port and Protocol Configuration

*   Secure shell (SSH) must be enabled on all nodes. 
*   Internet Control Message Protocol (ICMP) must be enabled on all nodes. 
*   All hostnames (FQDN and short hostnames) must be resolvable in DNS; both forward and reverse lookups must succeed. [enterprise type="inline" size="small" /]
*   Each node is network accessible from the bootstrap node. 
*   Each node has unfettered IP-to-IP connectivity from itself to all nodes in the DC/OS cluster. 
*   All ports should be open for communication from the master nodes to the agent nodes and vice versa. [enterprise type="inline" size="small" /]
*   UDP must be open for ingress to port 53 on the masters. To attach to a cluster, the Mesos agent node service (`dcos-mesos-slave`) uses this port to find `leader.mesos`.

### High Speed Internet Access

High speed internet access is recommended for DC/OS installation. A minimum 10 MBit per second is required for DC/OS services. The installation of some DC/OS services will fail if the artifact download time exceeds the value of MESOS_EXECUTOR_REGISTRATION_TIMEOUT within the file `/opt/mesosphere/etc/mesos-slave-common`. The default value for MESOS_EXECUTOR_REGISTRATION_TIMEOUT is 10 minutes.
*   