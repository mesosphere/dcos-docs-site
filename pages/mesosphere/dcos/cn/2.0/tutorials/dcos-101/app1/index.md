---
layout: layout.pug
navigationTitle:  部署第一个应用程序
excerpt: DC/OS 101 教程第 3 部分
title: 教程 - 部署第一个应用程序
render: mustache
model: /mesosphere/dcos/2.0/data.yml
menuWeight: 3
---

#include /mesosphere/dcos/include/tutorial-disclaimer.tmpl

欢迎阅读 DC/OS 101 教程第 3 部分


# 先决条件
* [正在运行的 DC/OS 群集](/mesosphere/dcos/2.0/tutorials/dcos-101/cli/)，[已安装 DC/OS CLI](/mesosphere/dcos/2.0/tutorials/dcos-101/cli/)。
* [Redis](/mesosphere/dcos/2.0/tutorials/dcos-101/redis-package/) 已部署并在您的群集中运行。


# 目的
您现在在群集中运行了一个工作持久层 [Redis](https://redislabs.com/)。
在本部分中，您将部署连接到 Redis 的简单应用程序。

# 步骤
1. 查看应用程序
  * 让我们首先了解[应用程序](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py)。它非常简单，只需检查是否可以联系 Redis，然后打印存储在那里的密钥总数。
2. 部署应用程序
  * python 脚本依赖于 [redis-py](https://pypi.python.org/pypi/redis) Python 库，您不能假设它存在于所有代理节点上。因此，您应该在提供所有依赖关系的 `mesosphere/dcos-101` Docker 容器中运行它。请随时查看 [DOCKERFILE](https://github.com/joerg84/dcos-101/blob/master/app1/DOCKERFILE)，它用于创建 `mesosphere/dcos-101` 图像。
  * 看看[应用定义](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json)。应用定义是 Marathon 用于部署和管理应用程序的配置。此应用定义将下载 python 脚本，然后在 `mesosphere/dcos-101` Docker 容器内运行它。
  * 使用应用定义将 app1 添加到 Marathon：`dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json`
3. 检查 app1 是否正在运行：
    * 通过查看所有 DC/OS 任务: `dcos task`。在这里，您应该查看此任务当前所处的状态，可能是正在分段或正在运行。
    * 通过查看所有 Marathon 应用程序：`dcos marathon app list`。
    * 通过检查日志：`dcos task log app1`。在这里，您应该看到 app1 在哪个节点和端口上运行以及显示 Redis 中密匙数的应用程序输出。不同运行之间甚至在应用程序生命周期内，节点和端口可能会有所不同，具体取决于群集中的事件。

# 结果
您已使用 Marathon 在 Docker 容器内部部署了第一个应用程序。
您验证了应用程序正在运行并已与先前部署的 Redis 服务成功连接。

# 深入研究
您刚刚直接使用 [Marathon] 部署了第一个应用程序(https://mesosphere.github.io/marathon/)。另请注意，Redis 服务本身是通过 Marathon 运行的。
Marathon 被称为 DC/OS 的初始化系统，因为其主要工作是支持长时间运行服务。
Marathon 还允许扩展或卸载应用程序。
除 DC/OS GUI 以外，还有多种选项可以在 Marathon 上部署和维护应用程序：

* DC/OS CLI：您刚刚使用此选项部署了应用程序。若要获得有关 Marathon CLI 的更多信息 ，请使用 `dcos marathon app --help`。
* HTTP 端点：Marathon 还附带广泛的 [REST API](http://mesosphere.github.io/marathon/api-console/index.html)
