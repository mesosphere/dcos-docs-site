---
layout: layout.pug
navigationTitle: 暴露 Kubernetes API
title: 暴露 Kubernetes API
menuWeight: 70
excerpt: 设置代理以暴露 Kubernetes API
---



## 暴露 Kubernetes API

DC/OS Kubernetes 不会自动在 DC/OS 集群外部暴露
 Kubernetes API。因此，要从 DC/OS 集群外部访问 Kubernetes API，
您必须设置可以到达 DC/OS VIP（
在 DC/OS 集群内暴露 Kubernetes API）的代理。

此 VIP 为 `apiserver. <SERVICE_NAME>.l4lb.thisdcos.directory:6443`，其中，
`<SERVICE_NAME>` 是安装包时您所提供的
服务名称。默认为 `<SERVICE_NAME>` is `kubernetes`，所以，默认情况下，
VIP 是 `apiserver.kubernetes.l4lb.thisdcos.directory:6443`。

在接下来的部分中，我们将介绍您可以遵循的两个示例，以便
将 Kubernetes API 暴露于 DC/OS 集群之外。第一个示例
提供了快速尝试 DC/OS Kubernetes 的方式，而无需担心
建立信任。第二个示例是对第一个示例的扩展，以便
建立完全安全的设置。

另外，如果您在 DC/OS 集群中运行 Marathon-LB 和/或 Edge-LB，您可以通过其中的一个暴露 Kubernetes API。有关操作的详细信息记录于 [此处](../exposing-the-kubernetes-api-marathonlb)。

为了让用户成功遵循示例，其 DC/OS 集群
**必须**至少有一个
[共用代理](/cn/1.11/overview/architecture/node-types/#public-agent-nodes)
（例如，网络上一个代理，允许从
集群外部 ingress）。在示例中，`<ip-of-public-agent>` 代表 IP 地址，
通过该地址可以找到此公用代理。用户 **必须**也可以从其工作站
通过 SSH 来访问此 DC/OS 公用代理。最终，用户
将得到以下类似设置：

![使用 HAProxy 暴露 Kubernetes API](../img/haproxy.png "Exposing the Kubernetes API using HAProxy")

图 1. 使用 HAProxy 暴露 Kubernetes API

<a name="example-1"></a>
## 示例 1：使用 HAProxy 和自签名证书

<div class="message--note">
<p><strong>警告</strong></p>
<p>本示例旨在提供一种快速、简单的方式来将
Kubernetes API 暴露于 DC/OS 集群（即开即用）外部。对于
暴露 Kubernetes API 的问题，这不是一个完全安全的解决方案，
<strong>不得</strong> 用于生产。</p>
</div>

此示例侧重于在 DC/OS 集群外暴露 Kubernetes API，
将 HAProxy 作为中间代理，并使用自签名通配符证书，
已确保用户和 HAProxy 之间的通信。

### 步骤 1：创建自签名通配符证书

要保持 HAProxy 与用户之间的连接，必须
获得 TLS 证书和私钥。因为此示例仅适用于
在没有任何其他安全问题的情况下暴露 Kubernetes API，
自签名通配符证书会被生成和使用。为了实现
此目的，用户可以使用 `openssl`：

```
# openssl genrsa 2048 > haproxy-key.pem
# openssl req -new -x509 -nodes -sha1 -days 3650 -key haproxy-key.pem \
    -subj "/C=US/ST=CA/L=SF/O=Mesosphere/OU=dcos-kubernetes/CN=*" > haproxy-crt.pem
# cat haproxy-crt.pem haproxy-key.pem > haproxy.pem
```

运行这些命令将在用户的当前目录中创建 `haproxy.pem` 文件，
随后会用到该文件。

### 步骤 2：创建 HAProxy 配置

您现在可以运行以下命令（根据需要替换 ` <SERVICE_NAME>`
占位符），以创建有效的 HAProxy 配置：

```
# cat <<EOF > haproxy.conf
global
    log 127.0.0.1 local0
    # Sets the maximum size of the Diffie-Hellman parameters used for generating
    # the ephemeral/temporary Diffie-Hellman key in case of DHE key exchange.
    tune.ssl.default-dh-param 2048
    # Enables debug mode which dumps to stdout all exchanges.
    # This should be disabled in production, as tokens will also be logged.
    debug

defaults
    log global
    mode http
    option httplog
    option dontlognull
    # Set appropriate values for timeouts. This is important so that calls such
    # as "kubectl exec" or "kubectl logs -f" do not exit prematurely due to
    # inactivity in the connection.
    timeout connect 10s
    timeout client 86400s
    timeout server 86400s
    timeout tunnel 86400s

frontend frontend_all
    bind :6443 ssl crt /haproxy/haproxy.pem
    mode http
    default_backend backend_kube_apiserver

backend backend_kube_apiserver
    mode http
    balance leastconn
    server kube-apiserver apiserver.<SERVICE_NAME>.l4lb.thisdcos.directory:6443 check ssl verify none
EOF
```

运行此命令将在当前的目录中创建 `haproxy.conf` 文件
随后会用到该文件。

### 步骤 3：将证书和 HAProxy 配置复制到公用代理

HAProxy 将从 DC/OS 公用代理文件系统的目录
中读取其配置以及所需的 TLS 材料。这可以是任何目录，只要
HAProxy 进程可以稍后访问（在以下步骤中
`<path-to-haproxy-config-directory>表示为 ` ）。要通过 SSH 将
所需的 TLS 材料复制到 DC/OS 公用代理，您可以运行
以下命令（根据需要替换占位符）：

```
# ssh <user>@<ip-of-public-agent> \
    mkdir <path-to-haproxy-config-directory>
# scp haproxy.pem \
    haproxy.conf \
    <user>@<ip-of-public-agent>:<path-to-haproxy-config-directory>
haproxy.pem     100%    2985    16.9KB/s    00:00
haproxy.conf    100%    1041     5.9KB/s    00:00
```

### 步骤 4：运行 HAProxy

在此步骤中，HAProxy 被配置为在
DC/OS 公用代理上运行的 Marathon 应用程序。要实现此目的，可以使用以下命令（根据需要替换 `<path-to-haproxy-config-directory>`）：

```
# cat <<EOF > marathon.json
{
  "id": "/kubernetes-haproxy",
  "acceptedResourceRoles": [
    "slave_public"
  ],
  "cmd": "/usr/local/sbin/haproxy -f /haproxy/haproxy.conf",
  "constraints": [
    [
      "hostname",
      "UNIQUE"
    ]
  ],
  "container": {
    "type": "MESOS",
    "volumes": [
      {
        "containerPath": "/haproxy",
        "hostPath": "<path-to-haproxy-config-directory>",
        "mode": "RO"
      }
    ],
    "docker": {
      "image": "haproxy:1.7",
      "forcePullImage": false,
      "parameters": []
    }
  },
  "cpus": 0.1,
  "instances": 1,
  "mem": 128,
  "networks": [
    {
      "mode": "host"
    }
  ],
  "portDefinitions": [
    {
      "protocol": "tcp",
      "port": 6443
    }
  ],
  "requirePorts": true
}
EOF
```

```
# dcos marathon app add marathon.json
```

部署 HAProxy 后，您应该能够看到以下内容：

```
# dcos task
NAME                HOST        USER    STATE  ID                                                       MESOS ID                                 REGION    ZONE
(...)
kubernetes-haproxy  10.138.0.7  root    R      kubernetes-haproxy.beaca041-5e7c-11e8-8c11-ce5fc4b24b83  cc965893-270f-4809-9617-e190904dae27-S0  us-west1  us-west1-b
```

现在可以访问 Kubernetes API：

```
# curl -k https://<ip-of-public-agent>:6443
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {

  },
  "status": "Failure",
  "message": "forbidden: User \"system:anonymous\" cannot get path \"/\"",
  "reason": "Forbidden",
  "details": {

  },
  "code": 403
}
```

要配置 `kubectl`，以使用此设置访问 Kubernetes API，
您现在应遵循
 [连接客户端](../connecting-clients)页面中“无 TSL 验证”小节所述的
步骤。

## 示例 2：使用 HAProxy 并建立信任

[实例 1](#example-1) 中提供的解决方案有几个缺点：

1. Kubernetes API 向 HAProxy 提供的证书未经验证。
1. HAProxy 向用户提供的证书太宽泛（而且也未
 验证）。
1. 此外，它还假设 Kubernetes API 将在
 DC/OS 公用代理的 IP 地址上被访问。
1. 它假设 HAProxy 会将 **所有** 传入流量路由至
 Kubernetes API VIP。

在生产场景中，您可能想要解决所有这些
缺点，以提高解决方案的整体安全性，
并且能够使用相同的 HAProxy 实例暴露多个服务/
端点。此示例基于前一个示例，侧重于解决所有
这些缺点。

### 步骤 1：验证 Kubernetes API 证书

要完全保持 HAProxy 与 Kubernetes API 之间
的连接，必须告知 HAProxy 如何信任由
Kubernetes API 提供的 TSL 证书。这可以通过告诉 HAProxy 
签署 TLS 证书的签署单位值得信赖来完成。为了实现
此目的，您必须联系 TLS 证书签署单位：

```
# dcos task exec kube-apiserver-0-instance cat ca-crt.pem > dcos-kubernetes-ca.pem
```

运行此命令将在当前的目录中创建 `dcos-kubernetes-ca.pem` 文件，
该文件现在必须复制到
`<path-to-haproxy-config-directory>DC/OS 公用代理中的 ` 目录。
您还必须根据以下示例更新 HAProxy 配置，
并将更新的配置复制到 DC/OS 公用代理：

```
backend backend_kube_apiserver
    (...)
    server kube-apiserver apiserver.<SERVICE_NAME>.l4lb.thisdcos.directory:6443 check ssl verify required ca-file /haproxy/dcos-kubernetes-ca.pem
```

### 步骤 2：验证 HAProxy 证书

在 [实例 1](#example-1) 中，自签名、通配符证书被使用。在
生产场景中，您需要使用由
知名、可信任的证书签署单位签署的有效证书。您可能还想使用一个域名（
例如，`kube-apiserver.example.com`），而不是 IP 地址，来访问
Kubernetes API。为了完成此步骤，您必须
确保：

* 您拥有对于
 `kube-apiserver.example.com` 域有效的证书（和匹配的私钥）；
* 位于 `example.com` 的 DNS 以此方式配置，以便
 `kube-apiserver.example.com` 解析为 DC/OS 代理（HAProxy 在运行）
  的 IP 地址；
* 您选择拥有证书签署单位（
 签署过上述证书）签发的证书（以防还未被
 操作系统信任）；

如何解决这三项，高度依赖于您的设置。在本示例的其余部分中，假设这些项已解决。

当您拥有证书和私钥（针对
将被使用的域）后（在这种情况下，`kube-apiserver.example.com`），您
必须把在 [实例 1](#example-1) 中创建的 `haproxy.pem` 文件替换为
 **同时** 包含新证书和私钥（按特定
顺序）的新文件，并将该文件通过 SSH 复制到 DC/OS 代理。您还必须
将包含证书签署单位证书的文件作为
`ca.pem` 通过 SSH 复制到 DC/OS 代理。最后，您必须根据以下示例更新 HAProxy
配置：

```
frontend frontend_all
    # /haproxy/haproxy.pem contains the certificate and key for kube-apiserver.example.com
    # /haproxy/ca.pem contains the certificate(s) of the certificate authority that signed
    # haproxy.pem. This is only required if the CA is not already trusted by the operating
    # system.
    bind :6443 ssl crt /haproxy/haproxy.pem ca-file /haproxy/ca.pem
    (...)
```

此时，您应遵循“有 TLS”中所述的步骤
 [连接客户端](../connecting-clients)页面中“无 TSL 验证”小节所述的
步骤。

### 步骤 3：使用 HAProxy 服务多个服务/端点

如上所述，用户可能希望使用正在部署的相同 HAproxy 实例
来暴露其他服务或端点。为了实现这一目的，
您可以使用
[服务器名称指示](https://en.wikipedia.org/wiki/Server_Name_Indication)。
然后，接收请求，HAProxy 将根据所请求的域名决定
使用哪个后端。

要将请求转发至 `kube-apiserver.example.com`，然后再转发至一直使用的 Kubernetes API VIP，
您必须根据以下示例来
更新 HAProxy 配置：

```
frontend frontend_all
    (...)
    # Inspect the SNI field from incoming TLS connections so we can forward to
    # the appropriate backend based on the server name.
    use_backend backend_kube_apiserver if { ssl_fc_sni kube-apiserver.example.com }

```

可根据需要为其他域设置额外的转发规则。举个
更多信息，请参阅
[HAProxy 文档](https://cbonte.github.io/haproxy-dconv/1.7/configuration.html)。
