---
layout: layout.pug
navigationTitle: 故障域感知和容量扩展
title: 故障域感知和容量扩展
menuWeight: 3
excerpt: 了解故障域

enterprise: false
---


故障域是网络的中（例如数据中心的机架或整个数据中心）容易在关键设备或系统出现故障时遭到损坏的一部分。故障域中的所有实例都有类似的故障和延迟特性。相同故障域中的实例都受到域内故障事件的影响。将实例放置在多个故障域中可降低故障影响所有实例的风险。

DC/OS 现在支持树立故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。DC/OS 目前支持 Mesos 的 2 级分层故障域：分区和分域。

# 分区故障域
分区故障域共用同一分域，所以提供中度故障隔离。然而，同一分域内分域之间的网络延迟较低（通常 ＜ 10ms）。对于本地部署而言，一个分区就是一个实体数据中心机架。对于公共云部署而言，分区就是大多数云提供商规定的“可用区”概念。如果您的目标是高可用性，且/或您的服务具有延迟敏感性，请将您的实例放在同一个分域，并将它们均衡分配到各个分区。

# 分域故障域

分域故障域提供最高故障隔离，尽管分域间网络延迟较高。对于本地部署而言，一个分域可能是一个数据中心。对于公共云部署而言，大多数云提供商都会提出“分域”概念。可以根据可用容量在特定分域部署实例。

## 本地和远程分域

-**本地分域**是运行 Mesos 管理节点的分域。
-**远程区域** 仅包含 Mesos 代理节点。远程分域和本地分域通常都存在高延迟。

# 安装

请考虑集群中服务的未来需求。您必须在安装时就定义分域和分区,尽管安装后可以在分域和分区中添加或删除节点。如果需要更新故障域检测脚本，就必须重新安装 DC/OS 。

Mesos 管理节点必须位于同一分域，因为否则它们之间的延迟就会过高。不过为了容错，它们应该被分散到不同分区。

分域之间的延迟必须小于 100ms。

## 安装步骤

1. 创建故障域检测脚本以在每个节点上运行，从而检测节点的故障域（仅限企业）。安装过程中此脚本的输出被传递到 Mesos。

脚本输出的推荐格式为：

  ```json
  {
      "fault_domain": {
          "region": {
              "name": "<region-name>"
          },
          "zone": {
              "name": "<zone-name>"
          }
      }
  }
  ```

我们提供 [AWS 和 Azure 节点的故障域检测脚本](https://github.com/dcos/dcos/tree/master/gen/fault-domain-detect)。对于具有 aws 节点和 azure 节点的集群，可将两者组合为一个脚本。可以使用这些模型为本地集群创建故障域检测脚本。

<p class="message--important"><strong>重要信息：</strong>如果在环境中使用代理，此脚本将不起作用。如果使用代理，则必须进行修改。</p>

2. 将此脚本添加到 bootstrap 节点的 `genconf` 文件夹。[更多信息](/cn/1.11/installing/production/deploying-dcos/installation/#create-a-fault-domain-detection-script)。

1. [安装 DC/OS ](/cn/1.11/installing/production/deploying-dcos/installation/)。

1. 测试安装。

 在 DC/OS  CLI 中输入 `dcos node`。您将看到类似以下内容的输出，其中列出了各个节点的分域和分区：

  ```bash
  HOSTNAME        IP                         ID                    TYPE               REGION      ZONE
  10.0.3.188   10.0.3.188  a2ea1578-22ee-430e-aeb8-82ee1b74d88a-S1  agent            us-east-1  us-east-1a
  10.0.7.224   10.0.7.224  a2ea1578-22ee-430e-aeb8-82ee1b74d88a-S0  agent            us-east-1  us-east-1b
  master.mesos.  10.0.5.41                     N/A                    master              N/A         N/A
  master.mesos.  10.0.6.95                     N/A                    master           us-east-1  us-east-1b
  master.mesos.  10.0.7.111    a2ea1578-22ee-430e-aeb8-82ee1b74d88a   master (leader)  us-east-1  us-east-1c
  ```


或者，单击 DC/OS  GUI 中的 **节点** 选项卡。节点表将显示每个代理的分域和分区栏。

# 使用

用户创建的 Marathon 服务和 Pod 支持树立分区和分域感知。以下 DC/OS 数据服务的 beta 版本支持树立分区感知：Cassandra、Elastic、HDFS、Kafka 和 Spark。请参阅各个服务文档，了解配置 DC/OS 数据服务分区感知的更多信息。

## Marathon 服务和 Pod

在 Marathon 服务或 pod 定义中，可以使用 [布局约束](/cn/1.11/deploying-services/marathon-constraints/)，以便：

- 为您的服务或 pod 指定分区和分域，从而将所有实例都安排在该分域和分区。

- 指定没有具体分区的分域，使给定服务或 Pod 的所有实例都安排在该分域（但不一定在同一分区）。

## 布局约束指南

- 如果您的服务或 pod 定义中没有指定分域，则仅为分域安排实例，因为本地分域和远程分域之间存在高延迟。实例将不会被安排给本地分域以外的代理，除明确指明应在远程区域启动的实例之外。

- 如果指定没有特定分区的分域，则实例将会在给定分域中的任何代理上被安排。

- 如果同时指定了分域和分区，则可在给定分域和分区内的任何代理节点安排实例，但不可安排到任何其他分域或分区内。

- 如果指定主机名 `UNIQUE` 限制，则远程分域也遵守该约束。

## 示例

假设您有跨 3 个分域的 Mesos 集群：`aws-us-east1`、`aws-us-east2` 和 `local`。每个分域都有分区 `a`、`b`、`c`、`d`。

### 仅指定远程分域

```json
{
  "instances": 5,
  "constraints": [
    ["@region", "IS", "aws-us-east1"]
  ]
}
```

- 不在本地分域启动任何实例。
- 5 个实例全都在 `aws-us-east1` 分域启动。

### 在同一分域内均衡放置

```json
{
   ...
  "instances": 6,
  "constraints": [
    ["@region", "IS", "aws-us-east1"],
    ["@zone", "GROUP_BY", "4"]
  ]
}
```

- 实例全都在 `aws-us-east1` 分域启动并均匀划分到 `aws-us-east1` 的分区 `a`、`b`、`c`、`d`。

### 增加集群容量

要增加容量，请 [添加新代理](/cn/1.11/administering-clusters/add-a-node/) 到远程分域或集群的分域，然后更新服务以在相应的一个或多个分域启动实例。

<p class="message--note"><strong>注意: </strong> 您无法将服务配置为在多个分域运行。</p>
