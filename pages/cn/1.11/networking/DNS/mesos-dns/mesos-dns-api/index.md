---
layout: layout.pug
navigationTitle: Mesos DNS API
title: Mesos DNS API
menuWeight: 201
excerpt: 使用 Mesos DNA API 发现 IP 地址和端口

enterprise: true
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


您可以使用 Mesos DNS API 发现其他应用程序的 IP 地址和端口。

# 路由

访问 Mesos DNS API 是通过每个节点上使用以下路由的 Admin Router 代理的：

```bash
curl -H "Authorization: token=<auth-token>" http://<public-master-ip>/mesos_dns/v1/
```

访问代理节点的 Mesos DNS API 也是通过管理节点代理的：

```bash
curl -H "Authorization: token=<auth-token>" http://<public-master-ip>/system/v1/agent/{agent_id}/mesos_dns/v1/
```

# 格式

Mesos DNS API 的请求和响应主体被编排成 JSON 格式。

请求必须包含接受标头：

```
Accept: application/json
```

响应将包括内容类型标头：

```
Content-Type: application/json
```

# 授权 [enterprise type=small]

所有 Mesos DNS API 路由需要认证才能使用。

要验证 API 请求，请参阅 [获取认证令牌](/cn/1.11/security/ent/iam-api/#obtaining-an-authentication-token) 和 [通过传递认证令牌](/cn/1.11/security/ent/iam-api/#passing-an-authentication-token)。

Mesos DNS API 还需要通过以下权限授权：

| 路由 | 权限 |
|-------|----------|
| `/system/mesos_dns/v1/` | `dcos:adminrouter:ops:mesos-dns` |
| `/system/v1/agent/{agent_id}/mesos_dns/v1/` | `dcos:adminrouter:system:agent` |

用户也可以通过 `dcos:superuser` 权限获得所有路由。

要为您的帐户分配权限，请参阅 [权限参考](/cn/1.11/security/ent/perms-reference/)。

# 资源
Mesos-DNS 实现了一个简单的 REST API，用于通过 HTTP 进行服务发现。这些示例假设您具有 [与节点的 SSH 连接](/cn/1.11/administering-clusters/sshcluster/)。

## <a name="get-version"></a>GET /v1/version

以 JSON 格式列出 Mesos-DNS 版本和源代码 URL。

```bash
curl -H "Authorization: token=<auth-token>" http://<public-master-ip>/mesos_dns/v1/version
```

输出应类似于：

```json
{
  "Service": "Mesos-DNS",
  "URL": "https://github.com/mesosphere/mesos-dns",
  "Version": "dev"
 }
```


## <a name="get-config"></a>GET /v1/config

以 JSON 格式列出 Mesos-DNS 配置参数。

```bash
curl -H "Authorization: token=<auth-token>" http://<public-master-ip>/mesos_dns/v1/config
```

DC/OS 开源的输出应该类似于：

```json
{
  "RefreshSeconds": 30,
  "Port": 61053,
  "Timeout": 5,
  "StateTimeoutSeconds": 300,
  "ZkDetectionTimeout": 30,
  "HttpPort": 8123,
  "TTL": 60,
  "SOASerial": 1495828250,
  "SOARefresh": 60,
  "SOARetry": 600,
  "SOAExpire": 86400,
  "SOAMinttl": 60,
  "SOAMname": "ns1.mesos.",
  "SOARname": "root.ns1.mesos.",
  "Masters": null,
  "ZoneResolvers": {},
  "Resolvers": [
   "169.254.169.253"
  ],
  "IPSources": [
   "host",
   "netinfo"
  ],
  "Zk": "zk://zk-1.zk:2181,zk-2.zk:2181,zk-3.zk:2181,zk-4.zk:2181,zk-5.zk:2181/mesos",
  "Domain": "mesos",
  "File": "/opt/mesosphere/etc/mesos-dns.json",
  "Listener": "0.0.0.0",
  "HTTPListener": "0.0.0.0",
  "RecurseOn": true,
  "DnsOn": true,
  "HttpOn": true,
  "ExternalOn": true,
  "EnforceRFC952": false,
  "SetTruncateBit": false,
  "EnumerationOn": true,
  "MesosHTTPSOn": false,
  "CACertFile": "",
  "CertFile": "",
  "KeyFile": "",
  "MesosCredentials": {
   "Principal": "",
   "Secret": ""
  },
  "IAMConfigFile": "",
  "MesosAuthentication": ""
 }
```

Entperise DC/OS 的输出应该类似于：

```json
{
  "RefreshSeconds": 30,
  "Port": 61053,
  "Timeout": 5,
  "StateTimeoutSeconds": 300,
  "ZkDetectionTimeout": 30,
  "HttpPort": 8123,
  "TTL": 60,
  "SOASerial": 1495828138,
  "SOARefresh": 60,
  "SOARetry": 600,
  "SOAExpire": 86400,
  "SOAMinttl": 60,
  "SOAMname": "ns1.mesos.",
  "SOARname": "root.ns1.mesos.",
  "Masters": null,
  "ZoneResolvers": {},
  "Resolvers": [
   "169.254.169.253"
  ],
  "IPSources": [
   "host",
   "netinfo"
  ],
  "Zk": "zk://zk-1.zk:2181,zk-2.zk:2181,zk-3.zk:2181,zk-4.zk:2181,zk-5.zk:2181/mesos",
  "Domain": "mesos",
  "File": "/opt/mesosphere/etc/mesos-dns-enterprise.json",
  "Listener": "0.0.0.0",
  "HTTPListener": "127.0.0.1",
  "RecurseOn": true,
  "DnsOn": true,
  "HttpOn": true,
  "ExternalOn": true,
  "EnforceRFC952": false,
  "SetTruncateBit": false,
  "EnumerationOn": true,
  "MesosHTTPSOn": true,
  "CACertFile": "/run/dcos/pki/CA/certs/ca.crt",
  "CertFile": "/run/dcos/pki/tls/certs/mesos-dns.crt",
  "KeyFile": "/run/dcos/pki/tls/private/mesos-dns.key",
  "MesosCredentials": {
   "Principal": "",
   "Secret": ""
  },
  "IAMConfigFile": "/run/dcos/etc/mesos-dns/iam.json",
  "MesosAuthentication": "iam"
 }
```

## <a name="get-hosts"></a>GET /v1/hosts/{host}

以 JSON 格式列出与主机名对应的 IP 地址。它与 DNS A 记录查找相同。

**注意：** HTTP 界面仅解析 Mesos 域中的主机名。

```bash
curl -H "Authorization: token=<auth-token>" http://<public-master-ip>/mesos_dns/v1/hosts/nginx.marathon.mesos
```

输出应类似于：

```json
[
    {"host":"nginx.marathon.mesos.","ip":"10.249.219.155"},
    {"host":"nginx.marathon.mesos.","ip":"10.190.238.173"},
    {"host":"nginx.marathon.mesos.","ip":"10.156.230.230"}
]
```

## <a name="get-service"></a>GET /v1/services/{service}

以 JSON 格式列出与主机名对应的主机名、IP 地址和端口。它与 DNS SRV 记录查找相同。

**注意：** HTTP 界面仅解析 Mesos 域中的服务名。

```bash
curl -H "Authorization: token=<auth-token>" http://<public-master-ip>/mesos_dns/v1/services/_nginx._tcp.marathon.mesos
```

输出应类似于：

```json
[
    {"host":"nginx-s2.marathon.mesos.","ip":"10.249.219.155","port":"31644","service":"_nginx._tcp.marathon.mesos."},
    {"host":"nginx-s1.marathon.mesos.","ip":"10.190.238.173","port":"31667","service":"_nginx._tcp.marathon.mesos."},
    {"host":"nginx-s0.marathon.mesos.","ip":"10.156.230.230","port":"31880","service":"_nginx._tcp.marathon.mesos."}
]
```
