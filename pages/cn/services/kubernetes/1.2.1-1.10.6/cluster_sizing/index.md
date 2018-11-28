---
layout: layout.pug
navigationTitle: 集群大小
title: 集群大小
menuWeight: 45
excerpt: 规划和调整集群的大小
---

DC/OS Kubernetes 支持符合以下所有标准的集群：

* 不超过 100 个节点
* 总共不超过 10000 个 pod
* 总共不超过 20000 个容器
* 每个节点不超过 100 个 pod
* 节点上运行的每个核心不超过 10 个 pod

请注意，这些值基于轻型 pod 或 `nginx` 等容器。
由集群操作员针对其特定工作负载，正确设置 Kubernetes 集群
的大小。

## 计划

在部署 Kubernetes 集群之前，请务必考虑
您需要的集群大小。DC/OS 集群操作员负责
确保 DC/OS 集群中有足够的可用资源，以满足
Kubernetes 集群部署。

您可以通过两种方式来设置集群的大小：

### 节点数

您需要多少个节点？ 从此，您可以计算出
您的 Kubernetes 集群支持的 pod 的最大数量：

 节点数 * 100 = pod 的最大数量

您可以遵循 [示例包选项的指南与使用](#sizing) 来
部署您的 Kubernetes 集群部署。

### pod 数量

您需要多少个 pod？ 从此，您可以计算出
Kubernetes 集群所需的最小节点数：

 pod 数量 * 100 = 最小节点数

我们建议您在节点上拥有备用容量，以确保集群稳定性。
集群操作员负责确保 DC/OS
集群和 Kubernetes 集群都具有足够的容量。您可以遵循 [示例包选项的指南与使用](#sizing) 来部署的  Kubernetes 集群部署。

## 大小

此大小调整指南假设通过将
 `kubernetes.high_availability` 选项设置为 `true`，可部署高可用集群。以下配置是示例，
集群操作员负责验证
其部署的配置。

随着节点数量的增加，Kubernetes 集群上
可部署的 pod 数量也会增加，那么正确扩展控制平面组件
（`etcd`、API 服务器、调度器和控制器管理器）就非常重要。一般而言，
`etcd` API 服务器将受益于获得更多资源
（参阅 [以下](#etcd)，以了解有关 [`etcd`](#etcd)
部署的特定建议）。

### 最多 10 个节点

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

### 最多 50 个节点

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

### 最多 100 个节点

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

## 提高性能

### etcd

Kubernetes 使用 [`etcd`](https://coreos.com/etcd/) 作为数据存储，
etcd 性能的提高有助于大幅度提升
Kubernetes 集群的性能和稳定性 。

DC/OS Kubernetes 正确配置 `etcd` 您集群
的大小，但是为了获得 `etcd` 的最佳性能，必须使用
快速磁盘。因此，如果可以，建议通过固态硬盘备份 `etcd` 的
存储。这也是 DC/OS 集群操作员的责任。
