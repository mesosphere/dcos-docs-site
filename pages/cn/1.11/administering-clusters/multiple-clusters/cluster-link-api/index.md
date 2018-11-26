---
layout: layout.pug
navigationTitle: Cluster Link API
title: Cluster Link API
menuWeight: 3
excerpt: 使用 Cluster Link API 管理集群链接
enterprise: true
---

您可以使用 Cluster Link API 管理集群链接。

# 路由

对 Cluster Link API 的访问是通过每个管理节点上的 Admin Router 使用以下路由以代理的方式完成：

```
/cluster/v1/links
```

要确定集群的 URL，请参阅 [集群访问](/cn/1.11/api/access/)。

# 格式

Cluster Link API 请求和响应主体的格式是 JSON 格式。

请求必须包含接受标头：

```
Accept: application/json
```

响应包括内容类型标头：

```
Content-Type: application/json
```

# 身份验证

使用所有 Cluster Link API 路由都需要身份验证。

要验证 API 请求，请参阅 [获取认证令牌](/cn/1.11/security/ent/iam-api/#obtaining-an-authentication-token) 和 [传递认证令牌](/cn/1.11/security/ent/iam-api/#passing-an-authentication-token)。

Cluster Link API 还需要通过以下权限授权：

| 资源 ID | 操作 |
|-------------|--------|
| `dcos:adminrouter:ops:cluster-link` | `full` |

所有路由也可以被具有 `dcos:superuser` 权限的用户使用。

要为您的帐户分配权限，请参阅 [权限参考](/cn/1.11/security/ent/perms-reference/)。


API 参考

Cluster Link API 允许您管理 DC/OS 集群上的集群链接操作。

[api-explorer api='/1.11/api/cluster-link.yaml']
