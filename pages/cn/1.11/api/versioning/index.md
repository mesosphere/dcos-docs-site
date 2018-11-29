---
layout: layout.pug
navigationTitle: API 版本控制
title: API 版本控制
menuWeight: 20
excerpt: 理解组件、资源和路由版本控制

enterprise: false
---

DC/OS API 由多个松散耦合组件支持；有些是独立项目，其他是专为 DC/OS 设计的项目。因此，它支持多种版本控制机制：组件、路由和资源版本控制。

要了解如何制定特定的 API 调用，请参阅该路由的组件 API 参考文档。

# 组件版本控制

使用自己的开源社区的组件（如 Mesos、Marathon和 Mesos DNS）具有基于其普遍使用的组件名称的路由。这些路由将版本控制委派给后端组件服务。

例如，[Marathon 组件](/cn/1.11/overview/architecture/components/#marathon)在路由`/service/marathon`下为 [Marathon API](/cn/1.11/deploying-services/marathon-api/)提供服务，其中一个资源路径是`/v2/apps`，所以该资源的完整路径是 `/service/marathon/v2/apps`。

# 路由版本控制

专为 DC/OS 设计的组件通常遵循另一个版本控制模式，其组件名称重要性在特征集的名称之后。这些路由通常包括一个以便之后更轻松地支持重命名或更换组件的版本。

例如，[DC/OS 诊断组件](/cn/1.11/overview/architecture/components/#dcos-diagnostics)在路由`/system/health/v1`下为 [System Health API](/cn/1.11/monitoring/#system-health-http-api-endpoint)服务，其中一个资源路径是 `/report`，所以该资源的完整路径是 `/system/health/v1/report`。

# 资源版本控制

部分组件完全避开路径版本控制，并在资源级别使用内容协商，以同时支持同一路径的多个 API 版本。

例如，[DC/OS Package Manager (Cosmos) 组件](/cn/1.11/overview/architecture/components/#dcos-package-manager)在路由`/package` 下为 [Package API](/cn/1.11/deploying-services/package-api/)服务，其中一个资源路径是`/list`，所以该资源的完整路径是 `/package/list`。请求的版本和所期待的应答版本分别由 `Content-Type` 和 `Accept` HTTP 标头指定：

```
Content-Type: application/vnd.dcos.package.list-request+json;charset=utf-8;version=v1
Accept:       application/vnd.dcos.package.list-response+json;charset=utf-8;version=v1
```
