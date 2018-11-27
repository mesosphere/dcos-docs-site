---
layout: layout.pug
title: 为  Kafka 配置 DC/OS Access
menuWeight: 660
excerpt: 配置 DC/OS Access 
featureMaturity:
enterprise: true
model: /cn/services/kafka/data.yml
render: mustache
---
# 版本

在 Kafka 2.3.0-1.1.0 和更高版本中，这些主题已被划分为“入门”和“安全”部分。以前版本仍需要以下信息。

# 配置 DC/OS 访问

本主题介绍如何为 Kafka 配置 DC/OS 访问权限。根据您的 [安全模式](/cn/1.11/security/ent/#security-modes/)，Kafka 需要 [服务认证](/cn/1.11/security/ent/service-auth/) 才能访问 DC/OS。

| 安全模式 | 服务帐户 |
|---------------|-----------------------|
| 已禁用 | 不可用 |
| 宽容 | 可选 |
| 严格 | 必填 |

如果您在宽容模式下安装服务且未指定服务帐户，Metronome 和 Marathon 将按照此服务的请求是由具有 [超级用户权限](/cn/1.11/security/ent/perms-reference/#superuser)的帐户做出的那样行事。

**前提条件：**

- [已安装 DC/OS CLI](/latest/cli/install/) 并以超级用户身份登录。
- [已安装 Enterprise DC/OS CLI 0.4.14 或更高版本](/1.9/cli/enterprise-cli/#ent-cli-install)。
- 如果您的 [安全模式](/latest/security/ent/#security-modes/) 是 `permissive` 或 `strict`，您必须 [获取 root 证书](/cn/1.11/networking/tls-ssl/get-cert/)，才能发出本部分中的 curl 命令。

# <a name="create-a-keypair"></a>创建密钥对
在此步骤中，通过使用企业 DC/OS CLI，创建了 2048 位 的 RSA 公私密钥对。

创建公私密钥对并将每个值保存到当前目录中的单独文件中。

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

**提示：** 您可以使用 [DC/OS 密钥存储库](/cn/1.11/security/ent/secrets/) 保护密钥对。

# <a name="create-a-service-account"></a>创建服务帐户

从终端提示中创建一个新的服务帐户(`<service-account-id>`) containing the public key (`<your-public-key>.pem`）。

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Kafka service account" <service-account-id>
```

**提示：** 您可以使用以下命令验证您的新服务帐户。

```bash
dcos security org service-accounts show <service-account-id>
```

# <a name="create-an-sa-secret"></a>创建密钥
创建密码 (`kafka/<secret-name>`) with your service account (`<service-account-id>`) and private key specified (`<private-key>.pem`）。

**提示：** 如果您在与服务名称匹配的路径中存储密钥（例如，服务名称和密钥路径 是`kafka`)，则只有名为 `kafka` 的服务可以访问密钥。

## 宽容

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> kafka/<secret-name>
```

## 严格

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> kafka/<secret-name>
```

**提示：**
您可以使用以下命令列出密钥：

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>创建和分配权限
使用以下 curl 命令，快速配置 Kafka 服务帐户以及必要的权限。

**提示：**

- 资源中的任何 `/` 字符必须替换为 `%252F` ，才能在 curl 命令中传递。
- 使用 API 管理权限时，您必须首先创建权限，然后分配权限。有时，权限可能已存在。在此情况下，API 返回告知性信息。您可以将其视为确认并继续执行下一个命令。

创建权限。

 <p class="message--important"><strong>重要信息：</strong> 这些命令使用 `{{ model.packageName }}-role`的默认 {{ model.techName }} `role` 值。如果您正在运行多个 {{ model.techName }}实例，使用正确的名称替换 `{{ model.packageName }}-role` 实例 (`<name>-role`). 例如, 如果你有一个 {{ model.techName }} 例  `{{ model.packageName }}2`, 您将替换代码示例中的每个角色值 `{{ model.packageName }}2-role`。</p> 

 ## 宽容
 运行这些命令，并且指定您的服务帐户名称 (`<service-account-id>`) 。

  ```bash
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody \
  -d '{"description":"Allows Linux user nobody to execute tasks"}' -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:kafka-role \
  -d '{"description":"Controls the ability of kafka-role to register as a framework with the Mesos master"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:kafka-role \
  -d '{"description":"Controls the ability of kafka-role to reserve resources"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:kafka-role \
  -d '{"description":"Controls the ability of kafka-role to access volumes"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<service-account-id> \
  -d '{"description":"Controls the ability of <service-account-id> to reserve resources"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<service-account-id> \
  -d '{"description":"Controls the ability of <service-account-id> to access volumes"}' \
  -H 'Content-Type: application/json'
  ```

 ## 严格
 运行这些命令，并且指定您的服务帐户名称 (`<service-account-id>`) 。

  ```bash
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:kafka-role \
  -d '{"description":"Controls the ability of kafka-role to register as a framework with the Mesos master"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:kafka-role \
  -d '{"description":"Controls the ability of kafka-role to reserve resources"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:kafka-role \
  -d '{"description":"Controls the ability of kafka-role to access volumes"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<service-account-id> \
  -d '{"description":"Controls the ability of <service-account-id> to reserve resources"}' \
  -H 'Content-Type: application/json'
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<service-account-id> \
  -d '{"description":"Controls the ability of <service-account-id> to access volumes"}' \
  -H 'Content-Type: application/json'
  ```

使用以下命令将权限和允许的操作授予服务帐户。

 运行这些命令，并且指定您的服务帐户名称 (`<service-account-id>`) 。

  ```bash
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:kafka-role/users/<service-account-id>/create
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:role:kafka-role/users/<service-account-id>/create
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:role:kafka-role/users/<service-account-id>/create
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:reservation:principal:<service-account-id>/users/<service-account-id>/delete
  curl -X PUT --cacert dcos-ca.crt \
  -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:volume:principal:<service-account-id>/users/<service-account-id>/delete
  ```

# <a name="create-json"></a>创建 config.json 文件
创建用于安装 Kafka 的自定义配置文件，并另存为 `config.json`。

指定服务帐户 (`<service-account-id>`) and secret path (`kafka/<secret-name>`).

```json
{
  "service": {
    "service_account": "<service-account-id>",
    "service_account_secret": "kafka/<secret-name>"
  }
}
```

## <a name="install-kafka"></a>安装 Kafka
使用此命令安装 Kafka：

```bash
dcos package install --options=config.json kafka
```
