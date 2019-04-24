---
layout: layout.pug
excerpt: DC/OS 101 教程第 6 部分
title: 教程 - 公开应用程序
navigationTitle: 公开应用程序
menuWeight: 6
---

#include /cn/include/tutorial-disclaimer.tmpl


欢迎阅读 DC/OS 101 教程第 6 部分。


# 先决条件
* [正在运行的 DC/OS 群集](/cn/1.12/tutorials/dcos-101/cli/)，[已安装 DC/OS CLI](/cn/1.12/tutorials/dcos-101/cli/)。
* [app2](/cn/1.12/tutorials/dcos-101/app2/) 已部署并在您的群集中运行。


# 目的
在本部分中，您将使用 Marathon-LB 在公共代理节点上运行 `app2`，从而实现可从群集外部对其进行访问。

# 步骤
DC/OS 有两种不同的节点类型：

- 专用代理节点
- 公共代理节点

专用代理节点通常只能在群集内访问，而公共代理节点允许从群集外部进入访问。

默认情况下，Marathon 启动专用代理节点上的应用程序和服务，而这些程序和服务无法从群集外部访问。要将应用程序向外部公开，通常使用一个公共节点上运行的负载均衡器。

您将在本教程后面重新讨论负载平衡主题和负载均衡器的不同选择，但是现在，您将使用 [Marathon-LB](/cn/1.12/tutorials/dcos-101/loadbalancing/) 作为负载均衡器。Marathon-LB 在公共代理节点上使用 [HA-Proxy](http://www.haproxy.org/)，为群集内部运行的应用程序提供外部访问和负载均衡。

1. 安装 Marathon-LB：
  
    ```
    dcos package install marathon-lb
    ```
1. 使用 `dcos task` 验证它是否在运行，并确定运行 Marathon-LB 的公共代理节点（主机）的 IP 地址。

      <p class="message--warning"><strong>警告：</strong>如果您使用云提供程序（尤其是 AWS）启动群集，则 <code>dcos 任务</code>可能会显示主机的专用 IP 地址，该地址无法从群集外部解析。如果 marathon-lb 任务的 <a href="https://en.wikipedia.org/wiki/Private_network">RFC1918 地址</a>以 192.168 或 10 开头，那么这就是专用 IP 地址。</p>

      在这种情况下，您需要从云提供程序中检索公共 IP。对于 AWS，请转至 EC2 仪表板，并使用搜索框搜索专用 IP，该 IP 分配给 `dcos task` 显示的 marathon-lb 任务。公共 IP 将在返回实例的 IPv4 公共 IP 字段中列出。

1. 通过 `<Public IP>:10000`（从本地设备）连接到 webapp。您应该看到网页的呈现版本，包括正在运行的物理节点和端口 `app2`。
1. 使用 Web 表单添加新“键:值”对
1. 您可以通过以下两种方式验证新密钥是否已添加：
 1. 使用 `app1` 检查密钥总数：
        ```
        dcos task log app1
        ```
 1. 直接检查 `redis`：
      * [SSH](/cn/1.12/administering-clusters/sshcluster/) 进入运行 redis 的节点：

      ```bash
      dcos node ssh --master-proxy --mesos-id=$(dcos task  redis --json |  jq -r '.[] | .slave_id')
      ```
      * 因为 Redis 在 Docker 容器中运行，所以您可以使用 `docker ps` 命令列出所有 Docker 容器，并获取 redis 任务的 ContainerID。

      ```
      docker ps
      ```

1. 使用上一步的 ContainerID 在正在运行的容器中创建 bash 会话：
       
      ```
      sudo docker exec -i -t CONTAINER_ID  /bin/bash
      ```
1. 启动 Redis CLI：
       
      ```
      redis-cli
      ```
1. 检查值是否存在：
       
      ```
      get <newkey>
      ```

# 结果
祝贺您！您已使用 Marathon-LB 向公众公开您的应用程序，并使用 Web 前端向 Redis 添加了一个新密钥。

 在[下一部分](/cn/1.12/tutorials/dcos-101/resources/) 中，您将学习如何监控和了解资源利用率，如何实施资源限制以及如何调试资源管理问题。