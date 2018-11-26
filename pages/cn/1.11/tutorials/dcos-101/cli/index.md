---
layout: layout.pug
excerpt: 第 1 部分 - 第一步
title: 教程 - 第一步
navigationTitle: 第一步
menuWeight: 1
---

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的仅仅是为了演示功能，它可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您应该进行调整、验证和测试。</td> 
</tr> 
</table>

欢迎阅读 DC/OS 101 教程第 1 部分。

# 先决条件
要开始学习本教程，您应该具有正在运行的 DC/OS 集群的访问权限，该集群至少包含一个管理节点和 3 个代理节点（其中一个是公共代理节点）。如果您没有设置这些要求，请遵循各种云提供程序、内部部署或虚拟机设置的[设置说明](/cn/1.11/installing/) 进行操作。
如果您不确定选择哪个选项，则建议使用 <a href="https://downloads.dcos.io/dcos/stable/aws.html" target="_blank">AWS 模板</a>。对于本教程，使用单个管理节点的设置就足够了，但是对于运行生产工作负载，您应该有多个管理节点。

# 目的
您可以访问您的集群，并且已经初步了解了 GUI。您也可以通过 DC/OS CLI 从本地机器访问集群。在本节结束时，您将安装 DC/OS CLI 并使用它来查看您的集群。

# 步骤
 * 安装 DC/OS CLI
 * 请遵循[此处](/cn/1.11/cli/install/) 的步骤或 DC/OS GUI 右下角的 `Install CLI` 说明。
 * 确保您有权通过运行 `dcos auth login` 连接到您的集群 。这对于防止未经授权人员访问您的集群是必要的。
 * 您还可以向集群添加/邀请朋友和同事。有关详细信息，请参阅[用户管理文档](/cn/1.11/security/ent/users-groups/)

 * 查看集群：
 * 使用 `dcos service` 检查正在运行的服务。除非您已安装其他服务，否则您的集群上应运行两个服务：Marathon（基本上是 DC/OS 初始化系统）和 metronome（基本上是 DC/OS cron 调度程序）。
 * 使用 `dcos node` 检查连接的节点。您应该能够看到集群中连接的代理节点（即：不是管理节点）。
 * 使用 `dcos node log --leader` 查看主导 mesos 管理节点的日志。Mesos 基本上是 DC/OS 的核心，本教程在本教程中多次查看 Mesos 日志。
 * 要查看更多 CLI 选项，请输入 `dcos help` 命令。还有可用的各个命令的帮助选项，例如，`dcos node --help`。或者，查看 [CLI 文档](/cn/1.11/cli/)。

# 结果
祝贺您！您已使用 DC/OS CLI 成功连接到您的集群，并开始查看某些 CLI 命令。
您将在随后的部分中进一步使用 CLI。

# 深入研究
在尝试使用 DC/OS CLI 时，您已经遇到过几个 DC/OS 组件（包括 Mesos、Marathon 或 Metronome）。
但是 DC/OS 还有哪些其他组件？

## DC/OS 组件
以下是与本教程相关的 DC/OS 组件。有关所有组件的完整说明，请参阅[文档](/cn/1.11/overview/architecture/components/)。
* [Marathon](/cn/1.11/overview/architecture/components/#marathon) 启动并监控 DC/OS 应用程序和服务。
* Apache [Mesos](/cn/1.11/overview/architecture/components/#apache-mesos) 是 DC/OS 的核心，负责低级别任务维护。
* [Mesos DNS](/cn/1.11/overview/architecture/components/#mesos-dns) 在集群内提供服务发现。
* [Minuteman](/cn/1.11/overview/architecture/components/#minuteman) 是内部第 4 层负载均衡器。
* [Admin Router](/cn/1.11/overview/architecture/components/#admin-router) 是一种开源 NGINX 配置，为 DC/OS 服务提供集中身份认证和代理。
* [Universe](/cn/1.11/overview/architecture/components/#dcos-package-manager) 是包含 DC/OS 服务（例如，Apache Spark 或 Apache Cassandra）的软件包存储库，您可以直接从 DC/OS GUI 和 CLI 在集群上安装这些服务。
