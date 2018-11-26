---
layout: layout.pug
navigationTitle: 配置 
title: 配置 Marathon-LB
menuWeight: 3
excerpt: 使用服务帐户配置 Marathon-LB
enterprise: true
---

您是否可以或必须使用服务帐户配置 Marathon-LB 因 [安全模式] 而异(/1.10/security/ent/#security-modes)。

- `disabled`：可选
- `permissive`：可选
- `strict`：必需

为了增加集群的安全性并符合最低权限的原则，我们建议在 `permissive` 模式中为 Marathon-LB 配置一个服务帐户。否则，Marathon 和 Metronome 将按照 Marathon-LB 配置到一个具有 `superuser` 权限的服务帐户行事。

此外，如果您计划升级至 `strict` 模式，在 `disabled` 和 `permissive` 模式中为 Marathon-LB 配置一个服务帐户将使升级更加轻松。如果您设置了与同一 Marathon 实例相互作用的多个 Marathon-LB 实例，您可以对每个 Marathon-LB 实例使用相同的服务帐户。

本主题描述如何配置与本土 Marathon 实例相互作用的 Marathon-LB 实例。要为 Marathon-LB 设置服务帐户，请完成以下步骤。

1. [创建密钥对。](#create-a-keypair)
1. [创建服务帐户。](#create-a-service-account)
1. [创建服务帐户密钥。](#create-an-sa-secret)
1. [为服务帐户提供必要的权限。](#give-perms)
1. [创建 config.json 文件。](#create-json)

本文档假定以下内容：
* `marathon-lb` 是 `marathon-lb` `marathon` 服务名称；如果您正在不同位置安装 `marathon-lb` ，您必须相应地更改密钥位置。
* `marathon-lb/service-account-secret` 是存储 Marathon-LB 服务帐户凭证的密钥的完整路径； 如果您更改 `marathon-lb` 服务名称，您必须更改此项。
* `mlb-private-key.pem` 是包含私钥的文件的名称。
* `mlb-public-key.pem` 是包含公钥的文件的名称。

我们建议您坚持使用这些名称，因为这样可以更容易地复制和粘贴命令。如果您决定更改名称，请确保在发出它们之前修改命令。

<p class="message--note"><strong>注意：</strong> 我们将密钥存储在 `marathon-lb/service-account-secret` 路径中。这将保护其免受其他服务的影响，所以我们不建议进行修改。</p>

## <a name="create-a-keypair"></a>创建密钥对

首先，您需要生成 2048 位 RSA 公私密钥对。虽然您可以使用任何工具完成此操作，但 DC/OS Enterprise CLI 最为方便，因为它以 DC/OS 所需的格式返回密钥。

**前提条件：**
- [已安装 DC/OS CLI](/1.10/cli/install/)
- [DC/OS Enterprise CLI 0.4.14 或更高版本](/1.10/cli/enterprise-cli/#ent-cli-install)

1. 使用以下命令创建公私密钥对并将每个值保存到当前目录中的单独文件中。

    ```bash
    dcos security org service-accounts keypair mlb-private-key.pem mlb-public-key.pem
    ```

1. 输入 `ls` 查看命令创建的两个新文件。您可能也想自行打开文件并验证其内容。

1. 继续进入 [下一部分](#create-a-service-account)。

## <a name="create-a-service-account"></a>创建服务帐户

本部分介绍如何使用 DC/OS Enterprise CLI 或 Web 界面创建服务帐户。

### 使用 DC/OS Enterprise CLI

**前提条件：**
- [已安装 DC/OS CLI](/1.10/cli/install/)
- [DC/OS Enterprise CLI 0.4.14 或更高版本](/1.10/cli/enterprise-cli/#ent-cli-install)
- 通过 `dcos auth login` 以超级用户身份登录。

1. 使用以下命令创建一个名为 `marathon-lb-sa` 并包含您刚刚生成的公钥的新服务帐户。

    ```bash
    dcos security org service-accounts create -p mlb-public-key.pem -d "Marathon-LB service account" marathon-lb-sa
    ```

1. 使用以下命令验证您的新服务帐户。

    ```bash
    dcos security org service-accounts show marathon-lb-sa
    ```

1. 继续 [创建服务帐户密钥](#create-an-sa-secret)。

### 使用 Web 界面

1. 在 DC/OS Web 界面，导航至 **组织** -> **服务帐户** 选项卡。

1. 单击 **新服务帐户**。

1. 输入与帐户相关联的描述、服务帐户 ID 和公钥。将相关的公钥文件的内容复制到 **公钥** 字段。

1. 继续 [创建服务帐户密钥](#create-an-sa-secret)。

## <a name="create-an-sa-secret"></a>创建服务帐户密钥

本部分介绍如何使用 DC/OS Enterprise CLI 或 Web 界面创建与包含私钥的服务帐户相关联的密钥。

### 使用 DC/OS Enterprise CLI

**先决条件：**
- [已安装 DC/OS CLI](/1.10/cli/install/)
- [DC/OS Enterprise CLI 0.4.14 或更高版本](/1.10/cli/enterprise-cli/#ent-cli-install)
- 通过 `dcos auth login` 以超级用户身份登录。

1. 根据您的安全模式，使用以下命令之一在 `marathon-lb` 路径中创建一个名为 `service-account-secret` 的新密钥（完整的密钥路径是 `marathon-lb/service-account-secret`。在 `marathon-lb` 路径中定位查找该密钥将确保只有 Marathon-LB 服务才能访问它。密钥将包含私钥、服务帐户名称和其他数据。

 **严格或宽容：**

```bash
dcos security secrets create-sa-secret --strict mlb-private-key.pem marathon-lb-sa marathon-lb/service-account-secret
```

 **禁用：**

```bash
dcos security secrets create-sa-secret mlb-private-key.pem marathon-lb-sa marathon-lb/service-account-secret
```

2. 确保已成功创建密钥：

```bash
dcos security secrets list /
```

3. 如果您安装了 [jq 1.5 或更高版本](https://stedolan.github.io/jq/download)，您还可以使用以下命令检索密钥，并确保其包含正确的服务帐户 ID 和私钥。

```bash
dcos security secrets get /marathon-lb/service-account-secret --json | jq -r .value | jq
```

 <p class="message--important"><strong>重要信息：</strong> 在检查密钥时，如果您处于 `strict` 或 `permissive` 模式，确保 `login_endpoint` URL 使用 HTTPS；如果您处于 `disabled` 模式，则使用 HTTP。如果 URL 以 `https` 开始，且您处于 `disabled` 模式中，尝试 <a href="/cn/1.11/cli/enterprise-cli/#ent-cli-upgrade">升级 DC/OS Enterprise CLI</a>、删除密钥并重新创建。</p>

4. 现在，您已经将私钥存储在密钥存储库中，我们建议从文件系统中删除私钥文件。这将防止不良用户使用私钥来进行 DC/OS 身份认证。

```bash
rm -rf mlb-private-key.pem
```

5. 继续 [为服务帐户提供权限](#give-perms)。

### 使用 Web 界面

1. 以具有 `dcos:superuser` 权限的用户登录 DC/OS Web 界面。

1. 打开 **系统** -> **安全** 选项卡。

1. 单击 **新密钥**。

1. 将 `marathon-lb/service-account-secret` 输入到 **ID** 字段中，在 `marathon-lb`路径中创建一个名为 `service-account-secret` 的新密钥。在 `marathon-lb` 路径中定位查找该密钥将确保只有 Marathon-LB 服务才能访问它。

1. 如果您有 `strict` 或 `permissive` 集群，将以下 JSON 粘贴到 **值** 字段。

  ```json
  {
      "scheme": "RS256",
      "uid": "marathon-lb-sa",
      "private_key": "<private-key-value>",
      "login_endpoint": "https://master.mesos/acs/api/v1/auth/login"
  }
  ```

 如果您有 `disabled` 集群，将以下 JSON 粘贴到 **值** 字段。

  ```json
  {
      "scheme": "RS256",
      "uid": "marathon-lb-sa",
      "private_key": "<private-key-value>",
      "login_endpoint": "http://master.mesos/acs/api/v1/auth/login"
  }
  ```

6. 用该标签更换 `<private-key-value>` 使用在 [创建密钥对](#create-a-keyair) 中创建的私钥值。

7. 单击 **创建**。您的密钥已经存储！

 **提示：** 确保将密钥路径复制到文本编辑器中。后面您将需要该信息。

8. 继续进入 [下一节](#give-perms)。

## <a name="give-perms"></a>为服务帐户配置权限

使用以下命令，您可以快速为 Marathon-LB 服务帐户配置所需权限。这些命令可从集群外部执行。

**前提条件**
- [已安装 DC/OS CLI](/1.10/cli/install/)
- 作为超级用户通过 `dcos auth login` 登录

所有 CLI 命令也可通过 [IAM API] 执行(/1.10/security/ent/iam-api/)。

1. 使用以下命令将权限和允许的操作授予服务帐户。

   ```bash
   dcos security org users grant marathon-lb-sa dcos:service:marathon:marathon:services:/ read --description "Allows access to any service launched by the native Marathon instance"
   dcos security org users grant marathon-lb-sa dcos:service:marathon:marathon:admin:events read --description "Allows access to Marathon events"
   ```

2. 继续进入 [下一部分](#create-json)。

## <a name="create-json"></a>创建 config.json 文件

`config.json` 文件必要的内容将根据您的 [安全模式而有所不同](/1.10/security/ent/#security-modes)。

### 严格和宽容模式 config.json

如果您的密钥叫做 `marathon-lb/service-account-secret`，您可以将以下 JSON 复制并粘贴到新文件中，并以名称 `config.json` 保存。否则，根据需要更改名称 `marathon-lb/service-account-secret`。

```json
{
    "marathon-lb": {
        "secret_name": "marathon-lb/service-account-secret",
        "marathon-uri": "https://marathon.mesos:8443"
    }
}
```

<p class="message--note"><strong>注意：</strong> 虽然在`permissive`模式中安装 Marathon-LB 不要求将用于与 Marathon 通信的端口切换至 `8443` ，我们还是推荐这样处理。这可确保 Marathon-LB 与 Marathon 的通信在加密渠道上进行。</p>

继续进入 [Install Marathon-LB](#install-mlb)。

### 禁用模式 config.json

如果您的密钥叫做 `marathon-lb/service-account-secret`，您可以将以下 JSON 复制并粘贴到新文件中，并以名称 `config.json` 保存。否则，根据需要更改名称 `marathon-lb/service-account-secret`。

```json
{
    "marathon-lb": {
        "secret_name": "marathon-lb/service-account-secret"
    }
}
```

继续进入 [下一部分](#install-mlb)。

## <a name="install-mlb"></a>安装 Marathon-LB

要安装服务，请使用以下命令。

```bash
dcos package install --options=config.json marathon-lb
```

您还可以把 `config.json` 提供给其他人，用于安装 Marathon-LB。请参阅 [Marathon-LB 文档](/services/marathon-lb/usage-ee/) 了解更多信息。
