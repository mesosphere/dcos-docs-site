---
layout: layout.pug
navigationTitle: 部署负载均衡数据管线
title: 部署负载均衡数据管线
menuWeight: 3
excerpt: 教程 - 在 DC/OS 上构建完整的负载均衡数据管线

---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</td> </tr> </table>

本教程演示如何在大约 15 分钟内在 DC/OS 上构建完整的负载均衡数据管线！

# 概述

在本教程中，您将安装和部署名为 Tweeter 的容器化 Ruby on Rails 应用程序。Tweeter 是类似于 Twitter 的应用程序，您可以使用该应用程序将 140 个字符的消息发布到互联网。然后，使用 Zeppelin 对由 Tweeter 创建的数据执行实时分析。

您将学习：

* 如何安装 DC/OS 服务。
* 如何向 DC/OS Marathon 添加应用程序。
* 如何通过 Marathon-LB 将公共流量发送到私有应用程序。
* 如何发现您的应用程序。
* 如何扩展您的应用程序。

本教程使用 DC/OS 为集群启动和部署这些微服务：

### Cassandra
[Cassandra][1] 数据库用于后端以存储 Tweeter 应用程序数据。

### Kafka
[Kafka][2] 发布订阅消息服务接收来自 Cassandra 的推文，并将它们发送到 Zeppelin 进行实时分析。

### Marathon-LB
[Marathon-LB][12] 是一种基于 HAProxy 的负载均衡器，仅适用于 Marathon。当您需要外部路由或第 7 层负载均衡功能时，它非常有用。

### Zeppelin
[Zeppelin][4] 是一款交互式分析笔记本，可在后端与 DC/OS Spark 配合使用，以实现交互式分析和可视化。因为 Spark 和 Zeppelin 可能会占用所有集群资源，所以必须为 Zeppelin 服务指定最大内核数。

### Tweeter
Tweeter 将推文存储在 DC/OS Cassandra 服务中，实时将推文流式传输到 DC/OS Kafka 服务，并使用 DC/OS [Spark][3] 和 Zeppelin 服务执行实时分析。

# 在 DC/OS 集群上准备和部署 Tweeter

## 先决条件

* [DC/OS](/cn/1.11/installing/) 或 [DC/OS Enterprise](/cn/1.11/installing/) 已安装，至少具有 5 个[专用代理节点][6] 和 1 个[公共代理节点][6]。

 如果您正在使用 DC/OS Enterprise 集群运行本教程，则需要确保将[安全模式](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#security-enterprise)设置为宽容或严格。默认情况下，DC/OS 安装在宽容安全模式下。

* [DC/OS CLI](/cn/1.11/cli/install/) 已安装。
* 公共代理节点的公共 IP 地址。在声明了公共代理节点的 DC/OS 已安装后，可以[导航到公共代理节点的公共 IP 地址][9]。
* Git：
 * **macOS：**从 [Git 下载](http://git-scm.com/download/mac)获取安装程序。
 * **Unix/Linux：**请参阅这些 [安装说明](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。

## 安装 DC/OS 服务

在此步骤中，您可以从 DC/OS Web 界面 [**Catalog**](/cn/1.11/gui/catalog/) 选项卡安装 Cassandra、Kafka、Marathon-LB 和 Zeppelin。您还可以使用 `dcos package install`][11] 命令，从 DC/OS CLI 安装 DC/OS 软件包。

1. 查找并单击 **cassandra** 软件包，单击 **REVIEW & RUN**，并通过再次单击 **REVIEW & RUN**，然后单击 **RUN SERVICE**，接受默认安装。Cassandra 最多可旋转 3 个节点。当模态警报提示时，单击 **OPEN SERVICE**。

2. 单击 **Catalog** 选项卡。查找并单击 **kafka** 软件包，单击 **REVIEW & RUN**按钮，然后再次单击该按钮，然后单击 **RUN SERVICE**。Kafka 最多打开 3 个代理。当模态警报提示时，单击 **OPEN SERVICE**。

3. 单击 **Catalog** 选项卡。查找并单击 *marathon-lb** 软件包，单击 **REVIEW & RUN**按钮，然后再次单击该按钮，然后单击 **RUN SERVICE**。当模态警报提示时，单击 **OPEN SERVICE**。

如果您在 Enterprise 集群上运行 Marathon-LB 时遇到问题，请尝试按照[这些说明](/services/marathon-lb/mlb-auth/)进行安装。根据您的 [安全模式](/cn/1.11/security/ent/#security-modes)，Marathon-LB 可能需要服务身份认证才能访问 DC/OS。

4. 单击 **Catalog** 选项卡。单击 **zeppelin** 软件包，然后单击 **REVIEW & RUN** 按钮。
 1. 单击左侧的 **spark** 选项卡，并将 `cores_max` 设置为 `8`。
 2. 单击 **REVIEW AND RUN**，然后单击 **RUN**。单击 **OPEN SERVICE**。

5. 在 DC/OS 上部署您的微服务时，单击 **Services**（服务**）选项卡。当节点上线时，您将看到“运行状况”状态从“空闲”转为“不佳”，最后变为良好状态。这可能需要几分钟。

 ![显示所有服务的服务选项卡。](/cn/1.11/img/tweeter-services6-ee.png)

 图 1. 显示 Tweeter 服务的服务选项卡 

## 部署容器化应用程序

在此步骤中，您将容器化 Tweeter 应用程序部署到公共节点。

1. 导航至 [Tweeter](https://github.com/mesosphere/tweeter/) GiThub 存储库并保存 `/tweeter/tweeter.json` Marathon 应用定义文件。

2. 将 `HAPROXY_0_VHOST` 定义添加到 `tweeter.json` 文件中，该定义使用[公共代理][9] 节点的公共 IP 地址。

    <table class=“table” bgcolor=#858585>
    <tr> 
    <td align=justify style=color:white><strong>重要信息：</strong>您必须删除前面的“http://”和后面的“/”。
    </td> 
    </tr> 
    </table>

    ```json
    ...
      ],
      "labels": {
        "HAPROXY_GROUP": "external",
        "HAPROXY_0_VHOST": "<public-agent-IP>"
      }
    ...
    ```

 在本示例中，DC/OS 集群正在 AWS 上运行：

    ```bash
    ...
      ],
      "labels": {
        "HAPROXY_GROUP": "external",
        "HAPROXY_0_VHOST": "52.34.136.22"
      }
    ...
    ```

3. 导航至包含已修改 `tweeter.json` 文件的目录。将 Tweeter 安装及部署到您的 DC/OS 集群中。

    ```bash
    dcos marathon app add tweeter.json
    ```

 `tweeter.json` 中的 `instances` 参数指定应用程序实例的数量。使用以下命令为应用程序增容或减容：

    ```bash
    dcos marathon app update tweeter instances=<number_of_desired_instances>
    ```

 在本示例中，服务通过集群节点 `node-0.cassandra.mesos:9042` 与 Cassandra 进行通信，通过集群节点 `broker-0.kafka.mesos:9557` 与 Kafka 进行通信。由于 `tweeter.json` 应用定义文件中的 `HAPROXY_0_VHOST` 定义，流量通过 Marathon-LB 传输。

4. 转到 **Services** 选项卡，验证您的应用程序是否正常运行。

 ![已部署的 Tweeter](/cn/1.11/img/tweeter-services7.png)

 图 2. 已部署的 Tweeter

5. 导航到[公共代理][9] 节点端点以查看 Tweeter UI 并发布一篇推文。在本例中，您将浏览器指向 `52.34.136.22`。

 ![Tweeter][14]

 图 3. “Hello world”推文

## 发布 10 万条推文

在此步骤中，您部署的应用程序自动发布来自 Shakespeare 的大量推文。应用程序将逐个发布超过 10 万条推文，因此当您刷新页面时，您会看到它们稳定地进入。

1. 导航至 [Tweeter](https://github.com/mesosphere/tweeter/) GiThub 存储库并保存 `tweeter/post-tweets.json` Marathon 应用定义文件。

2. 部署 `post-tweets.json` Marathon 应用定义文件。

    ```bash
    dcos marathon app add post-tweets.json
    ```

3. 在 `post-tweets.json` 运行后，刷新您的浏览器，查看传入的 Shakespeare 推文。

 ![Shakespeare 推文](/cn/1.11/img/tweeter-shakespeare.png)

 图 4. Shakespeare 推文

`post-tweets` 应用程序通过流式传输到 VIP`1.1.1.1:30000` 进行工作。此地址在 `post-tweets.json` 应用定义的 `cmd` 参数中声明。

```json
{
  "id": "/post-tweets",
  "cmd": "bin/tweet shakespeare-tweets.json http://1.1.1.1:30000",
...
}
```

Tweeter 应用程序使用安装在每个 DC/OS 节点上的服务发现和负载均衡器服务。此地址在 `tweeter.json` 定义 `VIP_0` 中定义。

```json
...
{
  "containerPort": 3000,
  "hostPort": 0,
  "servicePort": 10000,
  "labels": {
    "VIP_0": "1.1.1.1:30000"
    }
}
...
```

如果您正在使用 DC/OS Enterprise 集群，单击 DC/OS Web 界面中的 **Networking** -> **Service Addresses** 选项卡，然后选择 `1.1.1.1:30000` 虚拟网络，以查看正在执行的负载均衡：

![Tweeter scaled](/1.10/img/tweeter-services8-ee.png)

图 5. 扩展的推文

## 添加流分析

在最后一步中，您将对来自 Kafka 的推文流进行实时分析。

1. 导航至 [Tweeter](https://github.com/mesosphere/tweeter/) GiThub 存储库并保存 `tweeter/post-tweets.json` Marathon 应用定义文件。

2. 通过 'https://<master_ip>/service/zeppelin/` 导航至 Zeppelin。您的管理节点 IP 地址是 DC/OS Web 界面的 URL。

3. 单击 **Import Note** 并导入 `tweeter-analytics.json`。Zeppelin 已预先配置，以在 DC/OS 集群上执行 Spark 作业，因此无需进一步配置或设置。请务必使用 `https://` 而不是 `http://`。

4. 导航至 **Notebook** -> **Tweeter Analytics**。

5. 运行 **Load Dependencies** 步骤，将所需的库加载到 Zeppelin 中。

6. 运行 **Spark Streaming** 步骤，其从 ZooKeeper 中读取推文流并将其放入可使用 SparkSQL 查询的临时表中。

6. 运行 **Top tweeter** SQL 查询，其使用上一步中创建的表来计算每个用户的推文数。当新推文进入时，表会不断更新，因此重新运行查询会每次产生不同的结果。

![Top Tweeters][16]

图 6. Top Tweeters



 [1]: /services/cassandra/
 [2]: /services/kafka/
 [3]: /services/spark/
 [4]:http://zeppelin.apache.org/
 [5]: https://github.com/mesosphere/marathon-lb
 [6]: /1.11/overview/concepts/
 [9]: /1.11/administering-clusters/locate-public-agent/
 [11]: /1.11/cli/command-reference/
 [12]: /services/marathon-lb/
 [13]: https://github.com/mesosphere/tweeter
 [14]: /1.11/img/tweeter.png
 [16]: /1.11/img/top-tweeter.png
