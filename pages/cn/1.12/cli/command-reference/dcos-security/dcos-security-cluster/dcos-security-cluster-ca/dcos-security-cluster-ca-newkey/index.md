---
layout: layout.pug
navigationTitle:  dcos security cluster ca newkey
title: dcos security cluster ca newkey
menuWeight: 13
excerpt: 创建新密钥和新的 CSR

enterprise: true
---

# 说明

`dcos security cluster ca newkey` 用于创建新密钥和新的 CSR。

# 使用

```
dcos security cluster ca newkey [OPTIONS]
```


# 选项：

| 名称 | 说明 |
|--------|---------------|
|`--cn <text>` |规范名。（必填）|
| `--host <text>`| 可以多次指定 SAN 主机。（必填）|
| `--name-c <text>` | 国家。|
| `--name-st <text>` | 州。|
| `--name-o <text>` | 组织。|
| `--name-l <text>` | 地区。|
| `--name-ou <text>` | 组织单位。|
| `--key-algo <text>` | 密钥算法。|
| `--key-size <integer>`| 密钥大小。|
| `-j`, `--json`| JSON 格式的输出数据。|
| `-h`, `--help`| 显示此消息并退出。|



# 示例

```
dcos security cluster ca newkey --cn Newkey-1 --host SAN-1
certificate: '-----BEGIN CERTIFICATE-----

    MIIDnDCCAoSgAwIBAgIUGa0ZJB81dGW...2SxjIWJiuH+a5vTgQ+uqkw==

    -----END CERTIFICATE-----

    '
certificate_request: '-----BEGIN CERTIFICATE REQUEST-----

    MIICezCCAWMCAQAwEzERMA8GA1UE...Cd3zi8AAzKw3K1VgxOLF

    -----END CERTIFICATE REQUEST-----

    '
private_key: '-----BEGIN RSA PRIVATE KEY-----

    MIIEowIBAAKCAQEAwC+x2CaCEik10MPRRls...hodkI/cADjayx7Pjz29wt

    -----END RSA PRIVATE KEY-----

    '
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 CA](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | 查看 DC/OS 安全群集证书颁发机构信息。 |
