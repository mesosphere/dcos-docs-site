---
layout: layout.pug
navigationTitle:  安装第一个包
title: 安装第一个包
excerpt: 说明如何安装示例服务包（第 3 部分）
menuWeight: 3
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---
#include /mesosphere/dcos/include/tutorial-disclaimer.tmpl


现在您已经在管理节点和代理节点上安装和运行了 DC/OS 集群，并且已经安装了可与集群一起使用的 DC/OS 命令行界面 (CLI)，那么可以开始将包和应用程序添加到集群了。

# 开始之前
在开始本教程前，您应验证以下内容：
- 您可以通过至少一个管理节点和三个代理节点来访问运行中的 [DC/OS 群集](../start-here/)。
- 您可以访问安装了 [DC/OS CLI](../cli/) 的计算机。
- 您可以在托管 CLI 的计算机上打开命令行 shell。
- 您可以在远程群集节点上打开安全 shell (SSH) 会话。


# 学习目的
完成本教程，您将学习到：
- 如何在 DC/OS 包资源库中搜索服务。
- 如何安装您希望在 DC/OS 群集中可用的服务。
- 如何运行一些基本命令来使用您的第一个服务。

## 搜索包
在本教程中，您将安装 [Redis](https://redislabs.com/)。Redis 是一个开源键值数据结构存储。它常被用作数据库、缓存管理器和消息代理。它支持内存中数据检索、磁盘持久性和高可用性。

您可以使用 DC/OS 基于 Web 的管理控制台或运行 DC/OS 命令行程序来搜索您希望在 DC/OS 群集上安装的包。

## 使用 DC/OS 基于 Web 的控制台进行搜索
要使用 DC/OS 基于 Web 的管理控制台来搜索 Redis：
1. 打开 Web 浏览器并导航到 DC/OS 基于 Web 控制台的 URL。

1. 单击 **目录**。

    目录为可用于 DC/OS 群集的服务提供包资源库。如果您具有 Internet 连接，那么目录可让您从集中位置通过最少的手动配置来轻松安装服务。
    
    目录中的包由许多不同的贡献者进行开发和维护，包括经过 *认证* 的包以及由 Mesosphere 和 **社区** （已为包资源库做出贡献）测试和验证过的包，但是在很多情况下，这些包未经彻底测试。

1. 键入搜索字符串以找到要安装的包。

    例如，键入“redis”以找到与本教程中要安装的包相匹配的包名称。

    ![搜索目录中的包](/mesosphere/dcos/1.13/img/tutorial-redis-search.png)

    在这种情况下，有多个包与您的搜索字符串匹配。但是，在本教程中，您只会对 **redis** 包感兴趣。此包在 Docker 容器中安装单个 Redis 实例。

1. 在搜索结果中选择 Redis 包。

    如果您已准备好使用 DC/OS 基于 Web 的管理控制台进行安装，则继续 [使用 DC/OS 基于 Web 的控制台进行安装](#install-redis-gui)。



### 使用 DC/OS CLI 进行搜索
要通过运行 DC/OS CLI 命令来搜索 Redis：
1. 在您可以访问 DC/OS 命令行界面 (CLI) 的计算机上打开终端 shell。

1. 通过运行以下命令来搜索包：

    ```bash
    dcos package search redis
    ```

1. 检查命令的输出。

    例如，此命令返回以下条目：
    ```
    NAME      VERSION    SELECTED  FRAMEWORK  DESCRIPTION                                                                       
    mr-redis  0.0.1      False     True       Redis is the fastest in-memory KV-Cache and Datatstructure store                  
    redis     4.0-0.0.1  False     False      This is a single redis container, which is NOT suited for HA setups. Redis is...  
    ```

# 安装包
在本教程中，您只会对 **redis** 包感兴趣。此包在 Docker 容器中安装单个 Redis 实例。您可以通过 DC/OS 基于 Web 的管理控制台或运行命令行程序来安装该包。

<a name="install-redis-gui"></a>

## 使用 DC/OS 基于 Web 的控制台进行安装
要使用 DC/OS 基于 Web 的管理控制台来安装 Redis 包：
1. 打开 Web 浏览器并导航到 DC/OS 基于 Web 控制台的 URL。

1. 单击 **目录**。

1. 滚动或搜索来找到要安装的 Redis 包。

    本教程中，选择 **redis** 包。此包在 Docker 容器中安装单个 Redis 实例。

1. 单击 **检查和运行**。

1. 验证默认服务名称。

    如有需要，您可以修改服务名称。例如，您可能想将此服务命名为“redis-tutorial”。

1. 单击 **Redis**，验证 CPU 和内存设置。

    ![Redis 配置设置](/mesosphere/dcos/1.13/img/tutorial-redis-config.png)

1. 单击 **检查和运行** 以验证您的 Redis 配置，然后单击 **运行服务**。

    ![Redis 配置设置](/mesosphere/dcos/1.13/img/tutorial-redis-run.png)

1. 单击 **打开服务** 以查看 Redis 部署的状态。

    ![Redis 配置设置](/mesosphere/dcos/1.13/img/tutorial-redis-open-service.png)

## 通过 DC/OS CLI 进行安装
1. 在您可以访问 DC/OS 命令行界面 (CLI) 的计算机上打开终端 shell。

1. 通过运行以下命令来安装 Redis 包：

    ```bash
    dcos package install redis --yes 
    ```
# 验证服务是否已安装并运行
您可以通过使用 DC/OS 基于 Web 的管理控制台或运行命令行程序来验证 Redis 服务当前正在运行并报告运行状况。

## 在 DC/OS 基于 Web 的控制台中检查 Redis 状态
1. 打开 DC/OS 基于 Web 的管理控制台。

1. 单击 **服务** 以查看已部署服务列表。

1. 验证 Redis 的状态列显示正在运行。

    ![检查 Redis 服务状态](/mesosphere/dcos/1.13/img/tutorial-redis-status.png)

1. 单击服务名称以显示任务级别详情。

    ![查看 Redis 详情](/mesosphere/dcos/1.13/img/tutorial-redis-details.png)

## 使用 DC/OS 命令来检查 Redis 状态
1. 在您可以访问 DC/OS 命令行界面 (CLI) 的计算机上打开终端 shell。

1. 通过运行以下命令来查看 DC/OS 任务信息：

    ```bash
    dcos task
    ```

    此命令将显示所有运行中的 DC/OS 任务的基本信息。例如：

    ```
    NAME            HOST        USER  STATE  ID                                                                   MESOS ID                                     REGION          ZONE       
    redis-tutorial  10.0.1.192  root    R    redis-tutorial.instance-f4adfcf2-830c-11e9-9380-d281e1886025._app.1  da7a5a1b-ee52-4127-baf2-4989ba6fffea-S1  aws/us-west-2  aws/us-west-2a 
    ```

1. 通过运行以下命令来查看所有已部署 Marathon 应用程序的信息：

    ```bash
    dcos marathon app list
    ```

    由于 Marathon 用于启动 Redis 服务，Redis 在此命令的输出中列出。请注意，“运行状况”列指示“Redis”已配置为“运行一个实例”，并且当前正在运行一个实例 (1/1)。
    
    ```bash
    ID               MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD  
    /redis-tutorial  1024   1     1/1    1/1       ---      False      DOCKER   N/A  
    ```

1. 通过运行以下命令检查 Redis 日志：
 
    ```bash
    dcos task log redis
    ``` 
 
    此命令显示 Redis 任务的标准输出 (stdout) 和标准错误 (stderr) 日志。日志文件输出使您能够检查实际启动是否成功。默认情况下，命令将显示最近 10 行的已记录活动。您可以通过指定 `--lines=` 参数来更改显示的日志行数。例如，如果您运行 `dcos task log redis --lines=5`，那么您可能会看到与下内容类似的输出：

    ```bash
    1:M 27 Jun 18:17:31.449 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
    1:M 27 Jun 18:17:31.449 # Server initialized
    1:M 27 Jun 18:17:31.449 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
    1:M 27 Jun 18:17:31.449 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
    1:M 27 Jun 18:17:31.449 * Ready to accept connections
    ```

# 测试服务操作  
现在，您已经安装了 Redis 包，已在群集上部署了该服务，并验证了该服务可正常运行，那么可以通过 Redis 并使用 `redis-cli` 命令来手动存储键值，以完成本教程。

1. 在计算机（具有访问群集的网络）上打开终端 shell。

1. 在运行 Redis 服务的群集节点上打开安全 shell ([SSH](/mesosphere/dcos/cn/1.13/administering-clusters/sshcluster/)) 会话。

    您可以通过几种方式为在该节点上运行的 Redis 服务决定群集节点地址和 Mesos 任务标识符。
    
    例如，如果您知道主机名或 IP 地址并具有正确的登录凭据并被授权使用 SSH 连接到计算机，那么您可以通过运行类似于以下内容的命令来访问节点：

    ```bash
    ssh <agent-node-ip> -l <authorized-user>
    ```

    您也可以使用 `dcos task` 来查找 Redis 服务的 Mesos ID，然后通过类似于以下内容的命令来打开安全 shell：

    ```bash
    dcos node ssh --master-proxy --mesos-id=dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0
    ```

    如果提示您确认连接到主机，请键入 `yes`。

1. 列出 Docker 容器，通过运行以下命令来获取运行 Redis 服务的容器的 `ContainerID`：

    ```bash
    sudo docker ps
    ```

    该命令将返回类似于以下内容的输出：

    ```
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
    296b18087535        redis:4.0           "docker-entrypoint.s…"   About an hour ago   Up About an hour    0.0.0.0:3617->6379/tcp   mesos-6e81fd7b-9fa8-470d-9378-49b4a01b2d11
    ```

1. 通过运行以下命令并用运行 `docker ps` 命令获得的容器 ID 替换 CONTAINER_ID 参数，从正在运行的容器中启动 shell 会话：

    ```bash
    sudo docker exec -i -t CONTAINER_ID  /bin/bash
    ```

1. 通过运行以下命令来启动 Redis CLI 客户端：

    ```bash
    redis-cli
    ```

1. 通过运行以下命令，为键设置一个值：

    ```bash
    set tutorial my-tutorial-key-value
    ```

1. 通过运行以下命令来验证键值对：

    ```bash
    get tutorial
    ```
    
1. 如有需要，使用 `redis-cli` 来添加其他键。

    在下一个教程中，您将部署连接到 Redis 服务的简单应用程序，并检索定义的键数。

1. 退出 `redis-cli` 客户端，关闭 Redis 连接，并结束安全 shell 会话。

# 后续步骤
您从包资源库中成功安装了第一个服务，并验证它正在运行！

接下来的教程探讨可以通过 DC/OS 基于 Web 的管理控制台或命令行界面执行的其他入门任务：
- [部署您的第一个示例应用程序]](../first-app/)
- [创建并运行自定义应用程序](../create-service/)
- [发现已部署服务](../service-discovery/)
- [部署本地容器化应用程序](../native-app/)
  
# 相关主题
DC/OS [目录](/mesosphere/dcos/cn/1.13/gui/catalog/)（或 DC/OS 先前版本中的 [universe](https://github.com/mesosphere/universe)）是可安装在 DC/OS 群集上的服务的包资源库。

包资源库使您可以轻松地在集群中安装经过认证或社区提供的服务，例如，Apache Spark 或 Apache Cassandra，而无需手动查找、下载和配置单独的包。如果您的群集在没有互联网连接的隔离网络上运行，您可以创建和管理自己的站点特定包资源库。

有关创建自己的包资源库（包含自定义包)，请参阅 [Deploying a local Universe](/mesosphere/dcos/cn/1.13/administering-clusters/deploying-a-local-dcos-universe/) 以获取详细信息。
