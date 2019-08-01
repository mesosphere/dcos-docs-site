---
layout: layout.pug
title: 向 Datadog 导出 DC/OS 度量标准
navigationTitle: 向 Datadog 导出 DC/OS 度量标准
menuWeight: 4
excerpt: 向 Datadog 发送 DC/OS 度量标准
beta: true
---


DC/OS 1.12 通过 [Telegraf] 发送度量标准(/cn/1.12/overview/architecture/components/#telegraf)，可以配置为将度量标准导出到 Datadog。无需像在 DC/OS 1.9 、1.10 和 1.11 中一样安装度量标准插件。本页说明如何将适当的配置添加到 DC/OS 中。


**前提条件：**

- 必须 [安装 DC/OS CLI](/mesosphere/dcos/cn/1.12/cli/install/) 并通过 `dcos auth login` 命令以超级用户身份登户。

# 配置 Telegraf 以将度量标准导出到 Datadog

1. 使用以下内容创建名为 `datadog.conf` 的文件：

    ```
    # Transmit all metrics to Datadog
    [[outputs.datadog]]
      ## Datadog API key
      apikey = "my-secret-key"
      ## Connection timeout
      # timeout = "5s"
    ```

1. 用 Datadog API 密钥替换 `apikey` 值。

1. 在群集中的每个节点上执行以下任务：

 1. 上传 `datadog.conf` 文件到 `/var/lib/dcos/telegraf/telegraf.d/datadog.conf`。
 1. 运行 `sudo systemctl restart dcos-telegraf` 命令，重新启动具有新配置的 Telegraf 进程。
 1. 检查 Datadog UI 以查看传入的 DC/OS 度量标准。
