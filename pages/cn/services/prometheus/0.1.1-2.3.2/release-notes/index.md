---
layout: layout.pug
navigationTitle: 版本注释
title: 版本注释
menuWeight: 130
excerpt: 版本 0.1.1-2.3.2 的发行说明
featureMaturity:
enterprise: false
---

Prometheus 发布说明。

# 版本 0.1.1-2.3.2

## 错误修复

- 修复在 CenTos 上出现的 jq 使用错误

# 版本 0.1.0-2.3.2

这是 DC/OS Prometheus 框架的首次发布。

* Prometheus v2.3.2、AlertManager v0.15.1、PushGateway v0.5.2
* 该框架提供了提供 Prometheus、AlertManager 和规则配置的选项。
* 默认 `prometheus` 配置抓取集群中的 DC/OS 管理节点、代理节点，并执行 Prometheus 自我监控。
