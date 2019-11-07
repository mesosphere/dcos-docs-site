---
layout: layout.pug
navigationTitle:  设置
title: 设置
menuWeight: 10
excerpt: 使用“设置”菜单
enterprise: true
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---

从 **设置**选项卡，您可以管理 

- UI 设置
- 包存储库
- 密钥存储库
- LDAP 目录
- 身份提供者

![Package repositories](/mesosphere/dcos/1.14/img/GUI-Settings-Package-Repositories.png)

图 1 - **设置 > 包存储库** 选项卡

# UI 设置

**UI 设置** 选项卡允许您管理 DC/OS UI 版本以及显示 UI 的语言。

## DC/OS UI 详情

**DC/OS UI 详情** 部分显示安装了哪个版本 UI；请注意，这 **不是** 当前安装的 DC/OS 版本。

### 回滚
如果需要，您可以将 UI 版本恢复到较早的版本。DC/OS 附带一个预捆绑的 UI 版本。当您使用 **设置** 页面更新 UI 时，我们保存了预捆绑版本，以防需要回滚。因此，如果回滚，您将获得您的 DC/OS 安装随附的预捆绑版本。

单击 **回滚** 按钮加载早期版本的 UI。

![正在回滚](/mesosphere/dcos/1.14/img/GUI-Settings-Rollback.png)

图 2 - 回滚到早期版本的 UI

## 用户偏好

**用户偏好** 部分显示 UI 显示的语言，并允许您切换到其他显示语言。
1. 单击 **设置 > UI 设置**。

    ![UI 设置选项卡](/mesosphere/dcos/1.14/img/GUI-Settings-Change-Language.png)

    图 3 -“UI 设置”选项卡

1. 单击 **编辑** 按钮。将显示 **语言偏好** 对话框。

1. 从 **语言偏好** 窗口中，选择您的语言。

    ![语言偏好](/mesosphere/dcos/1.14/img/GUI-change-UI-settings-menu-2.png)

    图 4 -“语言偏好”菜单

1. 点击**保存**。

# 包存储库

**包存储库** 选项卡列出了 DC/OS 群集上当前已配置的所有包存储库。有关包注册表选项的详细信息，请参阅 [包注册表文档](/mesosphere/dcos/1.14/administering-clusters/package-registry/)。您还会发现 [部署本地目录文档](/mesosphere/dcos/1.14/administering-clusters/deploying-a-local-dcos-universe/) 也有用。

## 添加资源库

您可以将存储库及其相关服务添加到 DC/OS Enterprise 群集。

1. 单击右上角的 **+** 标志。

1. 将显示 **添加存储库** 对话框。填写所需的值。

    ![添加存储库](/mesosphere/dcos/1.14/img/GUI-Settings-Add-Repository.png)

    图 5 - 添加存储库

   | 名称 | 说明 |
   |---------|-------------|
   | 存储库名称 | 要添加的存储库的名称。  |
   | URL |  要添加的存储库的路径。  |
   | 优先级 | 0、1、或 2 |

1. 单击 **添加存储库**。

您可以在 [配置服务] (/mesosphere/dcos/1.14/deploying-services/config-universe-service/) 文档中找到有关部署目录的更多信息。

您还可以部署包含您自己的包集合的本地目录。请参阅 [选定包](/mesosphere/dcos/1.14/administering-clusters/deploying-a-local-dcos-universe/#selected-packages) 文档。

## 删除存储库

<p class="message--warning"><strong>警告：</strong>如果删除一个存储库，您将无法再安装属于该存储库的任何包。</p>

1. 将鼠标悬停在列表右侧的上方。
1. 将出现 **删除** 按钮。单击该按钮以删除您的存储库。将要求您确认此删除。

![删除存储库](/mesosphere/dcos/1.14/img/GUI-Settings-Package-Repositories-Delete.png)

图 6 - 删除包存储库

# 密钥存储库 

“密钥存储库”选项卡显示您当前所有密钥存储库的列表，以及与每密钥存储库相关的类型。此页面上不可以执行操作，但可以从 [密钥](/mesosphere/dcos/1.14/gui/secrets/) 选项卡管理密钥。

![密钥存储库](/mesosphere/dcos/1.14/img/GUI-Settings-Secret-Stores.png)

图 7 -“语言偏好”菜单

# LDAP 目录

您可以设置 LDAP 连接，以避免在 DC/OS 内重新创建用户账户。

![添加目录对话框](/mesosphere/dcos/1.14/img/ldap-add-dir-conn.png)

图 8 - 添加 LDAP 连接

要添加一个目录，请单击 **添加目录** 按钮。关于设置连接、导入联系人和导入组的更多详细信息可在 [LDAP 认证] (/mesosphere/dcos/1.14/security/ent/ldap/)文档中找到。

# 身份提供者

DC/OS 支持使用基于身份提供者的认证。有关如何设置基于身份提供者的认证的详细信息，请参阅 [文档](/mesosphere/dcos/1.14/security/ent/sso/)。我们提供配置 [SAML 身份提供者](/mesosphere/dcos/1.14/security/ent/sso/setup-saml/) 或 [OpenID Connect IdP](/mesosphere/dcos/1.14/security/ent/sso/setup-openid/) 的信息。

![身份提供者](/mesosphere/dcos/1.14/img/GUI-Settings-LDAP-Add-Oidc.png)

图 9 - 添加身份提供者