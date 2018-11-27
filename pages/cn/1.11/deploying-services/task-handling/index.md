---
layout: layout.pug
navigationTitle: 任务处理
title: 任务处理
menuWeight: 1
excerpt: 了解 Marathon 任务类别

enterprise: false
---

Marathon 将任务分为三类：初始、非终端和终端。这些类别中的任务可能处于下图所示的几种状态之一。如需了解任务的状态，可以查看数据中心操作系统日志或查询 [ Marathon  API](http://mesosphere.github.io/marathon/api-console/index.html) 的 [事件流](http://mesosphere.github.io/marathon/docs/event-bus.html) (/v2/events)。

也可以 [在无法访问任务时配置 Marathon 的行为](/cn/1.11/deploying-services/task-handling/configure-task-handling/)。

![Task Handling Flow](/cn/1.11/img/task-handling-corrected.png)

图 1. 任务处理图

# 终端状态

```
case TASK_ERROR => Error
```
任务描述包含错误。Marathon 将任务标记为错误之后，就会将其排除并启动新的任务。

```
case TASK_FAILED => Failed
```
任务未能成功完成。Marathon 将任务标记为失败后，就会将其排除并启动新的任务。

```
case TASK_DROPPED => Dropped
```
任务因瞬时错误而无法启动。任务的执行器从未启动运行。与 TASK_ERROR 不同，任务描述有效，尝试再次启动任务可能会成功。

```
case TASK_GONE => Gone
```

任务在已关闭的代理上运行（例如，代理已分区、重新启动，然后重新连接到管理节点；在重新启动之前运行的任何任务都会从“无法访问”转换为“消失”）。任务不再运行。Marathon 将任务标记为消失后，就会将其排除并启动新的任务。

```
case TASK_GONE_BY_OPERATOR => Gone
```
任务在管理节点联系不到的代理上运行；算子断定该代理已关闭，但尚未得到管理节点的直接确认。如果算子正确，则任务不运行，而且这是终端状态；如果算子错误，则任务仍可能运行，并且将来可能恢复为“运行”状态。Marathon 将任务标记为失败后，就会将其排除并启动新的任务。

```
case TASK_FINISHED => Finished
```
任务成功完成。

```
case TASK_UNKNOWN => Unknown
```
管理节点不知晓该任务。这通常是因为 (a) 管理节点从未知晓任务，或 (b) 管理节点的垃圾收集器收集了该任务的元数据，所以忘记了该任务。任务可能仍在运行，也可能不再运行。Marathon 收到“未知”消息后，就会排除该任务并启动新的任务。

```
case TASK_KILLED => Killed
```
任务被执行器关闭。

# 非终端状态

```
case TASK_STAGING => Staging
```
初始状态：任务正在临时阶段。

```
case TASK_STARTING => Starting
```
执行器正在启动任务。

```
case TASK_RUNNING => Running
```
任务正在运行。

```
case TASK_KILLING => Killing
```
任务被执行器关闭。

```
case TASK_UNREACHABLE => Unreachable
```
任务在与管理节点失去联系的代理上运行，通常是因为网络故障或分区。任务可能仍在运行，也可能不再运行。Marathon 收到“任务不可访问”消息之后，就会启动替换任务。如果不可访问的时间超过 15 分钟，Marathon 就会将任务标记为未知，然后排除任务。

