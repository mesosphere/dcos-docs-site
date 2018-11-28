---
layout: layout.pug
title: DC/OS 端口
navigationTitle: 端口
menuWeight: 15
excerpt: 了解为 DC/OS 部署配置的端口
---
本节将介绍 DC/OS 部署中的每个预配置端口。

[DC/OS 组件](/cn/1.11/overview/architecture/components/) 监听每个节点上的多个端口。为确保成功安装，这些端口必须可用。DC/OS 将其他端口分配给在 DC/OS 之上运行的服务。安装服务时，需要使用这些端口。

- 这些端口不得用于节点或集群区域之间的防火墙配置。
- 为让 DC/OS 按照预期安装和运行，这些端口在首次安装时必须打开且可访问。
- 因此，特定网络安全措施（从集群外部以及在内部集群节点和区域之间）应针对上述每个端口进行评估，必要时，在安装和实现 DC/OS 之前，由网络管理员落实到位。此外，DC/OS 安全模式（“禁用”、“宽容”和“严格”）并不影响对这些端口的访问。

## 所有节点

### TCP

| 端口 | DC/OS 组件 | `systemd` 单元 | 来源 | 目标 |
|---|---|---|---|---|
| 53 | DC/OS Net | `dcos-net.service` | 代理/管理 | 代理/管理 | 
| 61003 | REX-Ray | `dcos-rexray.service` | 代理/管理（可能会因具体 REX-Ray 配置而变化）| 代理/管理（可能会因具体 REX-Ray 配置而变化）|
| 61091 | dcos-metrics | `dcos-metrics-agent.service/dcos-metrics-master.service` | 代理/管理 | 代理/附加 |
| 61420 | DC/OS Net | `dcos-net.service` | 代理/管理 | 代理/管理 |
| 62080 | DC/OS Net | `dcos-net.service` | 代理/管理 | 代理/管理 |
| 62501 | DC/OS Net | `dcos-net.service` | 代理/管理 | 代理/管理 |


### UDP

| 端口 | DC/OS 组件 | 系统单元 | 来源 | 目标 |
|---|---|---|---|---|
| 53 | DC/OS Net | `dcos-net.service` | 代理/管理 | 代理/管理 | 
| 64000 | DC/OS Net | `dcos-net.service` | 代理/管理 | 代理/管理 | 

**注意：** UDP 端口 123 用于与 NTP 通信而开启。

## 管理节点

### TCP

| 端口 | DC/OS 组件 | systemd单元 | 来源 | 目标 |
|---|---|---|---|---|
| 80 | Admin Router 管理节点 (HTTP) | `dcos-adminrouter.service` |公共 IP| 管理 |
| 443 | Admin Router 管理节点 (HTTPS) | `dcos-adminrouter.service`|公共 IP| 管理 |
| 1337 | DC/OS 秘密 | `dcos-secrets.service` | 本地主机| 本地主机（管理）[enterprise type="inline" size="small" /] |
| 2181 | ZooKeeper | `dcos-exhibitor.service` | 代理/管理 | 管理 |
| 3888 | Exhibitor 或 ZooKeeper 和 Exhibitor | `dcos-exhibitor.service` | 代理/管理 | 管理 |
| 5050 | Mesos 管理节点 | `dcos-mesos-master.service` | 代理/管理 | 管理 |
| 7070 | DC/OS 包管理器 (Cosmos) | `dcos-cosmos.service` | 本地主机| 本地主机（管理）|
| 8080 | Marathon | `dcos-marathon.service` | 代理/管理 | 管理 |
| 8101 | DC/OS 身份和访问权限管理器 | `dcos-bouncer.service` | 本地主机| 本地主机（管理）[enterprise type="inline" size="small" /] |
| 8123 | Mesos DNS | `dcos-mesos-dns.service` | 本地主机 | 本地主机 |
| 8181 | Exhibitor 和 ZooKeeper | `dcos-exhibitor.service` | 代理/管理 | 管理 |
| 8200 | Vault | `dcos-vault.service` | 本地主机| 本地主机（管理）[enterprise type="inline" size="small" /] |
| 8443 | Marathon SSL | `dcos-marathon.service` | 代理/管理 | 管理 |
| 8888 | DC/OS 证书颁发机构 | `dcos-ca.service` | 本地主机| 本地主机（管理）[enterprise type="inline" size="small" /] |
| 9090 | DC/OS 作业 (Metronome) | `dcos-metronome.service`| 代理/管理 | 管理 |
| 9443 | DC/OS 作业 (Metronome) SSL | `dcos-metronome.service`| 代理/管理 | 管理 |
| 9990 | DC/OS 包管理器 (Cosmos) | `dcos-cosmos.service` | 本地主机| 本地主机（管理）|
| 15055 | DC/OS 历史记录 | `dcos-history-service.service` | 本地主机| 本地主机（管理）|
| 15101 | Marathon libprocess | `dcos-marathon.service` | 管理 | 代理/管理 |
| 15201 | DC/OS 作业 (Metronome) libprocess | `dcos-metronome.service`| 管理 | 代理/管理 |
| 61053 | Mesos DNS | `dcos-mesos-net.service` | 代理/管理 | 管理 | 
| 61430 | DC/OS Net | `dcos-net.service` | 代理/管理 | 管理 [enterprise type="inline" size="small" /]|
| Ephemeral | DC/OS 组件包理器 (Pkgpanda) | `dcos-pkgpanda-api.service` | 无 | 无 |

### UDP

| 端口 | DC/OS 组件 | `systemd` 单元 | 来源 | 目标 |
|---|---|---|---|---| 
| 61053 | Mesos DNS | `dcos-mesos-net.service` | 代理/管理 | 管理 | 

## 代理节点

### TCP

| 端口 | DC/OS 组件 | `systemd` 单元 | 来源 | 目标 |
|---|---|---|---|---|
| 5051 | Mesos 代理节点 | `dcos-mesos-slave.service` | 代理/管理 | 代理 |
| 61001 | Admin Router 代理 (HTTP) | `dcos-adminrouter-agent` | 代理/管理 | 代理 |
| 61002 | Admin Router 代理 (HTTPS) | `dcos-adminrouter-agent` | 代理/管理 | 代理 |
| 1025-2180 | 默认广告端口范围（对于 Mesos 任务）| 任何 Mesos 任务 | 代理/管理 | 代理 |
| 2182-3887 | 默认广告端口范围（对于 Mesos 任务）| 任何 Mesos 任务 | 代理/管理 | 代理 |
| 3889-5049 | 默认广告端口范围（对于 Mesos 任务）| 任何 Mesos 任务 | 代理/管理 | 代理 |
| 5052-8079 | 默认广告端口范围（对于 Mesos 任务）| 任何 Mesos 任务 | 代理/管理 | 代理 |
| 8082-8180 | 默认广告端口范围（对于 Mesos 任务）| 任何 Mesos 任务 | 代理/管理 | 代理 |
| 8182-32000 | 默认广告端口范围（对于 Mesos 任务）| 任何 Mesos 任务 | 代理/管理 | 代理 |
