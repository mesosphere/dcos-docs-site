---
layout: layout.pug
navigationTitle: 度量标准 API
title: 度量标准 API
menuWeight: 6
excerpt: 使用度量标准 API
beta: false
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

您可以使用度量标准 API 定期轮询有关群集、主机、容器和应用程序的数据。度量标准 API 是从 DC/OS 获取度量标准的一种方式。它专为针对特定任务和主机的偶尔访问而设计。这并不是了解 DC/OS 上所有度量标准整体情况的最佳方式。请参阅 [Prometheus](/cn/1.12/metrics/prometheus/) 和 [第三方插件](https://github.com/dcos/dcos-metrics/blob/master/plugins/CONTRIBUTING.md)了解度量标准文档。

度量标准 API 由 [Telegraf](/cn/1.12/overview/architecture/components/#telegraf) 支持，后者在群集中的所有节点上运行。

要开始使用 DC/OS 度量标准组件以及了解如何使用度量 API，请参阅 [度量快速入门指南](/cn/1.12/metrics/quickstart/)。


# 路由

对度量标准 API 的访问是通过 Admin Router 向每个节点代理的。当前首要节点的统计数据以以下作为开头：

```
/system/v1/metrics/v0/
```

<p class="message--important"><strong>重要信息：</strong><code>/system/v1/metrics/v0/</code> 预计在管理节点上会显示为 404。</p>

代理节点的统计数据以以下作为开头：

```
/system/v1/agent/{agent_id}/metrics/v0/
```

要确定群集的 URL，请参阅 [群集访问](/cn/1.12/api/access/)。节点的代理 ID 为其 Mesos ID。


# 格式

Mesos API 的请求和响应主体被编排成 JSON 格式。

请求必须包含接受标题：

```
Accept: application/json
```

响应将包括内容类型标题：

```
Content-Type: application/json
```


# 验证

所有度量标准 API 路由需要认证才能使用。

要验证 API 请求，请参阅 [获取认证令牌](/cn/1.12/security/ent/iam-api/#obtaining-an-authentication-token) 和 [传递认证令牌](/cn/1.12/security/ent/iam-api/#passing-an-authentication-token) 文档。

度量标准 API 还需要通过以下权限授权：

| 路由 | 权限 |
|-------|----------|
| `/system/v1/metrics/v0/` | `dcos:adminrouter:ops:system-metrics` |
| `/system/v1/agent/{agent_id}/metrics/v0/` | `dcos:adminrouter:system:agent` |

用户也可以通过 `dcos:superuser` 权限获得所有路由。

要为您的帐户分配权限，请参阅 [权限参考](/cn/1.12/security/ent/perms-reference/) 文档。


# 资源

以上两个路由均提供以下资源：

[swagger api='/1.12/api/metrics.yaml']
