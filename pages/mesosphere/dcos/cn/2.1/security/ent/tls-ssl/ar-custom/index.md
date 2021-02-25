---
layout: layout.pug
navigationTitle:  配置自定义外部证书
title: 配置自定义外部证书
menuWeight: 50
excerpt: 配置 DC/OS Enterprise 以使用自定义外部证书
enterprise: true
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


通过 Admin Router 对 DC/OS Enterprise 群集进行外部访问。默认情况下，Admin Router 提供的证书由 DC/OS 证书颁发机构签名。默认情况下，默认的 DC/OS CA 证书不受信任，并且要求客户端在 CA 中手动配置信任（例如，通过接受弹出的浏览器对话框）。可以使用 [自定义 CA 证书] 提供受信任的 CA 证书(/mesosphere/dcos/cn/2.1/security/ent/tls-ssl/ca-custom/)。但是，获得合适的 CA 证书可能很困难。通过自定义外部证书，群集管理员可以提供易于获取的非 CA 证书和 Admin Router 将提供给外部连接的密钥。

为您的 DC/OS Enterprise 群集使用自定义外部证书的好处包括：

- 只需要获得标准证书，而非中间 CA 签名证书，就可以在默认情况下与客户端信任的群集连接（即浏览器信任的证书）；
- 对于连接到使用不同服务器名称的群集的客户端，使用具有不同属性的证书。

# 目录
- [支持](#支持)
- [术语表](#glossary)，用于术语的一般定义
- [要求](#requirements)
- [配置参数参考](#config-ref)
- [安装](#installing-dcos-enterprise-with-a-custom-external-certificate)

# 支持
- DC/OS Enterprise 2.1 及更高版本支持自定义外部证书。
- 在初始安装或升级期间可添加自定义外部证书。
- 自定义外部证书支持 RSA 和 ECC 密钥。

术语表
- **自定义外部证书：** PEM 格式的证书，用于通过 Admin Router 访问使用一组服务器名称的群集。如有必要，应将所有的中间 CA 证书包含在客户端信任的根 CA 证书中。根 CA 证书不需要包含在 PEM 文件中。

- **服务器名称：** Admin Router 与自定义外部证书的规范名称和对象替代名称相匹配的一组名称。

- **自定义私钥：** 与自定义外部证书关联的 PKCS#8 格式的私钥。

- **安装目录：**DC/OS 安装程序驻留的 bootstrap 节点上的目录。在本文档中以 `$DCOS_INSTALL_DIR` 表示。

- **配置：**管理安装过程特定方面的配置参数集。配置存储在 DC/OS 配置文件中。

- **DC/OS 配置文件：**包含 DC/OS 配置参数的文件。DC/OS 配置文件通常被称为 `config.yaml`，并且必须在安装期间出现在 bootstrap 节点上的 `$DCOS_INSTALL_DIR/genconf/` 的目录中。它由 DC/OS 安装程序使用。


# 要求

要使用自定义外部证书安装 DC/OS Enterprise，您需要：

- 包含自定义外部证书的文件。
- 包含自定义私钥的文件。

## 指定位置

bootstrap 节点上 `$DCOS_INSTALL_DIR/genconf/` 目录中的自定义外部证书、自定义私钥的文件系统路径必须在 DC/OS 配置文件中分别使用 `external_certificate_path` 和 `external_certificate_key_path` 参数进行指定。路径必须相对于 `$DCOS_INSTALL_DIR`.

# <a name="config-ref"></a>配置参数参考
### external_certificate_path
到包含 OpenSSL PEM 格式的单个 X.509 leaf 证书的文件的路径（相对于 `$DCOS_INSTALL_DIR`）。例如：`genconf/external-certificate.crt`。如有必要，应将所有的中间 CA 证书包含在客户端信任的根 CA 证书中。建议不要在 PEM 文件中包含最终根 CA 证书，但这并不强制要求。

如果提供，则这是自定义外部证书。如果未提供，那么 DC/OS 群集使用在 DC/OS CA 签名的初始 bootstrap 阶段生成的唯一 leaf 证书，并将其提供给客户端。

请参阅 `external_certificate_validation_disable` 参数，了解外部证书的验证以及如何被覆盖。

## external_certificate_key_path
到包含私匙文件的路径（相对于 `$DCOS_INSTALL_DIR`），该私匙对应于自定义外部证书，以 OpenSSL (PKCS#8) PEM 格式编码。例如：`genconf/external-certificate-key.key`.

这是高度敏感的数据。配置处理器仅为配置验证目的访问此文件，并且不复制数据。成功配置验证后，需要将此文件从带外放置到路径 `/var/lib/dcos/pki/tls/private/adminrouter-external.key` 上所有 DC/OS 主节点的文件系统中，然后再启动大多数 DC/OS `systemd` 单元。该文件必须是根用户可读取的，并且应该具有 0600 权限集。

如果指定了 `external_certificate_path`，则此路径是必需的。

## external_certificate_servernames

访问群集时客户端可以使用的服务器名称列表，
以便 Admin Router 将自定义外部证书提供给
客户端。服务器名称可包含：
  - 普通主机名，例如，`host.example.com`。
  - IP 地址，例如，`192.0.2.5`。
  - `*` 通配符，如 `*.example.com`，会匹配
    `example.com`（如 `foo.example.com`、`bar.example.com`）的所有子域，但不是域
    本身 - `example.com` 或更深的子域：`foo.bar.example.com`。
  - `.` 通配符，如 `.example.com`，会相同匹配 `*` 通配符以及域
    本身（如 `foo.example.com`、`bar.example.com`、`example.com`）。

  服务器名称不能包含：
  - `master.mesos`
  - `leader.mesos`
  - `registry.component.thisdcos.directory`
  - 由 `/opt/mesosphere/bin/detect_ip` 脚本（从 `ip_detect_contents` 或 `ip_detect_filename` 配置参数创建）返回的任何 IP 地址。

此选项中所提供的每个服务器名称必须在自定义外部
证书的规范名称或对象替代名称中。

如果指定了 `external_certificate_path`，则此选项是必需的。

## external_certificate_validation_disable
自定义外部证书在使用之前，需要经过
验证。即：

  - 对
      `external_certificate_servernames`参数所提及的服务器名称的限制
  - 证书密钥必须为 RSA 或 ECC 类型
  - RSA 密钥最小为 2048
  - ECC 密钥最小为 256
  - ECC 的密钥曲线必须是 SECP256R1 或 SECP384R1 之一，
  - 必须定义密钥用法扩展
  - 证书的有效期不得起始于未来日期
  - 证书的有效期不得早于 365 
      天截止
  - 不需要基本约束，但如果被定义，则
      不应设置 CA 标记
  - 密钥用法扩展必须设置数字签名和密钥加密
      扩展
  - 必须存在已扩展的密钥用法扩展，并且其服务器
      身份认证标记必须被设置

此外，如果证书链存在于外部
证书的 PEM 中，则链本身必须：

  - 从 leaf 证书开始，紧跟中间 CA 证书，每个
  都签署其前者，并被其后者签署
  - 每个中间 CA 证书必须是有效的 CA 证书（到期等）

如果这些限制太严格，则可以通过
将 `external_certificate_validation_disable` 参数设置为 `true` 来覆盖。

# 使用自定义外部证书安装 DC/OS Enterprise

## 前提条件

- 通过安装程序安装 DC/OS Enterprise 是根据相应 [文档](/mesosphere/dcos/cn/2.1/installing/production/deploying-dcos/installation/) 进行准备（直至文档的[**安装 DC/OS**](/mesosphere/dcos/cn/2.1/installing/production/deploying-dcos/installation/#install-dcos) 部分）。

- 配置参数 `external_certificate_path`、`external_certificate_key_path` 和 `external_certificate_servernames` 在 DC/OS 配置文件 `$DCOS_INSTALL_DIR/genconf/config.yaml` 中指定并指向文件系统中的相关位置。在 bootstrap 节点上发出命令的示例：

```bash
cd $DCOS_INSTALL_DIR
cat genconf/config.yaml
```
```
[...]
external_certificate_path: genconf/external-certificate.crt
external_certificate_key_path: genconf/external-certificate-key.key
external_certificate_servernames:
  - foo.example.com
  - bar.example.com
  - .example.org
  - *.example.net
[...]
```

## 复制自定义外部证书和私钥到 bootstrap 节点

自定义外部证书、自定义私钥必须放在 bootstrap 节点上的 `$DCOS_INSTALL_DIR/genconf/` 目录中：

```bash
cd $DCOS_INSTALL_DIR
ls genconf/
```
```
external-certificate.crt
external-certificate-key.key
```

## 将自定义私钥手动复制到所有管理节点

出于安全原因，安装程序不会将私钥从 bootstrap 节点复制到主节点。
**在开始安装之前**，必须将自定义私钥安全地分发到每个 DC/OS  管理节点。

自定义私钥文件的文件系统路径必须是 `/var/lib/dcos/pki/tls/private/adminrouter-external.key`。包含与自定义外部证书对应的私钥 `adminrouter-external.key` 的文件必须由 root Unix 用户拥有，并且设置了 0600 权限。建议您确保目录 `/var/lib/dcos/pki/tls/private` 由 root 拥有，并且具有 0700 权限。

如果通过网络将私钥文件复制到主节点上，则必须充分保护网络通道。

例如，可以通过在每个管理节点（`W.X.Y.Z` 表示 bootstrap 节点的 IP 地址）上运行以下命令（如 `root` ）来实现这一点：

```bash
mkdir -p /var/lib/dcos/pki/tls/private/
chown root /var/lib/dcos/pki/tls/private/
chmod 700 /var/lib/dcos/pki/tls/private/
scp centos@W.X.Y.Z:$DCOS_INSTALL_DIR/genconf/external-certificate-key.key /var/lib/dcos/pki/tls/private/
chown root /var/lib/dcos/pki/tls/private/adminrouter-external.key
chmod 600 /var/lib/dcos/pki/tls/private/adminrouter-external.key
```

## 安装
按照 [安装程序文档](/mesosphere/dcos/cn/2.1/installing/production/deploying-dcos/installation/#install-dcos) 中的说明继续安装。请注意，当执行 `dcos_generate_config.ee.sh` 时，当前工作目录必须是 `$DCOS_INSTALL_DIR` 目录。

如果您从 DC/OS CA 发布的证书更改为自定义外部证书（反之亦然），请注意，您的客户端在升级期间可能需要同时信任这两种证书。

## 验证安装
要验证是否已通过自定义外部证书正确安装 DC/OS Enterprise 群集，请启动 TLS 连接至 Admin Router，它将提供已配置服务器名称的自定义外部证书。为此，请在要与 `external_certificate_servernames` 中的一个条目相匹配的请求中指定服务器名称。

如果您已有已签名外部证书的 CA 根证书，则可执行以下命令：

```bash
openssl s_client -connect <public_ip_master_node_X>:443 -showcerts -servername <one of configured server names> -verifyCAfile <path to the CA file that signed external certificate/external certificate intermediate chain>  | grep -e "s:" -e "i:" -e "return code:" | grep -e "s:" -e "i:" -e "return code:"
```

输出应如下所示：

```
depth=4 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Root CA
verify return:1
depth=3 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 0
verify return:1
depth=2 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 1
verify return:1
depth=1 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 2
verify return:1
depth=0 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Leaf Certificate
verify return:1
 0 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Leaf Certificate
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 2
 1 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 2
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 1
 2 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 1
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 0
 3 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 0
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Root CA
    Verify return code: 0 (ok)
```
