---
layout: layout.pug
navigationTitle: 性能监控
title: 性能监控
menuWeight: 1
excerpt: 监控 DC/OS 集群

enterprise: false
---

以下是监控 DC/OS 集群的一些建议。您可以使用任何监控工具。下面列出的端点有助于您在发生问题时解决问题。

您的监控工具应利用历史数据点，以便跟踪变更和偏差。已知处于健康状态和不健康状态时，您应对集群进行监控。这可以为 DC/OS 环境中的“正常”提供基准。使用此历史数据，您可以微调工具，设置适当的阈值和条件。超出这些阈值时，您可以向管理员发送警报。

Mesos 和 Marathon 揭示以下类型的度量标准：

* 仪表是指在查询时提供当前状态的度量标准。
* 计数器具有添加性的度量标准，包括过去和现在的结果。这些度量标准不会在故障切换过程中持续存在。

Marathon 有一个计时器度量标准，用以确定事件出现了多长时间。计时器对 Mesos 可观察性度量标准而言不存在。

## Marathon 度量标准

Marathon 提供了许多用于监控的 [度量标准][1]。以下是对 DC/OS 特别有用的内容。您可以在 `<Master-Public-IP>/marathon/metrics` 查询 DC/OS 集群中的度量标准 HTTP 端点。

**终身度量标准**

* `service.mesosphere.marathon.uptime`（仪表）此度量标准提供报告 Marathon 进程的正常运行时间，以毫秒为单位。使用此度量标准来诊断可能导致 Marathon 重启的稳定性问题。
* `service.mesosphere.marathon.leaderDuration`（仪表）此度量标准提供自上次领导者选举以来的时间，以毫秒为单位。使用此度量标准来诊断稳定性问题并确定领导者选举的频率。

**正在运行的任务**

* `service.mesosphere.marathon.task.running.count`（仪表）此度量标准提供正在运行的任务的数量。

**分阶段的任务**

* `service.mesosphere.marathon.task.staged.count`（仪表）此度量标准提供分阶段的任务的数量。任务在启动后立即分阶段。分阶段任务的数量一直很大表示有大量任务正在停止和重启。这可能由以下原因导致：

 * 大量应用程序更新或手动重启。
 * 经常自动重启的应用程序存在稳定性问题。

**任务更新状态**

* `service.mesosphere.marathon.core.task.update.impl.ThrottlingTaskStatusUpdateProcessor.queued`（仪表）此度量标准提供队列状态更新的数量。
* `service.mesosphere.marathon.core.task.update.impl.ThrottlingTaskStatusUpdateProcessor.processing`（仪表）此度量标准提供当前正在进行的状态更新的数量。
* `service.mesosphere.marathon.core.task.update.impl.TaskStatusUpdateProcessorImpl.publishFuture`（计时器）此度量标准计算 Marathon 处理状态更新所花的时间。

**应用程序和组计数**

* `service.mesosphere.marathon.app.count`（仪表）此度量标准提供定义的应用程序的数量。定义的应用程序的数量影响 Marathon 性能：定义的应用程序越多，Marathon 的性能就越低。
* `service.mesosphere.marathon.group.count`（仪表）此度量标准提供定义的群组的数量。定义的群组的数量影响 Marathon 性能：定义的群组越多，Marathon 的性能就越低。

**Marathon 和 Mesos 之间的通信**

如果健康，这些度量标准应始终在增加。

* `service.mesosphere.marathon.core.launcher.impl.OfferProcessorImpl.incomingOffers` 此度量标准提供 Mesos 从 Marathon 接收的邀约的数量。
* `service.mesosphere.marathon.MarathonScheduler.resourceOffers` 此 [Dropwizard](http://metrics.dropwizard.io/3.1.0/manual/core/) 度量标准衡量 Marathon 从 Mesos 接收的资源邀约的数量。
* `service.mesosphere.marathon.MarathonScheduler.statusUpdate` 此 [Dropwizard](http://metrics.dropwizard.io/3.1.0/manual/core/) 度量标准衡量 Marathon 从 Mesos 接收的状态更新的数量。

## Mesos 度量标准

Mesos 提供了许多用于监控的 [度量标准][2]。以下是对 DC/OS 特别有用的内容。

### 管理节点

** 这些度量标准不应随时间推移而增加** 如果这些度量标准增加，则可能哪里出错了。

* `master/slave_reregistrations`（计数器）此度量标准提供代理节点重新注册和重新启动的次数。使用此度量标准以及历史数据来确定发生网络分区时的偏差和峰值。如果此数字大幅增加，则集群出现停机，但已重新连接。
* `master/slave_removals`（计数器）此度量标准提供因各种原因（包括维护）而移除的代理节点的数量。在大量代理节点断开连接后，使用此度量标准确定网络分区。如果此数字严重偏离上一数字，应通知系统管理员（PagerDuty 等）。
* `master/tasks_error`（计数器）此度量标准提供无效任务的数量。
* `master/tasks_failed`（计数器）此度量标准提供失败任务的数量。
* `master/tasks_killed`（计数器）此度量标准提供被杀死任务的数量。
* `master/tasks_lost`（计数器）此度量标准提供丢失任务的数量。丢失任务是指任务被外部因素杀死或断开。当大量任务偏离前一历史数字时，使用此度量标准。
* `master/slaves_disconnected`（仪表）此度量标准提供断开的代理节点的数量。此度量标准与 `master/slave_removals` 一起很有用。如果代理节点断开连接，此数字将增加。如果代理节点重新连接，此数字将减少。
* `master/messages_kill_task`（计数器）此度量标准提供被杀死任务消息的数量。
* `master/slave_removals`（计数器）此度量标准提供在管理节点故障切换期间未重新注册的代理节点的数量。这是一个广泛的端点，结合了 `../reason_unhealthy`、`../reason_unregistered` 和 `../reason_registered`。您可以明确地监控或利用 `master/slave_removals/reason_unhealthy`、`master/slave_removals/reason_unregistered` 和 `master/slave_removals/reason_registered` 了解详情。
* `master/slave_removals/reason_unhealthy`（计数器）此度量标准提供由于未通过健康检查而失败的代理节点的数量。此端点返回不健康的代理节点的总数。
* `master/slave_removals/reason_unregistered`（计数器）此度量标准提供未注册代理节点的数量。如果此数字大幅增加，则表示管理节点或代理节点无法正常通信。使用此端点确定网络分区。
* `master/slave_removals/reason_registered`（计数器）此度量标准提供在新代理节点于同一地址处注册时被移除的代理节点的数量。新代理节点替代旧代理节点。此类事件应该很少见。如果此数字增加，则应通知系统管理员（PagerDuty 等）。

**这些度量标准不应随时间推移而减少**

* `master/slaves_active`（计数器）此度量标准提供活跃代理节点的数量。活跃代理节点的数量通过将 `slaves_connected` 和 `slave_disconnected` 加起来进行计算。
* `master/slaves_connected`（计数器）此度量标准提供已连接代理节点的数量。此数字应等于 Mesos 代理节点的总数 (`slaves_active`)。使用此度量确定集群总体健康状况为占总数的百分比。
* `master/elected`（仪表）此度量标准表示这是选择的管理节点。此度量标准应从所有管理节点获取并总计达 1。如果此数字在一段时间内不是 1，则应通知系统管理员（PagerDuty 等）。
* `master/uptime_secs`（仪表）此度量标准提供管理节点的正常运行时间，以秒为单位。此数字应至少为 5 分钟（300 秒），表示管理节点稳定。您可以使用这些度量标准来检测“波动”。例如，如果管理节点在 10 多分钟内正常运行时间少于 1 分钟（60 秒），则它可能已重启 10 次或更多次。
* `master/messages_decline_offers`（计数器）此度量标准提供被拒绝任务的数量。此数字应等于代理节点的数量乘以框架的数量。如果此数字降至一个较低值，则有些东西可能会变得匮乏。

### 代理节点

**这些度量标准不应随时间推移而减少**

* `slave/uptime_secs`（仪表）此度量标准提供代理节点的正常运行时间，以秒为单位。此数字应始终在增加。此数字重新设置为 `0` 时，表示代理节点进程已重启。您可以使用这些度量标准来检测“波动”。例如，如果代理节点在 10 多分钟内正常运行时间少于 1 分钟（60 秒），则它可能已重启 10 次或更多次。
* `slave/registered`（仪表）此度量标准指出该代理节点是否已向管理节点注册。该值应始终是 `1`。`0` 表示代理节点正在寻求加入新的管理节点。

## 概述

* 检查关键应用程序 API 端点的 Marathon 应用程序健康 API [端点][3]。
* 检查代理节点是否关闭：
 * 跟踪 `/var/log/mesos` 警告日志并注意 `Shutting down`
 * 指出已关闭多少代理节点的 Mesos 端点增加
* 检查 Mesos 管理节点的正常运行时间是否较短，这显示在 Mesos 度量标准中。
* 将 mom-marathon-service 日志记录级别从 `WARN` 变为 `INFO`。
* 修改 `mesos-master` 日志轮换配置以存储完整日志至少一天。

 * 确保管理节点有大量磁盘空间。
 * 将 `logrotation` 选项从 `rotate 7` 变为 `maxage 14` 或更多。例如：

        ```
        ...
        /var/log/mesos/* {
            olddir /var/log/mesos/archive
            maxsize 2000k
            daily
            maxage 14
            copytruncate
            postrotate
                find  /var/log/mesos /var/log/mesos/archive -mtime +14 -delete
            endscript
        }
        EOF
        ...
        ```


参阅 Apache Mesos [文档](http://mesos.apache.org/documentation/latest/monitoring/) 了解 Mesos 基本警报。

 [1]: https://mesosphere.github.io/marathon/docs/metrics.html
 [2]: http://mesos.apache.org/documentation/latest/monitoring/
 [3]: /1.11/deploying-services/marathon-api/#/apps
