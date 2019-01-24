---
layout: layout.pug
navigationTitle: Configuration
excerpt: Configuration options for the DC/OS Apache HDFS service
title: Configuration
menuWeight: 20
model: /services/hdfs/data.yml
render: mustache
---

#include /services/include/configuration-install-with-options.tmpl
#include /services/include/configuration-service-settings.tmpl
#include /services/include/configuration-regions.tmpl

## Node Configuration

The node configuration objects correspond to the configuration for nodes in the {{ model.techShortName }} cluster. Node configuration **must** be specified during installation and **may** be modified during configuration updates. All of the properties except `disk` and `disk_type` may be modified during the configuration update process.

### A Note on Memory Configuration

As part of the configuration for each node type, the amount of memory in MB allocated to the node can be specified. This value **must** be larger than the specified maximum heap size for the given node type. Make sure to allocate enough space for additional memory used by the JVM and other overhead. A good rule of thumb is allocate twice as much memory as the size of the heap (set using either `hdfs.hadoop_heapsize` or `<node type>.hadoop_<node type>node_opts`).

### A Note on Disk Types

As already noted, the disk size and type specifications cannot be modified after initial installation. Furthermore, the following disk volume types are available:

* `ROOT`: Data is stored on the same volume as the agent work directory and the node tasks use the configured amount of disk space.
* `MOUNT`: Data will be stored on a dedicated, operator-formatted volume attached to the agent. Dedicated MOUNT volumes have performance advantages and a disk error on these MOUNT volumes will be correctly reported to {{ model.techShortName }}.

## {{ model.techShortName }} File System Configuration

The {{ model.techShortName }} file system network configuration, permissions, and compression are configured via the `hdfs` JSON object. Once these properties are set at installation time they can not be reconfigured.

## Operating System Configuration

In order for {{ model.techShortName }} to function correctly, you must perform several important configuration modifications to the OS hosting the deployment. {{ model.techShortName }} requires OS-level configuration settings typical of a production storage server.

<table class="table">

  <tr>
    <th>File</th>
    <th>Setting</th>
    <th>Value</th>
    <th>Reason</th>
  </tr>

   <tr>
    <td>/etc/sysctl.conf</td>
    <td>vm.swappiness</td>
    <td>0</td>
    <td>If the OS swaps out the HDFS processes, they can fail to respond to RPC requests, resulting in the process being marked `down` by the cluster. This can be particularly troublesome for name nodes and journal nodes.</td>
  </tr>

  <tr>
    <td>/etc/security/limits.conf</td>
    <td>nofile</td>
    <td>unlimited</td>
    <td>If this value is too low, a job that operate on the HDFS cluster may fail due to too may open file handles.</td>
  </tr>

  <tr>
    <td>/etc/security/limits.conf, /etc/security/limits.d/90-nproc.conf</td>
    <td>nproc</td>
    <td>32768</td>
    <td>An HDFS node spawns many threads, which go towards kernel nproc count. If nproc is not set appropriately, the node will be killed.</td>
  </tr>

</table>
