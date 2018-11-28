---
layout: layout.pug
navigationTitle: 通过 Marathon-LB 或 Edge-LB 暴露 Kubernetes API
title: 通过 Marathon-LB 或 Edge-LB 暴露 Kubernetes API
menuWeight: 71
excerpt: 通过内置于 Marathon-LB 或 Edge-LB 中的现有 HAProxy 暴露 Kubernetes API
---

## 通过 Marathon-LB 或 Edge-LB 暴露 Kubernetes API

如果您在 DC/OS 集群中有现有的 Marathon-LB 实例，或者如果您使用 Edge-LB (DC/OS Enterprise)，可以通过内置于 Marathon-LB 或 Edge-LB 中的现有 HAProxy 暴露 Kubernetes API。

这些选项（如下文所述）的安全性略低于 [暴露 Kubernetes API(../exposing-the-kubernetes-api) 页面中的选项 2，因为它们使用自签名 TLS 证书来暴露 API 端点。可以使用签名证书通过 Marathon-LB 和/或 Edge-LB 将 Kubernetes API 端点暴露，但本文档中未涵盖。这些示例旨在提供一种快速、简便的方法，通过现有的 Marathon-LB 或 Edge-LB 实例暴露集群中的 Kubernetes API 端点。

这两个示例都将生成以下类似设置：

![使用 HAProxy 暴露 Kubernetes API](../img/marathonlb.png "Exposing the Kubernetes API using HAProxy")

图 1. 使用 HAProxy 暴露 Kubernetes API

所有这些示例均假设您正在将 `kubernetes` 用作 Kubernetes 实例的服务名称。如果您有不同的服务名称，那么可能需要进行一些更改；如下所示。

<p class="message--note"><strong>注意：</strong> 如果您有 Marathon-LB 在给定的公用代理节点上运行，那么端口 9090、9091、80、443 和 10000-10150 在默认情况下会被 Marathon-LB 消耗；考虑公用 Kubernetes 节点布局时，请牢记这一点。</p>

## 示例 1：使用现有的 Marathon-LB 实例

Marathon-LB 查看所有运行的 Marathon 应用程序，并使用应用程序定义上的元数据（标签和其他属性），来确定通过 HAProxy 暴露哪个应用程序和服务。具体地说，Marathon-LB 的给定实例将查找带有指定 `HAPROXY_GROUP` 标签的应用程序，并暴露符合指定 `HAPROXY_GROUP`的应用程序。Marathon-LB 查找的默认 `HAPROXY_GROUP` 标签是 `external`。

虽然 Marathon-LB 主要用于暴露 Marathon 应用程序，但是它也可以被诱导用于暴露虚拟应用程序的非 Marathon 端点。以下是如何实现这一目标的两个示例：

* 一个没有任何 TLS 证书验证
* 一个在 HAProxy 和 Kubernetes API 之间有 TLS 验证（但不是用户和 HAProxy 之间）

这两个示例均假设 Marathon-LB（版本 1.12.1 或更高版本）已正确安装和配置（遵循 Marathon-LB [安装说明](https://docs.mesosphere.com/services/marathon-lb/)）。

### 无 TLS 证书验证的 Marathon-LB
例如，如果您有默认的 Marathon-LB 实例，那么您可以通过以下定义来运行 Marathon 应用程序，它将暴露 Kubernetes API：

```json
{
  "id": "/kubectl-proxy",
  "instances": 1,
  "cpus": 0.001,
  "mem": 16,
  "cmd": "tail -F /dev/null",
  "container": {
    "type": "MESOS"
  },
  "portDefinitions": [
    {
      "protocol": "tcp",
      "port": 0
    }
  ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_MODE": "http",
    "HAPROXY_0_PORT": "6443",
    "HAPROXY_0_SSL_CERT": "/etc/ssl/cert.pem",
    "HAPROXY_0_BACKEND_SERVER_OPTIONS": "  timeout connect 10s\n  timeout client 86400s\n  timeout server 86400s\n  timeout tunnel 86400s\n  server kube-apiserver apiserver.kubernetes.l4lb.thisdcos.directory:6443 ssl verify none\n"
  }
}
```

如果您使用的是一些服务名称，而非 `kubernetes`，那么 `apiserver.kubernetes.l4lb.thisdcos.directory:6443` 应进行修改以匹配您的服务名称。例如，如果您的 Kubernetes 服务位于 `kubernetes-prod`，那么用  `apiserver.kubernetes-prod.l4lb.thisdcos.directory:6443` 替换 `apiserver.kubernetes.l4lb.thisdcos.directory:6443`。

此应用程序可通过 DC/OS UI、Marathon API、或通过 `dcos` 命令行（假设 JSON 被保存为文件 `kubectl-proxy.json`）加入到 DC/OS

```bash
$ dcos marathon app add kubectl-proxy.json
```

以下是其工作方式的示例：

1. Marathon-LB 确认应用程序 `kubectl-proxy` 拥有设置为 `external`的 `HAPROXY_GROUP` 标签（如果您正在为您的 Marathon-LB 配置使用不同的 `HAPROXY_GROUP`，则进行更改）。
1. `instances`、`cpus`、`mem`、`cmd` 和 `container` 字段基本上创建一个占用最小空间且无运行的虚拟容器。
1. 单个端口表示该应用程序有一个“端口”（此信息由 Marathon-LB 使用）
1. `"HAPROXY_0_MODE": "http"` 向 Marathon-LB 指示此特定服务的前端和后端配置应配置为 `http`。
1. `"HAPROXY_0_PORT": "6443"` 告知 Marathon-LB 在端口 6443 上暴露该服务（而不是随机生成的服务端口，该端口会被忽略）
1. `"HAPROXY_0_SSL_CERT": "/etc/ssl/cert.pem"` 告诉 Marathon-LB 使用自签名 Marathon-LB 证书（具有 **无 CN**）暴露该服务
1. 最后一个标签 `HAPROXY_0_BACKEND_SERVER_OPTIONS` 指示 Marathon-LB 应将流量转发至端点 `apiserver.kubernetes.l4lb.thisdcos.directory:6443`，而不是虚拟应用程序，而且应在无验证的情况下使用 TLS 进行连接。另外，使用大超时值，以便
`kubectl logs -f` 和 `kubectl exec -i -t` 等调用在短期内不会突然终止。

### 在 HAProxy 与 Kubernetes API 之间有 TLS 证书验证的 Marathon-LB 

或者，如果您使用 DC/OS 企业并将 Kubernetes 配置为使用 DC/OS CA 来签署证书，那么您可以修改虚拟应用程序，使其验证 HAProxy 与 Kubernetes API 的连接（对外部客户端，仍具有无效的自签名证书）：

```json
{
  "id": "/kubectl-proxy",
  "instances": 1,
  "cpus": 0.001,
  "mem": 16,
  "cmd": "tail -F /dev/null",
  "container": {
    "type": "MESOS"
  },
  "portDefinitions": [
    {
      "protocol": "tcp",
      "port": 0
    }
  ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_MODE": "http",
    "HAPROXY_0_PORT": "6443",
    "HAPROXY_0_SSL_CERT": "/etc/ssl/cert.pem",
    "HAPROXY_0_BACKEND_SERVER_OPTIONS": "  timeout connect 10s\n  timeout client 86400s\n  timeout server 86400s\n  timeout tunnel 86400s\n  server kube-apiserver apiserver.kubernetes.l4lb.thisdcos.directory:6443 ssl verify required ca-file /mnt/mesos/sandbox/.ssl/ca-bundle.crt\n"  
  }
}
```

如果您使用的是一些服务名称，而非 `kubernetes`，那么 `apiserver.kubernetes.l4lb.thisdcos.directory:6443` 应进行修改以匹配您的服务名称。例如，如果您的 Kubernetes 服务位于 `kubernetes-prod`，那么用  `apiserver.kubernetes-prod.l4lb.thisdcos.directory:6443` 替换 `apiserver.kubernetes.l4lb.thisdcos.directory:6443`。

同样，此应用程序可通过 DC/OS UI、Marathon API、或通过 `dcos` 命令行（假设 JSON 被保存为文件 `kubectl-proxy.json`）加入到 DC/OS

```bash
$ dcos marathon app add kubectl-proxy.json
```

## 示例 2：创建 Edge-LB 池
如果您是在 DC/OS 集群中使用 Edge-LB，而不是使用 Marathon-LB，那么您可以创建 Edge-LB 池，以将 Kubernetes API 暴露给客户端。

<p class="message--note"><strong>注意: </strong>此示例不会验证 Kubernetes 客户端与 HAProxy 之间的证书或者 HAProxy 与 Kubernetes API 之间的证书。这些验证是可实现的，但在本文档未涵盖。</p>

```json
{
  "apiVersion": "V2",
  "name": "kubectl-proxy",
  "count": 1,
  "autoCertificate": true,
  "haproxy": {
    "frontends": [{
      "bindPort": 6443,
      "protocol": "HTTPS",
      "certificates": [
        "$AUTOCERT"
      ],
      "linkBackend": {
        "defaultBackend": "kubernetes-apiserver"
      }
    }],
    "backends": [{
      "name": "kubernetes-apiserver",
      "protocol": "HTTPS",
      "services": [{
        "mesos": {
          "frameworkName": "kubernetes",
          "taskNamePattern": "kube-apiserver"
        },
        "endpoint": {
          "portName": "apiserver"
        }
      }]
    }],
    "stats": {
      "bindPort": 6090
    }
  }
}
```

如果您使用的是一些服务名称，而非 `kubernetes`，那么 `frameworkName` 应进行修改以匹配您的服务名称。例如，如果您的 Kubernetes 服务位于 `kubernetes-prod`，那么用  `"frameworkName": "kubernetes-prod"` 替换 `"frameworkName": "kubernetes"`。

此示例假设 Edge-LB（版本 1.0.3 或更高版本）已正确安装和配置（遵循 Edge-LB [安装说明](/cn/services/edge-lb/) )：

1. 使用以上内容创建 `kubectl-proxy-pool.json`。
1. 使用以下命令创建 Edge-LB 池：

    ```bash
    $ dcos edgelb create kubectl-proxy-pool.json
    ```

1. 这将创建具有以下配置的 Edge-LB 池：

 1. 一（1）个在公用 DC/OS 代理节点上运行的 HAProxy 实例
 1. 使用 TLS 和自签名证书暴露端口 6443
 1. 将端口 6443 上的连接转发到匹配框架名称 `kubernetes` 的 Mesos 任务和在标记为 `apiserver` 的端口上匹配 regex `kube-apiserver` 的任务名称。
 1. 在端口 6090 上侦听 HAProxy stats 端点。请注意，默认情况下，会将此端口向外暴露；如果您不希望向外暴露，您可以在 `stats` block 中添加 `"bindAddress":"127.0.0.1"`。
