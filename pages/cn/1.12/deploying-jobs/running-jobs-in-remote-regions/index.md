---
layout: layout.pug
navigationTitle: 在远程区域运行作业
title: 在远程区域运行作业
menuWeight: 3

enterprise: false
---

如 [故障域感知和服务容量扩展](/cn/1.12/deploying-services/fault-domain-awareness/)中所述，DC/OS 支持故障域感知。如果您的群集配置在多个区域或分区上，则可以安排 Metronome 作业在远程区域或特定分区中运行。

# 本地和远程分域

-**本地分域**是运行 Mesos 管理节点的分域。
-**远程区域** 仅包含 Mesos 代理节点。

# 使用

## 布局约束指南

- 如果您的作业中未指定任何区域，则作业将安排为仅在本地区域中运行。除明确指明应在远程区域启动的实例之外，不会为本地分域以外的代理安排作业运行。

- 如果指定没有特定分区的分域，则在给定分域中的任何代理上运行作业。

- 如果同时指定了分域和分区，则可在给定分域和分区内的任何代理节点运行作业，但不可安排到任何其他分域或分区内。


## 示例

有关如何配置故障域感知群集的说明，请参见[服务的故障域感知和容量扩展](/cn/1.12/deploying-services/fault-domain-awareness/) 中的“安装”。

假设您有跨 3 个分域的 Mesos 群集：`aws-us-east1`、`aws-us-east2` 和 `local`。每个分域都有分区 `a`、`b`、`c`、`d`。

### 在远程区域和特定分区运行作业

以下作业使用 [Metronome 约束](../metronome-constraints/)指定作业应在区域 `aws-us-east1`、分区 `b` 中运行

```json
{
  "description": "Remote Sleeper",
  "id": "sleeper-remote",
  "run": {
    "cmd": "sleep 60",
    "cpus": 0.05,
    "mem": 32,
    "docker": {"image": "alpine"},
    "maxLaunchDelaySeconds": 3600,
    "placement": {
      "constraints": [
        {
          "attribute": "@region",
          "operator": "EQ",
          "value": "aws-us-east1"
        },
        {
          "attribute": "@zone",
          "operator": "EQ",
          "value": "b"
        },
      ]
    }
  }
}
```

