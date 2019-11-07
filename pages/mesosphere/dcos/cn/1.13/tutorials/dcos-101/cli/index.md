---
layout: layout.pug
excerpt: 安装命令行界面来执行日常任务（第 2 部分）
title: 安装命令行界面
navigationTitle: 安装命令行界面
menuWeight: 2
---
DC/OS 命令行界面（CLI）为您提供一种方便的方式来执行管理任务、检索组件和操作信息以及监控群集状态和活动。

虽然您可以使用基于 DC/OS Web 的控制台以交互方式执行许多相同的任务，或者使用对 DC/OS 应用程序编程接口 (API) 的调用以编程方式执行许多任务，但大多数群集操作员都以交互式或脚本中的方式使用命令行程序来管理大部分常见群集操作和群集相关的活动。

# 开始之前
在开始本教程前，您应验证以下内容：
- 您必须能够从托管 CLI 的计算机上访问带有至少一个管理节点和三个代理节点的配置正确的 DC/OS 群集。
- 您必须拥有具有本地操作系统管理权限的帐户。
- 您必须能够在托管 CLI 的计算机上打开命令行 shell。
- 您必须能够在托管 CLI 的计算机上运行客户端 URL (`cURL`) 程序。
- 在开始安装之前，您必须禁用任何安全或防病毒软件（仅 Windows）。

# 学习目的
完成本教程，您将学习到：
- 如何从 DC/OS 基于 Web 管理控制台下载 DC/OS 命令行界面 (CLI)。
- 如何直接从包资源库安装 DC/OS 命令行界面 (CLI)
- 如何使用 DC/OS CLI 从本地计算机上的终端 shell 连接到群集。
- 如何使用 CLI 命令执行常见管理任务。

# 安装 DC/OS CLI
1. 在要安装 DC/OS 命令行界面 (CLI) 的计算机上打开终端 shell。

1. 打开 Web 浏览器并导航到 DC/OS 基于 Web 控制台的 URL。

1. 单击 DC/OS 基于 Web 控制台右上角的群集名称菜单。

    ![打开群集弹出窗口](/mesosphere/dcos/1.13/img/tutorial-cluster-menu.png)

1. 从群集名称菜单中 ，选择 **安装 CLI**。

1. 单击要安装 CLI 的计算机的相应操作系统选项卡。

1. 遵循操作系统选项卡上显示的说明。

    例如，对于 Linux 或 MacOS，复制“安装 CLI”对话框中显示的代码片断并将其粘贴到终端 shell 中，以将 CLI 包下载到本地计算机。

1. 在本地主机计算机上键入管理帐户的密码。

1. 键入群集管理帐户的用户名和密码。

    群集的默认管理用户名为 `bootstrapuser`。帐户的默认密码为 `deleteme`。

1. 通过运行以下命令来验证您可以从命令行连接到群集：

    ```bash
    dcos cluster list
    ```

    如果群集可用且 CLI 安装成功完成，那么命令会返回与以下内容类似的群集基本信息：

    ```bash
    NAME                        ID                    STATUS    VERSION                                       URL                                       
    *  lgunn-sidebet  351c8aa0-880e-459a-9483-cd6a4ab4391e  AVAILABLE  1.13.0   http://lgunn-sid-elasticl-1lqsarfasaw88-301095172.us-west-2.elb.amazonaws.com
    ``` 
1. 关闭 DC/OS 基于 Web 管理控制台中的“安装 CLI”对话框。

# 验证登录凭据
您可以通过运行以下命令验证帐户是否有权连接到群集：

```bash
dcos auth login
```

最初，只有默认群集管理帐户才有权连接到群集。当您授权其他用户访问群集并替换默认群集管理帐户和密码时，您可以通过运行 `dcos auth login` 命令来验证其对群集的访问。

# 验证群集上运行的服务
安装 DC/OS CLI 之后，有许多命令可供您用于检查群集的状态并执行常规管理任务。

例如，您可以通过运行以下命令来检查运行服务列表：

```bash
dcos service
```

如果您刚刚完成了前一个教程，且尚未安装任何其他服务，此命令会返回类似于以下内容的信息：

```
NAME          HOST    ACTIVE  TASKS  CPU  MEM  DISK  ID                                         
marathon   10.0.4.82   True     0    0.0  0.0  0.0   ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-0001  
metronome  10.0.4.82   True     0    0.0  0.0  0.0   ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-0000  
```

这些服务作为初始 DC/OS 安装的一部分进行安装和启动：
- `marathon` 服务是 DC/OS 群集的基本组件，为 DC/OS 核心提供初始化服务。
- `metronome` 服务提供类似于 DC/OS 群集的 `cron` 程序的基本调度和作业管理。

在您部署其他服务时，您可以使用 `dcos service` 命令来验证这些服务的状态。

# 检查已连接节点的状态
您可以使用 DC/OS 命令行界面来检查已连接节点的状态并返回日志信息。作为搜索 DC/OS 群集的起点，您可能需要运行 `dcos node list` 命令。

```bash
dcos node list
```

此命令返回有关群集中已连接代理和管理节点的基本信息。例如：

```bash
    HOSTNAME         IP      PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       
  10.0.2.246     10.0.2.246                 ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S1  agent            aws/us-west-2  aws/us-west-2a  
  10.0.5.193     10.0.5.193  52.24.8.165    ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S0  agent            aws/us-west-2  aws/us-west-2a  
  master.mesos.  10.0.4.82   34.220.80.239  ec31ddcf-1e31-4556-9f3b-9a56e172b6ef     master (leader)  aws/us-west-2  aws/us-west-2a  
  ```

您还可能希望搜索单个节点的日志。例如，您可以通过运行命令 `dcos node log --leader` 来检索有关当前管理节点领导者的详细信息。

此命令将返回记录在领导管理节点的日志消息中的信息。记录的消息为此示例条目提供信息：

```bash
2019-05-27 18:47:51 UTCbouncer.sh [2847]: 10.0.4.82 [27/May/2019:18:47:51 +0000] "GET /acs/api/v1/internal/policyquery?rid=dcos:adminrouter:ops:mesos&uid=dcos_history_service&action=full HTTP/1.0" 200 22 "-" "Master Admin Router" (0.001926 s)
```

同样，您可以通过运行类似于以下内容的命令来检索有关特定节点的详细信息：

```bash
dcos node log --mesos-id ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S1
``` 

在本示例中，`ec31ddcf-1e31-4556-9f3b-9a56e172b6ef-S1` 是代理标识符 (ID)。您可以使用 `dcos node list` 命令查找代理标识符，然后检索代理的日志信息。然后，您可以使用返回的信息来跟踪代理活动、分析操作或排除潜在问题。

# 获取 CLI 程序的使用信息
要浏览通过 DC/OS CLI 选项可用的信息类型，请输入 `dcos help` 命令。此帮助选项汇总了可用的顶级命令。例如：
```
Usage:
  dcos [command]

Commands:
  auth
      Authenticate to DC/OS cluster
  backup
      Access DC/OS backup functionality
  cluster
      Manage your DC/OS clusters
  config
      Manage the DC/OS configuration file
  help
      Help about any command
  job
      Deploy and manage jobs in DC/OS
  license
      Manage your DC/OS licenses
  marathon
      Deploy and manage applications to DC/OS
  node
      View DC/OS node information
  package
      Install and manage DC/OS software packages
  plugin
      Manage CLI plugins
  security
      DC/OS security related commands
  service
      Manage DC/OS services
  task
      Manage DC/OS tasks

Options:
  --version
      Print version information
  -v, -vv
      Output verbosity (verbose or very verbose)
  -h, --help
      Show usage help
```

然后，您可以使用单个命令的 `--help` 选项来查看有关特定命令的使用信息。例如，您可以运行 `dcos node --help` 来查看有关特定 `dcos node` 命令和参数的信息。有关使用 DC/OS 命令行界面的更多信息，请参阅 [CLI 文档](/mesosphere/dcos/1.13/cli/)。

# 后续步骤
祝贺您！您已使用 DC/OS CLI 成功连接到您的群集，可以开始使用 DC/OS 命令行界面来查看某些可用的任务和信息。

接下来的教程探讨可以通过 DC/OS 基于 Web 的管理控制台或命令行界面执行的其他入门任务：
- [从包资源库安装第一个服务](../first-package/)
- [部署您的第一个示例应用程序]](../first-app/)
- [发现已部署服务]../service-discovery/)

# 相关主题
您已经使用了 DC/OS 架构中的几个核心组件，包括 Mesos 内核，Marathon 和 Metronome。有关这些 DC/OS 组件以及其纳入 DC/OS 平台中的位置或功能和服务的更多信息，请参阅主要 DC/OS [文档](../../../overview/architecture/components/)：
- [Marathon](../../../overview/architecture/components/#marathon) 启动并监控 DC/OS 应用程序和服务。
- Apache [Mesos](../../../overview/architecture/components/#apache-mesos) 是 DC/OS 的核心，负责低级别任务的维护。
- [Mesos DNS](../../../overview/architecture/components/#mesos-dns) 在群集内提供服务发现。
- [DC/OS Net](../../../overview/architecture/components/#dns-forwarder) 提供网络服务，例如，DC/OS 内部第 4 层负载均衡器。
- [Admin Router](../../../overview/architecture/components/#admin-router) 是一种开源 NGINX 配置，为 DC/OS 服务提供中央身份验证和代理。
- [包资源库](../../../overview/architecture/components/#package-management) 是存储 DC/OS 服务的包资源库，例如，Apache Spark 或 Apache Cassandra，您可以直接从 DC/OS 基于 Web 的控制台或命令行界面 (CLI) 将其安装到集群上。
