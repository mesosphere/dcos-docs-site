---
layout: layout.pug
title: 向 Datadog 发送 DC/OS 度量标准
menuWeight: 3
excerpt: 向 Datadog 发送 DC/OS 度量标准
beta: false
enterprise: false
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


Datadog 度量标准插件支持直接从 DC/OS 度量标准服务发送度量标准到 [DatadogHQ](https://www.datadoghq.com/)。此插件包括 Datadog 代理的函数。必须在集群中的每个节点上安装此插件。此插件适用于 DC/OS 1.9.4 及更高版本。

**先决条件：**

- 必须 [安装 DC/OS CLI](/cn/1.11/cli/install/) 并通过 `dcos auth login` 命令以超级用户身份登户。

# 安装 DC/OS Datadog 度量标准插件

对于集群中的每个节点，先传输插件的二进制文件，然后添加一个 `systemd` 单元以管理该服务。此单元在管理节点和代理节点之间略有不同。

1. 在集群中的每个节点上：

 1. 从 downloads.mesosphere.io 下载最新的 Datadog 插件二进制文件：[datadog-plugin](https://downloads.mesosphere.io/dcos-metrics/plugins/datadog)
 1. 将插件重命名为 `dcos-metrics-datadog` 并移至 `/opt/mesosphere/bin`。
 1. 为插件分配权限：`chmod 0755 /opt/mesosphere/bin/dcos-metrics-datadog`。

1. 在每个管理节点上：
 1. 从 downloads.mesosphere.io 下载插件 `systemd` 服务文件：[datadog-plugin.service](https://downloads.mesosphere.io/dcos-metrics/plugins/datadog.service)
 1. 将服务文件复制到 `/etc/systemd/system/dcos-metrics-datadog.service`。编辑此文件，确保角色标记设置为“master”，并填写您的 [Datadog API 密钥](https://app.datadoghq.com/account/settings#api)

        ```
        [Unit]
        Description=DC/OS Metrics Datadog Plugin

        [Service]
        ExecStart=/opt/mesosphere/bin/dcos-metrics-datadog -dcos-role master -datadog-key <Datadog_API_key>
        ```

 2. 通过运行 `systemd` 以重新加载 `sudo systemctl daemon-reload` 状态。
 3. 使用 `sudo systemctl start dcos-metrics-datadog` 启动 `systemd` 服务 。
 4. 使用命令 `sudo journalctl -u dcos-metrics-datadog` 查看系统日志并验证插件是否在运行。

1. 在每个代理节点上：
 1. 从 downloads.mesosphere.io 下载插件 `systemd` 服务文件：[datadog-plugin.service](https://downloads.mesosphere.io/dcos-metrics/plugins/datadog.service)
 1. 将服务文件复制到 `/etc/systemd/system/dcos-metrics-datadog.service`。
 1. 编辑此文件，确保角色标记设置为“agent”，并填写您的 [Datadog API 密钥](https://app.datadoghq.com/account/settings#api)

        ```
        [Unit]
        Description=DC/OS Metrics Datadog Plugin

        [Service]
        ExecStart=/opt/mesosphere/bin/dcos-metrics-datadog -dcos-role agent -datadog-key  <Datadog_API_key>
        ```

 3. 通过运行 `systemd` 以重新加载 `sudo systemctl daemon-reload` 状态。
 4. 使用 `sudo systemctl start dcos-metrics-datadog` 启动 `systemd` 服务 。
 5. 查看系统日志，并通过 `sudo journalctl -u dcos-metrics-datadog` 验证插件是否在运行。
