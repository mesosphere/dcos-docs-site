---
layout: layout.pug
navigationTitle:  外部用户登录
title: 外部用户登录
excerpt: 以外部用户的身份登录到 DC/OS
render: mustache
model: /mesosphere/dcos/2.0/data.yml
menuWeight: 10
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 使用 DC/OS CLI 登录

**前提条件：**
- [DC/OS CLI](/mesosphere/dcos/cn/2.0/cli/)

1. 要登录到 DC/OS CLI，请输入以下 [auth login](/mesosphere/dcos/cn/2.0/cli/command-reference/dcos-auth/dcos-auth-login/) 命令。

    ```bash
    dcos auth login --provider dcos-oidc-auth0
    If your browser didn't open, please go to the following link:

        http://172.17.0.2/login?redirect_uri=urn:ietf:wg:oauth:2.0:oob

    Enter OpenID Connect ID Token: 
    >
    ```

1. 按照所示的说明触发浏览器登录流程。

1. 通过您的提供商登录后，复制浏览器中显示的 `OpenID Connect ID token`。

1. 将 `OpenID Connect ID token` 粘贴到 DC/OS CLI，以完成登录。

    <p class="message--note"><strong>注意：</strong><code>-提供商</code> 参数默认设置为 <code>dcos-oidc-auth0</code>。</p>

1. 通过执行以下命令来显示 DC/OS 认证令牌。

    ```bash
    dcos config show core.dcos_acs_token
    ```
1. 将 DC/OS 认证令牌作为 `TOKEN` 导出到环境中，以在 API 请求中使用它：

    ```bash
    export TOKEN=$(dcos config show core.dcos_acs_token)
    ```

# 使用 Web 界面登录

1. 启动 DC/OS Web 界面。
2. 使用您选择的身份提供商（Google、GitHub 或 Microsoft），通过单点登录流程登录。

<p class="message--note"><strong>注意：</strong>单点登录流将让 DC/OS 认证令牌存储在浏览器 cookie 中。</p>


