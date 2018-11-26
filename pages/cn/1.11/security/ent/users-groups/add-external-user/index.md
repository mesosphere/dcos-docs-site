---
layout: layout.pug
navigationTitle: 添加外部用户
title: 添加外部用户
menuWeight: 20
excerpt: 将外部用户添加到 DC/OS

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

在配置目录服务或身份提供程序后，您可以将用户添加到 DC/OS 以便您可以分配权限。

# 先决条件

- 外部 [LDAP 目录](/cn/1.11/security/ent/ldap/)。
- [OpenID Connect 或 SAML 提供程序](/cn/1.11/security/ent/sso/)。

# 通过登录尝试添加外部用户
默认情况下，用户没有 DC/OS 权限。在无任何权限的情况下，任何对 DC/OS 的访问尝试都将失败。但是，如果您已成功配置 LDAP 目录或身份提供程序，且用户提供有效凭据，登录尝试将导致用户帐户被添加到 DC/OS 中。

**要求**：用户的姓名和密码必须正确。

因为在添加任何权限之前您将需要 DC/OS 中的用户帐户，您可能会发现最简单的方法是让每个用户尝试登录到 DC/OS。虽然他们的尝试将失败，但这将用于通过他们的账号填入 DC/OS。

# 从 Web 界面单独导入外部 LDAP 用户

要导入外部用户：

1. 选择 **Organization > Users** 并创建新用户。

2. 选择 **Import LDAP User**。

3. 在 **User Name** 框中输入用户的用户名或 ID。

4. 单击 **Add**。

5. 完成添加所有用户后，单击 **Close** 按钮。


# 导入 LDAP 用户组

## 关于导入 LDAP 组

您可以将现有 LDAP 用户组导入到 DC/OS 中。导入 LDAP 组是一次性操作：导入后 ，C/OS 不保持与 LDAP 组的任何连接。

**要求：**LDAP 目录中的组条目必须使用 `member`、`uniquemember` 或 `memberuid` 属性列出其成员。

组大小限制为 100 个用户。要增加此限制数，请联系 Mesosphere 客户支持。如果用户名与现有用户匹配，则不会重新导入。您可以检查日志以确定是否已发生。

## 配置 LDAP 组导入

1. 打开 **Settings** -> **LDAP Directory** 选项卡。

2. 单击 **ADD DIRECTORY**。

3. 单击 **Group Import (Optional)**。

4. 为应在 **GROUP SEARCH BASE** 字段中搜索的目录树子集提供 DN。例如：`(cn=Users,dc=mesosphere,dc=com)`。

5. 在 **GROUP SEARCH FILTER TEMPLATE** 字段中提供用于将组名称转换为有效 LDAP 搜索筛选器的模板。字符串必须包含 `%(groupname)`。例如：`(&(objectclass=group)(sAMAccountName=%(groupname)s))`。

6. 完成后，对话框应如下所示。

 ![LDAP 组导入配置](/cn/1.11/img/1-11-ldap-group-import.png)

 图 1. LDAP 组导入配置

7. 单击 **ADD DIRECTORY**。

## 使用 Web 界面导入 LDAP 组

1. 在 **Organization** -> **Groups** 选项卡中，单击右上方的 **+** 图标，然后选择 **Import LDAP Group**。

1. 在 **Name** 框中键入 LDAP 组名称。组名称不得与现有组的名称相匹配。

1. 单击 **Add Group**。这将在 DC/OS 中创建与 LDAP 组相同名称的用户组，并将 LDAP 组中的所有用户导入到 DC/OS 中。

1. 完成添加所有组后，单击 **Close** 按钮。


## 使用 API 导入 LDAP 组

您可以使用 `/ldap/importuser` [IAM API](/cn/1.11/security/ent/iam-api/) 端点导入一组 LDAP 用户。

**前提条件：**

- 必须设置 `group-search` 配置验证序号，如[配置 LDAP 组导入](#Configure-LDAP-group-import) 中所述。
- 现有组条目必须通过使用 `member`、`uniquemember` 或 `memberuid` 属性列出其成员。
- 如果您[安全模式](/cn/1.11/security/ent/#security-modes)为 `permissive` 或 `strict`，则在本部分中发出 curl 命令之前，必须遵循[获取 DC/OS CA 根证书]中的步骤(/1.11/security/ent/tls-ssl/get-cert/)。如果您的[安全模式](/cn/1.11/security/ent/#security-modes)为 `disabled`，则必须在将其发出前从命令中删除 `--cacert dcos-ca.crt`。

在此示例中，导入了名为 `johngroup` 的组。

1. 登录 CLI 以确保您可以引用以下代码样本中所示的集群 URL。

1. 使用此命令启动导入：

    ```bash
    curl -i -X POST --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" --data '{"groupname": "johngroup"}' --header "Content-Type: application/json" $(dcos config show core.dcos_url)/acs/api/v1/ldap/importgroup
    ```

1. 确认 `johngroup` 已添加：

    ```bash
    curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/groups/johngroup
    ```

    ```bash
    curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/groups/johngroup/users
    ```
