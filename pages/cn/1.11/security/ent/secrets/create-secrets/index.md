---
layout: layout.pug
navigationTitle: 创建密钥
title: 创建密钥
menuWeight: 0
excerpt: 使用键值对或文件创建密钥

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


您可以使用键值对或作为文件在 DC/OS 中创建密钥。两种方法都将名称和密钥值添加到密钥存储库中。如果您已将密钥值存储在本地文件中，并希望避免剪切和粘贴，则可能会发现将密钥添加为文件很方便。

有关如何在应用程序或 pod 定义中引用这些密钥的信息，请参阅[配置服务和 pod 以使用密钥](/cn/1.11/security/ent/secrets/use-secrets/)。

# 创建密钥

以下部分解释了如何使用 Web 界面、CLI 和密钥 API，将密钥创建为键/值对和文件。

密钥应包括路径，除非您希望允许所有服务访问其值。有关密钥路径的更多信息，请参阅[空间](/cn/1.11/security/ent/#spaces)。

## 先决条件

### DC/OS Web 界面
- `dcos:superuser` 权限。

### DC/OS CLI 或密钥 API

- 有关从 CLI 或 API 创建密钥所需的权限，请参阅[密钥存储库权限](/cn/1.11/security/ent/perms-reference/#secrets)。您配置的权限必须包括允许用户创建的密钥名称。每个密钥必须拥有一项权限。密钥名称和权限名称必须匹配。

- [已安装 DC/OS CLI](/cn/1.11/cli/install/) 以及 [已安装 DC/OS Enterprise CLI](/cn/1.11/cli/enterprise-cli/#ent-cli-install)。

# <a name="ui"></a>使用 Web 界面创建键值对密钥

1. 以具有 `dcos:superuser` 权限的用户身份登录 DC/OS Web 界面。

1. 打开 **Secrets** 选项卡。

1. 单击右上方的 **+** 图标。

 ![新密钥](/cn/1.11/img/new-secret.png)

 图 1. 新密钥图标

1. 在 **ID** 框中，提供密钥名称及其路径（如果有）。

1. 在 **Value** 框中键入或粘贴密钥。

 ![密钥 ID/值字段](/cn/1.11/img/create-secret.png)

 图 2. 创建新密钥

1. 单击 **Create**。

# <a name="api"></a>使用 API 创建键值对密钥

本程序介绍了如何在 `developer` 路径内创建名为 `my-secret` 的密钥。

**注意：**如果您[安全模式](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#security-enterprise)为 `permissive` 或 `strict`，则在本部分中发出 curl 命令之前，必须遵循[获取 DC/OS CA 捆绑包]中的步骤(/1.11/security/ent/tls-ssl/get-cert/)。如果您的[安全模式](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#security-enterprise)为 `disabled`，则必须在将其发出前从命令中删除 `--cacert dcos-ca.crt`。

1. 使用 `dcos auth login` 登录到 CLI。

1. 使用以下命令创建密钥。

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -d '{"value":"very-secret"}' $(dcos config show core.dcos_url)/secrets/v1/secret/default/developer/my-secret -H 'Content-Type: application/json'
   ```

# <a name="cli"></a>通过 DC/OS Enterprise CLI 创建键/值对密钥

此步骤介绍了如何使用 DC/OS Enterprise CLI 在 `developer` 路径内创建名为 `my-secret` 的键/值对密钥。

1. 使用 `dcos auth login` 登录到 CLI。您可在 [CLI 参考](/cn/1.11/cli/command-reference/dcos-auth/dcos-auth-login/) 中找到有关此命令的更多信息。

1. 使用以下命令创建新密钥。

   ```bash
   dcos security secrets create --value=top-secret developer/my-secret
   ```

# 通过 DC/OS Enterprise CLI 从文件创建密钥

此步骤介绍了如何使用文件在 `developer` 路径内使用 DC/OS Enterprise CLI 创建名为 `my-secret` 的密钥。

文件内容（以下称为 `my-secret.txt`）可以是任何文本值。

**注意：**从 DC/OS 1.10 开始，您只能从 DC/OS CLI 上传密钥作为文件。密钥的最大文件大小约为 1 MiB，减去密钥存储库元数据的大约 1 KB。

1. 使用 `dcos auth login` 登录到 CLI。您可在 [CLI 参考](/cn/1.11/cli/command-reference/dcos-auth/dcos-auth-login/) 中找到有关此命令的更多信息。

1. 使用以下命令创建新密钥。

  ```bash
  dcos security secrets create -f my-secret.txt developer/my-secret
  ```

<table class=“table” bgcolor=#858585>
    <tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>密钥的最大文件大小约为 1 MB减去密钥存储库元数据的大约 1 KB。</td> 
    </tr> 
</table>
