---
layout: layout.pug
navigationTitle: V2 API 参考
title: V2 API 参考
menuWeight: 85
excerpt: 在 V2 API 中暴露的端点
enterprise: false
---

Edge-LB API 使您能够创建和管理负载均衡器池。

# 兼容性

Edge-LB API 最初与 DC/OS 1.10.0 一起发布，需要 DC/OS Enterprise 1.10.0 或更高版本。

# 路由

使用以下路由，通过主节点上的 Admin Router 来代理 Edge-LB API 的访问：

```
/services/edge-lb/
```

要确定您集群的地址，请参阅 [集群访问](/cn/1.11/api/access/)。

# 格式

API 请求标头可以是以下任一项：

- `application/json` 请求日志（JSON 格式）。
- `application/x-yaml` 请求日志（YAML 格式）。

# Auth

所有 Edge-LB API 路由都需要使用身份验证。

要验证 API 请求，请参阅 [获取身份认证令牌](/cn/1.11/security/ent/iam-api/#obtaining-an-authentication-token) 和 [传递身份认证令牌](/cn1.11/security/ent/iam-api/#pass-an-authentication-token)。

Edge-LB API 还需要通过以下权限进行授权：

| 路由 | 权限 |
|-------|----------|
| `/services/edgelb/` | `dcos:adminrouter:service:edge-lb` |

用户也可以通过 `dcos:superuser` 权限来访问所有路由。

要为您的帐户分配权限，请参阅 [分配权限](/cn/1.11/security/ent/perms-reference/)。

# 通用资源

这些基层路由与 V2 一起添加，可用于从 V1 或 V2 池配置读取数据。

[swagger api='/services/api/edge-lb-common.yaml']

# V2 资源

以上两条路由均提供以下资源：

[swagger api='/services/api/edge-lb-v2.yaml']
