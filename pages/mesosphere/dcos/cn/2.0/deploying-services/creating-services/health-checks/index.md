---
layout: layout.pug
navigationTitle:  状况检查
title: 状况检查
menuWeight: 200
excerpt: 定义 DC/OS 服务的运行状况检查
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

您可以为 DC/OS 服务定义运行状况检查。运行状况检查是基于每个应用定义的，并针对该应用程序的任务运行。运行状况检查会对分布在群集中的容器执行定期检查，以确保它们已启动并响应。如果运行状况检查因任何原因失败，Mesos 会将该任务报告为运行状况不佳，以便状态感知负载均衡器可以停止向容器发送流量。任务达到最大连续失败次数后，Marathon 将终止该任务并重新启动它。

在启动任务时立即开始运行状况检查。它们由 Mesos 在运行相应任务的代理节点上进行本地执行。运行状况检查的执行尽可能接近任务，因此它们不受网络故障的影响。运行状况检查将委派给运行任务的代理节点。这允许执行运行状况检查的任务数量与群集中的代理节点数量一起水平扩展。

- 默认运行状况检查利用 Mesos 对任务状态 `TASK_RUNNING => healthy` 的了解。
- Marathon 通过 [REST API](/mesosphere/dcos/2.0/deploying-services/marathon-api/) 提供任务资源的 `health` 成员，您可以将其添加到服务定义中。

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

创建服务时<>，您可以在 DC/OS GUI 中配置 JSON 运行状况检查，也可以直接配置为 JSON。此表显示同等的 GUI 字段和 JSON 选项。

| GUI | JSON | 默认 | 说明 |
|----------------------|--------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **宽限期 (S)** |`gracePeriodSeconds`| 15 | 指定在任务启动后立即忽略运行状况检查的时间（秒）；或直到任务第一次变健康为止。|
| **间隔 (S)** | `intervalSeconds` | 10 | 指定在运行状况检查之间等待的时间（秒）。|
| **最大故障数** | `maxConsecutiveFailures` | 3 | 指定在任务被终止之前可能发生的连续运行状况检查故障数。|
| **协议** | `protocol` | HTTP | 指定请求的协议：`HTTP`、`HTTPS`、`TCP` 或 `Command`。|
| **服务端点** | `path` | \ | 如果 `"protocol": "HTTP"`，此选项指定任务健康状态端点的路径。例如， `“/path/to/health”`。|
| 不适用 | `portIndex` | 0 | 指定用于运行状况请求的端口阵列中的端口索引。端口索引允许应用程序使用任何端口，如 `“[0, 0, 0]”`，并且任务可以从端口环境变量开始，如 `$PORT1`。|
| **超时 (S)** | `timeoutSeconds` | 20 | 指定运行状况检查失败之前的时间（秒），而不管响应如何。|


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

以下是使用 DC/OS UI 指定的相同运行状况检查。

![GUI 运行状况检查](/mesosphere/dcos/2.0/img/health-check-gui.png)

图 1. Web 界面运行状况检查

## 命令运行状况检查性能

部署使用命令运行状况检查的服务时，必须考虑运行状况检查本身消耗的资源。如果运行状况检查执行的命令要求运行大量 CPU 或内存，则应将这些资源添加到任务的资源需求上。在任务仅指定非常少 CPU 的情况下，即使是琐细的运行状况检查也会难以可靠运行，因此，至少应对任何使用命令运行状况检查的任务指定 1.0 CPU。

任务指定频繁运行状况检查而间隔时间只有几秒钟时，或者在一台计算机上运行命令运行状况检查的大量任务时，大量的运行状况检查可能会影响代理性能。测试表明，代理节点可能具有每秒运行大约 10-18 个运行状况检查的能力，具体取决于硬件。为了估算工作负载可在代理上运行的总运行状况检查率，可以执行如下计算：

```
Health check interval of 30 seconds = 2 health checks per minute
30 tasks running on an agent = 60 health checks per minute, or 1 health check per second
```

部署使用命令运行状况检查的生产工作负载时，为确定适当命令运行状况检查设置，**动手测试是您可以使用的最重要的工具**。进入生产前，在单个代理节点上运行执行有命令运行状况检查的实际服务数目的测试，并对这些服务应用现实的实际负载，以确定运行状况检查是否能够根据您为任务指定的资源分配来确定运行状况检查可靠成功。

## 更多信息
查看[这篇博文](https://mesosphere.com/blog/2017/05/16/13-factor-app-building-releasing-for-cloud-native/) 了解有关运行状况检查的更多信息。
