---
layout: layout.pug
navigationTitle:  部署第一个应用程序
title: 部署第一个应用程序
excerpt: 介绍如何在群集上定义和部署示例服务实例（第 4 部分）
menuWeight: 4
render: mustache
model：/mesosphere/dcos/1.13/data.yml
---
现在您已了解如何从 DC/OS 包资源库搜索和安装服务，那么您可以开始部署使用该服务的应用程序了。

本教程演示了如何部署一个简单的应用程序，该应用程序连接到您上一个教程中部署的 [Redis] (https://redislabs.com/) 服务。

# 开始之前
在开始本教程前，您应验证以下内容：
- 您可以通过至少一个管理节点和三个代理节点来访问运行中的 [DC/OS 群集](../start-here/)。
- 您可以访问安装了 [DC/OS CLI](../cli/) 的计算机。
- 您已安装 [redis](/mesosphere/dcos/1.13/tutorials/dcos-101/redis-package/) 包并且 Redis 服务已在群集中运行。

本教程中的示例应用程序和外部库有一些依赖关系。要确保完成该教程，您应该下载示例应用程序的 Docker 镜像。所提供的 Docker 镜像应包含所有必要的文件，这样，您就无需下载任何其他库或解析外部依赖关系。

# 学习目的
完成本教程，您将学习到：
- 如何部署与 Redis 服务连接的简单应用程序定义。
- 如何检查示例应用程序的状态。

# 查看示例应用程序定义
在本教程中，您将部署一个非常简单的 [示例应用程序](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py)，该应用程序检查与 Redis 服务的连接是否可用，然后打印存储于其中的密钥总数。

该示例应用程序是 Python 脚本，与 [redis-py](https://pypi.python.org/pypi/redis) Python 库有依赖关系。由于此依赖关系，并且您无法假定所需的库会出现在所有代理节点上，您应使用提供所有依赖关系的 `dcos-101`Docker 容器来运行示例应用程序。

您还可能需要查看：
- [DOCKERFILE](https://github.com/joerg84/dcos-101/blob/master/app1/DOCKERFILE)，用于创建 `dcos-101` 镜像。
- [应用程序定义](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json)，用于部署和管理应用程序。此应用程序定义下载示例应用程序 Python 脚本，然后在 `dcos-101` 容器内运行它。

# 部署示例应用程序
1. 通过运行以下命令，使用应用程序定义将示例应用程序添加到 Marathon：

    ```bash
    dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json
    ```

1. 检查该示例应用程序是否正在运行。

    从 DC/OS 基于 Web 的控制台：
    - 单击 **服务**。
    ![查看服务列表中的示例应用程序](/mesosphere/dcos/1.13/img/tutorial-dcos101-app1-service.png)

    - 单击 **dcos-101**。
    ![查看 app1 信息](/mesosphere/dcos/1.13/img/tutorial-app1-view.png)
    
    - 单击 **app1**。
    ![查看任务信息](/mesosphere/dcos/1.13/img/tutorial-app1-tasks.png)

    从 DC/OS  CLI：
    - 通过运行以下命令来查看所有 DC/OS 任务的状态：`dcos task`
    - 通过运行以下命令来查看所有 Marathon 应用程序的信息：`dcos marathon app list`
    - 通过运行以下命令来查看应用程序的日志信息：`dcos task log app1`
    
    `dcos task log app1` 命令的输出指示正在运行 ** app1 ** 示例应用程序的节点和端口、与 Redis 的连接状态以及您在 Redis服务中存储的密钥数。

    例如：

    ```
    Running on node '10.4.6.52' and port '6512
    Redis Connected. Total number of keys: 2
    ```

    要记住，不同运行之间甚至在已部署应用程序的生命周期内，节点和端口信息可能会有所不同，具体取决于群集中的其他事件。后续部分将讲解 DC/OS 如何定位在不同节点上运行的服务实例以及使用不同的端口。

# 后续步骤
在本教程中，您使用 Marathon 在 Docker 容器中部署了第一个应用程序，并验证了该应用程序已在运行以及可以成功连接到先前部署的 Redis 服务。

这两个教程合并展示了一个常见的场景，在该场景中，您部署后端服务（例如，Redis 或 MySQL），然后部署连接到该服务的应用程序以执行特定任务（例如，报告存储在 Redis 服务中的密钥数量或显示仪表板中的查询结果）。

接下来的教程将探讨您可以执行的其他部署任务，并揭示 DC/OS 架构中的其他组件：
- [创建和部署您自己的应用程序](../create-service/)
- [发现已部署服务]../service-discovery/)
- [部署本地容器化应用程序](../native-app/)
- [安排任务作为作业运行](../schedule-jobs/)

# 相关主题
您已经使用 [Marathon](https://mesosphere.github.io/marathon/) 部署了 Redis 服务和预定义的示例应用程序。

Marathon 是 DC/OS 平台的核心组件。Marathon 使 DC/OS 群集能够更好地支持长期运行的服务，并用于执行多项关键操作，包括按比例增加或减少应用程序实例的数量、修改资源需求或配置详细信息以及从群集中部署或删除应用程序。

有关使用 Marathon 的更多信息，请参阅以下主题：
- [部署服务和 pod](/mesosphere/dcos/1.13/deploying-services/) ，获取有关使用 Marathon 管理您的进程、服务和多个服务 pod 的信息。
- [DC/OS CLI Marathon 插件](/mesosphere/dcos/1.13/cli/command-reference/dcos-marathon/)，获取有关针对 Marathon 使用 DC/OS CLI 命令的信息。您还可以在终端 shell 中键入 `dcos marathon app --help`，以获取有关 `dcos marathon` 命令的更多信息。
- [重置 API]（http://mesosphere.github.io/marathon/api-console/index.html)，获取有关使用 HTTP 端点的信息。
