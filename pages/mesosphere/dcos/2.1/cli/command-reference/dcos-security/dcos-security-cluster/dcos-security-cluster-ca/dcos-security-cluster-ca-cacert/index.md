---
layout: layout.pug
navigationTitle:  dcos security cluster ca cacert
title: dcos security cluster ca
menuWeight: 12
excerpt: Interacting with the DC/OS cluster CA
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---


# Description

The `dcos security cluster ca cacert` command will fetch the PEM-encoded signing CA certificate (either a root CA certificate or an intermediate CA certificate).

# Usage

```
dcos security cluster ca cacert [OPTIONS]
```


# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|

# Example

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

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster ca](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | View DC/OS security cluster certificate authority information. |
