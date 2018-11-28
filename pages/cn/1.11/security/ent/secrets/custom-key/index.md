---
layout: layout.pug
navigationTitle: 重新初始化密钥存储库
title: 使用自定义 GPG 密钥对重新初始化密钥存储库
menuWeight: 15
excerpt: 使用自定义 GPG 密钥对重新初始化密钥存储库

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您可以使用自定义 GPG 密钥对重新初始化密钥存储库。执行此操作步骤包括：

1. [编辑](#1) 您的 SECRETS_BOOTSTRAP 值
1. [停止](#2) 存储库和保管库服务
1. [停止](#3) ZooKeeper CLI
1. [重启](#2) 存储库和保管库服务
1. [创建](#5) 新密钥对
1. 使用新密钥[初始化](#6) 存储库

**先决条件：**

- [DC/OS CLI 已安装](/cn/1.11/cli/install/)
- 通过 `dcos auth login` 作为超级用户登录到 DC/OS CLI
- [已安装了 GNU Privacy Guard (GPG)](http://brewformulas.org/Gnupg)
- 如果您的 [安全模式](/cn/1.11/security/ent/#security-modes) 是 `permissive` 或 `strict`，则必须遵守 [下载根证书](/cn/1.11/security/ent/tls-ssl/get-cert/) 中的步骤才能发布此部分的 `curl` 命令。
- 如果您的 [安全模式](1/1.11/security/ent/#security-mode) 是 `disabled`，在必须从命令中删除 `--cacert dcos-ca.crt` 才能发布。

## <a name="1"></a>编辑 SECRETS_BOOTSTRAP 值

1. [通过 SSH 进入主节点](/cn/1.11/administering-clusters/sshcluster/)。

2. 在您选择的编辑器中打开 `dcos-secrets.env` 文件。

   ```bash
   sudo vi /opt/mesosphere/etc/dcos-secrets.env
   ```

3. 编辑 `SECRETS_BOOTSTRAP=true` 值以读取 `false`，如下所示。

   ```
   SECRETS_BOOTSTRAP=false
   ```

4. 保存文件并退出编辑器。

## <a name="2"></a>停止存储库和保管库服务
1. 停止密钥存储库和保管库服务。

   ```bash
   sudo systemctl stop dcos-secrets dcos-vault
   ```

1. 使用以下命令确认 `dcos-secrets` 服务已关闭。

   ```bash
   systemctl status dcos-secrets
   ```

1. 键入 `q` 以退出。

1. 使用以下命令确认 `dcos-vault` 服务已关闭。

   ```bash
   systemctl status dcos-vault
   ```
1. 键入 `q` 以退出。

1. 如果您的集群有多个管理节点，在继续之前对每个管理节点重复步骤 1 到 5。

## <a name="3"></a>停止 ZooKeeper CLI

1. 启动 ZooKeeper 命令行界面。

   ```bash
   /opt/mesosphere/packages/exhibitor--*/usr/zookeeper/bin/zkCli.sh
   ```

1. 执行以下 ZooKeeper 命令以获得额外权限，必要时使用 ZooKeeper 超级用户的实际用户名和密码替换 `super:secret` 。

 **注意：**默认情况下，DC/OS 将 ZooKeeper 超级用户设置为 `super:secret`，但我们建议[更改默认值](cn/1.11/install/production/advanced-configuration/configuration-reference/#zk-superuser)。

   ```bash
   addauth digest super:secret
   ```

3. 删除 `/dcos/vault/default` 和 `rmr /dcos/secrets` 目录，如下所示。

   ```
   rmr /dcos/vault/default
   rmr /dcos/secrets
   ```

1. 使用以下命令确认目录已删除。

   ```
   ls /dcos/vault
   ls /dcos
   ```

1. 键入 `quit` 以退出 ZooKeeper 命令行界面。

## <a name="4"></a>启动存储库和保管库服务

1. 启动密钥存储库和保管库服务。

   ```bash
   sudo systemctl start dcos-secrets dcos-vault
   ```

1. 使用以下命令确认 `dcos-secrets` 服务已启动。

   ```bash
   systemctl status dcos-secrets
   ```

1. 键入 `q` 以退出。

1. 使用以下命令确认 `dcos-vault` 服务已启动。

   ```bash
   systemctl status dcos-vault
   ```

1. 键入 `q` 以退出。

1. 如果您的集群有多个管理节点，在继续之前对每个管理节点重复步骤 1 到 5。

## <a name="5"></a> 创建新密钥对
您**不必**使用 GPG 来生成密钥对。为方便起见，我们提供了这些说明。唯一要求是密钥对可以加载到 GPG 中。如果您选择使用其他工具，只需稍后将密钥导入 GPG 并跳转至步骤 4。

1. 在管理节点的安全 shell 内，使用以下命令启动新的 GPG 公私密钥对的创建。

   ```bash
   gpg --gen-key
   ```

1. 在第一个提示符下，键入`1` 以选择 `RSA and RSA` 选项。

1. 根据需要完成其余提示符部分。

1. 使用以下命令导出公钥，对其进行 base64 编码并删除换行符。在执行命令之前，将下面的 <key-ID><key-ID>替换为公钥的字母数字 ID。

 **注意：**在以下行 `gpg: key CCE6A37D marked as ultimately trusted` 中， `CCE6A37D` 表示公钥的 ID。

   ```bash
   gpg --export <key-ID> | base64 -w 0 | tr '\n' ' '
   ```

1. 复制 GPG 返回的值。这是 base64 编码格式的公共 GPG 密钥。

1. 在您的终端提示符中打开新选项卡。

## <a name="6"></a>使用公钥初始化存储库

1. 使用以下 `curl` 命令凭借新的 GPG 公钥初始化密钥存储库。将 `"pgp_keys"` 值替换为上一步中 GPG 返回的值。

   ```bash
   curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" -d '{"shares":1,"threshold":1,"pgp_keys":["mQIN...xQPE="]}' $(dcos config show core.dcos_url)/secrets/v1/init/default -H 'Content-Type: application/json'
   ```

1. 密钥存储库服务返回用使用公钥加密的开封密钥，表示成功了。

   ```json
   {"keys":["c1c14c03483...c400"],"pgp_fingerprints":["1ff31b0af...d57b464df4"],"root_token":"da8e3b55-8719-4594-5378-4a9f3498387f"}
   ```

祝贺您！您已成功重新初始化密钥存储库。要拆封它，请参阅[使用自定义钥匙拆封密封的密钥存储库](/cn/1.11/security/ent/secrets/unseal-store/#unseal-cust-keys)。
