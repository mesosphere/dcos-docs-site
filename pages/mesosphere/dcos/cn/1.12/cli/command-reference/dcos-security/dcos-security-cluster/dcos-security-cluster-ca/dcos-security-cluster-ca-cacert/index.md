---
layout: layout.pug
navigationTitle:  dcos security cluster ca cacert
title: dcos security cluster ca
menuWeight: 12
excerpt: 与 DC/OS 群集 CA 互动
enterprise: true
---


# 说明

`dcos security cluster ca cacert` 命令将获取 PEM 编码的签名 CA 证书（根 CA 证书或中间 CA 证书）。

# 使用

```
dcos security cluster ca cacert [OPTIONS]
```


# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|

# 示例

```
dcos security cluster ca cacert
-----BEGIN CERTIFICATE-----
MIIDszCCApugAwIBAgIQSgKc/+yCRSGVzvbfW0/WaDANBgkqhkiG9w0BAQsFADCB
ijELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRYwFAYDVQQHDA1TYW4gRnJhbmNp
c2NvMRkwFwYDVQQKDBBNZXNvc3BoZXJlLCBJbmMuMTswOQYDVQQDDDJEQy9PUyBS
b290IENBIDc0NTRlNGUwLTk0NWYtNGYyYS1hZjEwLTM0MTE4ODY4YTNlZjAeFw0x
OTAzMTUyMDA5MjNaFw0yOTAzMTIyMDA5MjNaMIGKMQswCQYDVQQGEwJVUzELMAkG
A1UECAwCQ0ExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xGTAXBgNVBAoMEE1lc29z
cGhlcmUsIEluYy4xOzA5BgNVBAMMMkRDL09TIFJvb3QgQ0EgNzQ1NGU0ZTAtOTQ1
Zi00ZjJhLWFmMTAtMzQxMTg4NjhhM2VmMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEA2PdIZenEiHxTodbW8F2HQmbxR5ixZAe4Wd/MSH/OXitv/riopjxm
rE3Avr3e57GgeLcNETmKbnr92DB48U5mzQ+KhBPHOpDN7KEY2qWVNXvuLSNfW0BI
azYep7SEG2h3pV51gnSjjrpKXZF3QZpBnyH+Vp30YkhaDZ37rLL2op9DPxTZDWdl
V9ryLtFnMlQq0oJW3qnBiG4h5t7yuoGNcfKSUIrKoDAs2ccKWT6Ge2rJhJUYdID7
L/hRCGl5yL0CX1Yq0UIj2S3hs4C+R9CuPH3e98lNIFdwRgiUIyCK3SFUw9rwIdZ8
iwdMB7vIj6FAj+pAillNWOa1ieDAz9MvcQIDAQABoxMwETAPBgNVHRMBAf8EBTAD
AQH/MA0GCSqGSIb3DQEBCwUAA4IBAQCTGvzsuCODTerSbJWWNwQzIUeCZK6eWnT4
5dQyA2X+mwVVeHlnPsTocHg+llcJvdaLJx84F8Ok3n0vG55xu9qu6E8mi91MqaRk
Hy8eyR72lVey+cBETfxgGszGxUF80hKITK5Z8jHuA+GiHa/bykuCWxo4tlcHOsmO
a1kssNxEO96o+6yHC3ACLQKDY5s/3W/eIPtV0wtdZb0JiZd7FECb8AzL0D2Z1Rsw
1TaFRmNAM70fAbHdz1Bi+wt6W4zEDRfxOa+yBd8RPrIlEGPOzcYIscK2lGwwaC4H
ndLcnv0dj2WTDCQihd6DNFnoCYNSAMUtSc6Kd6kqvbVVe+1ZzeOc
-----END CERTIFICATE-----
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 CA](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | 查看 DC/OS 安全群集证书颁发机构信息。 |
