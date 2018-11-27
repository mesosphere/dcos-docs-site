---
layout: layout.pug
navigationTitle: Marathon  API
title: Marathon  API
menuWeight: 40
excerpt: 使用 Marathon  API 管理长期运行的容器化服务

enterprise: true
---

Marathon API 帮助您管理长期运行的容器化服务（应用程序和 pod）。Marathon API 由 [Marathon 组件] 支持，并在管理节点上运行(/1.11/overview/architecture/components/#marathon)。其中一个 Marathon 实例被选为首要实例，而其余实例则是在发生故障时的热备份。所有 API 请求都必须经过 Marathon 首要实例。为执行该原则，Admin Router 代理会从任何管理节点向 Marathon 首要实例发出请求。

有关使用 Marathon 的更多信息，请参阅 [部署服务和 Pod](/cn/1.11/deploying-services/)。

## 路由

访问 Marathon API 是通过每个管理节点上使用以下路由的 Admin Router 代理的：

```
/service/marathon/
```

## 身份认证

使用所有 Marathon  API 路由都需要认证。要验证 API 请求，请参阅 [获取认证令牌](/cn/1.11/security/ent/iam-api/#obtaining-an-authentication-token) 和 [通过认证令牌](/cn/1.11/security/ent/iam-api/#passing-an-authentication-token)。Marathon API 还需要通过以下权限授权：

| 路由 | 权限 |
|-------|----------|
| `/service/marathon/` | `dcos:adminrouter:service:marathon` |

用户也可以通过 `dcos:superuser` 权限使用所有路由。要为您的帐户分配权限，请参阅 [权限参考](/cn/1.11/security/ent/perms-reference/)。

## 资源

[swagger api='/1.11/api/marathon.yaml']
