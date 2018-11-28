---
layout: layout.pug
navigationTitle: 使用虚拟 IP 地址
title: 使用虚拟 IP 地址
menuWeight: 10
excerpt: 使用虚拟 IP 地址

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS 可将流量从单个虚拟 IP (VIP) 映射到多个 IP 地址和端口。DC/OS VIP 是**基于名称的**，这意味着客户端是连接服务地址而非 IP 地址。

DC/OS 自动生成不会与 IP VIP 冲突的基于名称的 VIP，因此您不必担心冲突。此特性允许在安装服务时自动创建基于名称的 VIP。

基于名称的 VIP 包含以下组件：

 * 专用虚拟 IP 地址
 * 端口（服务可用的端口）
 * 服务名

您可以从 DC/OS GUI 将 VIP 分配给应用程序。在部署新服务时所输入的值将转换为以下 Marathon 应用定义条目：

- `portDefininitions` 如果不使用 Docker 容器
- `portMappings` 如果使用 Docker 容器

VIP 遵循以下命名约定：

```
<service-name>.marathon.l4lb.thisdcos.directory:<port>
```

### 先决条件

* 您应用程序独特的 VIP 地址池。

## 创建 VIP

1. 从 DC/OS [GUI](/cn/1.11/gui/)，单击**服务**选项卡，然后单击**运行服务**。
 1. 在**网络**选项卡上，选择**网络类型** > **虚拟网络：dcos**。
 2. 展开**添加服务端点**，为以下内容提供回复：

 - **容器端口**
 - **服务端点名称**
 - **端口映射**
 - **负载均衡服务地址**

 在填写这些字段时，Marathon 设置的服务地址将出现在屏幕底部。您可以单击**添加服务端点**，将多个 VIP 分配到您的应用程序。

 ![VIP 服务定义](/cn/1.11/img/vip-service-definition.png)

 图 1. VIP 服务定义屏幕

 在图 1 中，客户端可以访问位于 `my-service.marathon.l4lb.thisdcos.directory:5555` 的服务。

 1. 单击 **REVIEW & RUN** 和 **RUN SERVICE**。

您可以单击**网络**选项卡，查看服务的网络详情。

![VIP 输出](/cn/1.11/img/vip-service-definition-output.png)
 
图 2. 服务定义输出

有关端口配置的更多信息，请参阅 [Marathon 端口文档](/cn/1.11/deploying-services/service-ports/)。

## 通过 DC/OS 服务使用 VIP

某些 DC/OS 服务（如 [Kafka](/services/kafka/)）在您安装它们时会自动创建 VIP。命名约定是：`broker. <service.name>.l4lb.thisdcos.directory:9092`。

按照以下步骤查看 Kafka 的 VIP。

### 通过 GUI

1. 单击**网络** > **网络**，然后选择**dcos**。
1. 选择任务以查看详情。

    ![](/cn/1.11/img/vip-service-details.png)

 图 3. VIP 服务详情

### 通过 CLI

**先决条件：** Kafka 服务和 CLI 必须 [已安装](/services/kafka/)。

1. 运行此命令：

    ```bash
    dcos kafka endpoints broker
    ```

 输出应类似于：

    ```json
    {
      "address": [
        "10.0.2.199:9918"
      ],
      "zookeeper": "master.mesos:2181/dcos-service-kafka",
      "dns": [
        "broker-0.kafka.mesos:9918"
      ],
      "vip": "broker.kafka.l4lb.thisdcos.directory:9092"
    }
    ```
您可以用此 VIP 为集群中的任何一个 Kafka 中间人分配地址。


## 常见问题

### 连接似乎随意关闭

数据库等长时间连接的应用程序，例如数据库（如 Postgresql）通常会出现这种情况。若要修复，请尝试开启 keepalive。keepalive 可以是应用程序特定的机制（如通信校验），或是 TCP keepalive 等协议中的某些内容。需要有 keepalive，因为负载均衡器无法区分空闲连接或死机连接，原因是数据包在任何一种情况下都不会被发送。默认超时取决于内核配置，但通常为五分钟。

 [1]: /1.11/deploying-services/service-ports/
