---
layout: layout.pug
navigationTitle: 备份和恢复 API
title: 备份和恢复 API
menuWeight: 10
excerpt: 使用 API 备份和恢复集群

enterprise: true
---

您可以使用“备份和恢复 API”来创建和恢复集群的备份。

<p class="message--important"><strong>重要信息：</strong>查看备份和恢复的 <a href="/mesosphere/dcos/1.11/administering-clusters/backup-and-restore/#limitations">限制</a> 。</p>

# 路由

对备份和恢复 API 的访问是通过每个管理节点上的 Admin Router 使用以下路由以代理的方式完成：

```
/system/v1/backup/v1
```

要确定群集的 URL，请参阅 [群集访问](/mesosphere/dcos/cn/1.11/api/access/)。

# 格式

备份和恢复 API 请求和响应主体格式为 JSON 格式。

请求必须包含接受标头：

```
Accept: application/json
```

响应包括内容类型标头：

```
Content-Type: application/json
```

# 验证

使用所有备份和恢复 API 路由都需要身份验证。

要验证 API 请求，请参阅 [获取认证令牌](/mesosphere/dcos/cn/1.11/security/ent/iam-api/#obtaining-an-authentication-token) 和 [传递认证令牌](/mesosphere/dcos/cn/1.11/security/ent/iam-api/#passing-an-authentication-token)。

备份和恢复 API 还需要通过以下权限授权：

| 资源 ID | 操作 |
|-------------|--------|
| `dcos:adminrouter:ops:system-backup` | `full` |

所有路由也可以被具有 `dcos:superuser` 权限的用户使用。

要为您的帐户分配权限，请参阅 [权限参考](/mesosphere/dcos/cn/1.11/security/ent/perms-reference/)。


# API 参考

备份和恢复 API 允许您管理 DC/OS 集群上的备份和恢复操作。

[swagger api='/mesosphere/dcos/1.11/api/backup-restore.yaml']
