---
layout: layout.pug
navigationTitle:  身份认证
title: 身份认证
excerpt: 针对 DC/OS 验证用户
render: mustache
model：/mesosphere/dcos/1.13/data.yml
menuWeight: 30
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# DC/OS 中的身份验证

在 DC/OS 中，默认需要进行用户身份验证。每个要在 DC/OS 群集上执行操作（除了登录）的用户都必须首先通过身份验证。

DC/OS 通过认证令牌来处理用户身份验证。认证令牌由身份和访问管理器 (IAM) 分发给每个用户。令牌可以由任何第三方实体进行带外验证。允许令牌认证可独立于 IAM，使得这种方法与集中式会话状态保持相比具有高度可扩展性。此外，有了令牌，用户身份验证状态不会被轻易撤销。

[登录](/mesosphere/dcos/1.13/security/oss/login/) 到 DC/OS 之后，用户立即会收到 [DC/OS 认证令牌](/mesosphere/dcos/1.13/security/oss/authentication/authentication-token)。DC/OS 认证令牌可用于验证对 API 的后续请求；请参阅 [将认证令牌传递到 API](/mesosphere/dcos/1.13/security/oss/authentication/authentication-token/#pass-an-authentication-token-to-the-api)。

DC/OS 认证令牌也被 [DC/OS CLI](/mesosphere/dcos/1.13/cli/) 内部使用，以验证后续的 CLI 命令。仅 DC/OS CLI 版本 0.4.3 及更高版本支持身份认证。有关升级说明，请参阅[此处](/mesosphere/dcos/1.13/cli/update/)。

在 DC/OS 中，系统的唯一验证器是 [Admin Router](/mesosphere/dcos/1.13/overview/architecture/components/#admin-router)。它根据 [身份和访问管理器 (IAM)] 发出的信息来执行 DC/OS 认证令牌验证(/mesosphere/dcos/1.13/overview/architecture/components/#dcos-iam)。

通过利用公钥加密技术的带外验证，可以使第三方实体成为 DC/OS 认证令牌的验证器；请参阅 [带外令牌认证](/mesosphere/dcos/1.13/security/oss/authentication/out-of-band-verification/)，以获得说明。

<p class="message--note"><strong>注意：</strong>在 DC/OS 开源中，身份验证等同于授权。因此，获得有效 DC/OS 认证令牌的任何实体可以完全访问群集。</p>

## 禁用身份验证

您可以通过以下任一方式禁用身份验证：
1. 通过 [高级安装] 禁用身份验证(/mesosphere/dcos/1.13/installing/production/deploying-dcos/installation/)：您可以通过将此参数添加到配置文件 (`genconf/config.yaml`) 来禁用身份验证。

    ```yaml
    oauth_enabled: 'false'
    ```
    如需更多信息，请参阅配置[文档](/mesosphere/dcos/1.13/installing/production/advanced-configuration/configuration-reference/)。

2. 通过 [AWS] 上的云安装来禁用身份验证(/mesosphere/dcos/1.13/installing/evaluation/community-supported-methods/aws/)：您可以在 **指定详细信息** 步骤上将 `OAuthEnabled` 选项设置为 `false` 来禁用身份验证。

<p class="message--warning"><strong>警告：</strong>您无法通过 <a href ="/1.13/installing/evaluation/azure/">Azure</a> 上的云安装来禁用身份验证。</p>

<p class="message--note"><strong>注意：</strong>如果已经安装了群集，并且希望禁用此功能，则可以使用配置参数集进行升级。</p>
