---
layout: layout.pug
excerpt: DC/OS 101 教程第 1 部分
title: 教程 - 第一步
navigationTitle: 第一步
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
menuWeight: 1
---

#包括 /mesosphere/dcos/include/tutorial-disclaimer.tmpl

欢迎阅读 DC/OS 101 教程第 1 部分。

# 先决条件
要开始学习本教程，您应该具有正在运行的 DC/OS 群集的访问权限，该群集至少包含一个主节点和 3 个代理节点（其中一个是公共代理节点）。如果您没有设置这些要求，请遵循各种云提供程序、内部部署或虚拟机设置的[设置说明](/mesosphere/dcos/latest/installing/) 进行操作。

如果您不确定选择哪个选项，则建议使用 <a href="https://downloads.dcos.io/dcos/stable/aws.html" target="_blank">AWS 模板</a>。对于本教程，使用单个主节点的设置就足够了，但是对于运行生产工作负载，您应该有多个管理节点。

# 目的
您可以访问您的群集，并且已经初步了解了 GUI。您也可以使用 DC/OS CLI 从本地机器访问群集。在本部分结束时，您将安装 DC/OS CLI 并使用它来查看您的群集。

# 步骤
  * 安装 DC/OS CLI
    * 请遵循 [此处](latest/cli/install/) 的步骤或 DC/OS GUI 右下角的 `Install CLI` 说明。
    * 确保您有权通过运行 `dcos auth login` 连接到您的群集 。这对于防止未经授权人员访问您的群集是必要的。
    * 您还可以向群集添加/邀请朋友和同事。有关详细信息，请参阅[用户管理文档](/mesosphere/dcos/2.0/security/ent/users-groups/)

  * 查看群集：
      * 使用 `dcos service` 检查正在运行的服务。除非您已安装其他服务，否则您的群集上应运行两个服务：Marathon（基本上是 DC/OS 初始化系统）和 metronome（基本上是 DC/OS cron 调度程序）。
      * 使用 `dcos node list` 检查连接的节点。此命令显示有关群集中已连接代理节点和管理节点的一些基本信息。
      * 使用 `dcos node log --leader` 查看主导 mesos 管理节点的日志。Mesos 基本上是 DC/OS 的核心，本教程在本教程中多次查看 Mesos 日志。
      * 要查看更多 CLI 选项，请输入 `dcos help` 命令。还有可用的各个命令的帮助选项，例如，`dcos node --help`。或者，查看 [CLI 文档](/mesosphere/dcos/2.0/cli/)。

# 结果
祝贺您！您已使用 DC/OS CLI 成功连接到您的群集，并开始查看某些 CLI 命令。
您将在随后的部分中进一步使用 CLI。

# 深入研究
在尝试使用 DC/OS CLI 时，您已经遇到过几个 DC/OS 组件（包括 Mesos、Marathon 或 Metronome）。
但是 DC/OS 还有哪些其他组件？

## DC/OS 组件
以下是与本教程相关的 DC/OS 组件。有关所有组件的完整说明，请参阅[文档](/mesosphere/dcos/2.0/overview/architecture/components/)。
* [Marathon](/mesosphere/dcos/2.0/overview/architecture/components/#marathon) 启动并监控 DC/OS 应用程序和服务。
* Apache [Mesos](/mesosphere/dcos/2.0/overview/architecture/components/#apache-mesos) 是 DC/OS 的核心，负责低级别任务维护。
* [Mesos DNS](/mesosphere/dcos/2.0/overview/architecture/components/#mesos-dns) 在群集内提供服务发现。
* [Minuteman](/mesosphere/dcos/2.0/overview/architecture/components/#minuteman) 是内部第 4 层负载均衡器。
* [Admin Router](/mesosphere/dcos/2.0/overview/architecture/components/#admin-router) 是一种开源 NGINX 配置，为 DC/OS 服务提供集中身份认证和代理。
* [{{ model.packageRepo }}](/mesosphere/dcos/2.0/overview/architecture/components/#dcos-package-manager) 是包含 DC/OS 服务（例如，Apache Spark 或 Apache Cassandra）的包资源库，您可以直接从 DC/OS GUI 和 CLI 在群集上安装这些服务。
