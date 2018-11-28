---
layout: layout.pug
navigationTitle: API 参考
title: API 参考
menuWeight: 150
excerpt: DC/OS API 参考手册

enterprise: true
---

DC/OS API 是由 [DC/OS 组件] (/1.11/overview/architecture/components/) 支持的一组路由，通过名为 [Admin Router] (/1.11/overview/architecture/components/#admin-router)的 API 网关提供。

<!-- Use html img for horizontal centering -->
<img src="/1.11/img/dcos-api-routing.png" alt="DC/OS API 路由" style="display:block;margin:0 auto"/>

图 1. DC/OS API 路由示意图

# API 网关

Admin Router 是基于 NGINX 的 API 网关，具有以下功能：

- 为 DC/OS API 提供统一控制平面
- 代理 API 对管理节点和代理节点的组件服务的请求
- 执行用户身份认证
- 提供 DC/OS GUI

Admin Router 在每个 DC/OS 节点上运行，其有如下两种配置：

- **Admin Router 管理节点** 公开 [管理节点路由](/cn/1.11/api/master-routes/)。

 此配置在每个管理节点上运行，用作与 DC/OS 组件交互的主 API 网关。

- **Admin Router 代理节点** 公开 [代理路由](/cn/1.11/api/agent-routes/)。

 此配置在每个代理节点上运行，并提供用于监控、调试和管理的路由。

 某些代理路由，如日志和度量标准，通过管理节点 Admin Router 代理以允许外部访问。
其他路由，如组件管理，仅供内部使用。


# 路由类型

Admin Router 公开若干路由类型：

- **代理路由** 从另一个 URL 检索资源。
- **文件路由** 检索静态文件。
- **Lua 路由** 执行 Lua 代码以生成响应。
- **重定向路由** 重定向到另一个 URL。
- **重写路由** 将路由转换为其他路由。


# 集群访问

要确定集群的 URL，请参阅 [集群访问](/cn/1.11/api/access/)。


# 版本控制

DC/OS API 的部分按组件、路由或资源进行版本控制。

有关版本控制机制的详细信息，请参阅[版本控制](/cn/1.11/api/versioning/)。


# 身份验证

某些路由未经过身份认证，但大多数路由都需要认证令牌。

有关如何获取和使用认证令牌的详细信息，请参阅 [验证 HTTP API 端点](/cn/1.11/security/ent/iam-api/)。


# 授权

大多数认证路由也需要通过权限授权。DC/OS Enterprise 中的权限包含分层资源标识符和操作（创建、读取、更新、删除、全部）。

权限执行可以在两个级别执行。

- **粗粒度权限** 是在路由级别 [由 Admin Router 执行](/cn/1.11/security/ent/perms-reference/#admin-router)。
- **细粒度权限** 由单个后端组件服务执行。

[权限管理](/cn/1.11/security/ent/perms-management/)可通过具有 [超级用户权限](/cn/1.11/security/ent/perms-reference/#superuser) 的用户使用 [身份和访问管理 API](/cn/1.11/security/ent/iam-api/)执行。具有超级用户权限的用户也有隐式权限访问所有路由。


# 路由使用

- 通过 **代理路由**确定一个 API 资源的完整 URL，连接集群 URL、路由和后端组件资源路径。

    ```
    <cluster-url>/<route>/<resource-path>
    ```

 例如，从以下获取 Mesos 版本：`https://dcos.example.com/mesos/version`

- **文件路由** 没有后端组件，但可能提供有多个文件的目录或单个文件。因此，对于文件路由，指定文件路径，而不是后端组件资源路径。

    ```
    <cluster-url>/<route>/<file-path>
    ```

 例如，从以下获取集群的 DC/OS 版本：`https://dcos.example.com/dcos-metadata/dcos-version.json`

- **Lua 路由** 立即在 Admin Router 中执行代码，而不是以代理的方式路由到外部后端组件。因此，对于 Lua 路由，路由后无需路径。

    ```
    <cluster-url>/<route>
    ```

 例如，从以下获取管理节点的公用 IP 和集群 ID：`https://dcos.example.com/metadata`

- **重写和重定向路由**可能会在返回资源之前穿过一个或多个其他 URL 或路由。因此，对于这些路由，请遵循 URL 和路由链以查找端点。资源路径将取决于最终端点。

 大多数重写和重定向在另一个 DC/OS API 路由上终止， 但是明显的例外是`/login`，它使用 OpenID Connect 和外部身份提供程序进行授权，然后重定向回 DC/OS API。
