---
layout: layout.pug
navigationTitle: 安全
excerpt: 保护您的服务
title: 安全
menuWeight: 50
model: /cn/services/kafka/data.yml
render: mustache
enterprise: true
---


# DC/OS {{ model.techName }} 安全

DC/OS {{ model.techName }} 服务支持 {{ model.techShortName }}的本地传输加密、身份认证和授权机制。该服务提供自动化和编排，以简化这些重要功能的使用。

有关这些功能的详细概述，请参阅 [此处](https://www.confluent.io/blog/apache-kafka-security-authorization-authentication-encryption/)，{{ model.techShortName }}的安全文档可见 [此处](http://kafka.apache.org/documentation/#security)。

<p class="message--note"><strong>注意：</strong>这些安全功能仅在 DC/OS Enterprise 1.10 及更高版本中可用。</p>

## 传输加密

#include /cn/services/include/security-transport-encryption-lead-in.tmpl

<p class="message--note"><strong>注意：</strong>对于 [身份认证](#authentication)，启用传输加密 *需要* 使用 [SSL 身份认证]，但是，对于 <a href="#kerberos-authentication">Kerberos 身份认证</a>，则是可选的。</p>

#include /cn/services/include/security-configure-transport-encryption.tmpl

可以更新运行中的 DC/OS {{ model.techName }} 服务，从而在初始安装后启用传输加密，但服务在过渡期间可能不可用。另外，您的 {{ model.techShortName }} 客户端需要重新配置，除非 `service.security.transport_encryption.allow_plaintext` 被设置为 true。

#### 验证传输加密已启用

服务部署完成后，为端点 `broker-tls` 检查  [{{ model.techShortName }}端点](./api-reference/#connection-information) 的列表。如果 `service.security.transport_encryption.allow_plaintext` 是 `true`，那么 `broker` 端点也可用。

#include /cn/services/include/security-transport-encryption-clients.tmpl

## 身份认证

DC/OS {{ model.techName }} 支持两个身份认证机制，即 SSL 和 Kerberos。两者受独立支持，不得组合。如果同时启用 SSL 和 Kerberos 身份认证，那么该服务将使用 Kerberos 身份认证。

<p class="message--note"><strong>注意：</strong> Kerberos 身份认证可以与传输加密结合使用。</p>

### Kerberos 身份认证

Kerberos 身份认证依赖中央权限来验证 {{ model.techShortName }} 客户端（代理商、消费者或生产者）是他们所说的真实身份。DC/OS {{ model.techName }} 与现有 Kerberos 基础架构集成，以验证客户端的身份。

#### 先决条件
- 从 DC/OS 集群可访问的 KDC 的主机名和端口
- 充分访问 KDC 的权限，以创建 Kerberos principal
- 充分访问 KDC 的权限，以检索已生成的 principal 的 keytab
- [DC/OS Enterprise CLI](/1.10/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)
- DC/OS 超级用户权限

#### 配置 Kerberos 身份认证

#### 创建 principal

DC/OS {{ model.techName }} 服务要求部署每个代理的 Kerberos principal。每个 principal 必须为形式
```
<service primary>/kafka-<broker index>-broker.<service subdomain>.autoip.dcos.thisdcos.directory@<service realm>
```
带有：
- `service primary = service.security.kerberos.primary`
- `broker index = 0 up to brokers.count - 1`
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
    "brokers": {
        "count": 3
    }
}
```
则要创建的 principal 是：
```
example/kafka-0-broker.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/kafka-1-broker.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
example/kafka-2-broker.agoodexample.autoip.dcos.thisdcos.directory@EXAMPLE
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
                "enabled_for_zookeeper": <true|false default false>,
                "kdc": {
                    "hostname": "<kdc host>",
                    "port": <kdc port>
                },
                "primary": "<service primary default kafka>",
                "realm": "<realm>",
                "keytab_secret": "<path to keytab secret>",
                "debug": <true|false default false>
            }
        }
    }
}
```

**注意：** 如果 `service.kerberos.enabled_for_zookeeper` 设置为 true，那么是其他设置 `kafka.kafka_zookeeper_uri` 必须经过配置，以指向以下 kerberized {{ model.kafka.zookeeperTechName }}：
```json
{
    "kafka": {
        "kafka_zookeeper_uri": <list of zookeeper hosts>
    }
}
```
DC/OS {{ model.kafka.zookeeperTechName }} 服务（`{{ model.kafka.zookeeperPackageName }}` 包）用于此目的并支持 Kerberos。

**注意：** 可以在初始安装后启用 Kerberos，但服务在过渡期间可能不可用。另外，您的 {{ model.techShortName }} 客户端需要重新配置。


### SSL 身份认证

SSL 身份认证要求所有客户端（代理商、生产者或者消费者）出示可以获取其身份的有效证书。DC/OS {{ model.techName }} 将 SSL 证书的 `CN` 作为给定客户端的 principal。例如，将从证书 `CN=bob@example.com,OU=,O=Example,L=London,ST=London,C=GB` 中提取 principal `bob@example.com`。

#### 先决条件
- 完成上述 [传输加密](#transport-encryption) 部分

#### 安装服务

除了您自己的选项外，安装 DC/OS {{ model.techName }} 服务还提供以下选项：
```json
{
    "service": {
        "service_account": "<service-account>",
        "service_account_secret": "<secret path>",
        "security": {
            "transport_encryption": {
                "enabled": true
            },
            "ssl_authentication": {
                "enabled": true
            }
        }
    }
}
```

**注意：** 可以在初始安装后启用 SSL 身份认证，但服务在过渡期间可能不可用。另外，您的 {{ model.techShortName }} 客户端需要重新配置。

#### 认证客户端

要针对{{ model.techName }}DC/OS 认证客户端，您需要将其配置为使用 DC/OS CA 签发的证书。生成 [证书签名请求](https://www.ssl.com/how-to/manually-generate-a-certificate-signing-request-csr-using-openssl/)后，您可以通过调用 API `<dcos-cluster>/ca/api/v2/sign`. Using `curl`，将其发送到 DC/OS CA，请求类似于：
```bash
$ curl -X POST \
    -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
    <dcos-cluster>/ca/api/v2/sign \
    -d '{"certificate_request": "<json-encoded-value-of-request.csr>"}'
```

响应将包含已签名的公用证书。有关 DC/OS CA API 的完整详细信息，请参阅 [此处](/cn/1.11/security/ent/tls-ssl/ca-api/)。

## 授权

DC/OS {{ model.techName }} 服务支持 {{ model.techShortName }}的 [ACL-based](https://docs.confluent.io/current/kafka/authorization.html#using-acls) 授权系统。要使用 {{ model.techShortName }}的 ACL，必须按如上所述启用 SSL 或 Kerberos 身份认证。

### 启用授权

#### 先决条件
- 完成上述 [SSL](#ssl-authentication) 或 [Kerberos](#kerberos-authentication) 身份认证。

#### 安装服务

通过以下选项（您自己的选项除外）安装 DC/OS {{ model.techName }} 服务（请记住，SSL 身份认证或 Kerberos 必须启用）：
```json
{
    "service": {
        "security": {
            "authorization": {
                "enabled": true,
                "super_users": "<list of super users>",
                "allow_everyone_if_no_acl_found": <true|false default false>
            }
        }
    }
}
```

`service.security.authorization.super_users` 应设置为一个半冒号分隔的 principal 列表，用作超级用户（所有权限）。列表格式为`用户：<user1>；用户：<user2>；...`. Using Kerberos authentication, the "user" value is the Kerberos primary, and for SSL authentication the "user" value is the `证书的 CN`  {{ model.techShortName }} broker 自动被指定为超级用户。

**注意：** 可以在初始安装后启用身份认证，但服务在过渡期间可能不可用。此外，{{ model.techShortName }} 如果客户端的 principal 没有被正确分配 ACL，则客户端可能会出现故障。过渡期间， `service.security.authorization.allow_everyone_if_no_acl_found` 可设置为 `true`，以防止客户端出现故障，直到其 ACL 被正确设置。过度期间之后， `service.security.authorization.allow_everyone_if_no_acl_found` 应反转为 `false`。


## 在集群外部安全暴露 DC/OS {{ model.techName }}。

传输加密和 Kerberos 均紧密耦合到 {{ model.techShortName }} broker 的 DNS 主机。因此，在集群外部暴露安全的 {{ model.techName }} 服务需要额外设置。

### Broker to Client 连接

要在集群外部暴露安全的 {{ model.techName }} 服务，任何连接到服务的客户端必须能够通过分配给 broker 的 IP 地址访问服务的所有 broker。此 IP 地址将是其中之一：虚拟网络上的 IP 地址或 broker 正在运行的代理的 IP 地址。

### 转发 DNS 和自定义域

每个 DC/OS 集群都有一个唯一的加密 ID，可用于将 DNS 查询转发到该集群。要在集群外部安全地暴露服务，外部客户端必须将上游解析器配置为将 DNS 查询转发到服务的 DC/OS 集群，如所述[此处](https://docs.mesosphere.com/latest/networking/DNS/mesos-dns/expose-mesos-zone/)。

仅配置转发，DC/OS 集群内的 DNS 条目在 `<task-domain>.autoip.dcos. <cryptographic-id>.dcos.directory`. 如果配置DNS别名, 您可以使用自定义域. `<task-domain>.cluster-1.acmeco.net`处可解析。在任一情况下，DC/OS {{ model.techName }} 服务都需要通过额外的安全选项进行安装：

```json
{
    "service": {
        "security": {
            "custom_domain": "<custom-domain>"
        }
    }
}
```
其中 `<custom-domain>` 是其中之一 `autoip.dcos. <cryptographic-id>.dcos.directory` 或您的组织特定域名 (`cluster-1.acmeco.net`)。

作为具体实例，使用 `cluster-1.acmeco.net` 的自定义域，broker 0 任务将拥有 `kafka-0-broker 主机。<service-name>.cluster-1.acmeco.net`处可解析。

### Kerberos Principal 变更

单独传输加密不需要任何其他更改。端点发现将正常运行，只要按 [此处](#transport-encryption-for-clients) 所述进行配置，客户端即可与自定义域安全连接。

但是，Kerberos 需要稍微不同的配置。如 创建 Principal 中所注明的，服务的 Principal 基于服务的主机名。创建 Kerberos Principal 时，确保使用正确的域。

例如，如果使用以下设置进行安装：
```json
{
    "service": {
        "name": "a/good/example",
        "security": {
            "custom_domain": "cluster-1.example.net",
            "kerberos": {
                "primary": "example",
                "realm": "EXAMPLE"
            }
        }
    },
    "brokers": {
        "count": 3
    }
}
```
则要创建的 principal 是：
```
example/kafka-0-broker.agoodexample.cluster-1.example.net@EXAMPLE
example/kafka-1-broker.agoodexample.cluster-1.example.net@EXAMPLE
example/kafka-2-broker.agoodexample.cluster-1.example.net@EXAMPLE
```
