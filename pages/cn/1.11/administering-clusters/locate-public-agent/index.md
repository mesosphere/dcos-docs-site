---
layout: layout.pug
navigationTitle: 查找公共代理 IP
title: 查找公共代理 IP
menuWeight: 3
excerpt: 查找公共代理 IP 地址。
enterprise: false
---



使用已确认的公共代理节点安装 DC/OS 后，您可以导航到公共代理节点的公用 IP 地址。

**前提条件**

- DC/OS 已安装，有至少 1 个管理节点和 [公共代理](/cn/1.11/overview/concepts/#public-agent-node) 节点
- DC/OS [CLI](/cn/1.11/cli/) 0.4.6 或更高版本
- [jq](https://github.com/stedolan/jq/wiki/Installation)
- [SSH](/cn/1.11/administering-clusters/sshcluster/) 已配置

您可以通过从终端运行此命令来找到您的公共代理 IP。此命令 SSH 至您的集群以获取集群信息，然后查询 [ifconfig.co](https://ifconfig.co/) 以确定您的公共 IP 地址。

```
for id in $(dcos node --json | jq --raw-output '.[] | select(.attributes.public_ip == "true") | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
```

以下是公共 IP 地址为 `52.39.29.79`的示例：

```
for id in $(dcos node --json | jq --raw-output '.[] | select(.attributes.public_ip == "true") | .id'); do dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --mesos-id=$id "curl -s ifconfig.co" ; done 2>/dev/null
52.39.29.79
```
