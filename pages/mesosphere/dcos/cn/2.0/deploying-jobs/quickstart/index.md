---
layout: layout.pug
navigationTitle: 创建作业
title: 创建作业
menuWeight: 10
excerpt: 使用 UI、CLI 或 API 创建和管理作业
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

您可以通过以下任何方式创建和管理 DC/OS 群集的作业：
- 使用 [DC/OS UI](#managing-jobs) 交互式
- 使用 DC/OS [CLI](#cli) 交互式或编程式
- 直接通过调用用于作业相关操作的 DC/OS 应用程序编程接口 ([API](#jobs-api)

DC/OS UI 仅提供通过 `dcos job` CLI 和作业 API 提供的作业相关功能子集的访问权限。对于更多高级作业配置和活动，请使用 CLI  [`dcos job`](/mesosphere/dcos/cn/2.0/cli/command-reference/dcos-job/) 命令或 [作业 API](/mesosphere/dcos/cn/2.0/deploying-jobs/quickstart/#jobs-api)。

DC/OS 应用程序编程接口 (API) 提供可通过 DC/OS UI 和 CLI 访问的基础功能。在大多数情况下，只有将其与自定义程序或自动化脚本集成时，才能直接使用 API。

<a name="managing-jobs"></a>

# 使用 DC/OS UI 管理作业
您可以通过 DC/OS UI 交互式地管理最常见的作业相关活动。例如，您可以直接从 UI 中的 **作业** 选项卡添加、修改、运行和移除作业。

![Jobs](/mesosphere/dcos/2.0/img/GUI-Jobs-Main.png)

图 1 -“作业”选项卡和作业列表

### 分画面屏幕

请注意，在所有 **作业** UI 配置屏幕中，您可以选择单独查看 UI，或在 UI 和 **JSON 编辑器** 窗口之间分割屏幕。在对 **作业** 配置选项的以下讨论中，我们将向您介绍分画面屏幕，以便您能看到它们如何共同工作的，但您也可以始终选择自己使用 UI。要调用 **JSON 编辑器**，请单击 **提交** 按钮旁边的 **JSON 编辑器** 切换开关。

<!-- Where are JSON files created here stored? Can that location be configured? -->

对任一界面作出的编辑都会立即反映在另一个界面中。例如，如果您在左侧 UI 的任何字段中输入一个值，它将被添加到右侧的 JSON 文件中。

要消除 **JSON 编辑器** 屏幕，请再次单击切换按钮。

![分画面屏幕](/mesosphere/dcos/2.0/img/GUI-Jobs-Split-Screen.png)

图 2 - 分画面屏幕

## 添加作业

在 DC/OS UI 中创建作业的方法有两种。

- 如果未配置任何作业，“作业”屏幕将包含一个指出您没有活动作业的通知，并显示 **创建作业**按钮。

![无活动作业](/mesosphere/dcos/2.0/img/GUI-Jobs-No-Active-Jobs.png)

图 3 -“创建作业”按钮

- 无论您是否有活动的作业，您始终都可以单击右上角的 **+** 标志来创建新的作业。

![加号](/mesosphere/dcos/2.0/img/GUI-Jobs-Create-a-Job.png)

图 4 - 点击加号

将显示新作业的配置屏幕。请注意，此屏幕与用于编辑作业的屏幕相同。

![作业配置屏幕](/mesosphere/dcos/2.0/img/GUI-Jobs-New-Job.png)

图 5 - 作业配置屏幕

## 配置作业

您将在屏幕的左侧看到 8 个选项卡。这些可帮助您命名、配置和管理作业：

| 名称 | 说明 |
|------|--------------|
| [常规](#general) | 设置最基本的作业设置，如作业标识符、CPU、内存和磁盘要求。|
| [容器运行时](#container-runtime) | 指定作业运行是否使用通用容器运行时或 Docker 引擎。 |
| [计划](#schedule) | 为您的作业设置计划。您可以使用 `cron` 格式。 |
| [环境](#environment) | 指定要附加到每个作业实例的环境变量。|
| [卷](#volumes) | 通过设置持久卷来配置有状态的作业。|
| [放置](#placement) | 指定分域和分区中代理节点的放置以获得高可用性，或者将能力扩展到新分域。|
| [运行配置](#run-configuration) | 作业的高级设置。 |
| [密钥](#secrets) | 设置一个密钥存储库，以保护私钥、API 令牌等重要值。 |
    
有关每个配置屏幕参数和值的详细信息，请参阅 [作业](/mesosphere/dcos/cn/2.0/gui/jobs/) 文档。

### General 常规

选择 **常规**，以编辑最基本的作业设置，如作业标识符、CPU、内存和磁盘要求。

![Jobs](/mesosphere/dcos/2.0/img/GUI-Jobs-General.png)

图 6 - 常规配置选项卡

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/cn/2.0/gui/jobs/#general/)文档中找到。

<!-- * **作业 ID** - 定义新作业的唯一标识符。作业 ID 为必填字段。您还可以使用此设置管理作业操作。
* **描述** - 提供新作业的可选描述。
* **CPU** - 指定作业所需的 CPU 内核数。所有作业都必须填写此字段。
* **Mem** - 指定作业所需的内存大小，以 MB 为单位。所有作业都必须填写此字段。
* **磁盘** - 指定作业所需的磁盘空间大小，以 MB 为单位。所有作业都必须填写此字段。
* **GPU** - 指定分配用于处理作业的 GPU（图形处理单元）内核数。此字段仅适用于在节点上运行的作业，该节点配置为使用 GPU（图形处理单元）内核和任务，而该 GPU 内核和任务使用 DC/OS [通用容器运行时](/mesosphere/dcos/cn/2.0/deploying-services/containerizers/ucr/) 容器启动。GPU 资源支持对于 Docker 容器或镜像不可用。

选择相应作业类型，以运行一个或多个特定命令或 Docker 容器镜像。
* 选择 **命令专用**，指定您希望新作业执行的一个或多个命令。

    如果选择 **命令专用**，则必须指定要执行的命令或命令参数。执行指定命令时，命令 `/bin/sh -c job.cmd` 会自动将其封装起来。您必须在要执行的命令中包含 `cmd` 或 `args`。在同一作业中同时提供 `cmd` 和 `args` 则无效。

    如果选择 **命令专用** 选项，则“容器运行时”设置都不适用于该作业。您可以通过定义 **计划** 设置、添加高级 **运行配置** 选项或单击 **提交** 继续创建作业。

* 选择 **容器镜像**，为新作业指定容器镜像。如果选择此选项，请键入要运行的容器镜像的名称。例如，您可以输入容器镜像名称，例如 `ubuntu:14.04`。然后，您可以使用 **命令** 字段指定运行新作业的容器中可用的命令和任何其他运行时参数。

    如果选择 **容器镜像** 选项，则可以通过以下方式继续创建作业：
    - 为作业配置 **容器运行时**设置。
    - 定义作业 **计划**，如适用。
    - 添加高级 **运行配置** 选项，如适用。
    - 单击 **提交**。-->

### 容器运行时

选择 **容器运行时**，指定是否使用通用容器运行时或 Docker 引擎运行新作业的容器。我们支持 **通用容器运行时 (UCR)** 和 **Docker 引擎**。

### UCR

**通用容器运行时** 使用本机 Mesos 引擎，并支持 GPU 资源。这是建议的选择。

![Jobs](/mesosphere/dcos/2.0/img/GUI-Jobs-Container-Runtime.png)

图 7 - **作业 > 容器运行时** 选项卡

### Docker 引擎

**Docker 引擎**是 Docker 的容器运行时。它需要镜像，且不支持 GPU 资源。

![Jobs](/mesosphere/dcos/2.0/img/GUI-Jobs-Container-Runtime-2.png)

图 8 - **作业 > 容器运行时 > Docker 引擎** 选项卡

<!-- * 如果选择 **通用容器运行时**，则可以选择“启动时强制拉取镜像”，以在启动每个实例之前自动拉取最新镜像。

* 如果选择 **Docker 引擎**，则可以选择以下其他选项：
    - 选择 **启动时强制拉取镜像**，以在启动每个实例之前自动拉取最新镜像。
    - 选择 **授予运行时权限**，以在特权模式下运行指定的 Docker 镜像。
    - 单击 **添加参数**，为新作业指定其他 Docker 运行时参数名称和值，如适用。对于希望包含的每个参数名称和值，您可以通过单击 **添加参数** 添加多个参数名称和对应值。
    - 单击 **添加自变量**，为新作业指定其他命令行自变量，如适用。对于希望包含的每个自变量，您可以通过单击 **添加自变量** 添加多个自变量。 ->

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/2.0/gui/jobs/#container-runtime/)文档中找到。

### 计划

可以使用 `cron` 格式设置带有时间表的作业。选择 **计划**，以指定作业运行的时间表。

![计划](/mesosphere/dcos/2.0/img/GUI-Jobs-Schedule.png)

图 9 - **作业 > 计划** 选项卡

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/cn/2.0/gui/jobs/#schedule/)文档中找到。

定义计划之后，您可以通过选择或取消选择 **启用计划** 选项来激活或停用。提交新的作业定义后，您还可以在需要时修改或删除计划。

### 环境

选择 **环境** 以配置要连接到启动的作业的每个实例的任何环境值。

![环境](/mesosphere/dcos/2.0/img/GUI-Jobs-Environment.png)

图 10 - **作业 > 环境** 选项卡

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/cn/2.0/gui/jobs/#environment/)文档中找到。


### 卷

选择 **卷** 选项卡，通过配置持久卷来创建有状态的作业。持久卷允许重启实例，而不会丢失数据。

![卷](/mesosphere/dcos/2.0/img/GUI-Jobs-Volumes.png)

图 11 - **作业 > 卷** 选项卡

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/cn/2.0/gui/jobs/#volumes/)文档中找到。

### 放置

您可以配置分域和区中代理节点的放置以实现高可用性，或在必要时将能力扩展到新分域。

![放置](/mesosphere/dcos/2.0/img/GUI-Jobs-Placement.png)

图 12 - **作业 > 放置** 选项卡

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/cn/2.0/gui/jobs/#placement/)文档中找到。

### 运行配置

选择 **运行配置**，为新作业指定高级设置。

![运行配置](/mesosphere/dcos/2.0/img/GUI-Jobs-Run-Configuration.png)

图 13 - **作业 > 运行配置** 选项卡


<!-- 1. 单击 **运行配置**，为新作业指定高级设置。

    - 设置 **最大启动延迟**，以指定由计划的作业运行或用户手动启动作业后，等待作业开始运行的最大秒数。如果作业在允许的最大秒数内未开始运行，作业将被中止。

    - 设置 **结束宽限期**，以配置在发送终止任务的信号时从 `SIGTERM` 升级到 `SIGKILL` 的间隔秒数。在此宽限期内，任务应在收到 SIGTERM 后立即执行有序关闭。

    - 设置 **用户名** 以标识运行代理上任务的用户帐户。

    - 选择 **添加工件**，以提供一个或多个您希望传递给提取程序模块并在运行时解析的工件 URI，以及您希望为每个 URI 执行的操作：执行、提取或缓存。

        ![添加作业工件 URI 和操作](/mesosphere/dcos/2.0/img/job-artifacts-uri.png)

        图 2. 添加工件 URI 和操作

    - 选择 **重新启动策略**，以确定作业失败时要采取的步骤。
    
        - 如果您不想尝试重新启动失败的作业，可以选择 **从不**。
        
        - 如果选择 **失效**，则可以使用 **坚持尝试时间** 字段设置尝试重新启动作业的时间限制。例如，如果希望在等待 30 秒后尝试重新启动作业，请将 **坚持尝试时间** 设置为 30。如果未为“坚持尝试时间”设置任何值，DC/OS 将继续尝试无限期地重新启动失败的作业。

    - 单击 **添加标签**，以指定希望作为元数据附加到新作业的 **键** 和 **值**。然后，您可以使用作业标签来筛选或公开已标记作业的信息。对于希望包括的每个名称/值对，您可以通过单击 **添加标签** 添加多个标签键名称/值对。有关使用标签的更多信息，请参阅 [标记任务和作业](/mesosphere/dcos/cn/2.0/tutorials/task-labels/)。-->

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/cn/2.0/gui/jobs/#run-configuration/)文档中找到。


### 密钥

选择 {{ model.productName }} 密钥存储库，以保护私钥、API 令牌和数据库密码等重要值。

![Secrets](/mesosphere/dcos/2.0/img/job-artifacts-uri.png)

图 14 - 密钥选项卡

此选项卡的参数和允许的值可在 UI 的 [作业] (/mesosphere/dcos/cn/2.0/gui/jobs/#secrets/)文档中找到。

## 提交

1. 单击 **提交** 以创建作业。

1. 通过单击 **作业**，验证您是否已添加新作业。

    ![作业列表](/mesosphere/dcos/2.0/img/job-list-scheduled.png)

    图 15. 作业列表

## 向作业组添加作业
您可以将作业添加到现有的作业组，或在创建作业时创建新的作业组。在作业 ID 中使用句点可将作业嵌套在一个组中。例如，如果您使用作业 ID `marketing.myjob` 来添加作业，可在 `marketing` 作业组中创建新的 `myjob`。在 DC/OS Enterprise 中，您可以使用作业组实现细粒度用户访问。

如需更多关于通过作业组控制作业访问权限的信息，请参阅 [授予对作业的访问权限](/mesosphere/dcos/cn/2.0/deploying-jobs/job-groups/)。

## 查看、修改或删除特定作业
您可以查看和修改与作业相关的信息，包括通过 DC/OS UI 交互式运行历史和配置设置的详细信息。从 **作业** 选项卡，单击作业名称。然后您可以使用右上角的菜单编辑、运行、禁用或删除选定的作业。

![查看和修改作业详细信息](/mesosphere/dcos/2.0/img/job-menu-options.png)

图 16. 查看和修改作业详细信息

当作业正在运行时，您可以单击作业实例深入查看 **详细信息**、**文件** 和 **日志** 数据。

您可以看到 **编辑作业** 屏幕包含与 **新作业** 屏幕相同的配置选项卡：

![Jobs](/mesosphere/dcos/2.0/img/GUI-Jobs-General.png)

图 17 - **编辑作业**屏幕上的一般配置选项卡

<a name="cli"></a>

# 使用 DC/OS CLI 管理作业
您可以使用 `dcos job` 命令从 DC/OS CLI 中创建和管理作业。若要查看带有使用信息的可用命令的完整列表，请运行 `dcos job --help` 或查阅 [CLI 文档](/mesosphere/dcos/cn/2.0/cli/command-reference/dcos-job/)。

<a name="cli-add-job"></a>

## 为新作业创建 JSON 文件
1. 在文本编辑器中打开一个新文件，以 JSON 格式创建一个作业文件。

1. 在新文件中，指定定义作业所需的基本参数，包括以下内容：
    - 用于管理该作业的作业 `id`
    - 要运行的特定命令
    - CPU、内存和磁盘要求
    - 作业计划

    例如，新作业的 JSON 文件可能与此类似：

    ```json
    {
        "id": "myjob",
        "description": "A job that sleeps regularly",
        "run": {
            "cmd": "sleep 20000",
            "cpus": 0.01,
            "mem": 32,
            "disk": 0
        },
        "schedules": [
            {
                "id": "sleep-schedule",
                "enabled": true,
                "cron": "20 0 * * *",
                "concurrencyPolicy": "ALLOW"
            }
        ]
    }
    ```

1. 使用易于识别的文件名保存新作业的 JSON 文件。例如，您可以将作业信息保存为 `mysleepjob.json`。

1. 通过运行类似于以下内容的命令来添加作业：

    ```bash
    dcos job add <myjob>.json
    ```
    
    例如：

    ```bash
    dcos job add mysleepjob.json
    ```
1. 通过运行类似于以下内容的命令来验证是否已添加新作业：

    ```bash
    dcos job list
    ```
    
    命令显示类似于以下内容的作业列表：
    
    ```bash
        ID       STATUS    LAST RUN  
    mysleepjob  Scheduled  N/A       
    mypingjob   Running    N/A       
    ```

## 为已计划的作业设置并发策略
如果使用计划来启动某个作业，则可以定义该作业的并发策略。并发策略确定当已经有作业实例在运行时是否触发新的作业运行实例。

例如，假设您有一个计划于每天凌晨 3:00 启动的作业，并且您已将该作业的并发策略设置为 FORBID。如果该作业的实例已经在凌晨 3:00 点运行，无论是因为之前触发的作业运行仍处于活动状态，还是已经在计划外手动触发，计划启动时间将不会触发新作业运行。如果在下一个计划启动时间没有作业在运行，新的作业实例将按计划启动并运行。

如果希望允许在运行同一作业的其他实例时触发计划的作业，您可以将 `concurrencyPolicy` 设置为 ALLOW。

## 创建计划专用 JSON 文件
如果您在该作业的 JSON 文件中指定了作业计划，则只能为要运行的作业分配一个计划。

但是，如果希望对多项作业使用相同的计划，则可以专门为计划创建单独的 JSON 文件。然后可以使用 `dcos job schedule add <job-id> <schedule-file>` 命令将作业与计划关联。

1. 必要时，在文本编辑器中打开一个新文件，以 JSON 格式 [创建新作业](#cli-add-job) 文件。

    您必须使用您为该作业定义的作业 `id` 将计划 JSON 文件与作业关联。如果希望使用计划专用 JSON 文件来控制作业运行时间，为防止计划冲突或意外的作业运行，不应为作业定义计划参数。

1. 在文本编辑器中打开一个新文件，以 JSON 格式创建希望使用的计划。

    例如，新计划的 JSON 文件可能与此类似：

    ```json
    {
        "concurrencyPolicy": "ALLOW",
        "cron": "20 0 * * *",
        "enabled": true,
        "id": "nightly",
        "nextRunAt": "2016-07-26T00:20:00.000+0000",
        "startingDeadlineSeconds": 900,
        "timezone": "UTC"
    }
    ```

1. 使用易于识别的文件名保存新计划的 JSON 文件。例如，您可以将计划信息保存为 `my-cron-def.json`。

1. 通过运行类似于以下内容的命令将作业与计划关联：

    ```bash
    dcos job schedule add <job-id> <schedule-file>
    ```

    例如：

    ```bash
    dcos job schedule add mytestjob my-cron-def.json
    ```

    如果尝试将计划定义添加到已定义了计划的作业中，命令显示类似于以下内容的错误：

    ``` 
    Error: 409 - requirement failed: A schedule with id nightly already exists
    ```

1. 通过运行类似于以下内容的命令来验证是否已添加新作业计划：

    ```bash
    dcos job schedule show mytestjob
    ```

    此命令显示指定作业的计划信息，类似于以下内容：

    ```bash
    ID        CRON     ENABLED            NEXT RUN            CONCURRENCY POLICY  
    nightly  20 0 * * *  True     2019-04-11T00:20:00.000+0000  ALLOW
    ```

## 从命令行启动作业
您可以触发要运行的作业：
- 按需手动
- 根据您定义的计划自动进行 
- 在有或无计划的情况下通过自动化按编程方式进行

您可以使用这些方法中的任何一种来启动被称为作业运行的作业实例。例如，您可以使用 DC/OS CLI 来启动作业，无论您是否定义了计划。从命令行手动启动作业类似于使用 DC/OS UI 通过单击 **立即运行** 来启动作业。

若要在任何计划的作业活动之外按需启动作业运行，请运行类似以下内容的命令：

```bash
dcos job run <job-id>
```

例如，如果作业 ID 为 `mytestjob`，则运行：

```bash
dcos job run mytestjob
```

每次执行命令时，从命令行或通过 DC/OS UI 手动启动作业会触发新作业运行。按需手动触发的作业会忽略并发策略设置。

但是，如果计划用于启动作业，则作业的并发策略会确定是否触发新的作业运行实例。能够控制作业是否同时运行是手动或使用计划触发作业运行之间的主要差异之一。

## 从命令行移除作业
只要作业没有任何活动的作业实例在运行，您就可以使用命令行程序 [`dcos job remove <job-id>`](/mesosphere/dcos/cn/2.0/cli/command-reference/dcos-job/dcos-job-remove/)移除作业。如果作业有任何当前正在运行的实例，则必须停止所有当前活动的作业。停止所有正在运行的作业实例后，可以使用 `dcos job remove <job-id>` 命令移除该作业。

若要移除作业：
1. 通过运行类似以下内容的命令检查活动作业的状态：

    ```bash
    dcos job list
    ```

1. 通过运行以下命令，停止要删除作业的所有正在运行的作业实例并移除该作业：

    ```bash
    dcos job remove <job-id> --stop-current-job-runs
    ```

1. 通过运行以下命令，验证是否已移除指定的作业：

    ```
    dcos job list
    ```

## 从命令行修改作业
若要修改作业。请更新 JSON 作业文件，然后运行

```
dcos job update <job-file>.json
```

### 修改作业的计划
您可以通过两种方式更新作业计划，具体取决于您的作业是否具有 `<job-file>.json` 中指定的计划，或者作业的计划是否保存在单独的文件中。

#### 使用计划修改作业
修改 `schedules` 的 `<job-file>.json` 参数。然后运行

```
dcos job update <job-file>.json
```

#### 使用单独的计划文件修改作业
修改 `<schedule-file>.json`。然后运行以下命令之一：

```bash
dcos job schedule add <job-id> <schedule-file>.json
dcos job schedule remove <job-id> <schedule-id>
dcos job schedule update <job-id> <schedule-file>.json
```

## 查看作业详细信息
列出所有作业：

```
dcos job list
```

列出作业之前所有的运行：

```
dcos job history <job-id>
```

若要查看有关作业的详细信息，请运行：

```
dcos job show <job-id>
```

若要查看有关作业计划的详细信息，请运行：

```
dcos job schedule show <job-id>
```

### 查看作业日志
若要查看工作日志：

```
dcos task log --completed <job-id>
```

若要仅获取特定作业的日志，请使用 `dcos job history <job-id>` 中的作业运行 ID

```
dcos task log --completed <job-run-id>
```
<a name="jobs-api"></a>

# 使用 DC/OS API 管理作业

您可以通过对作业 API 端点的调用来创建和管理作业。本部分重点介绍通过作业相关的 API 调用来执行的最常见任务。关于作业 API 的更多完整信息，请参阅 [作业 API 参考]（http://dcos.github.io/metronome/docs/generated/api.html) 信息。

## 准备使用 API 调用
本部分中的代码示例说明如何包括作业 API 调用来使用客户端 URL (cURL) 程序执行与作业相关的任务。有关使用 `curl` 命令的详细信息，请参阅 [`curl` 手册页](https://curl.haxx.se/docs/manpage.html)。

此外，使用 DC/OS CLI 或 UI 和 API 之间的一个重要区别是如何配置作业计划。DC/OS CLI 和 UI 支持组合 JSON 格式，允许您在作业描述符中指定一个计划。若要使用 Jobs API 计划一个作业，您必须使用两个单独的调用：
- 使用一个调用来添加 **未计划** 作业。
- 使用另一个调用将特定 [计划文件](#add-sched) (`schedule-file.json`) 与作业关联。

## 使用 API 调用添加作业
以下命令将添加名为 `myjob.json` 的作业。

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d@/Users/<your-username>/<myjob>.json
```

## 使用 API 调用移除作业
无论作业是否运行，以下命令将删除作业：
```
curl -X DELETE -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>?stopCurrentJobRuns=true
```

若要只在作业未运行时删除作业，请将 `stopCurrentJobRuns` 设置为 `False`。

## 使用 API 调用修改或查看作业
以下命令显示所有作业：

```
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs
```

以下命令列出作业运行：

```
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>/runs/"
```

使用以下命令停止运行：

```
curl -X POST -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>/runs/20160725212507ghwfZ/actions/stop"
```

<a name="add-sched"></a>

## 为作业添加计划
以下命令为作业添加计划：

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<job-id>/schedules -d@<schedule-file>.json
```

## 使用 API 调用启动作业
您可以使用 DC/OS API 以编程方式启动作业。类似于使用 UI 或 CLI 来启动作业，您必须在调用中指定作业标识符。

若要触发作业运行启动，可以使用类似于以下内容的 REST API 调用：

```
curl -X POST -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/{jobId}/runs
```
