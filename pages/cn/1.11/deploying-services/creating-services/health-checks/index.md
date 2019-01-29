---
layout: layout.pug
navigationTitle: 状况检查
title: 状况检查
menuWeight: 200
excerpt: 定义 DC/OS 服务的运行状况检查

enterprise: false
---



您可以为 DC/OS 服务定义运行状况检查。运行状况检查是基于每个应用定义的，并针对该应用程序的任务运行。运行状况检查会对分布在集群中的容器执行定期检查，以确保它们已启动并响应。如果运行状况检查因任何原因失败，Mesos 会将该任务报告为运行状况不佳，以便状态感知负载均衡器可以停止向容器发送流量。任务达到最大连续失败次数后，Marathon 将终止该任务并重新启动它。

在启动任务时立即开始运行状况检查。它们由 Mesos 在运行相应任务的代理节点上进行本地执行。运行状况检查的执行尽可能接近任务的开始，好让它们不受网络故障的影响。运行状况检查将分配给运行任务的代理节点。这允许执行运行状况检查的任务数量与集群中的代理节点数量一起水平扩展。

- 默认运行状况检查利用 Mesos 对任务状态 `TASK_RUNNING => healthy` 的了解。
- Marathon 通过 [REST API](/cn/1.11/deploying-services/marathon-api/) 提供任务资源的 `health` 成员，您可以将其添加到服务定义中。

如果满足这两个条件，则视为运行状况检查：

- HTTP 响应代码介于 200 和 399（含） 之间。
- 在 `timeoutSeconds` 期间收到响应。如果任务连续失败超过 `maxConsecutiveFailures` 运行状况检查，则该任务将被终止。

您可以在 JSON 应用定义或 DC/OS GUI **Services** 选项卡中定义运行状况检查。您还可以定义要执行运行状况检查的自定义命令。这些可以在 Dockerfile 中定义，例如：

```json
{
  "protocol": "COMMAND",
  "command": { "value": "source ./myHealthCheck.sh" }
}
```

# 运行状况检查协议

DC/OS 支持以下运行状况检查协议：

- `MESOS_HTTP`
- `MESOS_HTTPS`
- `MESOS_TCP`
- `COMMAND`

# 运行状况检查选项

创建服务时，您可以在 DC/OS GUI 中配置 JSON 运行状况检查，也可以直接配置为 JSON。此表显示同等的 GUI 字段和 JSON 选项。

| GUI | JSON | 默认 | 说明 |
|----------------------|--------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **宽限期 (S)** |gracePeriodSeconds| 15 | 指定在任务刚启动后忽略运行状况检查的时间（秒）；或直到任务第一次运转良好。 |
| **间隔 (S)** | intervalSeconds | 10 | 指定在运行状况检查之间等待的时间（秒）|
| **最大故障** | maxLogitivEfailures | 3 | 指定在任务被终止之前可能发生的连续运行状况检查故障数 |
| **协议** | 协议 | HTTP | 指定请求的协议：`HTTP`， `HTTPS`、 `TCP` 或 `Command`。|
| **服务端点** | 路径 | \ | 如果 `"protocol": "HTTP"`，此选项指定任务健康状态端点的路径。例如， `“/path/to/health”`。|
| 不适用 | portIndex | 0 | 指定用于运行状况请求的端口阵列中的端口索引。端口索引允许应用程序使用任何端口，如 `“[0, 0, 0]”`，并且任务可以从端口环境变量开始，如 `$PORT1`。|
| **超时 (S)** | timeoutSeconds | 20 | 指定运行状况检查失败之前的时间（秒），而不管响应为何。 |


例如，以下是在应用定义中指定为 JSON 的运行状况检查。

```json
"healthChecks": [
  {
    "gracePeriodSeconds": 120,
    "intervalSeconds": 30,
    "maxConsecutiveFailures": 0,
    "path": "/admin/healthcheck",
    "portIndex": 0,
    "protocol": "MESOS_HTTP",
    "timeoutSeconds": 5
  } ]
```

以下是使用 DC/OS GUI 指定的相同运行状况检查。

![GUI 运行状况检查](/cn/1.11/img/health-check-gui.png)

图 1. Web 界面运行状况检查

## 更多信息
查看[这篇博文](https://mesosphere.com/blog/2017/05/16/13-factor-app-building-releasing-for-cloud-native/) 了解有关运行状况检查的更多信息。
