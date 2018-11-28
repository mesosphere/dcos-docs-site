---
layout: layout.pug
navigationTitle: 安全
excerpt: 保护 HDFS 服务
title: 安全
menuWeight: 50
model: /cn/services/hdfs/data.yml
render: mustache
---

# DC/OS {{ model.techName }} 安全

- DC/OS {{ model.techName }} 服务允许您创建服务帐户以为 {{ model.techName }} 配置访问权限。服务允许您创建和分配访问所需的权限。

- DC/OS {{ model.techName }} 服务支持 {{ model.techName }}的本地传输加密机制。该服务提供自动化和编排，以简化这些重要功能的使用。目前，不支持 {{ model.techName }} 的身份验证和授权功能。

<p class="message--note"><strong>注意：</strong> 这些安全功能仅在 DC/OS Enterprise 1.10 及更高版本中可用。</p>

#include /cn/services/include/service-account.tmpl

#include /cn/services/include/security-create-permissions.tmpl

## 传输加密

#include /cn/services/include/security-transport-encryption-lead-in.tmpl

<p class="message--note"><strong>注意 </strong>使用 <a href="#kerberos-authentication">Kerberos 身份认证</a>并不_要求_启用传输加密，但传输加密 _可以_ 与 Kerberos 身份认证结合。</p>

#include /cn/services/include/security-configure-transport-encryption.tmpl

#include /cn/services/include/security-transport-encryption-clients.tmpl

待确认
*注意*：可以更新正在运行的 DC/OS {{ model.techName }} 服务以在初次安装后启用传输加密，但在过渡期间，服务可能不可用。另外，您的 {{ model.techShortName }} 客户端需要重新配置，除非 `service.security.transport_encryption.allow_plaintext` 设置为 true。

## 身份认证 

DC/OS {{ model.techName }} 支持 Kerberos 身份认证。

### Kerberos 身份认证

Kerberos 身份认证依赖中央权限来验证 {{ model.techShortName }} 客户端是其所声明的身份。DC/OS {{ model.techName }} 与现有 Kerberos 基础架构集成，以验证客户端的身份。

#### 先决条件
- 从 DC/OS 集群可访问的 KDC 的主机名和端口
- 充分访问 KDC 的权限，以创建 Kerberos principal
- 充分访问 KDC 的权限，以检索已生成的 principal 的 keytab
- [DC/OS Enterprise CLI](/latest/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS 超级用户权限

#### 配置 Kerberos 身份认证

#### 创建 principal

DC/OS {{ model.techName }} 服务要求部署每个节点的 Kerberos principal。{{ model.techShortName }} 服务的整体拓扑是：
- 3 个日志节点
- 2 个名称节点（带 ZKFC）
- 可配置数量的数据节点

<p class="message--note"><strong>注意：</strong>{{ model.techName }} 需要一个针对 `service primary` 和 `HTTP` 二者的 principal。后者由 HTTP api 使用。</p>

所需的 Kerberos principal 形式如下：
```
<service primary>/name-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/name-0-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-0-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/name-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/name-1-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/name-1-zkfc.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>

<service primary>/journal-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/journal-0-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/journal-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/journal-1-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
<service primary>/journal-2-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/journal-2-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>

<service primary>/data-<data-index>-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
HTTP/data-<data-index>-node.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>

```
带有：
- `service primary = service.security.kerberos.primary`
- `data index = 0 up to data_node.count - 1`
- `service subdomain = service.name with all `/`'s removed`
- `service realm = service.security.kerberos.realm`

例如，如果使用以下选项安装：
```json
{
    "service": {
        "name": "a/good/example",
        "security": {
            "kerberos": {
                "primary": "example",
                "realm": "EXAMPLE"
            }
        }
    },
    "data_node": {
        "count": 3
    }
}
```
则要创建的 principal 是：
```
example/name-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/name-0-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-0-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/name-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/name-1-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/name-1-zkfc.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE

example/journal-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/journal-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/journal-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/journal-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/journal-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/journal-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE

example/data-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/data-0-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/data-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/data-1-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/data-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
HTTP/data-2-node.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
```

#include /cn/services/include/security-kerberos-ad.tmpl

#include /cn/services/include/security-service-keytab.tmpl

#### 安装服务

除了您自己的选项外，安装 DC/OS {{ model.techName }} 服务还提供以下选项：
```json
{
    "service": {
        "security": {
            "kerberos": {
                "enabled": true,
                "kdc": {
                    "hostname": "<kdc host>",
                    "port": <kdc port>
                },
                "primary": "<service primary default hdfs>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>
            }
        }
    }
}
```



## 授权

DC/OS {{ model.techName }} 服务支持 {{ model.techShortName }}的本地授权，其过程与 UNIX 文件权限类似。如果 Kerberos 已按 [以上](#kerberos-authentication) 详述内容启用，则 Kerberos principal 将映射到 {{ model.techShortName }} 用户，并据此分配权限。

### 启用授权

#### 先决条件
- 完成上述 [Kerberos 身份认证](#kerberos-authentication)。

#### 将 Kerberos Principal 设置为用户映射

必须设置自定义映射以将 Kerberos principal 映射到操作系统用户名，以确定组成员身份。这是通过设置参数提供的，
```
{
    "hdfs": {
        "security_auth_to_local": "<custom mapping>"
    }
}
```
其中 `<custom mapping>` 是 base64 编码字符串。

<p class="message--note"><strong>注意：</strong>没有 默认映射。必须 在安装时或在服务更新时设置一个映射。</p>

[本](https://hortonworks.com/blog/fine-tune-your-apache-hadoop-security-settings/) 文章有对如何创建自定义映射的详细说明，见“Kerberos Principal 和 UNIX 用户名”部分。

<p class="message--note"><strong>注意：</strong>在 DC/OS 1.11 及以上版本中，DC/OS UI 将自动对与 base64 之间的映射进行编码和解码。如果从 CLI 安装或从早于  DC/OS 1.11 版本的 UI 中安装，必须手动执行编码。</p>

