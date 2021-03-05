---
layout: layout.pug
navigationTitle: 度量标准
title: 度量标准
menuWeight: 100
excerpt: 了解 DC/OS 的度量标准组件
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---

# 概述

DC/OS 包括全面的度量标准服务，从 DC/OS 群集主机、容器以及这些主机上运行的应用程序提供度量标准。它收集、标记并从 DC/OS 群集中的每个节点、容器以及应用程序传输度量标准。度量标准可通过 DC/OS 度量标准 API 获得，以便轻松与各种监控解决方案集成。

# 度量标准的类型

DC/OS 采集四种度量标准，如下所示：

- **系统：** DC/OS 群集中每个节点的度量标准。
- **组件：** 组成 DC/OS 的组件的度量标准。
- **容器：** 关于根据 DC/OS [通用容器运行时](/mesosphere/dcos/cn/2.1/deploying-services/containerizers/ucr/) 或 [Docker 引擎](/mesosphere/dcos/cn/2.1/deploying-services/containerizers/docker-containerizer/) 运行时中运行的任务进行 `cgroup` 分配的度量标准。
- **应用程序：** 在通用容器运行时运行的任何应用程序发出的度量标准。

# 度量标准的操作

您可以对度量标准执行以下操作：

1. **添加度量标准：** 您可以从您的应用程序将自定义度量标准添加到 DC/OS 度量标准服务。DC/OS 度量标准倾听`StatsD`是否有来自与 Mesos 容器化工具一起运行的每个应用程序的度量标准。`StatsD server` 对每个容器揭示，让您可以按出处标记所有度量标准。通过注入标准环境变量 `STATSD_UDP_HOST` 和 `STATSD_UDP_PORT`.，其地址可供应用程序使用。

   或者，您也可以通过揭示一个相应的端点来提供 Prometheus 格式的度量标准。要通知您的任务正在服务 Prometheus 度量标准的度量标准服务，您需要至少使用标签 `DCOS_METRICS_FORMAT=prometheus` 添加一个端口。然后，在任务的生命周期内，每分钟将取消一次相应的端口。
   以这种方式收集的度量标准将标记有发起任务的名称及其框架名称。

   以下是应用定义示例，带有具有上述标签的端口定义和一个 `cmd` ，以揭示一些 `/metrics`。

   ```json
   {
     "id": "/metrics-example-app",
     "portDefinitions": [
       {
         "name": "prometheus",
         "port": 0,
         "labels": { "DCOS_METRICS_FORMAT": "prometheus" }
       }
     ],
     "container": {
       "type": "MESOS",
       "docker": { "image": "python:3" }
     },
     "cpus": 0.1,
     "mem": 128,
     "cmd": "echo \"# TYPE test_metric untyped\ntest_metric 123456\n\" > metrics;\npython3 -m http.server $PORT0\n"
   }
   ```

   当上述示例正在运行时，您可以通过直接请求群集内的端点（例如，通过 `curl alertmanager.prometheus.l4lb.thisdcos.directory:9093/metrics`）或使用 `dcos task metrics details <TASK_ID>` 来获得 `test_metric`。后者的输出应与以下内容类似。在最后一行中备注 `test_metric`。

   ```
   NAME VALUE
   mem.cache_bytes 1794048
   mem.file_bytes 1794048
   cpus.user_time_secs 0.49
   cpus.throttled_time_secs 1.57
   cpus.system_time_secs 0.13
   mem.total_bytes 25055232
   perf.timestamp 1561374937.08
   mem.anon_bytes 20635648
   cpus.nr_throttled 20
   mem.limit_bytes 167772160
   mem.rss_bytes 20635648
   cpus.nr_periods 3230
   cpus.limit 0.20
   test_metric 123456
   ```

   如需更多信息，请查看有关 [如何使用 Python 将自定义度量标准添加到 DC/OS 度量标准 API ]的文档。(https://mesosphere.com/blog/custommetrics/).

2. **标记度量标准：** 标记自动添加到度量标准以便识别，支持轻松钻取、筛选度量标准数据和进行分组。标记不限于以下列表：

   - 容器识别（对于所有容器和应用度量标准）：container_id、executor_id、framework_id、framework_name
   - 应用程序识别（例如，对于 Marathon 应用）：application_name
   - 系统识别：agent_id
     例如：管理员可以根据以下标记识别度量标准组：
     - `agent_id` - 检测系统特定的情况（例如，磁盘故障）。
     - `framework_id` - 检测哪些 Mesos 框架使用系统中的最多资源。
     - `container_id` - 显示相同的信息，除非具有每容器粒度。

3. **转发度量标准：** 从应用程序和主机收集度量标准之后，它可以转发给各种度量标准存储库。配置 Telegraf 插件以从群集转发度量标准数据。

4. **监控和可视化度量标准：** 建议安装 DC/OS 监控服务，以监控和可视化 DC/OS 群集中的度量标准。请参阅 [服务文档](/mesosphere/dcos/cn/services/dcos-monitoring/1.0.0/operations/install/) 了解有关如何安装和使用该服务的说明。

# Telegraf

DC/OS 1.12 版或更新版本中的度量标准使用 [Telegraf](/mesosphere/dcos/cn/2.1/overview/architecture/components/#telegraf) 收集和处理数据。Telegraf 提供插件驱动型架构。自定义 DC/OS 插件提供关于 DC/OS 工作负载和 DC/OS 本身性能的度量标准。Telegraf 使用 `StatsD` 进程提供采集自 DC/OS 群集主机、在这些主机上运行的容器以及在 DC/OS 上运行的应用程序的度量标准。它与 DC/OS 实现本地集成。默认情况下，它在每个节点上以 Prometheus 格式公开来自 `port 61091` 的度量标准，并通过 DC/OS [度量标准 API](/mesosphere/dcos/cn/2.1/metrics/metrics-api/).以 JSON 格式公开。Telegraf 包含在 DC/OS 分布中，并在群集中的每个主机上运行。

## 使用 Telegraf

Telegraf 通过 `dcos_statsd` 插件收集应用程序和自定义度量标准。为每个新任务启动专用的 `StatsD` 服务器。`StatsD` 服务器收到的任何度量标准都标有任务名称及其服务名称。服务器的地址由环境变量（`STATSD_UDP_HOST` 和 `STATSD_UDP_PORT`).）提供。

<p class="message--note"><strong>注意：</strong>任务完成时，发送但未被 Telegraf 收集的度量标准将被丢弃。</p>

`dcos_statsd` 收集的度量标准每 30 秒采集一次。任务必须运行至少 30 秒才能确保收集任务的度量标准。

有关 DC/OS 自动收集的度量标准列表的详细信息，请阅读 [度量标准参考](/mesosphere/dcos/cn/2.1/metrics/reference/) 文档。

# 故障排除

使用以下故障排除指南解决错误：

- 可以通过启用 `inputs.internal` 插件来收集有关 Telegraf 自身性能的度量标准。
- 可以通过运行 `systemd` 来检查 Telegraf `systemctl status dcos-telegraf`. 设备的状态。
- 可以通过  从期刊获得日志。`journalctl -u dcos-telegraf`.
