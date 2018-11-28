---
layout: layout.pug
excerpt: 了解基于队列长度的 microscaling
title: 教程 - Microscaling 
navigationTitle: Microscaling
menuWeight: 2
---


<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>重要信息：</b>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的是为了演示功能，可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您必须进行调整、验证和测试。</td> </tr> </table>

本教程指导您在 DC/OS 集群上设置 [Microscaling Systems][2] 的 Microscaling 演示。


[Microscaling][1] 调整计算集群内运行的任务的平衡。
这允许您的基础架构
从较低到较高优先级任务自动重新分配资源，并在几秒钟内响应需求变化。
Microscaling 可监控较高优先级任务是否符合性能目标。在本教程中，性能目标是维护配置队列值的长度。优先级较高的任务在不满足目标时被增容，在超出目标时被减容。优先级较低的任务可以使用备用资源。

**时间估计**：

如果您已设置 [先决条件](#prerequisites)，则可以在大约 10-15 分钟内运行 microscaling 演示。

**范围**：

在本教程中，microscaling 可根据 Azure 存储队列中的项目数量调整两个任务（一个高优先级和一个后台）之间的平衡。

![microscaling-queue.png](/cn/1.11/img/microscaling-queue.png)
 
 图 1. - Microscaling 队列

演示创建了四个作为 Docker 容器运行的 Marathon 应用程序。

* **Producer**实例将项目添加到队列中。Producer 越多，队列的填充速度就越快。我们在启动时启动了 3 个Producer，您可以使用 Marathon UI 手动扩展它们。
* **Consumer**实例从队列中删除项目，并由 Microscaling Engine 进行扩展。
* **Remainder**是后台任务。任何备用容量都用于此后台任务。您可以使用 Marathon UI 更改 Docker 镜像以使用您自己的镜像。
* **Microscaling** 是监控队列长度的引擎，可以扩展 Consumer 和 Remainder 任务。它还将数据发送到我们的 Microscaling-in-a-Box 网站，以便您可以看到正在发生的事情。

# <a name="prerequisites"></a>先决条件

* [Microsoft Azure][3] 帐户。您的 DC/OS 集群可以在任何地方运行（不必在 Azure 上运行），
但演示使用 Azure 存储队列。如果您还没有帐户，可以获得[免费试用版][4]。
* [正在运行的 DC/OS 集群][5]。如果您还没有集群，您可以遵循[在 Azure 上设置 DC/OS 集群的说明][6]。
* Marathon API 地址。如果您在端口 80 上设置 SSH 隧道到 Marathon 管理节点，则可以在 `http://localhost/marathon` 上访问 Marathon API。
* [Ruby][8] 在您的本地机器上运行演示脚本。

# 设置 Azure 存储帐户

* 登录 [Azure 门户][9]。
* 导航至新建 -> 数据 + 存储 -> 存储帐户。
* 使用以下设置创建存储帐户：

![microscaling-azure-storage.png](/cn/1.11/img/microscaling-azure-storage.png)

图 2. - Microscaling Azure 存储帐户

* **名称** - 在所有 Azure 存储帐户中，该名称必须是全局唯一的。记下这一点 - 您稍后将使用它作为环境变量 `AZURE_STORAGE_ACCOUNT_NAME`。
* **复制** - 为队列选择本地冗余存储。
* **资源组** - 为队列创建新的资源组。

在创建存储帐户后，导航至设置 -> 访问验证序号并记下您的访问验证序号。稍后您将使用它作为环境变量 `AZURE_STORAGE_ACCOUNT_KEY`。

# 设置 Microscaling-in-a-box

* 如果您还没有帐户，请转到 [Microscaling-in-a-box][10] 站点并注册帐户。
* 在步骤 1 中，选择 Mesos/Marathon 选项

![microscaling-step-1.png](/cn/1.11/img/microscaling-step-1.png)

图 3. 选择 Mesos/Marathon 选项

* 跳过步骤 2 和 3 以使用默认值。
* 导航至步骤 4（运行），并找到您的用户 ID 以及我们在演示中使用的队列的默认值。您稍后将使用这些值作为环境变量 `MSS_USER_ID` 和 `AZURE_STORAGE_QUEUE_NAME`。

![microscaling-step-4.png](/cn/1.11/img/microscaling-step-4.png)

图 4. 用户 ID 和队列名称

# 获取 microscaling 脚本

我们准备了一些脚本，用于配置和启动 Marathon 中的四个应用程序。转到本地机器上的终端，并使用以下命令获取这些脚本。

``` bash
git clone http://github.com/microscaling/queue-demo
```

进入 queue-demo 目录。

``` bash
cd queue-demo
```

# 运行 microscaling 安装脚本

设置以下环境变量

``` bash
export AZURE_STORAGE_ACCOUNT_NAME=<storage account name>
export AZURE_STORAGE_ACCOUNT_KEY=<storage account key>
export AZURE_STORAGE_QUEUE_NAME=<queue name>
export MSS_USER_ID=<user ID>
export MSS_MARATHON_API=http://localhost/marathon
```
现在您已准备好运行演示：
``` bash
./marathon-install
```

此脚本启动所有四个任务。您可以在 DC/OS Web 界面中查看这些内容。

在 Marathon 启动应用程序后，结果将开始出现在 Microscaling-in-a-Box UI 中。您将看到 Microscaling Engine 调整 consumer 和 remainder 容器，以维持目标队列长度。

![microscaling-chart-ui.png](/cn/1.11/img/microscaling-chart-ui.png)

图 5. Microscaling-in-a-box 用户界面

您可以使用 DC/OS Web 界面来增加或减少 Producer 任务数量，并查看 Microscaling 如何响应以控制队列长度。

# 清除

## 卸载 Marathon 应用程序

您可以使用 `marathon-uninstall` 命令从集群中删除演示应用程序。（此命令要求如上所述设置 `MSS_MARATHON_API` 环境变量。）

``` bash
./marathon-uninstall
```

## 删除 Azure 资源

完成演示后，您应删除 Azure 资源，以免收费。

* 登录 [Azure 门户][9]。
* 从左侧菜单中选择资源组。
* 找到并删除您为 Azure 队列创建的资源组。
* 如果您为此演示创建了 ACS 集群，则还需要删除该集群的资源组。

# 后续步骤

- 在运行演示之前，尝试修改 Microscaling-in-a-Box 步骤 3 中的一些配置设置。您需要停止任务（手动或通过运行 `./marathon-uninstall`）并使用 `./marathon-install` 重启它们以获取配置更改。
- 查看 `marathon-apps` 目录中包含的 JSON 文件中每个 Marathon 应用程序的设置。
- 这是 [microscaling engine 代码][11]。
- 在 [Microscaling Systems 网站][2] 上查找有关 microscaling 的更多信息。

[1]:http://microscaling.com
[2]:http://microscaling.com
[3]:http://azure.microsoft.com
[4]:https://azure.microsoft.com/en-us/pricing/free-trial/
[5]: /1.11/installing/
[6]:https://azure.microsoft.com/en-us/documentation/articles/container-service-deployment/

[8]:https://www.ruby-lang.org/en/documentation/installation/
[9]:http://portal.azure.com
[10]:http://app.microscaling.com
[11]:http://github.com/microscaling/microscaling
