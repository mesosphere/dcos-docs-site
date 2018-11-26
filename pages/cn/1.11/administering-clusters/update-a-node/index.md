---
layout: layout.pug
navigationTitle: 更新节点
title: 更新节点
menuWeight: 801
excerpt: 更新活动 DC/OS 集群中的代理节点

enterprise: false
---


您可以使用维护窗口或通过手动终止代理来更新活动 DC/OS 集群中的代理节点。维护窗口是首选方法，因为这通常更稳定，不容易出错。

如果您正在缩小集群、重新配置代理节点或将节点转移到新 IP，这些步骤非常有用。更改 Mesos 属性(`⁠⁠⁠⁠/var/lib/dcos/mesos-slave-common`⁠⁠⁠⁠) 或资源(⁠⁠⁠⁠`/var/lib/dcos/mesos-resources`⁠⁠⁠⁠)时，您必须删除代理节点，并以新的 UUID 在管理节点上重新注册它。然后，管理节点将识别新的属性和资源规范。

<table class=“table” bgcolor=#ffd000>
<tr> 
  <td align=justify style=color:black><strong>警告：</strong>⁠⁠⁠由于您正在更改代理属性或资源，在代理上运行的所有任务都将被终止。Mesos 将重新注册的代理视为新代理。</td> 
</tr> 
</table>

### 先决条件：

* [已安装和配置 SSH](/cn/1.11/administering-clusters/sshcluster/)。这是通过手动终止代理来删除节点所需的。
* 可访问 [Admin Router 权限](/cn/1.11/overview/architecture/components/#admin-router)。

# 使用维护窗口更新节点
使用维护窗口，您可以从集群外部同时排空多个节点。无需 SSH 访问。

您可以定义维护计划,以在更改代理属性或资源之前撤退您的任务。

1. 定义维护计划。例如，此处是已经指定示例机器 (`machine_ids`) 和维护窗口(`unavailability`)的基本维护计划 JSON 文件：

    ```json
    {
      "windows" : [
        {
          "machine_ids" : [
            { "hostname" : "10.0.2.107", "ip" : "10.0.2.107" },
            { "hostname" : "10.0.2.5", "ip" : "10.0.2.5" }
          ],
          "unavailability" : {
            "start" : { "nanoseconds" : 1 },
            "duration" : { "nanoseconds" : 3600000000000 }
          }
        }
      ]
    }
    ```

 如需更复杂的示例，请参阅 [maintain-agents.sh](https://github.com/vishnu2kmohan/dcos-toolbox/blob/master/mesos/maintain-agents.sh) 脚本。

1. 用指定机器 JSON 定义调用 `⁠⁠⁠⁠machine/down` 端点。例如，[此处](https://github.com/vishnu2kmohan/dcos-toolbox/blob/master/mesos/down-agents.sh) 是一个调用 `/machine/down/`的脚本。

    <table class=“table” bgcolor=#858585>
    <tr> 
     <td align=justify style=color:white><strong>重要信息：</strong>调用“machine/down”会针对代理上运行的任何任务发送“TASK_LOST”(TASK_LOST) 消息。某些 DC/OS 服务，例如 Marathon，将重新定位任务，但其他服务则不会，例如 Kafka 和 Cassandra。有关详细信息，请参阅 DC/OS 服务指南和 Mesos 维护原始 <a href="https://mesos.apache.org/documentation/latest/maintenance/">文档</a>。</td> 
    </tr> 
    </table>
    
1. 执行维护。
1. 通过使用指定的添加代理 JSON 定义，调用 `⁠⁠⁠⁠machine/up` 端点来添加代理到您的集群中。例如：

    ```json
    [
      { "hostname" : "10.0.2.107", "ip" : "10.0.2.107" },
      { "hostname" : "10.0.2.5", "ip" : "10.0.2.5" }
    ]
    ```

# 通过手动终止代理更新节点
使用终止信号 SIGUSR1 排空节点，这易于与可在节点上平行地执行任务的自动化工具集成，例如，Ansible、Chef 和 Puppet.。

1. [SSH 至代理节点](/cn/1.11/administering-clusters/sshcluster/)。
1. 停止代理。

 - **私有代理**

       ```bash
       sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
       ```
 - **公共代理**

       ```bash
       ⁠⁠⁠⁠sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave-public && systemctl stop dcos-mesos-slave-public'
       ```

1. 执行维护。
1. 将节点添加回集群。
 1. 重新加载 systemd 配置。

        ```bash
        ﻿⁠⁠sudo systemctl daemon-reload
        ```

 1. 删除代理节点上的 `latest` 元数据指针：

        ```bash
        ⁠⁠⁠⁠sudo rm /var/lib/mesos/slave/meta/slaves/latest
        ```

 1. 使用新配置的属性和资源规范启动代理。

 - **私有代理**

            ```bash
            sudo systemctl start dcos-mesos-slave
            ```
 - **公共代理**

            ```bash
            sudo systemctl start dcos-mesos-slave-public
            ```

 **提示：** 您可以使用以下命令检查状态：

        ```bash
        sudo systemctl status dcos-mesos-slave
        ```
