---
layout: layout.pug
navigationTitle: 任务类型
title: 任务类型
menuWeight: 2
excerpt: 了解 Mesos 任务

enterprise: false
---

DC/OS 可运行许多由任务组成的许多不同类型的工作负载。DC/OS 任务是已由 DC/OS 内置调度器或 DC/OS 上运行的调度器服务安排的 [Mesos 任务](/cn/1.11/overview/concepts/#mesos-task)。

# 执行器

当 [调度器](/cn/1.11/overview/concepts/#dcos-scheduler) 启动一个任务时， 它指定一个 [Mesos 执行器](/cn/1.11/overview/concepts/#mesos-executor)，然后执行此任务。在 Mesos 中，调度器及其执行器被称为 [框架](/cn/1.11/overview/concepts/#mesos-framework)，但在更广泛的 DC/OS 背景下，我们经常使用“调度器”、“执行器”和“任务”等具体词语。

### 内置执行器

Mesos 包括可供所有调度器使用的内置执行器，但调度器也可以使用自己的执行器。

- 命令执行器 - 执行 shell 命令或 Docker 容器
- 默认执行器 (Mesos 1.1) - 执行一组 shell 命令或 Docker 容器

有关 Mesos 执行器的更多信息，请参阅 [Mesos 框架开发指南](https://mesos.apache.org/documentation/latest/app-framework-development-guide/)

## 调度器

由于任务系统非常通用，因此用户一般不会直接创建任务或与任务交互。相反，调度器通常提供更高级别的抽象。

### 内置调度器

DC/OS 有两个内置调度器：

- Marathon 调度器提供服务（应用程序和 Pod），这些服务持续且同时运行。有关 Marathon 服务的更多信息，请参阅 [部署服务文档](/cn/1.11/deploying-services/) 或 [Marathon 文档](https://mesosphere.github.io/marathon/docs/)。
- Metronome 调度器提供立即运行或按定义计划运行的作业。有关 Metronome 作业的更多信息，请参阅 [部署作业文档](/cn/1.11/deploying-jobs/)。

### 用户空间调度器

其他调度器可以从 [Mesosphere Universe](/cn/1.11/overview/concepts/#mesosphere-universe) 或直接通过 Marathon作为 [调度器服务](/cn/1.11/overview/concepts/#dcos-scheduler-service) 安装在 Marathon 上。

用户空间调度器的示例：

- Kafka 调度器提供 Kafka 中间人，后者作为生命周期管理的 Kafka 节点运行。
- Cassandra 调度器提供 Cassandra 节点，后者作为生命周期管理的 Cassandra 节点运行。
- Spark 调度器（调度程序）提供 Spark 作业，这些自身是 Spark 任务的调度器。

有关可安装安排程序（及其他软件包）的完整列表，请参阅 [Mesosphere Universe 软件包列表](https://universe.dcos.io/#/)。
