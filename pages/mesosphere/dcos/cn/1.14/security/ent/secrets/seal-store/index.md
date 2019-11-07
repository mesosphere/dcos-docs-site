---
layout: layout.pug
navigationTitle:  密封密钥存储库
title: 密封密钥存储库
menuWeight: 3
excerpt: 手动密封密钥存储库
enterprise: true
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您可能需要手动密封密钥存储库，以保护其内容免受侵入者的侵害。密封的密钥存储库无法从 Web 界面访问。无法使用 [密钥 API](/mesosphere/dcos/1.14/security/ent/secrets/secrets-api/) 检索密码值。取决于密钥存储库中的值的服务可能无法部署。

若要密封密钥存储库，请完成以下步骤以密封 `dcos-secrets` 的单个实例。如果通过 `dcos config show core.dcos_url` 获取的群集 URL 指向负载均衡器，并且群集中有多个主节点，则应针对每个主节点发出这些步骤，并且应将群集 URL 更改为各个主节点的地址。

密封的预期状态是持久的；在密封存储库后，重启 `dcos-secrets` 不会拆封它。只有 [拆封存储库](/mesosphere/dcos/1.14/security/ent/secrets/unseal-store/) 中所述的步骤才可以拆封它。

**前提条件：**

- [DC/OS CLI 已安装](/mesosphere/dcos/1.14/cli/install/)
- 通过 `dcos auth login` 作为超级用户登录到 DC/OS CLI
- [安装的 GNU 隐私保护 (GPG)](http：//brewformulas.org/gnupg)
- 必须遵守 [下载根证书] (/mesosphere/dcos/1.14/security/ent/tls-ssl/get-cert/)中的步骤才能发布此部分的 `curl` 命令。


1. 在终端提示符下，通过以下命令检查密钥存储库的状态。

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

1. 密钥存储库服务应返回与此类似的响应：

   ```json
   {"sealed":false,"threshold":1,"shares":1,"progress":0}
   ```

   如果 `"sealed"` 的值是 `true`，则不完成本程序的其余部分。如果密钥存储库已经密封，则不能再次密封。

1. 使用以下命令密封密钥存储库。

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal/default
   ```

1. 使用此命令确认密钥存储库已密封。

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

    应返回以下 JSON：

   ```json
   {"sealed":true,"threshold":1,"shares":1,"progress":0}
   ```
