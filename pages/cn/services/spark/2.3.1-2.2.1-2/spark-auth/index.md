---
layout: layout.pug
title: 为  Spark 配置 DC/OS Access 
navigationTitle: 为  Spark 配置 DC/OS Access
menuWeight: 1010
excerpt:
featureMaturity:
enterprise: true
---
# 版本

在 Spark 2.3.1-2.2.1-2 和更高版本中，这些主题已被分成“入门”和“安全”部分。以前版本仍需要以下信息。

# 配置 DC/OS 访问

本主题介绍如何为 Spark 配置 DC/OS 访问权限。根据您的 [安全模式](/1.9/security/ent/#security-modes/)，Spark 需要 [服务身份认证](/1.10/security/ent/service-auth/) 以访问 DC/OS。

| 安全模式 | 服务帐户 |
|---------------|-----------------------|
| 已禁用 | 不可用 |
| 宽容 | 可选 |
| 严格 | 必填 |

如果您在宽容模式下安装服务且未指定服务帐户，Metronome 和 Marathon 将按照此服务的请求是由具有 [超级用户权限](/cn/1.11/security/ent/perms-reference/#superuser)的帐户做出的那样行事。

**前提条件：**

- [已安装 DC/OS CLI](/1.9/cli/install/) 并以超级用户身份登录。
- [已安装 Enterprise DC/OS CLI 0.4.14 或更高版本](/1.9/cli/enterprise-cli/#ent-cli-install)。
- 如果您的 [安全模式](/1.9/security/ent/#security-modes/) 是 `permissive` 或 `strict`，您必须 [获取 root 证书](/1.9/networking/tls-ssl/get-cert/)，才能发出本部分中的 curl 命令。

# <a name="create-a-keypair"></a>创建密钥对
在此步骤中，系统使用 Enterprise DC/OS CLI（如果没有，使用 `dcos package install dcos-enterprise-cli` 安装）创建 2048 位 RSA 公私密钥对。

创建公私密钥对并将每个值保存到当前目录中的单独文件中。

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

**提示：** 您可以使用 [DC/OS 密钥存储库](/1.10/security/ent/secrets/) 保护密钥对。

# <a name="create-a-service-account"></a>创建服务帐户

从终端提示中创建一个新的服务帐户(`<service-account-id>`) containing the public key (`<your-public-key>.pem`）。

```bash
dcos security org service-accounts create -p <your-public-key>.pem -d "Spark service account" <service-account-id>
```

**提示：** 您可以使用以下命令验证您的新服务帐户。

```bash
dcos security org service-accounts show <service-account-id>
```

# <a name="create-an-sa-secret"></a>创建密钥
创建密码 (`spark/<secret-name>`) 与您的服务帐户 (`<service-account-id>`) 和 私钥指定 (`<private-key>.pem`）。

**提示：** 如果您在与服务名称匹配的路径中存储密钥（例如，服务名称和密钥路径 是`spark`)，则只有名为 `spark` 的服务可以访问密钥。

## 宽容

```bash
dcos security secrets create-sa-secret <private-key>.pem <service-account-id> spark/<secret-name>
```

## 严格

```bash
dcos security secrets create-sa-secret --strict <private-key>.pem <service-account-id> spark/<secret-name>
```

**提示：**
您可以使用以下命令列出密钥：

```bash
dcos security secrets list /
```

# <a name="give-perms"></a>创建和分配权限
使用以下 curl 命令快速为 Spark 服务帐户配置必需的权限。这也可通过 UI 完成。

**提示：**

- 资源中的任何 `/` 字符必须替换为 `%252F` ，才能在 curl 命令中传递。
- 使用 API 管理权限时，您必须首先创建权限，然后分配权限。有时，权限可能已存在。在此情况下，API 返回告知性信息。您可以将其视为确认并继续执行下一个命令。

1. 创建权限。其中一些权限可能已存在。

 <p class="message--important"><strong>重要: </strong> Spark 默认在 <a href="http://mesos.apache.org/documentation/latest/roles/">Mesos 默认角色</a>下运行，其由 `*` 符号表示。您可以部署多个 Spark 实例，而不用修改此默认值。如果您想覆盖默认 Spark 角色，您必须相应地修改这些代码样例。</p>

```bash
curl -X PUT --cacert dcos-ca.crt \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody \
-d '{"description":"Allows Linux user nobody to execute tasks"}' \
-H 'Content-Type: application/json'
curl -X PUT --cacert dcos-ca.crt \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:* \
-d '{"description":"Allows a framework to register with the Mesos master using the Mesos default role"}' \
-H 'Content-Type: application/json'
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fspark" \
-d '{"description":"Allow to read the task state"}' \
-H 'Content-Type: application/json'

```

 **故障排除** 如果这些命令返回 `307 Temporary Redirect` 错误，可能是因为您的集群 URL（`dcos config show core.dcos_url`）未设置为超文本传输协议安全（`https://`）。


2. 使用以下命令将权限和允许的操作授予服务帐户。

 运行这些命令，并且指定您的服务帐户名称 (`<service-account-id>`) 。

```bash
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<service-account-id>/create"
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252Fspark/users/<service-account-id>/create"
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
```


# <a name="create-json"></a>创建配置文件
创建用于安装 Spark 的自定义配置文件，并另存为 `config.json`。

指定服务帐户 (`<service-account-id>`) and secret (`spark/<secret-name>`).

```json
{
    "service": {
            "service_account": "<service-account-id>",
            "user": "nobody",
            "service_account_secret": "spark/<secret_name>"
    }
}
```

## <a name="install-spark"></a>安装 Spark

现在，可以使用此命令安装 Spark：

```bash
dcos package install --options=config.json spark
```

**注意** 您可以通过将 `root` 替换为上面的 `nobody` 来安装 Spark Mesos Dispatcher 以作为 `root` 运行。如果您正在运行严格的模式集群，您必须给予 Marathon 所需的权限才能启动 Dispatcher 任务。使用以下命令为 Dispatcher 提供适当的权限：

```bash
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:root/users/dcos_marathon/create
```

## <a name="Run a Job"></a>运行作业

要在严格的模式集群上运行作业，您必须添加 `principal`到命令行。例如：
```bash
dcos spark run --verbose --submit-args=" \
--conf spark.mesos.principal=spark-principal \
--conf spark.mesos.containerizer=mesos \
--class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
```

如果您想使用 [Docker Engine](/cn/1.11/deploying-services/containerizers/docker-containerizer/) 而非 [Universal Container Runtime](/cn/1.11/deploying-services/containerizers/ucr/)，您必须通过 `SPARK_USER` 环境变量指定用户：

```bash
dcos spark run --verbose --submit-args="\
--conf spark.mesos.principal=spark-principal \
--conf spark.mesos.driverEnv.SPARK_USER=nobody \
--class org.apache.spark.examples.SparkPi http://downloads.mesosphere.com/spark/assets/spark-examples_2.11-2.0.1.jar 100"
```
