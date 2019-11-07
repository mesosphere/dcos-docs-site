---
layout: layout.pug
navigationTitle:  配置任务日志输出和保留
title: 配置任务日志输出和保留
menuWeight: 2
excerpt: 影响日志记录的任务环境变量
render: mustache
model：/mesosphere/dcos/2.0/data.yml
beta: false
enterprise: false
---


您可以修改任务日志的目标和日志保留
通过在其中指定以下任何环境变量修改
任务定义：

| 环境变量 | 默认 | 简述 |
|----------------------|---------|-------------------|
| `CONTAINER_LOGGER_DESTINATION_TYPE` | `logrotate` | 任务日志的指向：任务的沙盒或日志。|
| `CONTAINER_LOGGER_LOGROTATE_MAX_STDOUT_SIZE` | `2MB` | 沙盒中 stdout 文件在触发日志轮换之前的最大大小。|
| `CONTAINER_LOGGER_LOGROTATE_STDOUT_OPTIONS` | `rotate 9` | 轮换 stdout 文件时传递给 `logrotate` 的选项。|
| `CONTAINER_LOGGER_LOGROTATE_MAX_STDERR_SIZE` | `2MB` | 沙盒中 stderr 文件在触发日志轮换之前的最大大小。|
| `CONTAINER_LOGGER_LOGROTATE_STDERR_OPTIONS` | `rotate 9` | 轮换 stderr 文件时传递给 `logrotate` 的选项。|
| `CONTAINER_LOGGER_EXTRA_LABELS` | `"{}"` | 在输出到 journald 时标记每个日志行的额外密钥值对。|


# 详细信息

<p class="message--warning"><strong>警告：</strong>为这些选项指定无效值将导致该任务
启动失败。</p>

## 目标类型

`CONTAINER_LOGGER_DESTINATION_TYPE` 可能采用三个自变量：

* `logrotate` (默认)
* `journald`
* `journald+logrotate`

**不推荐** 使用 `journald` 选项，这是因为
[journald 性能问题](https://github.com/systemd/systemd/issues/5102)。
启用后，日志会直接通过管道传输到节点的日志中，同时还有
`AGENT_ID`、`EXECUTOR_ID` 和 `CONTAINER_ID` 等一些标签

`logrotate` 选项将放置日志（名为 `stdout` 和 `stderr`)
在任务沙盒内并创建附加文件，用于轮换这些
日志 (`*.logrotate.conf` 和 `*.logrotate.state`)。

请参阅 [记录参考](/mesosphere/dcos/2.0/monitoring/logging/logging-reference/)
了解如何读取这些日志的信息。

## 最大大小

`CONTAINER_LOGGER_LOGROTATE_MAX_STDOUT_SIZE` 和
`CONTAINER_LOGGER_LOGROTATE_MAX_STDERR_SIZE` 选项控制
这些日志文件的最大大小。达到此阈值后，日志轮换
就会被触发。

大小必须为小于 2^64 的整数，且后缀必须带有
`B`（字节）、`KB`、`MB`、`GB` 或 `TB` 的等单位。不应该在
整数和单位之间留有空格。

示例：

* `2MB`
* `1234B`
* `1TB`

<p class="message--important"><strong>重要信息：</strong>大小的规定上限为 2^64 字节。尝试指定更高的
值（例如 2^64 TB）将导致未确定的结果。</p>

## 禁用的日志轮换选项

禁用 `CONTAINER_LOGGER_LOGROTATE_STDOUT_OPTIONS` 和 `CONTAINER_LOGGER_LOGROTATE_STDERR_OPTIONS`，以防止滥用 `postrotate` 条款和其他注入式攻击。请参阅 [MESOS-9564](https://issues.apache.org/jira/browse/MESOS-9564)</a>
以获取更多信息。
