---
layout: layout.pug
navigationTitle:  dcos security cluster ca newcert
title: dcos security cluster ca newcert
menuWeight: 5
excerpt: 创建和签署新证书
enterprise: true
---

# 说明

`dcos security cluster ca newcert` 命令让您可以创建并签署新证书。您只能根据下面提供的命令行选项创建新证书。

# 使用

```
dcos security cluster ca newcert [OPTIONS]
```

# 选项

| 名称 | 说明 |
|----------|---------------|
|`--cn <text>` | 规范名。（必填）|
| `--host <text>`| 可以多次指定 SAN 主机（必填）|
|`--name-c <text>`| 国家|
|`--name-st <text>`|州 |
|`--name-o <text>`| 组织|
|`--name-l <text>`| 地区|
|`--name-ou <text>`| 组织单位|
|`--key-algo [rsa|ecdsa]`| 密钥算法|
|`--key-size [256|384|521|2048|4096|8192]`| 密钥大小|
|`-p`, `--profile <text>`| 要使用的签名配置文件|
|`-j`, `--json`| JSON 格式的输出数据|
|`-h`, `--help`| 显示此消息并退出|



# 示例

```
dcos security cluster ca newcert --cn Certificate_1 --host SAN-1
certificate: '-----BEGIN CERTIFICATE-----

    MIIDoTCCAomgAwIBAgIUBT...kJJdXc8+KbNdmWCj8Jrp4F6kl1

    -----END CERTIFICATE-----

    '
certificate_request: '-----BEGIN CERTIFICATE REQUEST-----

    MIICgDCCAWgCAQAwGDEWMBQGA1UE...WtxMohnRkIif/9nYMugdWaMoP7o=

    -----END CERTIFICATE REQUEST-----

    '
private_key: '-----BEGIN RSA PRIVATE KEY-----

    MIIEowIBAAKCAQEA0o6J+/q4YLSC9...R40PgUuPfHXR0flwdp9JN5

    -----END RSA PRIVATE KEY-----

    '
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 CA](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | 查看 DC/OS 安全群集证书颁发机构信息。 |
