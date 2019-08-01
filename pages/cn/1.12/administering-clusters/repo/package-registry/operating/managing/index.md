---
layout: layout.pug
navigationTitle: 管理
title: 管理
menuWeight: 35
excerpt: 管理 DC/OS 包注册表
enterprise: true
---

# 更新设置

安装引导程序注册表后执行 `dcos package describe --config package-registry` 可为您提供多种配置选项。服务选项只能通过 DC/OS GUI 更新。

## 监测和运行状况检查

DC/OS 包注册表服务会公开 HTTP API 端点 (`/health`) 用于检查注册表的运行状况。在 DC/OS 中部署此服务时，Mesos 代理节点命令运行状况检查程序配置为检查其运行状况。使用 `dcos marathon task list <service-name>` 命令以获取所有容器及其运行状况的列表。

```bash
dcos marathon task list registry
```

# 故障排除

## 日志

使用 [`dcos task log`](/mesosphere/dcos/cn/1.12/monitoring/logging/quickstart/#view-the-mesos-and-dcos-logs) 命令下载 DC/OS 包注册表日志。DC/OS 还支持 [日志聚合](/mesosphere/dcos/cn/1.12/monitoring/logging/aggregating/)。假设再次使用默认服务名称 `registry`，可以使用以下方式获取最新的日志条目：

```bash
dcos task log registry
```

## 度量标准

DC/OS 包注册表将应用度量标准报告给 DC/OS 度量标准服务。可以使用 `dcos task metrics details` 获取这些最新的值：

```bash
dcos task metrics details registry | sort
```

## 灾难恢复

DC/OS 包注册表不提供对于灾难恢复的本机支持。然而，建议您先备份所有 DC/OS 包，然后再将它们添加到 DC/OS 包注册表。
