---
layout: layout.pug
title: 方案 1
navigationTitle: 方案 1
excerpt: 教程 - 资源分配
menuWeight: 1
---

<a name=c1></a>

## 方案 1：资源分配

### 设置

对于第一个方案，请按如下方式部署[此应用定义](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-scaling1.json)：

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-scaling1.json
```

使用 DC/OS Web 界面检查应用程序状态，您应该看到如下内容：

![Web 界面图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-14.png)

图 1. 显示应用程序状态的 DC/OS Web 界面

应用程序的状态最可能是“等待”，然后是一些千分位数“x/1000”。“等待”是指整体应用状态和数字；“x”表示已成功部署多少个实例（本示例中为 6）。

您也可以从 CLI 检查此状态：

```bash
$ dcos marathon app list
```

会在响应中产生以下输出：

```bash
ID MEM CPUS TASKS HEALTH DEPLOYMENT WAITING CONTAINER CMD

/app-scaling-1 128 1 6/1000 --- scale True mesos sleep 10000
```

或者，如果您想查看所有正在进行的部署，请输入：

```bash
$ dcos marathon deployment list
```

看到如下内容：

```bash
APP             POD  ACTION  PROGRESS  ID

/app-scaling-1  -    scale     1/2     c51af187-dd74-4321-bb38-49e6d224f4c8
```

现在我们知道应用程序的某些 (6/1000) 实例已成功部署，但整体部署状态为“等待”。但这是什么意思？

### 解决方法

“等待”状态表示 DC/OS（或更准确地说是 Marathon）正在等待合适的资源提供。这似乎是一个部署问题，我们应该先检查可用的资源。

如果我们查看 DC/OS 仪表盘，我们应该看到与以下相似的相当高的 CPU 分配（当然，确切的百分比取决于您的集群）：

![CPU 分配图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-20.png)

图 2. DC/OS 资源分配显示

由于我们还没有 100% 分配，但我们仍在等待部署，因此正在发生一些有趣的事情。让我们来看看 DC/OS Web 界面调试视图中的最新资源提供。

![Web 界面相关实例图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-21.png)

图 3. 最新资源提供

我们可以看到，没有匹配的 CPU 资源。但同样，整体 CPU 分配仅为 75%。更令人费解的是，当我们进一步查看以下“详细信息”部分时，我们会看到不同主机的最新提供符合我们应用程序的资源要求。所以，举例而言，来自主机 `10.0.0.96` 的第一个邀约与角色、约束（此 `app-definition` 中不存在）、内存、磁盘、端口资源要求匹配，--- 但 CPU 资源要求不合格。在此之前的提供似乎应该符合资源要求。**因此，尽管看起来我们有足够的 CPU 资源可用，但应用程序似乎只因为这个原因而失败**。

让我们更加仔细地看一看“详细信息”。

![详细信息图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-22.png)

图 4. 资源分配详细信息

有意思。据此，其余一些 CPU 资源分配给了不同的 [Mesos 资源角色](http://mesos.apache.org/documentation/latest/roles/)，因此，我们的应用程序无法使用（它以角色“*”运行，默认角色）。

要检查不同资源的角色，让我们[看看 state-summary 端点](/cn/1.11/tutorials/dcos-debug/tools/#state-summary)，其访问地址为`https://<master-ip>/mesos/state-summary`。

该端点将为我们提供相当长的 json 输出，所以使用 jq 使输出可读非常有用：

```bash
curl -skSL

-X GET

-H "Authorization: token=$(dcos config show core.dcos_acs_token)"

-H "Content-Type: application/json"

"$(dcos config show core.dcos_url)/mesos/state-summary" |

jq '.'
```

查看代理程序信息时，我们可以看到两种不同类型的代理程序。

![集群信息图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-19.png)

图 5. 集群信息

第一种类型没有可用的 CPU 资源，也没有保留资源。当然，如果您在这些练习之前在集群上运行了其他工作负载，这可能会有所不同。请注意，这些未保留资源对应于默认角色“*” --- 我们试图部署任务的角色。

第二种类型有未使用的 CPU 资源，但这些资源在“slave_public”角色中保留。

我们现在知道**问题在于整个集群中所需资源角色中没有足够的资源**。作为一种解决方案，我们可以减少应用程序（1000 个实例似乎过多），或者我们需要向集群添加更多资源。

### 一般规律

##### 当您的应用程序框架（例如 Marathon）不接受资源邀约时，请检查相应资源角色中是否有足够的可用资源。

这是一个简单的方案，CPU 资源太少。通常，资源问题更可能是由更复杂的因素引起的 - 如未正确配置的[端口资源](/cn/1.11/deploying-services/service-ports/)或[布局约束](/cn/1.11/deploying-services/marathon-constraints/)。尽管如此，这种一般工作流模式仍然适用。

### 清除

使用以下命令从集群中删除应用程序：

`$ dcos marathon app remove /app-scaling-1`
