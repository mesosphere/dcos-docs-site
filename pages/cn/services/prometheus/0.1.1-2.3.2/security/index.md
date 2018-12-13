---
layout: layout.pug
navigationTitle:
excerpt: DC/OS Prometheus 安全
title: 安全
menuWeight: 50
model: /cn/services/prometheus/data.yml
render: mustache
---



## 使用 TLS 加密保护 Prometheus API 和 UI 端点

Prometheus 不直接支持用于连接 Prometheus 实例（例如表达式浏览器或 HTTP API）的传输层安全（TLS）加密。如果您希望对这些连接执行 TLS，我们建议结合使用 Prometheus 与反向代理，并在代理层应用 TLS。

请参阅 [Prometheus 文档](https://prometheus.io/docs/guides/tls-encryption/)。
