---
layout: layout.pug
title: 在 DC/OS 上运行有状态服务
navigationTitle: 在 DC/OS 上运行有状态服务
menuWeight: 2
excerpt: 教程 - 在 DC/OS 上运行有状态服务
---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</td> </tr> </table>

本教程向您展示如何在 DC/OS 上安装和运行有状态服务。有状态服务对持久数据起作用。每次启动时，简单**无**状态服务在空沙盒中运行。相反，**有**状态服务使用驻留在集群中代理节点上的持久卷，直到被明确销毁。

这些持久卷安装在任务的 Mesos 沙盒中，因此可以连续被服务访问。DC/OS 为每个任务创建持久卷，并且动态保留运行任务所需的所有资源。这样，DC/OS 可确保重新启动服务，并在需要时重用其数据。这对数据库、缓存和其他数据感知服务非常有用。

如果您打算运行的服务不会自行复制数据，则需要处理备份或采用合适的复制策略。

有状态服务利用两个基础的 Mesos 功能：

- [动态保留](http://mesos.apache.org/documentation/latest/reservation/)，含保留标签
- [持久卷](http://mesos.apache.org/documentation/latest/persistent-volume/)

**时间估计**：

大约 20 分钟。

**目标受众**：

本教程适用于希望在 DC/OS 上运行有状态服务的开发人员。**注意：**DC/OS 持久卷功能仍处于测试阶段，在没有数据复制策略来防止数据丢失的情况下尚未准备好进行生产使用。

## 先决条件

* [已安装 DC/OS][1]
- [已安装 DC/OS CLI]
* 集群大小：至少一个代理节点，具有 1 个 CPU、1 GB RAM 和 1000 MB 可用磁盘空间。

## 安装有状态服务 (PostgreSQL)

这是启动官方 PostgreSQL Docker 镜像的 DC/OS 服务定义 JSON 。

```json
{
  "id": "/postgres",
  "cpus": 1,
  "mem": 1024,
  "instances": 1,
  "networks": [
    { "mode": "container/bridge" }
  ],
  "container": {
    "type": "DOCKER",
    "volumes": [
      {
        "containerPath": "pgdata",
        "mode": "RW",
        "persistent": {
          "size": 100
        }
      }
    ],
    "docker": {
      "image": "postgres:9.5"
    },
    "portMappings": [
      {
        "containerPort": 5432,
        "hostPort": 0,
        "protocol": "tcp",
        "labels": {
          "VIP_0": "5.4.3.2:5432"
        }
      }
    ]
  },
  "env": {
    "POSTGRES_PASSWORD": "DC/OS_ROCKS",
    "PGDATA": "/mnt/mesos/sandbox/pgdata"
  },
  "healthChecks": [
    {
      "protocol": "TCP",
      "portIndex": 0,
      "gracePeriodSeconds": 300,
      "intervalSeconds": 60,
      "timeoutSeconds": 20,
      "maxConsecutiveFailures": 3,
      "ignoreHttp1xx": false
    }
  ],
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  }
}
```

注意 `volumes` 字段，它表示 `postgres` 用于其数据的持久卷。即使任务终止并重新启动，它也会恢复该卷，数据也不会丢失。

接下来，将此[服务][4] 添加到您的集群：

```
dcos marathon app add /1.11/tutorials/stateful-services/postgres.marathon.json
```

服务已安排且 Docker 容器已下载后，postgres 将变得运行良好并且可以使用。您可以从 DC/OS CLI 验证这一点：

```
dcos marathon task list
APP        HEALTHY          STARTED              HOST     ID
/postgres    True   2016-04-13T17:25:08.301Z  10.0.1.223  postgres.f2419e31-018a-11e6-b721-0261677b407a
```

## 停止服务

要停止服务：

```
dcos marathon app stop postgres
```

此命令将 `instances` 计数缩减到 0 并终止所有正在运行的任务。如果再次检查任务列表，您会注意到任务仍在那里。该列表提供了有关其被放置的代理节点及其已连接的持久卷的信息，但没有 `startedAt` 值的信息。这允许您使用相同的元数据重新启动服务。

```
dcos marathon task list
APP        HEALTHY  STARTED     HOST     ID
/postgres    True     N/A    10.0.1.223  postgres.f2419e31-018a-11e6-b721-0261677b407a
```

## 重启

再次启动有状态服务：

```
dcos marathon app start postgres
```

先前 `postgres` 任务的元数据用于启动新任务，该任务接管先前停止的服务的预约和卷。重复上一步的命令，再次检查正在运行的任务。您将看到运行的服务任务使用与前一服务任务相同的数据。

## 清除

若要在安装有状态服务之前恢复集群状态，请删除该服务：

```
dcos marathon app remove postgres
```

## 附录

有关 DC/OS 中有状态服务的更多信息，请访问[文档的存储部分](/cn/1.11/storage/)。


[1]: /1.11/installing/
[2]: /1.11/cli/install/
[4]: postgres.marathon.json
