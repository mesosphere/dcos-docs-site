---
layout: layout.pug
navigationTitle:  组织
title: 组织
menuWeight: 11
excerpt: 使用“组织”菜单
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
---

您可以在“组织”页面中管理用户访问。“组织”菜单有 3 个子菜单：

- [用户](#users)
- 组
- 服务帐户

![组织用户](/mesosphere/dcos/2.0/img/GUI-Organization-Users-List-View.png)

图 1 - **组织 > 用户** 选项卡


# 用户

**组织** 选项卡的默认页面是 **用户** 页面。您可以从此选项卡添加、删除和管理单个用户。此页面有两列：

| 名称 | 说明 |
|-------|-------|
| 用户名 | 您可以对该字段的用户名列表进行排序。 |
| 全名 | 这是用户的全名。 |

您还可以按以下条件筛选此列表：

| 名称 | 说明 |
|-------|-------|
| 全部 | 显示所有用户 |
| 本地 | 本地用户账户仅存在于 DC/OS 中。 |
| 外部 |  DC/OS 仅存储用户的 ID 或用户名以及其他 DC/OS 特定信息，如权限和组成员。DC/OS 从不接收或存储外部用户的密码。相反，它将用户凭据的验证委派给以下其中一项：LDAP 目录、SAML 或 OpenID Connect。请参见 [管理用户和组](/mesosphere/dcos/2.0/security/ent/users-groups/) 了解更多信息。 |


如果单击用户名称，将显示该个人的“用户”页面。此页面有三个选项卡：[权限](#permissions)、[组成员](#group-membership) 和 [详情](#details)。

## 权限
**用户 > 权限** 选项卡显示分配给此用户的所有资源。您可以从此屏幕删除用户。您还可以管理授予此用户的权限。

![用户权限](/mesosphere/dcos/2.0/img/GUI-Organization-Users-2.png)

图 2 - **权限** 选项卡

在此页面上，您可以编辑用户权限或完全删除用户。如需更多信息，请参阅 [权限管理](/mesosphere/dcos/2.0/security/ent/perms-management/) 文档。

## 组成员

**用户 > 组成员** 选项卡显示此个人用户所属的所有组。您可以按字母顺序排序 **组 ID** 列。您也可以使用右上角的 **编辑** 按钮来编辑组。

![组成员](/mesosphere/dcos/2.0/img/GUI-Organization-Users-Group-Membership.png)

图 3 - **组成员** 选项卡

在此选项卡上，您还可以将用户添加到组。

## 详细信息

**用户 > 详情** 选项卡显示有关此用户的详细信息：

| 名称 | 说明 |
|-------|-------|
| ID    | 此用户的用户 ID |
| 描述 | 这是用户的全名。 |

![详情选项卡](/mesosphere/dcos/2.0/img/GUI-Organization-Users-Details.png)

图 4 - **详情** 选项卡


# 组

DC/OS Enterprise 允许您创建用户组，并从 LDAP 导入用户组。组可以更容易地管理权限。您可以一次为整个用户组分配权限，而不是单独为每个用户帐户分配权限。

![组选项卡](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-Main.png)

图 5 - 组主页

如果单击某个组的 ID，您可以打开它的“详情”页面。此页面有 3 个选项卡：[权限](#permissions-2)、[用户](#users-2) 和 [服务账户](#service-accounts)。

<a name="permissions-2"></a>

## 权限

**组织 > 组 > 权限** 选项卡显示分配给特定组的所有资源。在此页面，您可以使用垂直点下的 **编辑** 菜单添加权限，或者使用 **添加权限** 按钮。

![组权限](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-Permissions.png)

图 6 - **组 > 权限** 选项卡

<a name="users-2"></a>

## 用户

在 **组 > 用户** 选项卡上，您可以将已建立的用户添加到现有组。

![组用户](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-Users.png)

图 7 - **组 > 用户** 选项卡


## 服务帐户

在 **组 > 服务账户** 选项卡，您可以将已建立的服务账户添加到组。

![组用户](/mesosphere/dcos/2.0/img/GUI-Organization-Groups-Service-Accounts.png)

图 8 - **组 > 服务账户** 选项卡

有关管理组的更多信息，请参阅 [管理用户和组](/mesosphere/dcos/2.0/security/ent/users-groups/) 文档。