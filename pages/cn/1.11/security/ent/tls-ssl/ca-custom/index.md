---
layout: layout.pug
navigationTitle: 配置自定义 CA 证书
title: 配置自定义 CA 证书
menuWeight: 50
excerpt: 配置 DC/OS Enterprise 以使用自定义 CA 证书

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


每个 DC/OS Enterprise 集群都有自己的 DC/OS 证书颁发机构 (CA)。默认情况下，CA 使用在安装 DC/OS 期间生成的全局唯一根 CA 证书。根 CA 证书用于为 DC/OS 组件（如 Admin Router）签署证书。您可以将 DC/OS Enterprise 配置为使用自定义 CA 证书，而不是使用自动生成的根 CA 证书，该证书可以是根 CA 证书，也可以是中间 CA 证书。（参见 [以下](#example-use-cases) 示例）

使用 DC/OS Enterprise 集群的自定义 CA 证书的好处包括：

- 确保 DC/OS 集群中用于签名和加密的所有 X.509 证书都来自您组织的 X.509 证书层次结构。
- 控制验证序号对的安全属性，如类型和强度，用于签署 DC/OS 组件证书。
- 确保所有 DC/OS 组件（包括 Admin Router）都提供浏览器信任的证书。

# 目录
- [受支持证书](#supported-ca-certificate)
- [术语表](#glossary)，用于术语的一般定义 
- [要求](#requirements)
- [配置参数参考](#config-ref)
- [安装预排](#install-dcos-enterprise-with-a-custom-ca-certificate)。
- [用例示例](#example-use-cases) 然后为三个常用用例的自定义 CA 证书配置文件提供示例文件内容。

# 受支持的 CA 证书
- 仅支持具有关联 RSA 类型验证序号对的自定义 CA 证书。当前不支持其他类型的证书，如使用 ECC 类型验证序号对的证书。
- 只有全新安装的 DC/OS Enterprise 1.10 或更高版本才支持自定义 CA 证书。不支持较旧版本的 DC/OS，并且在升级期间无法添加自定义 CA 证书。

术语表 
- **自定义 CA 证书：**PEM 格式的自定义 CA 证书，用于为 DC/OS 组件（如 Admin Router）颁发证书。自定义 CA 证书是中间 CA 证书（由其他 CA 颁发）或根 CA 证书（由自定义 CA 自签名）。

- **与自定义 CA 证书相关联的私钥：**与自定义 CA 证书关联的 PKCS#8 格式的私钥。

- **与自定义 CA 证书相关联的证书链：**终端实体证书验证所需的完整 CA 证书链。它必须包括中间自定义 CA 的所有父级 CA 证书，其中包括根 CA 证书。如果自定义 CA 证书为根 CA 证书，则证书链必须为空。

- **安装目录：**DC/OS 安装程序驻留的 bootstrap 节点上的目录。在本文档中以 `$DCOS_INSTALL_DIR` 表示。

- **配置：**管理安装过程特定方面的配置参数集。配置存储在 DC/OS 配置文件中。

- **DC/OS 配置文件：**包含 DC/OS 配置参数的文件。DC/OS 配置文件通常被称为 `config.yaml`，并且必须在安装期间出现在 bootstrap 节点上的 `$DCOS_INSTALL_DIR/genconf/` 的目录中。它由 DC/OS 安装程序使用。


# 要求

要使用自定义 CA 证书安装 DC/OS Enterprise，您需要：

- 使用 [高级 DC/OS 安装方法](/cn/1.11/installing/ent/custom/advanced/)。不支持其他安装方法。
- 包含自定义 CA 证书的文件。
- 包含与自定义 CA 证书相关联的私钥的文件。
- 包含与自定义 CA 证书相关联的证书链的文件，如果 CA **不是** 自签名根 CA。

## <a name="manually-placing-custom"></a>手动放置自定义 CA 证书


自定义 CA 证书、关联的专用验证序号和证书链文件必须放在 bootstrap 节点上的 `$DCOS_INSTALL_DIR/genconf/` 的目录中：

```bash
cd $DCOS_INSTALL_DIR
ls genconf/
```
```bash
dcos-ca-certificate.crt
dcos-ca-certificate-key.key
dcos-ca-certificate-chain.crt
```

## <a name="manually-placing-master"></a>手动放置专用验证序号 


出于安全原因，安装程序不会将专用验证序号从 bootstrap 节点复制到管理节点。
在**开始安装**之前，必须手动将与自定义 CA 证书相关联的专用验证序号分发到每个 DC/OS 管理节点。

私钥文件的文件系统路径必须是 `/var/lib/dcos/pki/tls/CA/private/custom_ca.key`。
目录 `/var/lib/dcos/pki/tls/CA/private/` 必须在将文件 `custom_ca.key` 放置在每个 DC/OS 管理节点上的目录中之前使用以下命令手动创建。

```bash
 mkdir -p /var/lib/dcos/pki/tls/CA/private
```

此外，包含与自定义 CA 证书对应的专用验证序号 `custom_ca.key` 的文件必须由 root Unix 用户拥有，并且设置了 0600 权限。

如果通过网络将私钥文件复制到管理节点上，则必须充分保护网络通道。下面提供了复制 CA 专用验证序号的示例。命令将在 bootstrap 节点上执行。以下 `W.X.Y.Z` 表示管理节点的 IP 地址：

```bash
cd $DCOS_INSTALL_DIR/genconf
scp dcos-ca-certificate-key.key centos@W.X.Y.Z:/var/lib/dcos/pki/tls/CA/private/custom_ca.key
```

## 指定位置

bootstrap 节点上 `$DCOS_INSTALL_DIR/genconf/` 目录中的自定义 CA 证书、关联专用验证序号和证书链文件的文件系统路径必须在 DC/OS 配置文件中分别使用 `ca_certificate_path`、`ca_certificate_key_path` 和 `ca_certificate_chain_path` 参数进行指定。路径必须对于 `$DCOS_INSTALL_DIR` 是相对的。

以下 [用例示例](#example-use-cases) 部分显示如何设置这些配置参数。

# <a name="config-ref"></a>配置参数参考
## ca\_certificate\_path
到包含 OpenSSL PEM 格式的单个 X.509 CA 证书的文件的路径（相对于 `$DCOS_INSTALL_DIR`）。例如：`genconf/dcos-ca-certificate.crt`它是**根 CA 证书**（“自签名”）或是由其他证书颁发机构签署的**中间 CA 证书**（“交叉认证”）。

如果提供，则这是自定义 CA 证书。它用作签名 CA 证书，即 DC/OS CA 将使用此证书签署终端实体证书；本证书的主体将是由 DC/OS CA 签署的证书的发行方。如果未提供，则 DC/OS 集群在初始 bootstrap 阶段中生成唯一根 CA 证书，并将其用作签名 CA 证书。

与自定义 CA 证书相关联的公共验证序号必须为 RSA 类型。

## ca\_certificate\_key\_path
到包含专用验证序号文件的路径（相对于 `$DCOS_INSTALL_DIR`），该私匙对应于自定义 CA 证书，以 OpenSSL (PKCS#8) PEM 格式编码。例如：`genconf/CA_cert.key`。

这是高度敏感的数据。配置处理器仅为配置验证目的访问此文件，并且不复制数据。成功配置验证后，需要将此文件从带外放置到路径 `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` 上所有 DC/OS 管理节点的文件系统中，然后再启动大多数 DC/OS `systemd` 单元。该文件必须是根用户可读取的，并且应该具有 0600 权限集。

如果指定了 `ca_certificate_path`，则此路径是必需的。

## ca\_certificate\_chain\_path
到包含完整 CA 证书链文件的路径（相对于 `$DCOS_INSTALL_DIR`），该证书链是终端实体证书验证所需的，采用 OpenSSL PEM 格式。例如：`genconf/CA_cert_chain.pem`。

如果 `ca_certificate_path` 指向根 CA 证书，则必须将参数保留为未定义。如果指定了 `ca_certificate_path` 并且自定义 CA 证书是**中间 CA 证书**，则为必需。

对于中间 CA，这需要指向包含所有 CA 证书的文件，该证书包含完整的顺序，精确地从用于签署自定义 CA 证书的 CA 证书开始并以根 CA 证书结束（其中发行方和主体是相同的），产生无间隙的认证途径。顺序很重要，列表必须至少包含一个证书。

使用自定义 CA 证书安装 DC/OS Enterprise

**先决条件**

- 通过高级安装程序安装 DC/OS Enterprise 是根据相应[文档](/cn/1.11/installing/production/deploying-dcos/installation/)编写，直至文档的[**安装 DC/OS**](/cn/1.11/installing/production/deploying-dcos/installation/#install-dcos)部分准备的。

- 在 bootstrap 节点上，带有自定义 CA 证书、关联的专用验证序号和可选的 CA 证书链的文件已放入 `$DCOS_INSTALL_DIR/genconf/` 的目录中。（请参阅上面的[部分](#manually-placing-custom)，了解更多详细说明）

- 与自定义 CA 证书相关联的私钥已安全地放置在所有 DC/OS 管理节点上（有关更多信息，请参阅本[部分](#manually-place-master)）。在 DC/OS 管理节点之一上发出命令的示例：

```bash
stat /var/lib/dcos/pki/tls/CA/private/custom_ca.key
```
```bash
File: ‘/var/lib/dcos/pki/tls/CA/private/custom_ca.key’
Size: 9 Blocks: 8 IO Block: 4096 regular file
Device: ca01h/51713d Inode: 100671105 Links: 1
Access: (0600/-rw-------) Uid: ( 0/ root) Gid: ( 0/ root)
Context: unconfined_u:object_r:var_lib_t:s0
Access: 2017-12-27 12:35:58.643278377 +0000
Modify: 2017-12-27 12:35:58.643278377 +0000
Change: 2017-12-27 12:36:13.019162417 +0000
Birth: -
```

- 配置参数 `ca_certificate_path`、`ca_certificate_key_path` 和 `ca_certificate_chain_path` 在 DC/OS 配置文件 `$DCOS_INSTALL_DIR/genconf/config.yaml` 中指定并指向文件系统中的相关位置。在 bootstrap 节点上发出命令的示例：

```bash
cd $DCOS_INSTALL_DIR
cat genconf/config.yaml
```
```bash
[...]
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
[...]
```
请注意，在使用根证书作为自定义 CA 证书设置 DC/OS Enterprise 时，不得存在 `ca_certificate_chain_path`。

## 安装
按照[高级安装程序文档](/cn/1.11/installing/production/deploying-dcos/installation/#install-dcos)中的说明继续安装。请注意，当执行 `dcos_generate_config.ee.sh` 时，当前工作目录必须是 `$DCOS_INSTALL_DIR` 目录。

## 验证安装
验证是否使用自定义 CA 证书正确安装 DC/OS Enterprise 集群的一种方法是启动到 Admin Router 的 TLS 连接，Admin Router 在安装后会显示自定义 CA 签署的证书。为此，您首先需要获取已部署集群的 DC/OS CA 捆绑包。[本页面](/cn/1.11/security/ent/tls-ssl/get-cert/)显示了您如何做到这一点。

如果您已经获得 DC/OS CA 捆绑包，并将其存储在名为 `dcos-ca.crt` 的文件中，在包含 `dcos-ca.crt` 文件的目录中发出以下命令，以检查管理节点上的 Admin Router 是否使用自定义 CA 签署的证书：

```bash
openssl s_client -verify_ip <private_ip_master_node_X> -CAfile dcos-ca.crt -connect <public_ip_master_node_X>:443 | grep -e "s:" -e "i:" -e "return code:"
```

输出应如下所示：

```bash
depth=3 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Programmer Unit, CN = Integration Test Root CA
verify return:1
depth=2 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Programmer Unit, CN = Integration Test Intermediate CA 01
verify return:1
depth=1 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Programmer Unit, CN = Integration Test Intermediate CA 02
verify return:1
depth=0 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = AdminRouter on 172.31.12.45
verify return:1
 0 s:/C=US/ST=CA/L=San Francisco/O=Mesosphere, Inc./CN=AdminRouter on 172.31.12.45
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 02
 1 s:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 02
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
 2 s:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
    Verify return code: 0 (ok)
```

## 用例示例
本部分介绍了如何在 `$DCOS_INSTALL_DIR/genconf/config.yaml` DC/OS 配置文件中为自定义 CA 证书层次结构的最常见用例指定三个配置参数 `ca_certificate_path`、`ca_certificate_key_path` 和 `ca_certificate_chain_path`。

### 用例 1：
自定义 CA 证书是自签名根 CA 证书。CA 没有“父” CA，因此 CA 证书链为空。

包含以下文件：

- 在 botstrap 节点上：
 - 包含自定义 CA 证书的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` 文件
 - 包含与自定义 CA 证书相关联的专用验证序号的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` 文件

- 在管理节点：
 - 包含与自定义 CA 证书相关联的私钥的 `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` 文件。

以下是自定义根 CA 证书的 `issuer` 和 `subject` 字段示例：

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
```

由于自定义 CA 证书是根 CA 证书，且相应的 CA 证书链为空，因此我们必须省略 DC/OS 配置文件中的 `ca_certificate_chain_path` 参数。必须在 bootstrap 节点上的 `$DCOS_INSTALL_DIR/genconf/config.yaml` 文件中指定如下内容的配置参数：

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
```

### 用例 2：

在该用例中，自定义 CA 证书是由 root CA 直接颁发的中间 CA 证书。CA 证书链只包含该根 CA 证书。存在以下文件：

- 在 botstrap 节点上：
 - 包含自定义 CA 证书的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` 文件， 格式为 PEM
 - 包含与自定义 CA 证书相关联的私钥的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` 文件，格式为 PKCS#8
 - 包含证书链的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-chain.crt` 文件， 格式为 PEM

- 在管理节点
 - 包含与自定义 CA 证书相关联的专用验证序号的 `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` 文件，格式为 PKCS#8

以下是适当的中间自定义 CA 证书示例：

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
```

以下是相应的 CA 证书链的示例：

```bash
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-certificate-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }' 
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
```

必须在 bootstrap 节点上的 `$DCOS_INSTALL_DIR/genconf/config.yaml` DC/OS 配置文件中指定类似于以下内容的配置参数：

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
```

### 用例 3：

在该用例中，自定义 CA 证书是其他中间 CA 直接颁发的中间 CA 证书，而后者的证书又由根 CA 颁发。

CA 证书链包括 
1. 颁发中间 CA 的 CA 证书，以及 
1. 根 CA 

按以上顺序。

存在以下文件：

- 在 botstrap 节点上：
 - 包含自定义 CA 证书的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` 文件， 格式为 PEM
 - 包含与自定义 CA 证书相关联的私钥的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` 文件，格式为 PKCS#8
 - 包含证书链的 `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-chain.crt` 文件， 格式为 PEM

- 在管理节点
 - 包含与自定义 CA 证书相关联的专用验证序号的 `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` 文件，格式为 PKCS#8

以下是适当的自定义中间 CA 证书示例：

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 02
```

以下是相应的 CA 证书链的示例：

```bash
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-certificate-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }' 
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
```

必须在 bootstrap 节点上的 `$DCOS_INSTALL_DIR/genconf/config.yaml` DC/OS 配置文件中指定如下内容的配置参数：

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
```
