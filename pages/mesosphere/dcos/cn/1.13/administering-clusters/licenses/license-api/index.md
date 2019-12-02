---
layout: layout.pug
navigationTitle:  许可证 API
title: 许可证 API
menuWeight: 3
enterprise: true
excerpt: 使用 许可证 API 管理您的 DC/OS 许可证
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---
# 路由

对 许可证 API 的访问是通过每个管理节点上的 Admin Router 使用以下路由以代理的方式完成：

```
/licensing/v1
```

要确定群集的 URL，请参阅 [群集访问](/mesosphere/dcos/cn/1.13/api/access/)。

# 格式

许可证 API 请求和响应主体在 JSON 中格式化。

请求必须包含接受标题：

```
Accept: application/json
```

响应包括内容类型标题：

```
Content-Type: application/json
```

或

```
Content-Type: application/x-tar
```

# 身份认证

使用所有 许可证 API 路由都需要身份认证。

要验证 API 请求，请参阅 [获取认证令牌](/mesosphere/dcos/cn/1.13/security/ent/iam-api/#obtaining-an-authentication-token) 和 [传递认证令牌](/mesosphere/dcos/cn/1.13/security/ent/iam-api/#passing-an-authentication-token)。

许可证 API 还需要通过以下权限授权：

| 资源 ID | 操作 |
|-------------|--------|
| `dcos:adminrouter:licensing` | `full` |

所有路由也可以被具有 `dcos:superuser` 权限的用户抵达。

要为您的帐户分配权限，请参阅 [权限参考](/mesosphere/dcos/cn/1.13/security/ent/perms-reference/)。

# API 参考

许可证 API 允许您管理 DC/OS 群集上的许可证操作。

[swagger api='/mesosphere/dcos/1.13/api/dcos-licensing-component-spec.yaml']
