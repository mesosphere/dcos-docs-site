---
layout: layout.pug
title: 包管理 API
menuWeight: 10
excerpt: 使用包管理 API 安装 DC/OS 服务

enterprise: true
---

您可以使用包管理 API 安装 DC/OS 服务。DC/OS 服务是在包注册表中存储的包中安装的，例如 [Mesosphere Universe](/1.11/overview/concepts/#mesosphere-universe)。

[DC/OS 包管理器 (Cosmos) 组件](/1.11/overview/architecture/components/#dcos-package-manager) 在所有管理节点上运行。

如需管理包存储库的信息，请参阅 [管理包存储库](/1.11/administering-clusters/repo/)。

如需管理服务的信息，请参阅 [部署服务和 Pod](/1.11/deploying-services/)。


## 路由
Admin Router 将三路路由托管到 DC/OS 包管理器 (Cosmos)：

| 路由 | 资源 |
|-------|----------|
| `/cosmos/service/` | `/service/` |
| `/package/` | `/package/` |
| `/capabilities` | `/capabilities` |


## 身份认证

所有包管理 API 路由都需要认证才能使用。要验证 API 请求，请参阅 [获取认证令牌](/1.11/security/ent/iam-api/#obtaining-an-authentication-token) 和 [传递认证令牌](/1.11/security/ent/iam-api/#passing-an-authentication-token)。包管理 API 还需要通过以下权限授权：

| 路由 | 权限 |
|-------|----------|
| `/cosmos/service/` | `dcos:adminrouter:package` |
| `/package/` | `dcos:adminrouter:package` |
| `/capabilities` | `dcos:adminrouter:capabilities` |

用户也可以通过 `dcos:superuser` 权限获得所有路由。要为您的账户分配权限，请参阅 [权限名称](/1.11/security/ent/perms-reference/)。


## 资源

以下两个路由均提供以下资源：

[swagger api='/1.11/api/package-manager.yaml']
