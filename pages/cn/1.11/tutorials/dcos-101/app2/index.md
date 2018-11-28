---
layout: layout.pug
excerpt: 第 5 部分 - 部署本地应用程序
title: 教程 - 部署本地应用程序
navigationTitle: 本地应用程序
menuWeight: 5
---

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的仅仅是为了演示功能，它可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您应该进行调整、验证和测试。</td> 
</tr> 
</table>

欢迎阅读 DC/OS 101 教程第 5 部分


# 先决条件
* [正在运行的 DC/OS 集群](/cn/1.11/tutorials/dcos-101/cli/)，[已安装 DC/OS CLI](/cn/1.11/tutorials/dcos-101/cli/)。
* [app1](/cn/1.11/tutorials/dcos-101/app1/) 已部署并在您的集群中运行。


# 目的
在本教程[前述部分](/cn/1.11/tutorials/dcos-101/app1/)中，您部署了在集群内部运行的应用程序，与集群中的其他应用程序连接，而不是在外部进行交互。在此部分中，您将部署为用户提供 GUI 的应用程序。您还将本地部署此应用程序，而不依赖于 Docker 作为依赖项，从而降低复杂性。

# 步骤
 * 了解应用程序
 * 简要了解一下 [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go)。App2 是基于 [Go](https://golang.org/) 的 HTTP 服务器，它向 Redis 公开了一个非常简单的网络接口。
 * 部署 app2
 * 简要了解一下[应用定义](https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json)。在这种情况下，应用程序是是没有外部依赖关系的二进制文件。
 因此，您不再需要将其部署在 Docker 容器中。
 * 部署 app2：`dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json`
 * 您有多个选项可以检查应用程序 2 是否成功运行：
 * 通过查看所有 DC/OS 任务: `dcos task`
 * 通过查看所有 Marathon 应用程序：`dcos marathon app list`
 * 从集群中curl  http 服务器（在这种情况下来自主要主管理节点服务器）：
       * `dcos node ssh --master-proxy --leader`
       * `curl dcos-101app2.marathon.l4lb.thisdcos.directory:10000`

 这应该从 app2 的 web 服务器返回原始 HTML 响应。


从集群中访问应用程序并查看原始 HTML 响应证明我们的应用程序正在运行，但在现实世界中，您希望向公众公开应用程序。在本教程的下一部分，您将完全做到这一点。

# 结果
 您已经部署了第二个使用本地 Mesos 容器化工具的应用程序。

# 深入研究
您现在以两种不同的方式部署了应用程序：

1. 使用 Docker (app1)。
1. 使用本地 Universal Container Runtime (app2)。

让我们更详细地探讨一下这些差异。

DC/OS 使用[容器化工具](/cn/1.11/deploying-services/containerizers/)在容器中运行任务。容器中的运行任务提供了许多好处，包括将任务彼此隔离并以编程方式控制任务资源的能力。DC/OS 支持两种类型的容器化工具 - DC/OS Universal Container Runtime 和 Docker 容器化工具。

对于第一个应用程序，您使用了 Docker 容器镜像来封装 app1 的依赖项（请记住：永远不要依赖于代理程序上安装的依赖项！），然后使用 了Docker 容器化工具来执行它。由于 Docker 容器化工具在内部使用 [Docker 运行时间](https://docs.docker.com/engine/userguide/intro/)，因此您还使用了 Docker 运行时间。

对于第二个应用程序，您没有任何依赖项，因此可能依赖于默认的 DC/OS Universal Container Runtime。在内部，两个运行时间都使用相同的 OS 功能进行隔离，即 [cgroup](https://en.wikipedia.org/wiki/Cgroups) 和 [namespaces](https://en.wikipedia.org/wiki/Linux_namespaces)。
这实际上可以使用 DC/OS Universal Container Runtime 来运行 Docker 镜像 - 有关详细信息，请查看 [DC/OS Universal Container Runtime](/cn/1.11/deploying-services/containerizers/) 文档。
