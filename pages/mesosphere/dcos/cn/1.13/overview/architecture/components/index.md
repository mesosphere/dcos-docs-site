---
layout: layout.pug
navigationTitle:  组件
title: 组件
menuWeight: 4
excerpt: 了解 DC/OS 组件
render: mustache
model：/mesosphere/dcos/1.13/data.yml
---

DC/OS 由许多开源微服务组件组成，经过精心调整和配置以协同工作。Mesosphere DC/OS Enterprise 包括大部分开源 DC/OS 组件，但还包括多个额外组件、模块和插件。

![Mesosphere DC/OS Enterprise 组件](/mesosphere/dcos/1.13/img/dcos-components-1-13.png)

图 1 - DC/OS 组件

从表面上看，DC/OS 是处理容器编排、包管理和安全的包容性容器平台。从根本上说，DC/OS 是建立在 [Apache Mesos] (http://mesos.apache.org/) 基础之上的操作系统，处理群集管理和软件定义网络，同时简化日志记录和度量标准收集。

<a name="cluster-management"><a>

# 群集管理

DC/OS 提供了一种作为单个群集级别系统查看和操作大量单个机器级系统的方法。它隐藏了 Mesos（分布式系统内核）的复杂性，具有更高级别的抽象概念、接口和工具。群集管理是该功能的核心，包括内核、其依赖关系及其用户界面。

<a name="apache-mesos"></a>

## Apache Mesos

Mesos 作为分布式系统内核来管理资源和任务。Mesos 管理节点揭示调度器、执行器和操作界面，以便进行群集管理。Mesos 代理节点管理每个 [DC/OS 代理节点] 上的单个执行器、任务和资源(/mesosphere/dcos/1.13/overview/concepts/#dcos-agent-node)。Mesos Agent Public 是配置用于在 [DC/OS 公共代理节点] 上运行的 Mesos 代理节点(/mesosphere/dcos/1.13/overview/concepts/#public-agent-node)。

### 系统服务

- `dcos-mesos-master.service`
- `dcos-mesos-slave.service`
- `dcos-mesos-slave-public.service`

阅读以下文档资源，了解有关 Apache Mesos 的更多信息：

- [文档](http://mesos.apache.org/)
- [来源](https://github.com/apache/mesos)
- [API 参考](https://mesos.apache.org/documentation/latest/endpoints/)

<a name="apache-zookeeper"></a>

## Apache ZooKeeper

ZooKeeper 为配置、同步、名称注册和群集状态存储提供一致且高度可用的分布式键值存储。

### 系统服务

不适用 - ZooKeeper 由 Exhibitor 监督。

阅读以下文档资源，了解有关 Apache Zookeeper 的更多信息：

- [文档](https://zookeeper.apache.org/)
- [来源](https://github.com/apache/zookeeper)


<a name="exhibitor"></a>
## Exhibitor

Exhibitor 监督 ZooKeeper 并提供管理 Web 界面。

### 系统服务

- `dcos-exhibitor.service`

阅读以下文档资源，了解有关 Exhibitor 的更多信息：

- [文档](https://github.com/soabase/exhibitor/wiki)
- [来源](https://github.com/dcos/exhibitor)
- [API 参考](https://github.com/soabase/exhibitor/wiki/REST-Introduction)

<a name="dcos-installer"></a>

## DC/OS 安装工具

DC/OS 安装工具（`dcos_generate_config.ee.sh`）生成安装工件并安装 DC/OS。作为每个节点上安装过程的一部分，DC/OS 下载服务从 bootstrap 机器下载安装工件，DC/OS 设置服务利用 DC/OS 组件包管理器 (Pkgpanda) 安装组件。

### 系统服务

- `dcos-download.service`
- `dcos-setup.service`

阅读以下文档资源，了解有关 DC/OS 和安装方法的更多信息：

- [文档](/mesosphere/dcos/1.13/installing/)
- [来源](https://github.com/dcos/dcos)

[企业]
<a name="dcos-backup"></a>

## DC/OS 备份
[/enterprise]
DC/OS 备份提供 DC/OS 组件状态的备份和恢复（在 1.10 中仅 Marathon）。

### 系统服务

- `dcos-backup-master.service`
- `dcos-backup-master.socket`

阅读以下文档资源，了解有关备份和恢复群集的更多信息：

- [文档](/mesosphere/dcos/1.13/administering-clusters/backup-and-restore/)
- [API 参考](/mesosphere/dcos/1.13/administering-clusters/backup-and-restore/backup-restore-api/)


<a name="dcos-gui"></a>

## DC/OS GUI

DC/OS GUI（Web 界面）是基于浏览器的系统仪表盘和控制中心。

### 系统服务

不适用 - GUI 由 Admin Router 服务。

阅读以下文档资源，了解有关 DC/OS GUI 的更多信息：

- [文档](/mesosphere/dcos/1.13/gui/)
- [来源](https://github.com/dcos/dcos-ui)


<a name="dcos-cli"></a>

## DC/OS CLI

DC/OS CLI 是基于终端的远程客户端。

### 系统服务

不适用 - CLI 是用户可下载的二进制文件。

阅读以下文档资源，了解有关 DC/OS CLI 的更多信息：

- [文档](/mesosphere/dcos/1.13/cli/)
- [来源](https://github.com/dcos/dcos-cli)

# 容器编排

容器编排是连续自动调度、协调和管理容器化流程及其所消耗的资源。DC/OS 包括最常用的基于容器的高级抽象的内置编排：作业和服务。许多使用案例通过这些基本抽象直接处理，但它们还能够为需要更灵活程序化生命周期管理自动化的任务部署定制调度器。

<a name="marathon"></a>

## Marathon

Marathon 编排长期的容器化服务（应用程序和 Pod）。

### 系统服务

- `dcos-marathon.service`

阅读以下文档资源，了解有关 DC/OS Marathon 的更多信息：

- [网站](https://mesosphere.github.io/marathon/)
- [文档](/mesosphere/dcos/1.13/deploying-services/)
- [来源](https://github.com/mesosphere/marathon)
- [API 参考](/mesosphere/dcos/1.13/deploying-services/marathon-api/)

<a name="dcos-jobs"></a>

## DC/OS 作业（Metronome）

DC/OS 作业（Metronome）编排短期的、计划的或即时的容器化作业。

### 系统服务

- `dcos-metronome.service`

阅读以下文档资源，了解有关 DC/OS Metronome 的更多信息：

- [文档](/mesosphere/dcos/1.13/deploying-jobs/)
- [来源](https://github.com/dcos/metronome)
- [API 参考](https://dcos.github.io/metronome/docs/generated/api.html)

# 容器运行时

容器运行时在隔离操作系统级别环境中执行和管理机器一级的进程。DC/OS 使用 [Mesos 的容器化工具抽象]（http://mesos.apache.org/documentation/latest/containerizers/）支持多个容器运行时。

<a name="universal-container-runtime"></a>

## 通用容器运行时

通用容器运行时（Mesos 容器化工具）是内置于 Mesos 代理节点的逻辑组件，严格来说不是一个单独的进程。它使用可配置的隔离器对 Mesos 任务执行容器化。通用容器运行时支持多种图像格式，包括 Docker 镜像，无需使用 Docker 引擎。

### 系统服务

不适用 - 通用容器运行时是 Mesos 代理节点的一部分。

阅读以下文档资源，了解有关通用容器运行时的更多信息：

- [Mesos 容器化工具文档](http://mesos.apache.org/documentation/latest/containerizers/)

<a name="docker-engine"></a>

## Docker 引擎

Docker 引擎不由 DC/OS 安装程序安装，而是在每个节点上运行的系统附属。Mesos 代理节点还包括一个名为 Docker 容器化工具的独立逻辑组件，将 Mesos 任务的容器化分配给 Docker 引擎。

### 系统服务

- `docker.service` - Docker 引擎不由 DC/OS 安装工具安装。

阅读以下文档资源，了解有关 Docker 引擎的更多信息：

- [Docker 容器化工具文档](http://mesos.apache.org/documentation/latest/docker-containerizer)
- [Docker 引擎文档](https://docs.docker.com/engine/)
- [Docker 引擎来源](https://github.com/docker/docker/)


<a name="docker-gc"></a>
## Docker GC

Docker GC 定期收集 Docker“垃圾”容器和图像。

### 系统服务

- `dcos-docker-gc.service`
- `dcos-docker-gc.timer`

阅读以下文档资源，了解有关 Docker GC 的更多信息：

- [来源](https://github.com/spotify/docker-gc)

# 日志记录和度量标准

没有任何软件能完美运行，尤其是在首次运行时。在整个群集分配任务以及分析和调试这些服务的正常模式都会变得繁琐。DC/OS 包括多个组件，通过聚合、缓存和流式传输日志、度量标准和群集状态元数据来减轻调试分布式系统的辛苦。

<a name="dcos-network-metrics"></a>
[企业]

## DC/OS 网络度量标准
[/enterprise]

DC/OS 网络度量标准揭示了网络相关度量标准。DC/OS 网络度量标准也被称为 DC/OS 网络 API。

### 系统服务

- `dcos-networking_api.service`

<a name="dcos-diagnostics"></a>

## DC/OS 诊断

DC/OS 诊断汇总并揭示组件的健康状态。DC/OS 诊断也被称为 DC/OS 分布式诊断工具。

### 系统服务

- `dcos-diagnostics.service`
- `dcos-diagnostics.socket`

阅读以下文档资源，了解有关 DC/OS 诊断的更多信息：

- [来源](https://github.com/dcos/dcos-diagnostics)
- [API 参考](/mesosphere/dcos/1.13/monitoring/#system-health-http-api-endpoint)

<a name="dcos-log"></a>

## DC/OS 日志

DC/OS 日志服务揭示节点、组件和容器（任务）日志。

### 系统服务

- `dcos-log-master.service`
- `dcos-log-master.socket`
- `dcos-log-agent.service`
- `dcos-log-agent.socket`

阅读以下文档资源，了解有关 DC/OS 日志的更多信息：

- [来源](https://github.com/dcos/dcos-log)
- [API 参考](/mesosphere/dcos/1.13/monitoring/logging/logging-reference/)

<a name="logrotate"></a>

## 日志轮换

Logrotate 管理历史日志文件的轮换、压缩和删除。

### 系统服务

- `dcos-logrotate-master.service`
- `dcos-logrotate-master.timer`
- `dcos-logrotate-agent.service`
- `dcos-logrotate-agent.timer`

阅读以下文档资源，了解有关 DC/OS 日志轮换的更多信息：

- [文档](https://linux.die.net/man/8/logrotate)
- [来源](https://github.com/logrotate/logrotate)

<a name="telegraf"></a>

## Telegraf

Telegraf 是一个可配置的度量标准管道。它默认收集系统、容器和应用程序度量标准。

### 系统服务

- `dcos-telegraf.service`
- `dcos-telegraf.socket`

阅读以下文档资源，了解有关 DC/OS Telegraf 的更多信息：

- [来源](https://github.com/dcos/telegraf)
- [API 参考](/mesosphere/dcos/1.13/metrics/metrics-api/)

<a name="dcos-signal"></a>

## DC/OS 信号

DC/OS 信号服务报告群集遥测和分析，以帮助改进 DC/OS。管理员可以在安装时间 [选择退出遥测](/mesosphere/dcos/1.13/installing/production/deploying-dcos/opt-out/#telemetry)。

### 系统服务

- `dcos-signal.service`
- `dcos-signal.timer`

阅读以下文档资源，了解有关 DC/OS 信号的更多信息：

- [来源](https://github.com/dcos/dcos-signal)

<a name="dcos-history"></a>

## DC/OS 历史记录

DC/OS 历史记录服务缓存并揭示历史系统状态，以促进 GUI 中的群集使用率统计信息。

### 已弃用

此服务已弃用，将在未来版本中移除。

### 系统服务

- `dcos-history.service`

阅读以下文档资源，了解有关 DC/OS 历史记录的更多信息：

- [来源](https://github.com/dcos/dcos/tree/master/packages/dcos-history/extra)
- [API 参考](https://github.com/dcos/dcos/tree/master/packages/dcos-history/extra#api)

# 网络

在为计算机提供数字而非名字的世界里，任务是自动调度的，依赖关系以声明方式定义，服务在分布式集合中运行，网络管理也需要从插入电缆提升到配置软件定义网络。为实现这个目标，DC/OS 包含了用于路由、代理、名称解析、虚拟 IP、负载均衡和分布式重配置的一系列网络组件。

<a name="admin-router"></a>

## Admin Router

Admin Router 使用 [NGINX] 揭示组件和服务的统一控制平面代理(https://www.nginx.com/)。Admin Router 代理为节点特定的健康、日志、度量标准和包管理内部端点提供代理。

### 系统服务

- `dcos-adminrouter.service`
- `dcos-adminrouter-agent.service`

阅读以下文档资源，了解有关 DC/OS Admin Router 的更多信息：

- [来源](https://github.com/dcos/adminrouter)

<a name="mesos-dns"></a>

## Mesos DNS

Mesos DNS 提供群集内基于域名的服务发现。

### 系统服务

- `dcos-mesos-dns.service`

阅读以下文档资源，了解有关 Mesos DNS 的更多信息：

- [文档](http://mesosphere.github.io/mesos-dns/)
- [来源](https://github.com/mesosphere/mesos-dns)
- [API 参考](/mesosphere/dcos/1.13/networking/DNS/mesos-dns/mesos-dns-api/)

<a name="dns-forwarder"></a>

## DC/OS 网络

`dcos-net` 是一个 Erlang 虚拟机，主持以下网络应用程序：
- `dcos-dns`：基于 DNS 的分布式服务发现。
- `dcos-overlay`：适合 UCR 和 Docker 容器的 SDN 解决方案。
- `dcos-l4lb`：分布式 4 层负载均衡器。

### 系统服务

- `dcos-net.service`
- `dcos-net-watchdog.service`

阅读以下文档资源，了解有关 DC/OS Net 的更多信息：

- [来源](https://github.com/dcos/dcos-net)

<a name="generate-resolv.conf"></a>

## `Generate resolv.conf`

`Generate resolv.conf` 通过更新 `/etc/resolv.conf` 以促进 DC/OS 软件定义网络来配置网络名称解析。

### 系统服务

- `dcos-gen-resolvconf.service`
- `dcos-gen-resolvconf.timer`

阅读以下文档资源，了解更多有关 `Generate resolv.conf` 的信息:

- [来源](https://github.com/dcos/dcos/blob/master/packages/dcos-net/extra/gen_resolvconf.py)

# 包管理

正如机器操作系统需要包管理以安装、升级、配置和移除单个应用程序和服务一样，数据中心操作系统也需要包管理来对分布式服务执行同样的操作。在 DC/OS 中，包管理有两个级别：组件的机器级别以及用户服务的群集级别。


<a name="dcos-package-manager"></a>

## DC/OS 包管理器 (Cosmos)

DC/OS 包管理器 (Cosmos) 安装和管理 [DC/OS 软件包存储库] 中的 DC/OS 软件包，(/mesosphere/dcos/1.13/administering-clusters/package-registry/)如 [Mesosphere {{ model.packageRepo }}](https://github.com/mesosphere/universe)。

### 系统服务

- `dcos-cosmos.service`

阅读以下文档资源，了解有关 DC/OS 包管理器（Cosmos）的更多信息：

- [来源](https://github.com/dcos/cosmos)
- [API 参考](/mesosphere/dcos/1.13/deploying-services/package-api/)

<a name="dcos-component-package-manager"></a>

## DC/OS 组件包管理器 (Pkgpanda)

DC/OS 组件包管理器 (Pkgpanda) 安装和管理 DC/OS 组件。

### 系统服务

- `dcos-pkgpanda-api.service`
- `dcos-pkgpanda-api.socket`


阅读以下文档资源，了解有关 DC/OS 组件包管理器 (Pkgpanda) 的更多信息：

- [来源](https://github.com/dcos/dcos/tree/master/pkgpanda)
- [API 参考](/mesosphere/dcos/1.13/administering-clusters/component-management/)

[企业]
# IAM 和安全
[/enterprise]

DC/OS Enterprise 中的身份和访问管理由用户、用户组和权限构成的内部数据库管理。也可以附加外部身份提供商，以充分利用现有数据库。权限由 Admin Router 的反向代理在边缘执行，也在组件级别执行，以控制对特定操作的访问。SSL 证书等密钥也可以安全地生成、管理、存储并添加到用户服务中。

<a name="dcos-iam"></a>

## DC/OS 身份和访问管理器 (Bouncer)

DC/OS 身份和访问管理器 (IAM) 通过管理用户、用户组、服务帐户、权限和身份提供商，控制对 DC/OS 组件和服务的访问。除管理本地用户数据库以外，DC/OS IAM 还可以使用 LDAP、SAML 或 Open ID Connect 来分派给外部身份提供商。对于细粒度的访问控制，其他 DC/OS 组件（如 Mesos 和Marathon）直接与 DC/OS IAM 集成。DC/OS IAM 也被称为 Bouncer。

### 系统服务

- `dcos-bouncer.service`

阅读以下文档资源，了解有关 DC/OS 标识和访问管理器 (Bouncer) 的更多信息：

- [文档](/mesosphere/dcos/1.13/security/)
- [API 参考](/mesosphere/dcos/1.13/security/ent/iam-api/)

<a name="cockroachdb"></a>

## CockroachDB

CockroachDB 是一个分布式 SQL 数据库，基于事务性、高度一致的键值对存储。

<p class="message--note"><strong>注意：</strong>CockroachDB 目前仅由 <a href="#dcos-iam">DC/OS 身份和访问管理器使用</a>。</p>

### 系统服务

- `dcos-cockroach.service`

阅读以下文档资源，了解有关 CockroachDB 的更多信息：

- [文档](https://www.cockroachlabs.com/docs/)
- [来源](https://github.com/cockroachdb/cockroach)

<a name="dcos-certificate-authority"></a>

## DC/OS 证书颁发机构

DC/OS 证书颁发机构 (CA) 发布已签署的数字证书，确保通信安全。DC/OS CA 是基于 Cloudflare 的 <a href="https://github.com/cloudflare/cfssl">Cfssl</a>。

### 系统服务

- `dcos-ca.service`

阅读以下文档资源，了解有关 DC/OS 证书颁发机构的更多信息：

- [文档](/mesosphere/dcos/1.13/security/ent/tls-ssl/)
- [API 参考](/mesosphere/dcos/1.13/security/ent/tls-ssl/ca-api/)

<a name="dcos-secrets"></a>

## DC/OS 密钥

DC/OS 密钥提供一个安全的 API，用于存储并从 Vault （一个密钥存储库）检索密钥。

### 系统服务

- `dcos-secrets.service`

阅读以下文档资源，了解有关 DC/OS 密钥的更多信息：
- [文档](/mesosphere/dcos/1.13/security/ent/secrets/)
- [API 参考](/mesosphere/dcos/1.13/security/ent/secrets/secrets-api/)

<a name="vault"></a>
## Vault

Vault 是一个用于安全地管理密钥的工具。密钥是指您希望控制其访问权限的任何内容，例如 API 密钥、密码、证书等。Vault 提供与任何密钥的统一界面，同时提供严密的访问控制并记录详细的审核日志。

### 系统服务

- `dcos-vault.service`

阅读以下文档资源，了解有关 Vault 的更多信息：

- [文档](https://www.vaultproject.io/docs/)
- [来源](https://github.com/mesosphere/vault/)
- [API 参考](https://www.vaultproject.io/api/)

# 存储

DC/OS 提供了许多不同方法来调配磁盘空间和卷到任务。其中一种方法是外部持久卷，由其自己的组件管理。

<a name="rex-ray"></a>

## REX-Ray

REX-Ray 编排调配、附加和安装外部持久卷。

### 系统服务

- `dcos-rexray.service`

阅读以下文档资源，了解有关 REX 射线的更多信息：

- [文档](http://rexray.readthedocs.io/)
- [来源](https://github.com/codedellemc/rexray)

# 套接字和计时器

多个组件被配置为按需使用 [systemd 套接字](https://www.freedesktop.org/software/systemd/man/systemd.socket.html)，使得可以在请求出现时将其启动，而不是持续运行和不必要地消耗资源。虽然这些套接字是单独的 [systemd 单元](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)，但它们不被视为是单独组件。

多个组件被配置为使用 [systemd 计时器](https://www.freedesktop.org/software/systemd/man/systemd.timer.html)，使得它们可以定期执行或重新启动。定期执行避免了持续执行和不必要的资源消耗。定期重新启动使得可以从下游依赖关系（如基于时间的 DNS 缓存到期）中提取新配置。虽然这些计时器是单独的 [systemd 单元](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)，但它们不被视为是单独组件。

# 组件安装

DC/OS 组件由 [DC/OS 组件包管理器 (Pkgpanda)](https://github.com/dcos/dcos/tree/master/pkgpanda)（用于 `systemd` 单元的包管理器）安装、升级和管理。

要查看 DC/OS 安装工具管理的软件包的完整列表，请参阅 [DC/OS 源存储库的软件包目录](https://github.com/dcos/dcos/tree/master/packages)。

# `Systemd` 服务

大多数 DC/OS 组件在 DC/OS 节点上作为 [systemd 服务] (/mesosphere/dcos/1.13/overview/concepts/#systemd-service)运行。

要查看 `systemd` 在任何特定节点上运行的组件的列表，请列出 `/etc/systemd/system/dcos.target.wants/` 目录的内容或执行 `systemctl | grep dcos-` 以查看其当前状态。

## 管理节点

```
ls /etc/systemd/system/dcos.target.wants/ -1
dcos-adminrouter.service
dcos-backup-master.service
dcos-backup-master.socket
dcos-bouncer-legacy.service
dcos-bouncer.service
dcos-ca.service
dcos-cockroach.service
dcos-cosmos.service
dcos-diagnostics.service
dcos-diagnostics.socket
dcos-epmd.service
dcos-exhibitor.service
dcos-gen-resolvconf.service
dcos-gen-resolvconf.timer
dcos-history.service
dcos-log-master.service
dcos-log-master.socket
dcos-logrotate-master.service
dcos-logrotate-master.timer
dcos-marathon.service
dcos-mesos-dns.service
dcos-mesos-master.service
dcos-metrics-master.service
dcos-metrics-master.socket
dcos-metronome.service
dcos-navstar.service
dcos-networking_api.service
dcos-pkgpanda-api.service
dcos-secrets.service
dcos-secrets.socket
dcos-signal.service
dcos-signal.timer
dcos-spartan.service
dcos-spartan-watchdog.service
dcos-spartan-watchdog.timer
dcos-vault.service
```

## 专用代理节点

```
ls /etc/systemd/system/dcos.target.wants/ -1
dcos-adminrouter-agent.service
dcos-diagnostics.service
dcos-diagnostics.socket
dcos-docker-gc.service
dcos-docker-gc.timer
dcos-epmd.service
dcos-gen-resolvconf.service
dcos-gen-resolvconf.timer
dcos-log-agent.service
dcos-log-agent.socket
dcos-logrotate-agent.service
dcos-logrotate-agent.timer
dcos-mesos-slave.service
dcos-metrics-agent.service
dcos-metrics-agent.socket
dcos-navstar.service
dcos-pkgpanda-api.service
dcos-rexray.service
dcos-signal.timer
dcos-spartan.service
dcos-spartan-watchdog.service
dcos-spartan-watchdog.timer
```

## 公共代理节点

```
ls /etc/systemd/system/dcos.target.wants/ -1
dcos-adminrouter-agent.service
dcos-diagnostics.service
dcos-diagnostics.socket
dcos-docker-gc.service
dcos-docker-gc.timer
dcos-epmd.service
dcos-gen-resolvconf.service
dcos-gen-resolvconf.timer
dcos-log-agent.service
dcos-log-agent.socket
dcos-logrotate-agent.service
dcos-logrotate-agent.timer
dcos-mesos-slave-public.service
dcos-metrics-agent.service
dcos-metrics-agent.socket
dcos-navstar.service
dcos-pkgpanda-api.service
dcos-rexray.service
dcos-signal.timer
dcos-spartan.service
dcos-spartan-watchdog.service
dcos-spartan-watchdog.timer
```
