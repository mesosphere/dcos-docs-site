---
layout: layout.pug
navigationTitle: 配置 SAML IdP
title: 配置 SAML 身份提供程序
menuWeight: 1
excerpt: 配置 SAML 身份提供程序和 OneLogin IdP

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

本主题讨论了安全声明标记语言 (SAML) 的一般要求，并提供了设置 OneLogin IdP 的分步程序。

# 关于添加 SAML 身份提供程序

DC/OS Enterprise 要求 SAML 身份提供程序 (IdP)：

- 签署其身份认证声明。
- 不使用 `urn:oasis:names:tc:SAML:2.0:nameid-format:transient` 作为其 `NameIDFormat`。

从 IdP 接收到 SAML 响应后，DC/OS 会在其中搜索可用作 DC/OS 用户 ID 的值。它按以下顺序执行，在找到必要值后停止。

1. 如果 `Subject` 的 `NameID` 似乎包含电子邮件地址，则 DC/OS 会使用电子邮件地址值。
1. 如果响应包含属性语句，DC/OS 则使用看起来是电子邮件地址的第一个属性值，特别是如果属于 [LDAP `mail` 属性](https://tools.ietf.org/html/rfc4524#section-5) 类型。
1. DC/OS 使用 `NameID`。

虽然 DC/OS Enterprise 支持 SAML 2.0 IdP 的全部范围，但以下程序将使用 OneLogin IdP 作为示例，并提供分步说明。

# 添加 OneLogin 身份提供程序

## 获取身份提供程序元数据

1. 以 OneLogin 超级用户身份登录 Onelogin 仪表盘。
2. [创建](https://admin.us.onelogin.com/apps/find) 一个可以发送属性并签署授权声明的 IdP 应用程序。
3. 单击以添加应用程序。
4. 在 **Display Name** 字段中键入此 IdP 的描述性名称。
5. 点击**保存**。
7. 单击 **SSO** 选项卡。
8. 复制 **Issuer URL** 值。
9. 从浏览器或使用 curl 向 **Issuer URL** 发出 `GET` 请求。
10. 它应该返回身份提供程序 XML。

  ```xml
<?xml version="1.0?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://app.onelogin.com/saml/metadata/555370">
  [...]
</EntityDescriptor>
  ```

11. 将 XML 复制到剪贴板或文本编辑器中。
12. 单击 **Access** 选项卡。激活您希望能够登录到集群的所有角色。例如：**员工**和**工程师**。

 **注意：** 请勿在此阶段单击 **Save**；它会失败。

## 配置 DC/OS 以使其作为 SAML 服务提供程序

1. 以 `superuser` 中的用户或具有 `dcos:superuser` 权限的用户身份登录 DC/OS GUI。
1. 打开 **Settings** -> **Identity Providers** 选项卡。
1. 单击右上方的 **+** 图标。
1. 单击 **SAML 2.0**。
1. 在 **Provider ID** 字段，键入可以在 URL 中传递的 IdP 的标识符，即只有小写字母数字和 `-` 字符。您配置的每个 SAML IdP 都需要一个唯一标识符。如果您有另一个 SAML IdP，则必须为此选择一个不同的标识符。例如：`my-saml-idp`。
1. 在 **Description** 字段中键入 IdP 的描述性名称。此字符串将出现在显示给用户的按钮中，以允许他们选择他们想要使用的 IdP。例如，如果您在 **Description** 字段键入 `Fantastic SAML IdP`，则按钮将显示 **Login with Fantastic SAML IdP** 登录。
1. 将前一部分获得的身份提供程序 XML 元数据粘贴到 **IDP Metadata** 字段。
1. 在您的浏览器顶部复制 URL，所有内容都在第一个斜杠之前，然后粘贴到 **Service Provider Base URL** 字段。
1. 单击 **Submit**。

## 获取 DC/OS 回调 URL

**提示：**此程序使用身份和访问管理 API (IAM API)。有关 IAM API 的更多详细信息，请访问 [IAM API 文档](/cn/1.11/security/ent/iam-api/)。

1. 使用浏览器或 curl 将 `GET` 请求发送至 `<your-cluster-URL>/acs/api/v1/auth/saml/provider`。
2. 它将返回 JSON 对象，其中包含您已配置的每个身份提供程序的 ID 和描述。

    ```json
    {
      "my-saml-idp": "SAML IdP"
    }
    ```

3. 在列表中找到您的身份提供程序，并将其 ID 复制到剪贴板或文本编辑器中。在前一示例中，提供程序 ID 为 `my-saml-idp`。
4. 使用浏览器或 curl 将 `GET` 请求发送至 `<your-cluster-URL>/acs/api/v1/auth/saml/provider/{provider-id}/acs-callback-url`, replacing `{provider-id}` 使用您在上一步中获得的提供程序 ID。
5. 此请求返回回调 URL。

    ```json
    {
      "acs-callback-url": "https://me-9w7g-elasticl-3tifi04qqdhz-692669367.us-west-2.elb.amazonaws.com/acs/api/v1/auth/saml/providers/my-saml-idp/acs-callback"
    }
    ```

6. 将此值复制到剪贴板或文本编辑器中。

## 为 OneLogin 身份提供程序提供回调 URL

1. 单击以打开 OneLogin 仪表盘中的 **Configuration** 选项卡。
2. 将上一过程中获得的回调 URL 粘贴到以下三个字段中：**Recipient**。**ACS (Consumer) URL Validator** 和 **ACS (Consumer) URL**。
3. 将您的集群 URL 粘贴到 **Audience** 字段中。附加以下内容：`/acs/api/v1/auth/saml/providers/{provider-id}/sp-metadata`。
4. 将 `{provider-id}` 替换为您的提供程序 ID。例如，`https://me-9w7g-elasticl-3tifi04qqdhz-692669367.us-west-2.elb.amazonaws.com/acs/api/v1/auth/saml/providers/my-saml-idp/sp-metadata`。
5. 点击**保存**。

## 验证连接

1. 清除您的 Cookie 或开始新的浏览器会话。
2. 导航到 DC/OS GUI 的登录页面。
3. 单击刚刚配置的 SAML 提供程序的按钮。
4. 您应该收到来自 DC/OS 的**访问被拒绝**消息。

 **注意：**这表明 DC/OS 已经与第三方提供程序一起验证您的帐户，并将其导入 DC/OS。由于默认情况下您的帐户没有权限，因此会返回“访问被拒绝”。

## 分配权限

1. 以具有 `dcos:superuser` 权限的用户身份登录 DC/OS GUI。
2. 在 **Organization** -> **Users** 选项卡中，找到您刚尝试作为用户登录的电子邮件地址，然后双击它。
3. 为帐户分配所需权限。有关分配权限的详细信息，请访问[权限](/cn/1.11/security/ent/perms-reference/)文档。


# 故障排除

用户登录可能会失败，并显示以下消息。

```
SAML SSO authentication not successful. Could not extract the subject identity from the SAML response.
```

检查 IdP 的 SAML 响应是否包括 `urn:oasis:names:tc:SAML:2.0:nameid-format:transient`。DC/OS 不支持 `urn:oasis:names:tc:SAML:2.0:nameid-format:transient`。
