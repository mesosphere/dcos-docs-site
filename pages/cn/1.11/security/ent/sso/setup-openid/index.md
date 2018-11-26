---
layout: layout.pug
navigationTitle: 配置 OpenID Connect IdP
title: 配置 OpenID 身份提供程序
menuWeight: 2
excerpt: 配置 OpenID 身份提供程序

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


本页面讨论了 OpenID Idp 的一般要求，并提供了设置 OneLogin IdP 的分步步骤。DC/OS Enterprise 可与使用 OpenID Connect 1.0 的任何身份提供程序 (Idp) 集成。以下步骤将采用 Google IdP 作为示例，并引导您完成设置流程的每个步骤。

# 添加 OpenID Connect 身份提供程序：

您可以在 Google 或 DC/OS 中添加 Google OpenID Connect IdP。

## 在 Google 中配置 IdP

1. 访问 [Google Developer Console 的凭据页面](https://console.developers.google.com/apis/credentials?project=_)。

1. 如果您已经有项目，请单击 **Select a Project**，选择项目，然后单击 **Open**。

 如果您还没有项目，请单击 **Create a project**，在 **Project Name** 框中键入项目名称，选择加入或退出电子邮件通信，接受服务条款，然后单击 **Create**。

1. 在 **Credentials** 对话框中，选择 **OAuth client ID**。

1. 单击 **Configure consent screen**。

1. 下一个屏幕允许您提供一系列信息，以便在用户提供凭据时显示给用户。至少，您必须在 **Product name shown to users** 框中指定 IdP 的名称。

1. 点击**保存**。

1. 选择 **Web 应用程序** 作为 **应用程序类型**。

1. 在 **Name** 框中键入 IdP 的名称。

1. 将集群的 URL 粘贴到 **Authorized Javascript origins**框中。示例：`https://jp-ybwutd-elasticl-1r2iui8i0z9b7-1590150926.us-west-2.elb.amazonaws.com`

 如果您的集群前端有负载均衡器（推荐），则集群 URL 将成为负载均衡器的路径。集群 URL 与 DC/OS Web 界面的路径相同，可从浏览器栏复制。或者，您可以登录到 DC/OS CLI 并键入 `dcos config show core.dcos_url` 以获取集群 URL。

1. 也将您的集群 URL 粘贴到 **Authorized redirect URIs** 字段。

1. 将 `/acs/api/v1/auth/oidc/callback` 粘贴到  **Authorized redirect URIs** 字段中您集群 URL 的末尾处。示例：`https://jp-ybwutd-elasticl-1r2iui8i0z9b7-1590150926.us-west-2.elb.amazonaws.com/acs/api/v1/auth/oidc/callback`

1. 单击 **Create**。

1. 将客户端 ID 和客户端密钥值复制并粘贴到文本文件中。

## 在 DC/OS 中配置 IdP

1. 以具有 `dcos:superuser` 权限的用户身份登录 DC/OS Web 界面。

1. 打开 **Settings** -> **Identity Providers** 选项卡。

1. 单击右上方的 **+** 图标。

1. 单击 **OpenID Connect**。

1. 在 **Provider ID** 字段中键入您的 IdP 名称。此名称将在 URL 中传递，因此请确保它仅包含小写字母数字和 `-` 字符。例如：`google-idp`。

1. 在 **Description** 字段中键入 IdP 的可读名称。例如，`Google`。

1. 将以下内容粘贴到 **Issuer** 字段：`https://accounts.google.com`。

1. 将您的集群 URL 粘贴到 **Base URI** 字段。有关获取此值的更多信息，请参阅前一部分。

1. 将客户端 ID 值从 Google 粘贴到 **Client ID** 字段。

1. 将客户端密钥从 Google 粘贴到 **Client Secret** 字段。

 ![Google IdP 配置](/cn/1.11/img/oidc-google.png)

 图 1. Google IdP 配置

11. 单击 **Submit**。

12. 您现在应该在 DC/OS Web 界面中看到新的 IdP。


## 验证 IdP

### 关于验证 IdP

您可以使用以下任一方法来验证您是否已正确设置 IdP。

- [使用 DC/OS Web 界面](#use-gui)
- [使用 DC/OS CLI](#using-cli)

### <a name="using-gui"></a>使用 DC/OS GUI

1. 退出 DC/OS GUI。

1. 您应该在登录对话框中看到一个新按钮，该按钮显示 **LOGIN WITH GOOGLE**。

1. 单击新按钮。

1. 您将被重定向至 Google。

1. 单击以允许 DC/OS 访问您的 Google 帐户信息。

1. 您应该看到来自 DC/OS 的**访问被拒绝**消息。这表示登录成功，用户帐户已添加到 DC/OS，但新用户没有权限，因此无法查看 DC/OS Web 界面中的任何内容。

1. 单击 **LOG OUT**。

1. 使用 `dcos:superuser` 权限以用户身份重新登录。

1. 打开 **Organization** -> **Users** 选项卡。

1. 您应该看到所列的新用户。

1. 为此用户分配适当的[权限](/cn/1.11/security/ent/perms-reference/)。

### <a name="using-cli"></a>使用 DC/OS CLI

**先决条件：**[已安装 DC/OS CLI](/cn/1.11/cli/install/)。

1. 使用以下命令以新用户身份登录。

   ```bash
   dcos auth login --provider=google-idp --username=<user-email> --password=<secret-password>
   ```

1. CLI 应返回类似以下内容的消息。

   ```bash
   Please go to the following link in your browser:

    https://eanicich-elasticl-c3kpgqk7jdft-820516824.us-west-2.elb.amazonaws.com/acs/api/v1/auth/login?oidc-provider=google-idp&target=dcos:authenticationresponse:html
   ```

1. 复制路径并将其粘贴到浏览器中。

1. 您应该看到类似以下内容的消息。

 ![CLI IdP 认证令牌](/cn/1.11/img/cli-auth-token.png)

 图 2. CLI IdP 认证令牌

1. 单击 **Copy to clipboard**。

1. 返回到终端提示符并粘贴认证令牌值。

1. 您应该收到以下消息。

   ```bash
   Login successful!
   ```
