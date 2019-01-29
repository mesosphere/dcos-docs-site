---
layout: layout.pug
navigationTitle: 创建作业
title: 创建作业
menuWeight: 10
excerpt: 使用 Web 界面、CLI 或 API 创建和管理作业
beta: true
enterprise: false
---


您可以在 DC/OS Web 界面、DC/OS CLI 中或通过 API 创建和管理作业。

# DC/OS Web 界面

<p class="message--note"><strong>注意: </strong> DC/OS Web 界面提供 CLI 和 API 功能的子集。对于高级作业配置，使用 [dcos job](/cn/1.11/cli/command-reference/dcos-job/) 命令或 Jobs [API](#jobs-api)。</p>

## 添加作业

从 DC/OS Web 界面中单击 **Jobs** 选项卡，然后单击 **Create a Job** 按钮。填写以下字段，或切换到 JSON 模式以直接编辑 JSON。

![创建 JOB UI](/cn/1.11/img/create-job.png)

图 1. 新作业菜单

### **General** 选项卡
* **ID** - 作业的 ID。
* **Description** - 作业描述。
* **CPU** - 作业所需的 CPU 量。
* **Mem** - 作业所需的内存大小，以 MB 为单位。
* **Disk space** - 作业所需的磁盘空间大小，以 MB 为单位。
* **Command** - 作业将执行的命令。如果您将使用 Docker 镜像，请将此留空。

### **Schedule** 选项卡
检查 **Run on a Schedule** 以显示以下字段。
* **Cron Schedule** - 指定 cron 格式的时间表。使用 [this crontab generator](http://crontab.guru) 寻求帮助。
* **Time Zone** - 以 [TZ 格式] 输入时区(http://www.timezoneconverter.com/cgi-bin/zonehelp)，例如，美国/纽约。
* **Starting Deadline** -  如果由于某些原因错过了计划时间，这是开始作业的时间（以秒为单位）。错过的作业执行将被视为失败的作业执行。

### **Docker Container** 选项卡
* **Image** - 如果您使用的是 Docker 镜像，请输入您将用于指定作业操作的 Docker 镜像。

### **Labels**
**Label Name** 和 **Label Value** - 将元数据附加到您的作业，以便您可以筛选。[了解有关标签的更多信息](/cn/1.11/tutorials/task-labels/)。

## 作业组
您可以将作业添加到现有的作业组，或在创建作业时创建一个组。在作业 ID 中使用点可将作业嵌套在一个组中。例如，如果您输入作业 ID `marketing.myjob`，`myjob` 将在 `marketing` 组中创建。在 DC/OS Enterprise 中，您可以 [使用工作组](/cn/1.11/deploying-jobs/job-groups/) 实现细粒度用户访问。

## 修改、查看或删除作业

在 **Jobs** 选项卡中，单击作业名称，然后单击右上方的菜单修改或删除作业。当作业正在运行时，您可以单击作业实例深入查看 **Details**、**Files** 和 **Logs** 数据。

## DC/OS CLI

您可以使用 `dcos job` 命令从 DC/OS CLI 中创建和管理作业。若要查看可用命令的完整列表，请运行 `dcos job --help`。

## 添加作业

1. 以 JSON 格式创建作业文件。`id` 参数是作业 ID。您稍后将使用此 ID 管理作业。

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

    <p class="message--note"><strong>注意: </strong> 您只能为作业分配一个计划。</p>

1. 添加作业：
    ```bash
    dcos job add <myjob>.json
    ```

    <p class="message--note"><strong>注意: </strong> 您可以为作业文件选择任何名称。</p>

1. 转到 DC/OS Web 界面的 **Jobs** 选项卡以验证是否已添加作业，或从 CLI 进行验证：
    ```bash
    dcos job list
    ```

## 仅限计划的 JSON

如果对多项作业使用相同的计划，您可以为计划创建单独的 JSON 文件。使用 `dcos job schedule add <job-id> <schedule-file>` 命令将作业与计划关联。

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

## 删除作业

1. 在 DC/OS CLI 上输入以下命令：

    ```
    dcos job remove <job-id>
    ```

1. 转到 DC/OS Web 界面的 **Jobs** 选项卡以验证是否已删除作业，或从 CLI 进行验证：

    ```
    dcos job list
    ```

## 修改作业

若要修改作业。请更新 JSON 作业文件，然后运行

```
dcos job update <job-file>.json
```

### 修改作业的计划

您可以通过两种方式更新作业计划，具体取决于作业是否在 `<job-file>.json` 中具有指定的计划或作业计划是否保存在单独的文件中。

#### 使用计划修改作业

修改您的  `.json` 的`schedules` <job-file>参数。然后运行

```
dcos job update <job-file>.json
```

#### 使用单独的计划文件修改作业

修改  `<schedule-file>.json`。然后运行以下命令之一：

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

若要查看作业日志：

```
dcos task log --completed <job-id>
```

若要仅获取一个特定作业的日志，请使用‘dcos job history’中的作业运行 ID <job-id>`

```
dcos task log --completed <job-run-id>
```

# <a name="jobs-api"></a>Jobs API

您还可以通过 API 创建和管理作业。[在此查看完整的 API](http://dcos.github.io/metronome/docs/generated/api.html)。

<p class="message--note"><strong>注意: </strong> DC/OS CLI 和 Web 界面支持组合 JSON 格式（通过 `/v0` 终端访问），允许您在作业描述符中指定计划。若要通过 API 计划作业，请使用两个调用：一个添加未计划的作业，另一个用于将<schedule-file><schedule-file>.json 与作业关联。</p>

## 添加作业

以下命令将添加名为 `myjob.json` 的作业。

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d@/Users/<your-username>/<myjob>.json
```

## 删除作业

无论作业是否运行，以下命令将删除作业：
```
curl -X DELETE -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>?stopCurrentJobRuns=true
```

若要只在作业不在运行时删除作业，请将 `stopCurrentJobRuns` 设置为 `False`。

## 修改或查看作业

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
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<job-id>/schedules -d@/Users/<your-username>/<schedule-file>.json
```
