---
layout: layout.pug
navigationTitle: 通过双向 TLS 保护 Exhibitor
title: 通过双向 TLS 保护 Exhibitor
menuWeight: 500
excerpt: 通过启用 TLS 的 Exhibitor 组合来保护 DC/OS
enterprise: true
---

# 验证 Exhibitor 是否受到保护 

从 DC/OS 2.0 开始，Exhibitor 在大多数情况下都受到默认保护。要验证 Exhibitor 是否在群集上受到保护，请在您的管理节点之一上运行以下命令：
```bash

    curl -LI \
        --cacert /var/lib/dcos/exhibitor-tls-artifacts/root-cert.pem \
        --cert /var/lib/dcos/exhibitor-tls-artifacts/client-cert.pem \
        --key /var/lib/dcos/exhibitor-tls-artifacts/client-key.pem \
        https://localhost:8181/exhibitor/v1/ui/index.html
```

如果您看到以下内容，则表明 Exhibitor 在您的群集上已受到保护：
```bash
    HTTP/1.1 200 OK
    Content-Type: text/html
    Content-Length: 0
    Server: Jetty(1.5.6-SNAPSHOT)
```

# 保护 Exhibitor

以前，Exhibitor HTTP 服务对可以访问管理节点上端口 8181 的任何客户端开放。本页介绍保护一种 Exhibitor 服务免受未经授权访问的方法。启用后，HTTP 客户端必须通过 Admin Router 访问 Exhibitor，因而将 Admin Router 访问控制策略应用于 Exhibitor 服务。
保护 Exhibitor 的策略是双向 TLS 认证。为了保护 Exhibitor，必须先创建唯一性根 CA 证书。该 CA 证书用于为 Admin Router 和 Exhibitor 服务签署各种端点实体证书。创建输出 PEM 和 Java KeyStore 格式化工件的公钥基础架构不是一件容易的事。为了简化此过程，我们创建了一个简单的工具来生成必要的文件。

本指南仅适用于使用 **静态** 管理节点发现的群集，目前不支持 `master_http_loadbalancer`。请参阅 [管理节点发现](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#master-discovery-required) 的配置参考。

<p class="message--note"><strong>注意：</strong>通过 Admin Router <code>https://master_host/exhibitor</code> 访问 Exhibitor 时 ，已认证用户必须有 <code>dcos:adminrouter:ops:exhibitor</code> 特权以及<i>全部</i>操作标识符</p>

## 使用工具

先决条件：需要有效的 Docker 安装。如果 Docker 不可用，请参阅 [exhibitor 自述文件](https://github.com/mesosphere/exhibitor-tls-artifacts-gen/blob/master/README.md)，以获取有关本机运行命令的信息。

从 <a href=https://github.com/mesosphere/exhibitor-tls-artifacts-gen/releases>Github 发布页面</a> 下载脚本并运行：

```sh
curl -LsO https://github.com/mesosphere/exhibitor-tls-artifacts-gen/releases/download/v0.4.0/exhibitor-tls-artifacts
chmod +x exhibitor-tls-artifacts
./exhibitor-tls-artifacts --help
```

预期输出如下所示：
```sh
    Usage: exhibitor-tls-artifacts [OPTIONS] [NODES]...

    Generates Admin Router and Exhibitor TLS artifacts. NODES should consist
    of a space separated list of master IP addresses. See
    /mesosphere/dcos/2.0/security/ent/tls-ssl/exhibitor/

    Options:
    -d, --output-directory TEXT  Directory to put artifacts in. This
                                 output_directory must not exist.
    --help                       Show this message and exit.
```


## 生成工件
要生成 TLS 工件，请将管理节点 IP 地址用作位置参数来运行该工具。使用在 `master_list` DC/OS 配置文件 (config.yml) 中的字段中找到的 IP 地址。如果此文件不可用，运行每个管理节点上的 `/opt/mesosphere/bin/detect_ip` 都会生成正确的地址。

例如，如果管理节点是 `10.192.0.2, 10.192.0.3, 10.192.0.4`，则使用以下命令调用脚本：

```sh
./exhibitor-tls-artifacts 10.192.0.2 10.192.0.3 10.192.0.4
```

上述命令会在当前的目录中创建名为 `artifacts` 的目录（在运行命令之前该目录不得存在）。在 `artifacts` 下方，您会找到 root-cert.pem 和 truststore.jks。这些文件包含 PEM 和 Java Keystore 格式的根 CA 证书。`artifacts` 目录还包含 3 个子目录，即 `10.192.0.2`、`10.192.0.3` 和 `10.192.0.4`。每个子目录包含以下文件：
```text
    client-cert.pem
    client-key.pem
    clientstore.jks
    root-cert.pem
    serverstore.jks
    truststore.jks
```

这些目录包含保护每个 Exhibitor 节点的所有必要文件。

## 安装工件
将每个节点的工件目录内容复制到相应管理节点的 `/var/lib/dcos/exhibitor-tls-artifacts`。

例如：

```sh
scp -r artifacts/10.192.0.2 root@10.192.0.2:/var/lib/dcos/exhibitor-tls-artifacts
scp -r artifacts/10.192.0.3 root@10.192.0.3:/var/lib/dcos/exhibitor-tls-artifacts
scp -r artifacts/10.192.0.4 root@10.192.0.4:/var/lib/dcos/exhibitor-tls-artifacts
```

## 重启服务

Exhibitor 和 Master Admin Router 必须在所有节点上重启。复制所有文件后，在 **所有** 管理节点上运行以下命令。

<p class="message--warning"><strong>警告：</strong>这将导致 ZooKeeper 和 Master Admin Router 短时间停机。</p>

```sh
systemctl restart dcos-exhibitor.service
systemctl restart dcos-adminrouter.service
```

`systemd` 单元脚本将检测工件是否存在，并相应地设置所有权和权限。

## 部署新群集

在安装 DC/OS 之前，生成工件并将文件复制到管理服务器。