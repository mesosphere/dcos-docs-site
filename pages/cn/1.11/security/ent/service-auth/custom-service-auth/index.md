---
layout: layout.pug
title: 认证 DC/OS 服务
menuWeight: 100
excerpt: 为自定义应用程序和 pod 配置身份认证

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

本主题详细介绍了如何为在 DC/OS 上启动的自定义应用程序和 Pod 配置身份认证。

**先决条件：**

- [已安装 DC/OS CLI](/cn/1.11/cli/install/) 并以超级用户身份登录。
- [已安装 DC/OS Enterprise CLI 0.4.14 或更高版本](/cn/1.11/cli/enterprise-cli/#ent-cli-install)。
- 如果您的 [安全模式](/cn/1.11/security/ent/#security-modes) 是 `permissive` 或 `strict`，则必须 [获取根证书](/cn/1.11/security/ent/tls-ssl/get-cert/) 才能发布此部分的 `curl` 命令。

# <a name="create-a-keypair"></a>创建验证序号对
使用 DC/OS Enterprise CLI 创建 2048 位 RSA 公私验证序号对。将每个值保存到当前目录中的单独文件中。

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

使用 [DC/OS 密钥存储库](/cn/1.11/security/ent/secrets/) 保护验证序号对。

# <a name="create-a-service-account"></a>创建服务帐户
您可以使用 DC/OS Enterprise CLI 或 DC/OS Web 界面创建服务帐户。

## 使用 DC/OS Enterprise CLI

在终端提示符下，创建新服务帐户 (`<service-account-id>`) containing the public key (`<your-public-key>.pem`）。

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "<description>" <service-account-id>
```

使用以下命令验证您的新服务帐户。

```bash
dcos security org service-accounts show <service-account-id>
```

## 使用 Web 界面

1. 在 DC/OS Web 界面，导航至 **Organization** -> **Service Accounts** 选项卡。
1. 单击右上方的 **+** 图标。

 ![单击服务帐户创建按钮](/cn/1.11/img/new-service-account-button.png)

 图 1. 单击服务帐户创建按钮

1. 输入描述并在 **ID** 字段中输入服务帐户 ID。
1. 将与帐户相关联的公共验证序号粘贴到 **PUBLIC KEY** 字段中。

 ![创建服务帐户 UI](/cn/1.11/img/create-service-account.png)

 图 2. 创建新服务帐户


# 创建密钥
创建密钥 (`<secret-name>`) with your service account (`service-account-id>`) and private key specified (`<private-key>.pem`）。

## 宽容

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> <secret-name>
```

## 严格
在严格模式下，服务帐户名称 (`<service-account-id>`) must match the name specified in the framework `principal`。
```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> <secret-name>
```

使用此命令列出密钥：

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>创建和分配权限

## 确定所需权限
使用此程序确定服务帐户所需的访问权限。这将让您排除可能由错误权限导致的任何功能问题。

1. [SSH 到您的节点](/cn/1.11/administering-clusters/sshcluster/)。

    ```bash
    dcos node ssh --master-proxy --mesos-id=<mesos-id>
    ```

1. 运行此 `grep` 命令以查看服务帐户的 `deny` 日志 (`<service-account-id>`).

    ```bash
    journalctl -u "dcos-*" |grep "audit" |grep "<service-account-id>" |grep "deny"
    ```

 此命令将返回由于权限不足或令牌不良而拒绝访问服务时生成的审核日志列表。拒绝消息应包括缺失的权限。您可能需要多次重复此过程，以确定所需权限的完整列表。


### 故障排除

您可以授予服务超级用户权限以排除任何功能问题。所有有效的服务都应该能够以超级用户身份运行。

   ```bash
   curl -x put --cacert dcos-ca.crt \
   -h "authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:superuser/users/<service-account-id>/full
   ```

如需更多信息，请参阅 [权限参考](/cn/1.11/security/ent/perms-reference/)。

## 分配权限
使用 [权限参考](/cn/1.11/security/ent/perms-reference/) 和日志输出，为您的服务分配权限。所有 CLI 命令也可通过 [IAM API](/cn/1.11/security/ent/iam-api/) 执行。

### 使用 CLI

您可以使用 CLI 分配权限。例如，为将在 DC/OS 上卸载的 [Cassandra 服务](/services/cassandra/cass-auth/)授权：

授予权限 (`dcos:mesos:master:framework:role:cassandra-role`) 和允许的操作 (`create`)。

    ```bash
    dcos security org users grant <service-account-id> dcos:mesos:master:framework:role:cassandra-role create --description "Controls the ability of cassandra-role to register as a framework with the Mesos master"
    ```

### 使用 Web 界面

1. 以具有超级用户权限的用户身份登录 DC/OS Web 界面。
1. 选择 **Organization > Service Accounts**。
1. 选择要授予权限的服务账户名称。

 ![选择服务帐户](/cn/1.11/img/add-service-account-permission.png)

 图 3. 选择服务帐户

1. 从 **Permissions** 选项卡中，单击 **ADD PERMISSION**。
1. 单击 **INSERT PERMISSION STRING** 以切换对话框。
1. 在 **Permissions Strings** 字段中复制并粘贴权限。

 ![服务帐户权限字符串](/cn/1.11/img/service-account-permission-string.png)

 图 4. 服务帐户权限字符串

# <a name="req-auth-tok"></a>请求认证令牌

生成[服务登录令牌](/cn/1.11/security/ent/service-auth/))，其中服务帐户 (`<service-account-id>`) and private key (`<private-key>.pem` )已指定。

```bash
dcos auth login --username=<service-account-id> --private-key=<private-key>.pem
```

# <a name="pass-tok"></a>在后续请求中通过传递认证令牌
服务成功登录后，将创建一个[认证令牌](/cn/1.11/security/ent/service-auth/)。认证令牌应在后续对 DC/OS 端点的请求中使用。您可以将认证令牌引用为 shell 变量，例如：

```
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
```

# <a name="refresh-tok"></a>刷新认证令牌
默认情况下，认证令牌在五天后过期。您的服务将需要在到期之前或之后续订其令牌。令牌本身包含到期时间，因此您的服务可以使用此信息主动刷新令牌。或者，您可以等待从 DC/OS 获取 `401`，然后刷新。

若要刷新认证令牌，只需重复 [请求认证令牌](#req-auth-tok) 中所示的过程。
