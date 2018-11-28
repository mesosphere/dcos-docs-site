---
layout: layout.pug
navigationTitle: 安全
excerpt: 保护您的服务
title: 安全
menuWeight: 40
model: /cn/services/spark/data.yml
render: mustache
---

本主题介绍如何为 {{ model.techShortName }} 配置 DC/OS 服务帐户。

在 [DC/OS 严格安全模式](/cn/1.11/security/)下运行时，调度器和作业都
必须使用 [DC/OS 服务帐户 进行 Mesos 认证](/cn/1.11/security/service-auth/)。

#include /cn/services/include/service-account.tmpl

# <a name="give-perms"></a>创建和分配权限
使用以下 `curl` 命令快速为 {{ model.techShortName }} 服务配置所需权限。这也可通过 UI 完成。

**注意：**

- 在资源中的任何 `/` 字符必须替换为 `%252F`，才能在 `curl` 命令中进行传递。
- 使用 API 管理权限时，您必须首先创建权限，然后分配权限。有时，权限可能已存在。在此情况下，API 返回告知性信息。您可以将其视为确认并继续执行下一个命令。

1. 创建权限。其中一些权限可能已存在。

 <p class="message--note"><strong>注意：</strong>{{ model.techShortName }} 默认在 <a href="http://mesos.apache.org/documentation/latest/roles/">Mesos 默认角色</a>)下运行，以 <code>*</code> 符号表示。您可以部署多个 {{ model.techShortName }} 实例，而不修改此默认值。如果要覆盖默认 {{ model.techShortName }} 角色，您必须相应地修改这些代码样本。</p>

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
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F{{ model.serviceName }}" \
-d '{"description":"Allow to read the task state"}' \
-H 'Content-Type: application/json'

```

如果这些命令返回 `307 Temporary Redirect` 错误，可能是因为您的集群 URL (`dcos config show core.dcos_url`) 未设置为超文本传输协议安全（`https://`）。


2. 使用以下命令将权限和允许的操作授予服务帐户。运行这些命令，并且指定您的服务帐户名称 (`<service-account-id>`) 。

```bash
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:framework:role:*/users/<service-account-id>/create"
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:app_id:%252F{{ model.serviceName }}/users/<service-account-id>/create"
curl -X PUT -k \
-H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:mesos:master:task:user:nobody/users/<service-account-id>/create
```

#include /cn/services/include/configuration-create-json-file.tmpl

# 使用密钥存储库

DC/OS Enterprise 允许用户以文件的形式向 DC/OS 密钥存储库添加特权信息。这些文件
可在 {{ model.techShortName }} 作业中引用，可用于认证和授权不同的外部服务（例如
HDFS）。例如，我们使用此功能传递 Kerberos Keytab。有关如何使用密钥的详细信息，
参见[官方文档](/cn/1.11/security/ent/secrets/)。

### 放置密钥的地方
为了让 {{ model.techShortName}} 可用到密钥，密钥必须放置在可通过 {{ model.techShortName}} 服务访问的路径中。如果只有 {{ model.techShortName}} 需要访问密钥，将密钥存储在匹配所述 {{ model.techShortName}} 服务名称的路径中（例如 `{{ model.serviceName}}/secret`）。有关密钥路径如何限制对密钥的访问的详细信息，请参阅 [有关空间的密钥文档][13]。

### 限制
有权访问 {{ model.techShortName}}（调度器）服务实例的任何人可访问对其可用的所有密钥。不要授予用户访问 {{ model.techShortName}} 调度器实例的权限，除非他们也被允许访问所有可用于 {{ model.techShortName}} 调度器实例的密钥。

### 二进制密钥

您可以将二进制文件，如 Kerberos keytab，存储在 DC/OS 密钥存储库中。在 DC/OS 1.11 和更高版本中，您可以直接从
二进制文件创建密钥，而在 DC/OS 1.10 或更早版本中，文件必须按照
RFC 4648 的说明进行 base64 编码，才能保存为密钥。

#### DC/OS 1.11+

要使用 `kerb5.keytab` 二进制内容创建名为 `mysecret`的密钥，运行：

```bash
$ dcos security secrets create --file kerb5.keytab mysecret
```

#### DC/OS 1.10 或更早版本

要使用 `kerb5.keytab` 二进制内容创建名为 `mysecret`的密钥，首先使用
`base64` 命令行实用程序对其进行编码。以下示例使用 BSD `base64` （macOS 中默认 ）。

```bash
$ base64 -i krb5.keytab -o kerb5.keytab.base64-encoded
```

或者，GNU `base64`（Linux 中默认）默认在编码数据中插入行馈送。
使用 `-w 0` 自变量禁用自动换行。

```bash
$ base64 -w 0 -i krb5.keytab > kerb5.keytab.base64-encoded
```

现在文件已编码，可以将其作为密钥存储。

```bash
$ dcos security secrets  create -f kerb5.keytab.base64-encoded  some/path/__dcos_base64__mysecret
```

<p class="message--note"><strong>注意：</strong> 密钥名称 <strong>必须</strong>具有前缀 <code>__dcos_base64__</code>。</p>

当 `some/path/__dcos_base64__mysecret` 密钥在您的 `dcos {{ model.serviceName }} run` 命令中被引用时，其 base64 解码的
内容将作为您的应用程序中的[临时文件] 提供(http://mesos.apache.org/documentation/latest/secrets/#file-based-secrets)
{{ model.techShortName }} 。

<p class="message--note"><strong>注意：</strong> 确保仅作为文件引用二进制密钥，因为
不鼓励在环境变量中包含二进制内容。</p>


使用 Mesos 密钥

在密钥存储库中添加密钥之后，
您可以将它们传递至 {{ model.techShortName }}，并使用 `{{ model.serviceName }}.mesos.<task-name>.secret.names` 和
`{{ model.serviceName }}.mesos.<task-name>.secret.<filenames|envkeys>` 配置参数 哪里 `<task-name>` 是 或 `driver` 要么
`executor`。

指定 `filenames` 或 `envkeys` 将密钥实现为基于文件的密钥或
环境变量。这些配置参数将使用“压缩”在一起的逗号分隔列表制作
最终的密钥文件或环境变量。我们建议尽可能使用基于文件的密钥，因为这样
比环境变量更加安全。

仅 Mesos containerizer 支持密钥，Docker containerizer 不支持。要使用 Mesos containerizer，添加此配置：
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
```

例如，要在驱动程序 _和_ 执行程序中以文件形式使用名为 `{{ model.serviceName }}/my-secret-file` 的密钥，添加这些配置
参数：
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
--conf {{ model.serviceName }}.mesos.driver.secret.names={{ model.serviceName }}/my-secret-file
--conf {{ model.serviceName }}.mesos.driver.secret.filenames=target-secret-file
--conf {{ model.serviceName }}.mesos.executor.secret.names={{ model.serviceName }}/my-secret-file
--conf {{ model.serviceName }}.mesos.executor.secret.filenames=target-secret-file
```
这将把密钥 `{{ model.serviceName }}/my-secret-file` 的内容放入驱动程序和执行程序沙箱中
名为`target-secret-file` 的安全 RAM-FS 挂载密钥文件中。如果您想作为环境变量使用密钥（例如
AWS 凭证），您将按以下更改配置：
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
--conf {{ model.serviceName }}.mesos.driver.secret.names=/{{ model.serviceName }}/my-aws-secret,/{{ model.serviceName }}/my-aws-key
--conf {{ model.serviceName }}.mesos.driver.secret.envkeys=AWS_SECRET_ACCESS_KEY,AWS_ACCESS_KEY_ID
```
这假设您的密钥存取键存储在名为 `{{ model.serviceName }}/my-aws-secret`的密钥中，您的密钥 ID 在
`{{ model.serviceName }}/my-aws-key`.

### 限制
使用基于环境和文件的密钥组合时，需要相同数量的接收器和密钥
来源（即文件和环境变量）。例如
```
--conf {{ model.serviceName }}.mesos.containerizer=mesos
--conf {{ model.serviceName }}.mesos.driver.secret.names=/{{ model.serviceName }}/my-secret-file,/{{ model.serviceName }}/my-secret-envvar
--conf {{ model.serviceName }}.mesos.driver.secret.filenames=target-secret-file,placeholder-file
--conf {{ model.serviceName }}.mesos.driver.secret.envkeys=PLACEHOLDER,SECRET_ENVVAR
```
将 `{{ model.serviceName }}/my-secret-file` 的内容放入 `PLACEHOLDER` 环境变量，将 `target-secret-file` 文件
以及 `{{ model.serviceName }}/my-secret-envvar` 内容放入 `SECRET_ENVVAR` 和 `placeholder-file`。如果是二进制
密钥，环境变量将仍然为空，因为不能给环境
变量分配二进制值。

# {{ model.techShortName }} SSL

DC/OS {{ model.techName}} 中的 SSL 支持对以下信道进行加密：

* 从 [DC/OS Admin Router][11] 到调度器。
* 从驱动程序向执行程序提供的文件。

要启用 SSL，必须提供 Java keystore（和可选信任存储）及其密码。在
提交工作时，以下前三个设置为 **必需**。如果使用信任存储，后两个也是 **必需**：

| 变量 | 说明 |
|----------------------------------|-------------------------------------------------|
| `--keystore-secret-path`         | 密钥库在秘密商店的路径                |
| `--keystore-password`            | 用于访问密钥库的密码        |
| `--private-key-password`         | 私钥的密码                |
| `--truststore-secret-path`       | 信任库在秘密商店的路径              |
| `--truststore-password`          | 用于访问信任库的密码     |


此外, t有一些 {{ model.techShortName }} 配置变量 与SSL设置相关.  这些配置设置是**可选的**:

| 变量      | 说明     | 默认值 |
|------------|---------------|---------------|
|`{{ model.serviceName }}.ssl.enabledAlgorithms` |  允许的 cypher  | JVM 默认值 |
|`{{ model.serviceName }}.ssl.protocol` | 协议 | TLS |


keystore 和信任存储使用 [Java 键工具][12] 创建。keystore 必须包含一个私钥及其
已签名公钥。信任存储是可选的，可能包含明确受 Java 信任的自签名 root-ca 证书
。

将存储添加到您在 DC/OS 密钥存储库的密钥中。例如，如果您的 keystore 和信任存储
分别为 server.jks 和 trust.jks，则使用以下命令将其添加到密钥
存储：

```bash
dcos security secrets create /{{ model.serviceName }}/keystore --value-file server.jks
dcos security secrets create /{{ model.serviceName }}/truststore --value-file trust.jks
```

您必须向您的 `dcos {{ model.serviceName }} run ` 命令中添加以下配置。
括号中的内容是可选的：

```bash

dcos {{ model.serviceName }} run --verbose --submit-args="\
--keystore-secret-path=<path/to/keystore, e.g. {{ model.serviceName }}/keystore> \
--keystore-password=<password to keystore> \
--private-key-password=<password to private key in keystore> \
(—-truststore-secret-path=<path/to/truststore, e.g. {{ model.serviceName }}/truststore> \)
(--truststore-password=<password to truststore> \)
(—-conf {{ model.serviceName }}.ssl.enabledAlgorithms=<cipher, e.g., TLS_RSA_WITH_AES_128_CBC_SHA256> \)
--class <{{ model.techShortName }} Main class> <{{ model.techShortName }} Application JAR> [application args]"
```

**DC/OS 1.10 或更早版本：** 因为两个存储都是二进制文件，它们必须是 base64 编码，然后才能放入
DC/OS 密钥存储库。按照上述有关编码二进制密钥的说明，编码 keystore 和信任存储。

**注意：** 如果您使用 `{{ model.serviceName }}.mesos.[driver|executor].secret.envkeys` 指定了基于环境的密钥，由于密钥实施方式，keystore 和
信任存储密钥也将显示为基于环境的密钥。您可以
忽略这些额外的环境变量。

# {{ model.techShortName }} SASL（执行程序认证和数据块转移服务加密）
{{ model.techShortName }} 使用简单认证安全层 (SASL) 对驱动程序进行认证，并加密
组件之间发送的消息。此功能依赖于您预期在相互之间通信的所有组件之间的一个共享密钥
。可以使用 DC/OS {{ model.techShortName }} CLI 生成密钥
```bash
dcos {{ model.serviceName }} secret <secret_path>
# for example
dcos {{ model.serviceName }} secret /{{ model.serviceName }}/{{ model.serviceName }}AuthSecret
```
这将生成随机密钥，并将其上传到指定路径的 DC/OS 密钥存储库[14]。要使用此
密钥进行 RPC 认证，在您的 CLI 命令中添加以下配置：
```bash
dcos {{ model.serviceName }} run --submit-args="\
...
--executor-auth-secret=/{{ model.serviceName }}/{{ model.serviceName }}AuthSecret
...
"

```



 [11]:/cn/1.11/overview/architecture/components/
 [12]:http://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
 [13]:/cn/1.11/security/ent/#space-for-secrets
 [14]:https://docs.mesosphere.com/latest/security/secrets/
