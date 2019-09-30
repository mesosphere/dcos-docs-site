---
layout: layout.pug
navigationTitle: Configuration
excerpt: Configuration options for the DC/OS Apache HDFS service
title: Configuration
menuWeight: 20
model: /mesosphere/dcos/services/hdfs/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/configuration-install-with-options.tmpl
#include /mesosphere/dcos/services/include/configuration-service-settings.tmpl
#include /mesosphere/dcos/services/include/configuration-regions.tmpl

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
    <td>If the OS swaps out the HDFS processes, they can fail to respond to RPC requests, resulting in the process being marked DOWN by the cluster. This can be particularly troublesome for name nodes and journal nodes.</td>
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

## Using Volume Profiles

Volume profiles are used to classify volumes. For example, users can group SSDs into a “fast” profile and group HDDs into a “slow” profile. 

<p class="message--note"><strong>NOTE: </strong>Volume profiles are immutable and therefore cannot contain references to specific devices, nodes or other ephemeral identifiers.</p> 

[DC/OS Storage Service (DSS)](https://docs.d2iq.com/mesosphere/dcos/services/storage/1.0.0/) is a service that manages volumes, volume profiles, volume providers, and storage devices in a DC/OS cluster.

Once the DC/OS cluster is running and volume profiles are created, you can deploy Hdfs with the following configs:

```bash
cat > hdfs-options.json <<EOF
{
    "journal_node": {
        "volume_profile": "hdfs",
        "disk_type": "MOUNT"
    },
    "name_node": {
        "volume_profile": "hdfs",
        "disk_type": "MOUNT"
    },
    "data_node": {
        "volume_profile": "hdfs",
        "disk_type": "MOUNT"
    }
}
EOF
```
```
dcos package install hdfs --options=hdfs-options.json
```
<p class="message--note"><strong>NOTE: </strong>Hdfs will be configured to look for <code>MOUNT</code> volumes with the <code>hdfs</code> profile.</p> 

Once the Hdfs service finishes deploying its tasks will be running with the specified volume profiles.

```bash
dcos hdfs update status
deploy (serial strategy) (COMPLETE)
├─ journal (serial strategy) (COMPLETE)
│  ├─ journal-0:[node] (COMPLETE)
│  ├─ journal-1:[node] (COMPLETE)
│  └─ journal-2:[node] (COMPLETE)
├─ name (serial strategy) (COMPLETE)
│  ├─ name-0:[node, zkfc] (COMPLETE)
│  └─ name-1:[node, zkfc] (COMPLETE)
└─ data (serial strategy) (COMPLETE)
   ├─ data-0:[node] (COMPLETE)
   ├─ data-1:[node] (COMPLETE)
   └─ data-2:[node] (COMPLETE)
```
