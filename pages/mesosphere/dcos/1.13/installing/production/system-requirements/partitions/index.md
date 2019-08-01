---
layout: layout.pug
title: Disk Partitions
navigationTitle: Disk Partitions
menuWeight: 16
excerpt: Planning disk partitioning for a DC/OS cluster
---
In planning system resources for DC/OS, you should pay particular attention to how disks are partitioned. To prevent DC/OS from running low on disk space or having disk space contention adversely affect cluster operations, you should create separate partitions to isolate I/O-intensive services such as the `journald` logging facility process and Mesos sandbox from critical infrastructure services such as ZooKeeper and CockroachDB. Using separate partitions helps to ensure fault-tolerant cluster operations and limits the scope of disk space errors (ENOSPC - no space left on device errors) to recoverable issues such as tasks failing to deploy.

# Recommended partition layout
You can use the following guidelines to plan disk partitioning for replicated state stores and persistent configuration override locations under `/var/lib/dcos`.

## Master nodes
For the master nodes, the recommended practice is to host the `/var/lib/dcos` directory on a separate partition backed by **fast**, **locally-attached** storage (SSD/NVMe). Using this separate partition on the master nodes enables the following replicated state stores and persistent configuration override files to be stored under the `/var/lib/dcos` directory:
- Mesos Paxos replicated log: /var/lib/dcos/mesos/master/replicated_log
- Navstar Overlay replicated log: /var/lib/dcos/mesos/master/overlay_replicated_log
- CockroachDB distributed database: /var/lib/dcos/cockroach
- Navstar Mnesia distributed database: /var/lib/dcos/navstar/mnesia
- Navstar Lashup distributed database: /var/lib/dcos/navstar/lashup
- Secrets vault: /var/lib/dcos/secrets/vault
- Zookeeper distributed database: /var/lib/dcos/exhibitor/zookeeper
- History Service cache: /var/lib/dcos/dcos-history

## Agent nodes
On the agent nodes, you should use separate partitions for the following directories under `/var/lib/mesos`:

- `/var/lib/mesos` - You should always host the `/var/lib/mesos` directory on a separate partition. Keep in mind that the disk space that Apache Mesos advertises in its UI is the sum of the space provided by the file system(s) underpinning the `/var/lib/mesos` directory, including any MOUNT volumes (`/dcos/volume<n>`).

- `/var/lib/mesos/slave/slaves` - This directory hosts the sandbox directories for tasks. You should use a separate partition for this directory, if possible.

- `/var/lib/mesos/slave/volumes` - This directory is used by frameworks that consume ROOT persistent volumes. You should use a separate partition for this directory, if possible.

- `/var/lib/mesos/slave/store/docker` - This directory stores Docker image layers that are used to provision UCR containers. You should use a separate partition for this directory, if possible.

In most cases, agents do not require a separate partition for the persistent configuration override files stored in the `/var/lib/dcos` directory. You should, however, be sure to allow enough disk space partitions for the following configuration files on agent nodes:
- `/var/lib/dcos/mesos-slave-common`
- `/var/lib/dcos/mesos-resources`

<p class="message--note"><strong>NOTE: </strong>For overall cluster health, keep in mind that the `/var/lib/mesos/slave/meta/resources`, `/var/lib/mesos/slave/volumes` and `/dcos/volume<n>` MOUNT directories must be available (or restored from backups) for reservations to be re-advertised to the frameworks. Providing separate partitions to ensure the availability of these directories and the resource offers allows operations and tasks to recover successfully.

## Other directories and partitions
In addition to the master- and agent-specific partitions, you should consider using a separate partition for each of the following directories:

- `/var/lib/docker` - This directory stores Docker image layers and is used by containers launched with the Docker engine.

- `/dcos/volume<n>` - These volume-identified directories--for example, `/dcos/volume0` and `/dcos/volume1`--are used by frameworks that consume MOUNT persistent volumes.

- `/opt/mesosphere` - This directory contains the DC/OS binaries, libraries, and cluster configuration files. If the DC/OS cluster is version 1.11, or newer, you should place this directory in its own partition. Because the size of this directory tends to increase with each DC/OS upgrade and there is no automatic clean-up of old files, you should monitor disk space usage for the `/opt/mesosphere` directory carefully. In addition to monitoring the directory, you might want to create a custom script to periodically remove unused or out-of-date files.

All of these file system paths and mount points should be on their own isolated input/output (IO) path, down to the physical devices where they are located to minimize the I/O competition.
