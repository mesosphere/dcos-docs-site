---
layout: layout.pug
navigationTitle:  用户账户管理
title: 用户账户管理
menuWeight: 10
excerpt: 管理 DC/OS 用户账户
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS 被设计为多用户系统。

开源 DC/OS 可处理三种类型的用户账户：

* **外部用户账户**：外部用户账户适用于希望使用其 Google、GitHub 或 Microsoft 凭据的用户。DC/OS 从不接收或存储外部用户的密码。
* **本地用户账户**：本地用户账户适用于希望在 DC/OS 内创建用户账户的用户。用户名和密码哈希存储在 IAM 数据库中。
* **服务账户**：与 DC/OS 交互的机器应始终通过服务账户登录来获取认证令牌。请勿在这种情况下进行基于用户名/密码的登录。

用户账户可由任何授权用户进行管理。为了 bootstrap 此进程，在开源 DC/OS 中，第一个通过 Web 界面登录的用户会自动创建一个外部用户。

<p class="message--note"><strong>注意：</strong>对 DC/OS 有访问权限的任何用户可以创建更多用户账户。DC/OS 中的每个用户账户都是被授权的管理员账户，开源 DC/OS 中没有明确的权限概念。</p>
