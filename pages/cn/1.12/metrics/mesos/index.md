---
layout: layout.pug
title: 启用 Mesos 度量标准
navigationTitle: 启用 Mesos 度量标准
menuWeight: 3
excerpt: 使用 Telegraf 监测 Mesos
enterprise: false
---

可以配置 DC/OS 版本 1.12 或更新版本，以从每个 Mesos 代理节点和管理节点收集 [观察性度量标准](http://mesos.apache.org/documentation/latest/monitoring/)。

Telegraf 中的 Mesos 输入插件由名为 `enable_mesos_input_plugin` 的 `config.yaml` 文件中的选项控制。要启用插件，`enable_mesos_input_plugin` 需要设置为 `true`（目前默认为 `false`）。有关如何为本地安装创建配置文件的说明，请参见 [此处](/cn/1.12/installing/production/deploying-dcos/installation/#create-a-configuration-file)。要修改现有本地群集上的配置文件，必须 [修补现有 DC/OS 版本](/cn/1.12/installing/production/patching/#modifying-dcos-configuration)。对于云安装，可以在 [此处](/cn/1.12/installing/evaluation/)找到每个受支持的云提供商的配置和安装说明。

＃查看 Mesos 管理节点和代理节点的度量标准
 
可在 [观察性度量标准](http://mesos.apache.org/documentation/latest/monitoring/)的 Mesos 文档中查看 Mesos 生成的度量标准的完整列表。请注意，存储度量标准的数据库可能要求修改度量标准名称。例如，Prometheus 度量标准名称中禁止使用正斜杠 (/) 字符，因此 Prometheus 中可将 `master/uptime_secs` 名称用作 `master_uptime_secs`。
