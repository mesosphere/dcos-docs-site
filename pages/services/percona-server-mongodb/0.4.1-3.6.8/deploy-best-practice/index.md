---
layout: layout.pug
navigationTitle:  Deployment Best Practices
title: Deployment Best Practices
menuWeight: 64
excerpt: Best practices for deploying DC/OS Percona Server for MongoDB
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

# Minimum {{ model.dbName }} Node Requirements

The following resources are the service default, recommended for development and testing only:
- 3 x {{ model.dbName }} Nodes `count`
- 1 x CPUs per node
- 1024MB RAM per node
- 1000MB Disk per node, ['ROOT' Disk-type](https://docs.mesosphere.com/1.10/storage/mount-disk-resources/)

# Production {{ model.dbName }} Node Requirements

The following resources are recommended for a production deployment:
- 3 x {{ model.dbName }} Nodes `count`
- 4 x CPUs per node
- 4096MB RAM per node
- 8000MB Disk per node, [MOUNT Disk-type](https://docs.mesosphere.com/1.10/storage/mount-disk-resources/)
- ['XFS' filesystem](https://en.wikipedia.org/wiki/XFS)

<p class="message--warning"><strong>WARNING: </strong> Disks cannot be resized after deployment. Adjust the disk space requirements for the volume of your use case.</p> 


# Production DC/OS Agent Node

The recommendations in this section apply to the DC/OS Agent nodes running the {{ model.techName }} service.

## Block Device / Storage

### Disk Recommendations

{{ model.dbName }} performs best when using disks with fast read and write patterns.

We recommend the following:
- Always prefer locally-attached storage. Remote storage adds points of failure, add latency/overhead to block requests and are more complicated to troubleshoot.
- For redundant disk arrays, choose RAID10 (0+1). This RAID level provides the best performance and redundancy balance.
  - Enable RAID controller caching when using a battery-backed controller.
  - {{ model.dbName }} implements its own redundancy in storage, via replication. Keep this in mind when adding possibly-duplicated redundancy to storage.
- For better performance, use solid-state disks vs. spinning disks, or allocate more memory to cache more data, reducing the use of disks.

### Filesystem
The ['XFS' filesystem](https://en.wikipedia.org/wiki/XFS) is required when using [WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/), the default [{{ model.dbName }} Storage Engine](https://docs.mongodb.com/manual/core/storage-engines/). Serious stability problems have been observed when running WiredTiger on other filesystems.

We **strongly recommend** that you do not use the ['EXT3' filesystem](https://en.wikipedia.org/wiki/Ext3) with {{ model.dbName }}, due to poor pre-allocation performance. When in doubt, always use the ['XFS' filesystem](https://en.wikipedia.org/wiki/XFS).

### Read-Ahead and I/O Scheduler

For block device read-ahead, we recommend a setting of 32 sectors (=16KB) for most {{ model.dbName }} workloads. For the kernel-level I/O Scheduler, we recommend using "deadline". Both the IO scheduler and read-ahead can be changed by adding a file to the udev configuration in the `/etc/udev/rules.d` directory. This example assumes the block device serving mongo data is named `/dev/sda`. In the example, "deadline" is set as the IO scheduler and 16kb/32-sectors as the read-ahead:

```shell
# set deadline scheduler and 16kb read-ahead for /dev/sda
ACTION=="add|change", KERNEL=="sda", ATTR{queue/scheduler}="deadline", ATTR{bdi/read_ahead_kb}="16"
```

## Linux / Operating System

### Linux Kernel

Your Linux operating system should at minimum use Linux 2.6.36 and Glibc 2.13 or later. We strongly recommend that you use Linux kernels 3.2 or greater to take advantage of significant optimisations.

### NUMA Architecture

NUMA (Non-Uniform Memory Access) architecture should be disabled on the DC/OS Agent node, as {{ model.dbName }} operates inefficiently when it is enabled. We recommend that you disable NUMA on the DC/OS Agent node. Please consult your operating system or system manual to do this.

### Transparent HugePages

Recent versions of Linux operating systems enable a memory optimization named Transparent HugePages. We recommend that you disable this feature as it does not perform optimally under {{ model.dbName }} (or most other) workloads.

{{ model.dbName }} will log the following warning if Transparent HugePages are enabled:

```shell
2018-03-26T13:47:28.929+0000 I CONTROL  [initandlisten] ** WARNING: /sys/kernel/mm/transparent_hugepage/enabled is 'always'.
2018-03-26T13:47:28.929+0000 I CONTROL  [initandlisten] **        We suggest setting it to 'never'
2018-03-26T13:47:28.929+0000 I CONTROL  [initandlisten]
2018-03-26T13:47:28.929+0000 I CONTROL  [initandlisten] ** WARNING: /sys/kernel/mm/transparent_hugepage/defrag is 'always'.
2018-03-26T13:47:28.929+0000 I CONTROL  [initandlisten] **        We suggest setting it to 'never'
```

Disable THP by adding the following flag to your Linux kernel boot options:

```shell
transparent_hugepage=never
```

Usually this requires changes to the GRUB boot-loader config in the directory `/boot/grub` or `/etc/grub.d` on newer systems. Red Hat covers this in more detail in this article (same method on CentOS): [https://access.redhat.com/solutions/46111](https://access.redhat.com/solutions/46111). Reboot the system after this change to clear out any previous huge pages and ensure that the setting will persist on reboot.

# {{ model.dbName }}

## {{ model.dbName }} User-per-Application

It is important to never give applications access to administrative functions of {{ model.dbName }}. We strongly recommend that you create a user for each application connecting to {{ model.dbName }}. Generally, applications need the ["readWrite" {{ model.dbName }} Privilege](https://docs.mongodb.com/manual/reference/built-in-roles/#readWrite) only to access the database(s) they require. See the "{{ model.dbName }} Administration" section of the documentation for steps on adding an application-level user.

## Links

See more Production recommendations here:
- [{{ model.dbName }} Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)
- ["Tuning Linux for {{ model.dbName }}" - Percona Database Performance Blog](https://www.percona.com/blog/2016/08/12/tuning-linux-for-mongodb/)
