---
layout: layout.pug
title: 包管理 API
menuWeight: 10
excerpt: 使用包管理 API 安装 DC/OS 服务
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---

您可以使用包管理 API 安装 DC/OS 服务。DC/OS 服务是从包注册表中存储的包安装的，例如 [Mesosphere {{ model.packageRepo }}](/mesosphere/dcos/2.0/overview/concepts/#mesosphere-universe)。

[DC/OS 包管理器 (Cosmos) 组件](/mesosphere/dcos/2.0/overview/architecture/components/#dcos-package-manager) 在所有管理节点上运行。

如需管理包存储库的信息，请参阅 [管理包存储库](/mesosphere/dcos/2.0/administering-clusters/package-registry/)。

如需管理服务的信息，请参阅 [部署服务和 Pod](/mesosphere/dcos/2.0/deploying-services/)。


## 路由
Admin Router 将三路路由托管到 DC/OS 包管理器 (Cosmos)：

| 路由 | 资源 |
|-------|----------|
| `/cosmos/service/` | `/service/` |
| `/package/` | `/package/` |
| `/capabilities` | `/capabilities` |


## 身份认证

所有包管理 API 路由都需要认证才能使用。要验证 API 请求，请参阅 [获取认证令牌](/mesosphere/dcos/2.0/security/ent/iam-api/#obtaining-an-authentication-token) 和 [传递认证令牌](/mesosphere/dcos/2.0/security/ent/iam-api/#passing-an-authentication-token)。包管理 API 还需要通过以下权限授权：

| 路由 | 权限 |
|-------|----------|
| `/cosmos/service/` | `dcos:adminrouter:package` |
| `/package/` | `dcos:adminrouter:package` |
| `/capabilities` | `dcos:adminrouter:capabilities` |

用户也可以通过 `dcos:superuser` 权限获得所有路由。要为您的账户分配权限，请参阅 [权限参考](/mesosphere/dcos/2.0/security/ent/perms-reference/)。


## 资源

以下两个路由均提供以下资源：

[swagger api='/mesosphere/dcos/2.0/api/package-manager.yaml']
