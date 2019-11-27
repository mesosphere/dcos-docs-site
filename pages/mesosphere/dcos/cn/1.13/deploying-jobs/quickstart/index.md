---
layout: layout.pug
navigationTitle:  创建作业
title: 创建作业
menuWeight: 10
excerpt: 使用 UI、CLI 或 API 创建和管理作业
# beta: true
enterprise: false
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---

您可以通过以下任何方式创建和管理 DC/OS 群集的作业：
- 采用 DC/OS 基于 Web 的管理控制台 GUI 的交互方式。
- 采用 DC/OS 命令行界面 (CLI) 程序的交互或编程方式。
- 直接通过调用用于作业相关操作的 DC/OS 应用程序编程接口 (API)。

用于作业相关操作的 DC/OS 应用程序编程接口 (API) 提供了可通过 DC/OS 基于 Web 的管理控制台和命令行界面 (CLI) 访问的基础功能。因此，在大多数情况下，只有将该功能与自定义程序或自动化脚本集成时，才能直接使用 API。

# 使用 DC/OS UI 管理作业
您可以通过 DC/OS UI 交互地管理最常见的作业相关活动。例如，您可以直接从基于 Web 的控制台的 **作业** 选项卡添加、修改、运行和删除作业。但是，DC/OS UI 仅提供通过 `dcos job` CLI 和作业 API 提供的作业相关功能子集的访问权限。对于更多高级作业配置和活动，使用 [`dcos job`](/mesosphere/dcos/1.13/cli/command-reference/dcos-job/) 命令或 [作业 API](/mesosphere/dcos/1.13/deploying-jobs/quickstart/#jobs-api)。

## 添加作业
1. 导航到 Web 浏览器中 DC/OS 基于 Web 的控制台的 URL。

1. 单击 **作业**，然后单击 **创建作业** 以显示新作业设置。

    ![创建 JOB UI](/mesosphere/dcos/1.13/img/job-new-general-fields.png)

    图 1. 创建作业

    您可以使用显示的字段配置作业，或单击 **JSON 编辑器**，直接编辑 JSON。如果单击 **作业**，并看到以前创建的作业列表，则单击该作业列表上方和右侧显示的加号 (+) 以创建新作业。

1. 单击 **常规**，编辑最基本的作业设置，如作业标识符、CPU、内存和磁盘要求。

    * **作业 ID** - 定义新作业的唯一标识符。作业 ID 为必填字段。您还可以使用此设置管理作业操作。
    * **描述** - 提供新作业的可选描述。
    * **CPU** - 指定作业所需的 CPU 内核数。所有作业都必须填写此字段。
    * **Mem** - 指定作业所需的内存大小，以 MB 为单位。所有作业都必须填写此字段。
    * **磁盘空间** - 指定作业所需的磁盘空间大小，以 MB 为单位。所有作业都必须填写此字段。
    * **GPU** - 指定分配用于处理作业的 GPU（图形处理单元）内核数。此字段仅适用于在节点上运行的作业，该节点配置为使用 GPU（图形处理单元）内核和任务，而该 GPU 内核和任务使用 DC/OS [通用容器运行时](/mesosphere/dcos/1.13/deploying-services/containerizers/ucr/) 容器启动。GPU 资源支持对 Docker 容器或镜像不可用。

1. 选择相应作业类型，以运行一个或多个特定命令或 Docker 容器镜像。
    * 选择 **命令专用**，指定您希望新作业执行的一个或多个命令。
    
        如果选择 **命令专用**，则必须指定要执行的命令或命令参数。执行指定命令时，命令 `/bin/sh -c job.cmd` 会自动将其封装起来。您必须在要执行的命令中包含 `cmd` 或 `args`。在同一作业中同时提供 `cmd` 和 `args` 则无效。

        如果选择 **命令专用** 选项，则“容器运行时”设置都不适用于该作业。您可以通过定义 **计划** 设置、添加高级 **运行配置** 选项或单击 **提交** 继续创建作业。

    * 选择 **容器镜像**，为新作业指定容器镜像。如果选择此选项，请键入要运行的容器镜像的名称。例如，您可以输入容器镜像名称，例如 `ubuntu:14.04`。然后，您可以使用 **命令** 字段指定运行新作业的容器中可用的命令和任何其他运行时参数。
    
        如果选择 **容器镜像** 选项，则可以通过以下方式继续创建作业：
        - 为作业配置 **容器运行时**设置。
        - 定义作业 **计划**，如适用。
        - 添加高级 **运行配置** 选项，如适用。
        - 单击 **提交**。

1. 单击 **容器运行时**，指定是否使用通用容器运行时或 Docker 引擎运行新作业的容器。

    * 如果选择 **通用容器运行时**，则可以选择“启动时强制拉取镜像”，以在启动每个实例之前自动拉取最新镜像。
    
    * 如果选择 **Docker 引擎**，则可以选择以下其他选项：
        * 选择 **启动时强制拉取镜像**，以在启动每个实例之前自动拉取最新镜像。
        - 选择 **授予运行时权限**，以在特权模式下运行指定的 Docker 镜像。
        - 单击 **添加参数**，为新作业指定其他 Docker 运行时参数名称和值，如适用。您可以通过单击 **添加参数** 为您希望包括的每个参数名称和值添加多个参数名称和对应值。
        - 单击 **添加 Arg**，为新作业指定其他命令行自变量，如适用。您可以通过单击 **添加 Arg** 为您希望包括的每个自变量添加多个自变量。

1. 单击 **计划**，然后单击 **启用计划**，指定作业运行计划。

    选择 **启用计划**，如果希望使用您通过以下设置定义的计划运行作业：

    - 键入 **计划 ID**，以定义作业计划的唯一标识符。计划标识符必须为至少 2 个字符的字符串，并且只能包含数字 (`0-9`)、连字符 (`-`)和小写字母 (`a-z`)。计划标识符开头或结尾不得用连字符。

    - 选择 **CRON 计划**，以指定 `cron` 格式的计划。使用 [this crontab generator]（http://crontab.guru）获取帮助。您还可以设置 **时区** 以应用于 cron 计划。例如，您可能在不同时区中有节点，并希望使用标准化 UTC 时间或特定本地时区（如 America/New_York）运行作业。

    - 选择 **启动截止日期**，以秒为单位设置启动作业的时间（如果由于任何原因错过了计划时间）。错过的作业执行被视为失败的作业。

    - 如果已有作业实例在运行，您希望允许新的作业实例运行，请选择 **并发策略**。

    定义计划之后，您可以通过选择或取消选择 **启用计划** 选项来激活或停用。提交新的作业定义后，您还可以在需要时修改或删除计划。

1. 单击 **运行配置**，为新作业指定高级设置。

    - 设置 **最大启动延迟**，以指定由计划的作业运行或用户手动启动作业后，等待作业开始运行的最大秒数。如果作业在允许的最大秒数内未开始运行，则作业将中止。

    - 设置 **终止宽限期**，以配置在发送任务终止时从 `SIGTERM` 升级到 `SIGKILL` 间隔的秒数。在此宽限期内，任务应在收到 SIGTERM 后立即执行有序关闭。

    - 设置 **用户名**，以标识在代理上运行任务的用户帐户。

    - 选择 **添加工件**，以提供一个或多个您希望传递给提取程序模块并在运行时解析的工件 URI，以及您希望为每个 URI 执行的操作：执行、提取或缓存。

        ![添加作业工件 URI 和操作](/mesosphere/dcos/1.13/img/job-artifacts-uri.png)

        图 2. 添加工件 URI 和操作

    - 选择 **重新启动策略**，以确定作业失败时要采取的步骤。
    
        - 如果您不想尝试重新启动失败的作业，可以选择 **从不**。
        
        - 如果选择 **失败**，则可以使用 **坚持尝试时间** 字段设置尝试重新启动作业的时间限制。例如，如果希望在等待 30 秒后尝试重新启动作业，请将 **坚持尝试时间** 设置为 30。如果未为“坚持尝试时间”设置任何值，则 DC/OS 将继续尝试无限期地重新启动失败的作业。

    - 单击 **添加标签**，以指定希望作为元数据附加到新作业的 **键** 和 **值**。然后，您可以使用作业标签来筛选或公开已标记作业的信息。您可以通过单击 **添加标签** 为希望包括的每个名称/值对添加多个标签键名称/值对。有关使用标签的更多信息，请参阅 [标记任务和作业](/mesosphere/dcos/1.13/tutorials/task-labels/)。

1. 单击 **提交** 以创建作业。

1. 单击 **作业**，验证您是否已添加新作业。

    ![作业列表](/mesosphere/dcos/1.13/img/job-list-scheduled.png)

    图 3. 作业列表

## 向作业组添加作业
您可以将作业添加到现有的作业组中，或在创建作业时创建新的作业组。在作业 ID 中使用点可将作业嵌套在一个组中。例如，如果您使用作业 ID `marketing.myjob` 添加作业，则在 `marketing` 作业组中创建新的 `myjob`。在 DC/OS Enterprise 中，您可以使用作业组实现细粒度用户访问。如需更多关于通过作业组控制作业访问权限的信息，请参阅 [授予对作业的访问权限](/mesosphere/dcos/1.13/deploying-jobs/job-groups/)。

## 修改、查看或删除特定作业
您可以查看和修改与作业相关的信息，包括通过 DC/OS UI 交互运行历史和配置设置的详细信息。从 **作业** 选项卡，单击作业名称。然后您可以使用右上角的菜单编辑、运行、禁用或删除选定的作业。

![查看和修改作业详细信息](/mesosphere/dcos/1.13/img/job-menu-options.png)

图 4. 查看和修改作业详细信息

当作业正在运行时，您可以单击作业实例深入查看 **详细信息**、**文件** 和 **日志** 数据。

# 使用 DC/OS CLI 管理作业
您可以使用 `dcos job` 命令从 DC/OS CLI 中创建和管理作业。若要查看带有使用信息的可用命令的完整列表，请运行 `dcos job --help`。

<a name="cli-add-job"></a>

## 为新作业创建 JSON 文件
1. 在文本编辑器中打开一个新文件，以 JSON 格式创建作业文件。

1. 在新文件中，指定定义作业所需的基本参数，包括以下内容：
    - 您用于管理作业的作业 `id`
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

1. 通过运行类似于以下内容的命令添加作业：

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
如果使用计划启动作业，则可以定义作业的并发策略。并发策略确定是否在已有运行的作业实例时触发新作业运行实例。

例如，假设您有一个计划于每天凌晨 3:00 启动的作业，并且您已将该作业的并发策略设置为 FORBID。如果该作业的实例已经在凌晨 3:00 点运行（无论是因为之前触发的作业运行仍处于活动状态，还是在计划外手动触发），计划启动时间将不会触发运行新作业。如果在下一个计划启动时间没有作业在运行，新的作业实例将按计划启动并运行。

如果希望允许在运行同一作业的其他实例时触发计划的作业，您可以将 `concurrencyPolicy` 设置为 ALLOW。

## 创建计划专用 JSON 文件
如果您为该作业的 JSON 文件中的作业指定了计划，则只能为要运行的作业分配一个计划。

但是，如果希望对多项作业使用相同的计划，则可以专门为计划创建单独的 JSON 文件。然后可以使用 `dcos job schedule add <job-id> <schedule-file>` 命令将作业与计划关联。

1. 必要时，在文本编辑器中打开一个新文件，以 JSON 格式 [创建新作业](#cli-add-job) 文件。

    您必须使用您为该作业定义的作业 `id` 将计划 JSON 文件与作业关联。如果希望使用计划专用 JSON 文件来控制作业运行时间，为防止计划冲突或意外的作业运行，则不应为作业定义计划参数。

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
- 自动化按编程方式进行，有或无计划

您可以使用这些方法中的任何一种来启动被称为作业运行的作业实例。例如，您可以使用 DC/OS 命令行界面来启动作业，无论您是否定义了计划。从命令行手动启动作业类似于使用 DC/OS 基于 Web 的控制台通过单击 **立即运行** 来启动作业。

若要在任何计划作业活动之外按需启动作业运行，请运行类似以下内容的命令：

```bash
dcos job run <job-id>
```

例如，如果作业 ID 为 `mytestjob`，则运行：

```bash
dcos job run mytestjob
```

每次执行命令时，从命令行或通过 DC/OS 基于 Web 的控制台手动启动作业会触发新作业运行。按需手动触发的作业会忽略并发策略设置。

但是，如果计划用于启动作业，则作业的并发策略确定是否触发新作业运行实例。能够控制作业是否同时运行是手动或使用计划触发作业运行之间的主要差异之一。

## 从命令行删除作业
只要作业没有运行任何活动的作业实例，您就可以使用命令行程序 dcos job remove <job-id>。如果作业有任何当前正在运行的实例，则必须停止所有当前活动的作业。停止所有运行的作业实例后，您可以使用 `dcos job remove <job-id>` 命令删除作业。

若要删除作业：
1. 通过运行类似以下内容的命令检查活动作业的状态：

    ```bash
    dcos job list
    ```

1. 通过运行以下命令停止要删除作业的所有正在运行的作业实例并删除作业：

    ```bash
    dcos job remove <job-id> --stop-current-job-runs
    ```

1. 通过运行以下命令，验证是否已删除指定的作业：

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

# <a name="jobs-api"></a>使用 Jobs API
您还可以通过对 Jobs API 端点的调用来创建和管理作业。本部分重点介绍通过作业相关的 API 调用执行的最常见任务。关于 Jobs API 的更多完整信息，请参阅 [Jobs API 参考]（http://dcos.github.io/metronome/docs/generated/api.html) 信息。

## 准备使用 API 调用
本部分中的代码示例说明如何包括 Jobs API 调用来使用客户端 URL (cURL) 程序执行与作业相关的任务。有关使用 `curl` 命令的详细信息，请参阅 [`curl` 手册页](https://curl.haxx.se/docs/manpage.html)。

此外，使用 DC/OS 命令行界面或基于 Web 的控制台和 API 之间的一个重要差异是如何配置作业计划。DC/OS CLI 和基于 Web 的控制台支持组合 JSON 格式，允许您在作业描述符中指定计划。若要使用 Jobs API 计划作业，则必须使用两个单独的调用：
- 使用一个调用以添加 **未计划** 作业。
- 使用第二个调用将特定 [计划文件](#add-sched) (`schedule-file.json`) 与作业关联。

## 使用 API 调用添加作业
以下命令将添加名为 `myjob.json` 的作业。

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d@/Users/<your-username>/<myjob>.json
```

## 使用 API 调用删除作业
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
您可以使用 DC/OS API 以编程方式启动作业。类似于使用基于 Web 的控制台或命令行界面启动作业，您必须在调用中指定作业标识符。

若要触发要启动的作业运行，可以使用 REST API 调用，类似于以下内容：

```
curl -X POST -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/{jobId}/runs
```
