---
layout: layout.pug
navigationTitle: 安全
excerpt: 保护您的服务
title: 安全
menuWeight: 50
model: /cn/services/cassandra/data.yml
render: mustache
enterprise: true
---

# DC/OS {{ model.techName }} 安全

- DC/OS {{ model.techName }} 服务允许您创建服务帐户以为 {{ model.techName }} 配置访问权限。服务允许您创建和分配访问所需的权限。

- DC/OS {{ model.techName }} 服务支持 {{ model.techName }}的本地传输加密机制。该服务提供自动化和编排，以简化这些重要功能的使用。目前，不支持 {{ model.techName }} 的身份验证和授权功能。

<p class="message--note"><strong>注意：</strong> 这些安全功能仅在 DC/OS Enterprise 1.10 及更高版本中可用。</p>


#include /cn/services/include/service-account.tmpl

#include /cn/services/include/security-create-permissions.tmpl

# <a name="transport_encryption"></a> 传输加密

#include /cn/services/include/security-transport-encryption-lead-in.tmpl

#include /cn/services/include/security-configure-transport-encryption.tmpl

<p class="message--note"><strong>注意：</strong> 可以更新运行中的 DC/OS {{ model.techName }} 服务，从而在初始安装后启用传输加密，但服务在过渡期间可能不可用。另外，您的客户端需要重新配置，除非 `service.security.transport_encryption.allow_plaintext` 被设置为 `true`。</p>

#include /cn/services/include/security-transport-encryption-clients.tmpl
 
