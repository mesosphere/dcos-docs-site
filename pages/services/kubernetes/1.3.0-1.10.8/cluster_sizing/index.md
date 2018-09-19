---
layout: layout.pug
navigationTitle: Cluster Sizing
title: Cluster Sizing
menuWeight: 45
excerpt:
---

DC/OS Kubernetes supports clusters that meet all the following criteria:

* No more than 100 nodes
* No more than 10000 total pods
* No more than 20000 total containers
* No more than 100 pods per node
* No more than 10 pods per core running on a node

Note that these values are based on lightweight pods or containers like nginx.
It is up to the cluster operator to size the Kubernetes cluster appropriately
for their specific workloads.

## Planning

Before deploying your Kubernetes cluster, it is important to consider what size
cluster you require. It is the responsibility of the DC/OS cluster operator to
ensure there are enough resources available in the DC/OS cluster to satisfy the
Kubernetes cluster deployment.

There are two ways to size your cluster:

### Number of nodes

How many nodes do you require? From this, you can work out the maximum number of
pods that your Kubernetes cluster will support:

    Number of nodes * 100 = Maximum number of pods

You can follow the [guide and use the example package options](#sizing) to
deploy your Kubernetes cluster deployment.

### Number of pods

How many pods do you require? From this, you can work out the minimum number of
nodes that your Kubernetes cluster will require:

    Number of pods / 100 = Minimum number of nodes

It is advised to have spare capacity on your nodes to ensure cluster stability.
It is the responsibility of the cluster operator to ensure that both the DC/OS
cluster and the Kubernetes cluster have sufficient capacity.

You can follow the [guide and use the example package options](#sizing) to
deploy your Kubernetes cluster deployment.

## Sizing

This sizing guide assumes that a highly available cluster is deployed by setting
the `kubernetes.high_availability` option to `true`. The configurations below are examples,
and it is the responsibility of the cluster operator to validate the
configurations for their deployment.

As the number of nodes increases, and therefore the number of pods deployable on
the Kubernetes cluster, it is important to scale the control plane components
(etcd, API server, scheduler, and controller manager) appropriately. Generally,
etcd and the API server will benefit most from being given more resources
(although see [below](#etcd) for specific recommendations on the [etcd](#etcd)
deployment).

### Up to 10 nodes

```json
{
  "kubernetes": {
    "high_availability": true,
    "node_count": 10,
    "reserved_resources": {
      "kube_cpus": 4,
      "kube_mem": 20480,
      "kube_disk": 40960,
      "system_mem": 2048,
      "system_cpus": 2
    },
    "public_reserved_resources": {
      "kube_cpus": 4,
      "kube_mem": 20480,
      "kube_disk": 40960,
      "system_mem": 2048,
      "system_cpus": 2
    }
  },
  "etcd": {
    "cpus": 2,
    "mem": 8192
  },
  "scheduler": {
    "cpus": 1,
    "mem": 512
  },
  "controller_manager": {
    "cpus": 1,
    "mem": 512
  },
  "apiserver": {
    "cpus": 1,
    "mem": 4096
  }
}
```

### Up to 50 nodes

```json
{
  "kubernetes": {
    "high_availability": true,
    "node_count": 50,
    "reserved_resources": {
      "kube_cpus": 4,
      "kube_mem": 20480,
      "kube_disk": 40960,
      "system_mem": 2048,
      "system_cpus": 2
    },
    "public_reserved_resources": {
      "kube_cpus": 4,
      "kube_mem": 20480,
      "kube_disk": 40960,
      "system_mem": 2048,
      "system_cpus": 2
    }
  },
  "etcd": {
    "cpus": 2,
    "mem": 8192
  },
  "scheduler": {
    "cpus": 2,
    "mem": 1024
  },
  "controller_manager": {
    "cpus": 2,
    "mem": 1024
  },
  "apiserver": {
    "cpus": 2,
    "mem": 8192
  }
}
```

### Up to 100 nodes

```json
{
  "kubernetes": {
    "high_availability": true,
    "node_count": 100,
    "reserved_resources": {
      "kube_cpus": 4,
      "kube_mem": 20480,
      "kube_disk": 40960,
      "system_mem": 2048,
      "system_cpus": 2
    },
    "public_reserved_resources": {
      "kube_cpus": 4,
      "kube_mem": 20480,
      "kube_disk": 40960,
      "system_mem": 2048,
      "system_cpus": 2
    }
  },
  "etcd": {
    "cpus": 4,
    "mem": 16384
  },
  "scheduler": {
    "cpus": 2,
    "mem": 2048
  },
  "controller_manager": {
    "cpus": 2,
    "mem": 2048
  },
  "apiserver": {
    "cpus": 4,
    "mem": 16384
  }
}
```

## Increasing performance

### etcd

Kubernetes uses [`etcd`](https://coreos.com/etcd/) as the data store, and as
such increasing the performance of etcd can lead to significant performance and
stability benefits to a Kubernetes cluster.

DC/OS Kubernetes configures etcd appropriately for your cluster
size, but in order to get the best performance from etcd, it is important to use
fast disks. Therefore, when possible, it is advised to back etcd's storage with
an SSD. Again, this is the responsibilty of the DC/OS cluster operator.
