---
layout: layout.pug
navigationTitle: 安装第一个软件包
excerpt: 第 2 部分 - 安装第一个软件包
title: 教程 - 安装第一个软件包
menuWeight: 2
---


<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</td> </tr> </table>

欢迎阅读 DC/OS 101 教程第 2 部分。


# 先决条件
到目前为止，您应该已经安装并配置了正在运行的 DC/OS 集群和 DC/OS CLI。 如果不是这样，请按照本教程的[第一](/cn/1.11/tutorials/dcos-101/cli/)部分进行操作。
本教程的下一阶段使用 [jq](https://stedolan.github.io/jq/)，一个命令行 JSON 处理器，以简化一些命令。请遵循[此处](https://stedolan.github.io/jq/download/)的说明为操作系统安装 JQ。

# 目的
本部分结束时，您将从 DC/OS Universe 存储库安装第一个服务 - [Redis](https://redislabs.com/)。Redis 是键值存储，您将在本教程中用于保存数据。

# 步骤

## 安装 Redis
1. 在 Universe 存储库中搜索 `redis` 软件包：

        ```bash
        dcos package search redis
        ```
 这应该返回两个条目（`mr-redis` 和 `redis`）。您想要 `redis` 软件包，它安装单个 Redis 容器。
      
2. 使用此命令安装软件包：

        ```bash
        dcos package install redis
        ```

1. 验证 `redis` 是否正在运行。您可以使用以下任何方法：
- 通过查看 Web 界面：Redis 任务应显示在“Service Health”选项卡中，并显示运行状况。
- 通过使用 `dcos task` 命令查看所有 DC/OS 任务 。此命令将向我们显示所有正在运行的 DC/OS 任务（如 Mesos 任务）。
- 通过查看所有 Marathon 应用程序：`dcos marathon app list`。此命令将向我们显示所有正在运行 Marathon 应用程序。由于服务是通过 Marathon 启动的，所以您还应该在此处看到 Redis。请注意，此处还显示了运行状况（如 1/1）。
- 通过查看 Redis 日志：`dcos task log redis`。此命令将向我们显示 `redis` 任务的日志（`stdout` 和 `stderr`）。这允许您检查实际启动是否成功。您可以使用 `--lines=` 参数增加显示的日志行数，默认值为 10。

## 使用 Redis

我们将通过 `redis-cli` 命令手动存储密钥来使用 Redis
 * [SSH](/cn/1.11/administering-clusters/sshcluster/) 进入运行 redis 的节点：

      ```bash
      dcos node ssh --master-proxy --mesos-id=$(dcos task  redis --json |  jq -r '.[] | .slave_id')
       ```

因为 Redis 在 Docker 容器中运行，所以您可以使用 `docker ps`列出所有 Docker 容器，并获取运行 redis 服务的容器的 ContainerID。

1. 在正在运行的容器中启动 `bash` 会话，将 CONTAINER_ID 替换为您从上一个命令中获得的 ContainerID：

      ```bash
      sudo docker exec -i -t CONTAINER_ID  /bin/bash
      ```

1. 启动 Redis CLI：

      ```bash
      redis-cli
      ```

 1. 设置具有值的密钥：

      ```bash
      set mykey key1
      ```

1. 检查值是否存在：

      ```bash
      get mykey
      ```

# 结果
 您刚刚从 Universe 存储库中成功安装了第一个服务，并验证了它正在运行！

# 深入研究
 [Universe](https://github.com/mesosphere/universe) 是可用于 DC/OS 集群的软件包存储库。
 它使您能够轻松地在集群中安装诸如 Apache Spark 或 Apache Cassandra 等服务，而无需处理手动配置。Universe 软件包由许多不同的贡献者开发和维护。

 目前有两类软件包：
 1. 经过测试和认证的策划软件包。
 1. 社区贡献的软件包，可能未经过良好测试。

 您还可以添加自己的存储库，其包含您的自定义软件包。有关详细信息，请参阅[文档](/cn/1.11/administering-clusters/repo/)。
