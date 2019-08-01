---
layout: layout.pug
navigationTitle: 权限管理
title: 权限管理
menuWeight: 30
excerpt: 管理权限

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS 身份和访问管理系统旨在通过细粒度授权来保护资源。
每个受保护资源都有一个关联的 ACL，用于声明哪些主体可以对指定资源执行哪些操作。这是根据白名单（默认拒绝）模型执行的。

可以使用 DC/OS Web 界面、[IAM HTTP API](/mesosphere/dcos/cn/1.12/security/ent/iam-api/) 或 [DC/OS Enterprise CLI](/mesosphere/dcos/cn/1.12/cli/enterprise-cli/) 对用户和组应用权限。每个接口提供管理访问控制条目 (ACE) 的方式。每个 ACE 包括以下信息：

* 主体标识符
* 资源标识符
* 操作标识符

这三条信息是字符串。

必须从一组固定的操作集中选择操作标识符。可用的操作标识符是 `create`、`read`、`update`、 `delete` 和 `full`。按照惯例，`full` 表示权限支持所有其他操作标识符。标识符 `full` 可能包括任何其他操作标识符不支持的操作。

### 从 CLI 管理权限

有 [四个命令](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/#dcos-security-org) 用于管理 DC/OS Enterprise CLI 的权限。

若要从 DC/OS Enterprise CLI 管理**组**的权限，请使用以下命令：

* `dcos security org groups grant [OPTIONS] GID RID ACTION`
* `dcos security org groups revoke [OPTIONS] GID RID ACTION`

若要从 DC/OS Enterprise CLI 管理**用户**的权限，请使用以下命令：

* `dcos security org users grant [OPTIONS] UID RID ACTION`
* `dcos security org users revoke [OPTIONS] UID RID ACTION`

### 使用 API 管理权限

[IAM HTTP API](/mesosphere/dcos/cn/1.12/security/ent/iam-api/) 提供管理用户和组权限的操作。

请注意，创建权限时，所有实体都必须存在。

创建权限的常见方式有：

1. 调用 `PUT /acls/{rid}`，为受保护资源 `{rid}` 创建访问控制列表，忽略任何返回的 `409` 状态代码（表示它已经存在）；然后
1. 调用 `PUT /acls/{rid}/users/{uid}/{action}` 或 `PUT /acls/{rid}/groups/{gid}/{action}`，创建特定用户或组访问控制条目。
