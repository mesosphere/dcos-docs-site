---
layout: layout.pug
navigationTitle:  安装第一个软件包
excerpt: DC/OS 101 教程第 2 部分
title: 教程 - 安装第一个软件包
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
menuWeight: 2
---


#包括 /mesosphere/dcos/include/tutorial-disclaimer.tmpl

欢迎阅读 DC/OS 101 教程第 2 部分。


# 先决条件
到目前为止，您应该已经安装并配置了正在运行的 DC/OS 群集和 DC/OS CLI。如果不是这样，请按照本教程的[第一](/mesosphere/dcos/1.14/tutorials/dcos-101/cli/)部分进行操作。
本教程的下一阶段使用 [jq](https://stedolan.github.io/jq/)，一个命令行 JSON 处理器，以简化一些命令。请遵循[此处](https://stedolan.github.io/jq/download/)的说明为操作系统安装 JQ。

# 目的
本部分结束时，您将从 DC/OS {{ model.packageRepo }} 资源库安装第一个服务 - [Redis](https://redislabs.com/)。Redis 是键值存储，您将在本教程中用于保存数据。

# 步骤
  * 安装 Redis
      * 搜索 Redis 包的 {{ model.packagerepo }} 资源库：

        ```bash
        dcos package search redis
        ```

        这应该返回两个条目（mr-redis 和 redis）。

      * 您想要 Redis 包，它会安装单个 Redis 容器。使用此命令安装软件包：

        ```bash
        dcos package install redis
        ```

  * 您可以使用以下任何方法检查 Redis 是否正在运行：
      * 通过查看 GUI：Redis 任务应显示在“Service Health”选项卡中，并显示运行状况。
      * 通过使用 `dcos task` 命令查看所有 DC/OS 任务 。此命令将向我们显示所有正在运行的 DC/OS 任务（即 Mesos 任务）。
      * 通过查看所有 Marathon 应用程序：`dcos marathon app list`。此命令将向我们显示所有正在运行 Marathon 应用程序。由于服务是通过 Marathon 启动的，所以您还应该在此处看到 Redis。请注意，此处还显示了健康状况（即 1/1）。
      * 通过查看 Redis 日志：`dcos task log redis`。此命令将向我们显示 Redis 任务的日志（stdout 和 stderr）。这允许您检查实际启动是否成功。您可以使用 `--lines=` 参数增加显示的日志行数，默认值为 10。
  * 让我们通过 redis-cli 命令手动存储密钥来使用 Redis
      * [SSH](/mesosphere/dcos/1.14/administering-clusters/sshcluster/) 进入运行 Redis 的节点：

        ```bash
        dcos node ssh --master-proxy --mesos-id=$(dcos task  redis --json |  jq -r '.[] | .slave_id')
        ```

      * 因为 Redis 在 Docker 容器中运行，所以您可以使用 `docker ps`列出所有 Docker 容器，并获取运行 Redis 服务的容器的 ContainerID。
      * 在正在运行的容器中启动 bash 会话，将 CONTAINER_ID 替换为您从上一个命令中获得的 ContainerID：

        ```bash
        sudo docker exec -i -t CONTAINER_ID  /bin/bash
        ```

      * 启动 Redis CLI：

        ```bash
        redis-cli
        ```

      * 设置具有值的密钥：

        ```bash
        set mykey key1
        ```

      * 检查值是否存在：

        ```bash
        get mykey
        ```

# 结果
  您刚刚从 {{ model.packageRepo }} 资源库成功安装了第一个服务，并验证了它正在运行！

# 深入研究
  [{{ model.packageRepo }}](https://github.com/mesosphere/universe) 是可用于 DC/OS 群集的包资源库。
  它让您能够轻松地在群集中安装 Apache Spark 或 Apache Cassandra 等服务，而无需处理手动配置。{{ model.packageRepo }} 包由许多不同的贡献者开发和维护。

  目前有两类软件包：
  1. 经过测试和认证的策划软件包。
  1. 社区贡献的软件包，可能未经过良好测试。

  您还可以添加自己的存储库，其包含您的自定义软件包。有关详细信息，请参阅[文档](/mesosphere/dcos/1.14/administering-clusters/package-registry/)。
