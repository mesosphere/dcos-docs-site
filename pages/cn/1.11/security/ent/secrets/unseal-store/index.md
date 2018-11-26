---
layout: layout.pug
navigationTitle: 拆封密钥存储库
title: 拆封密钥存储库
menuWeight: 3
excerpt: 拆封密钥存储库

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 关于拆封密钥存储库

密钥存储库可在以下情况下变为密封状态：

- [手动密封后。](/cn/1.11/security/ent/secrets/seal-store/)
- 断电后。
- 由于无法通过 Vault 实例访问底层存储（如 ZooKeeper）。

密封的密钥存储库无法从 Web 界面访问。无法使用 [密钥 API](/cn/1.11/security/ent/secrets/secrets-api/) 检索密码值。依赖于通过环境变量配置的值的服务可能无法部署。

若要拆封密钥存储库，请完成以下步骤。他们将仅拆封一个 `dcos-secrets` 实例。如果通过 `dcos config show core.dcos_url` 获取的集群 URL 指向负载均衡器，并且集群中有多个管理节点，则应针对每个管理节点发出这些步骤，并且应将集群 URL 更改为各个管理节点的地址。

密封的预期状态是持久的，因此，如果存在密封存储库的前提条件之一，即使在重新启动后，`dcos-secrets` 也会自动将其密封。只有[密封存储库](/cn/1.11/security/ent/secrets/unseal-store/)中描述的步骤才会将其密封。

**先决条件：**


- [DC/OS CLI 已安装](/cn/1.11/cli/install/)
- 通过 `dcos auth login` 作为超级用户登录到 DC/OS CLI
- 如果您的 [安全模式](/cn/1.11/security/ent/#security-modes) 是 `permissive` 或 `strict`，则必须遵守 [下载根证书](/cn/1.11/security/ent/tls-ssl/get-cert/) 中的步骤才能发布此部分的 `curl` 命令。
- 如果您的 [安全模式](1/1.11/security/ent/#security-mode) 是 `disabled`，在必须从命令中删除 `--cacert dcos-ca.crt` 才能发布。


# <a name="unseal-def-keys"></a>使用默认密钥拆封密钥存储库

1. 在终端提示符下，通过以下命令检查密钥存储库的状态。

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

1. 密钥存储库服务应返回如下响应。

   ```json
   {"sealed":true,"threshold":1,"shares":1,"progress":0}
   ```

 如果 `"sealed"` 的值是 `false`，则不完成本程序的其余部分。如果密钥存储库未密封，则无法拆封它。

1. 使用以下 `curl` 命令拆封密钥存储库。

    ```bash
    curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/auto-unseal/default
    ```

1. 使用此命令确认密钥存储库已拆封。

   ```bash
   curl --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/secrets/v1/seal-status/default
   ```

 密钥存储库服务应返回以下 JSON 响应，表示成功了。

   ```json
   {"sealed":false,"threshold":1,"shares":1,"progress":0}
   ```
