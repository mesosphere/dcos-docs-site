---
layout: layout.pug
navigationTitle: 示例
title: 作业示例
menuWeight: 20
excerpt: 作业常见使用情景示例。
beta: true
enterprise: true
---

这些示例为作业提供常见的使用情景。

**先决条件：**

- [DC/OS](/cn/1.11/installing/)和[DC/OS CLI](/cn/1.11/cli/install/)已安装。

# <a name="create-job"></a>创建简单的作业

此 JSON 文件创建了一项没有计划的简单作业。

1. 使用以下内容创建 JSON 文件。
    ```json
    {
      "id": "my-job",
      "description": "A job that sleeps",
      "run": {
        "cmd": "sleep 1000",
        "cpus": 0.01,
        "mem": 32,
        "disk": 0
      }
    }
    ```

1. 从 DC/OS CLI 中添加作业。
    ```bash
    dcos job add <my-job>.json
    ```

 或者，使用 API 添加作业。
    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d@/Users/<your-username>/<myjob>.json
    ```

# <a name="create-job-schedule"></a>创建有计划的作业
**注意：** 此示例 JSON 仅在您从 DC/OS CLI 或 Web 界面添加作业时有效。使用 [以下示例](#schedule-with-api) 通过 API 创建有计划的作业。

1. 使用以下内容创建 JSON 文件。
    ```
    {
        "id": "my-scheduled-job",
        "description": "A job that sleeps on a schedule",
        "run": {
            "cmd": "sleep 20000",
            "cpus": 0.01,
            "mem": 32,
            "disk": 0
        },
        "schedules": [
            {
                "id": "sleep-nightly",
                "enabled": true,
                "cron": "20 0 * * *",
                "concurrencyPolicy": "ALLOW"
            }
        ]
    }
    ```

1. 添加作业。
    ```bash
    dcos job add <my-scheduled-job>.json
    ```

# <a name="schedule-with-api"></a>使用 API 创建作业并关联计划

1. 使用 [上述说明](#create-job) 添加没有计划的作业。

1. 使用以下内容创建 JSON 文件。这是您作业的时间表。

    ```
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

1. 添加计划并将其与作业关联。
 通过 DC/OS CLI：
    ```bash
    dcos job schedule add <job-id> <schedule-file>.json
    ```

 通过 API
    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<job-id>/schedules -d@/Users/<your-username>/<schedule-file>.json
    ```

**注意：** 您可以将计划与多项作业相关联。

# 创建分区作业环境

在此示例中，使用了 DC/OS Web 界面创建分区作业环境。这让您限制每项作业或每个作业组的用户访问。作业是在名为 `batch` 的作业组中创建的，该作业组是名为 `dev` 作业组的子级。

```
├── dev
    ├── batch
        ├── job1
        ├── job2
```

然后作业组为用户 `Cory` 和 `Alice` 分配权限以限制访问的权限。

**前提条件：**

- 安装 DC/OS 时，[安全模式](/cn/1.11/security/ent/#security-modes) `permissive` 或 `strict`。
- 您必须以 `superuser` 身份登录。

1. 以具有 `superuser` 权限的用户身份登录 DC/OS Web 界面。

 ![登录](/cn/1.11/img/gui-installer-login-ee.gif)

 图 1. DC/OS Enterprise 登录

1. 创建分区作业。

 1. 选择 **Jobs**，然后单击 **CREATE A JOB**。
 1. 在 **ID** 字段中，键入 `dev.batch.job1`。
 1. 在 **Command** 字段中，键入 `sleep 1000`（或其他有效的 shell 命令）并单击 **CREATE A JOB**。

 ![创建作业](/cn/1.11/img/job-ex1.png)

 图 2. 新作业屏幕

 这将在 DC/OS 中的这样的目录结构中创建作业：**Jobs > dev > batch > job1**。

 1. 单击右上角的 **+** 图标创建另一项作业。

 ![创建另一项作业](/cn/1.11/img/job-ex2.png)

 图 3. 创建另一项作业

 1. 在 **ID** 字段中，键入 `dev.batch.job2`。
 1. 在 **Command** 字段中，键入 `sleep 1000`（或其他有效的 shell 命令）并单击 **CREATE A JOB**。您应该有两项作业：

 ![创建作业](/cn/1.11/img/job-ex3.png)

 图 4. Jobs > dev > batch screen

1. 运行作业。

 1. 单击 **Jobs > dev > batch > job1**，然后单击 **Run Now**。

 ![运行作业](/cn/1.11/img/job-ex4.png)

 图 5. “Run now”菜单

 1. 单击 **Jobs > dev > batch > job2**，然后单击 **Run Now**。

1. 为作业分配权限。

 1. 选择 **Organization > Users** 并创建名为 `Cory` 和 `Alice` 的新用户。

 ![创建用户 Cory](/cn/1.11/img/service-group3.png)

 图 6. 创建新用户

 1. 选择用户 **Cory** 授予 `job1` 访问权限。
 1. 从 **Permissions** 选项卡中，单击 **ADD PERMISSION**，然后切换 **INSERT PERMISSION STRING** 按钮以手动输入权限。

 ![添加 cory 权限](/cn/1.11/img/job-ex5.png)

 图 7. 为用户“Cory”添加权限

 1. 在 **Permissions Strings** 字段中复制并粘贴权限。指定您的作业组 (`dev/batch`)、作业名称 (`job1`) 和操作 (`read`)。操作可以是 `create`、 `read`、 `update`、`delete` 或 `full`。若要允许多个操作，请使用逗号分隔它们，例如: `dcos:service:metronome:metronome:jobs:/dev/batch/job1 read,update`。

        <table class=“table” bgcolor=#858585>
        <tr> 
        <td align=justify style=color:white><strong>重要信息：</strong>您的<a href="/1.11/security/ent/#security-modes">安全模式</a>必须是宽容或严格。</td> 
        </tr> 
        </table>

        ```bash
        dcos:adminrouter:service:metronome full
        dcos:service:metronome:metronome:jobs:dev/batch/job1 read
        dcos:adminrouter:ops:mesos full
        dcos:adminrouter:ops:slave full
        dcos:mesos:master:framework:role:* read
        dcos:mesos:master:executor:app_id:/dev/batch/job1 read
        dcos:mesos:master:task:app_id:/dev/batch/job1 read
        dcos:mesos:agent:framework:role:* read
        dcos:mesos:agent:executor:app_id:/dev/batch/job1 read
        dcos:mesos:agent:task:app_id:/dev/batch/job1 read
        dcos:mesos:agent:sandbox:app_id:/dev/batch/job1 read
        ```
 1. 单击 **ADD PERMISSIONS**，然后单击 **Close**。
 1. 对用户 **Alice** 重复这些步骤 ，在权限中，将 `job1` 替换为 `job2`。

1. 退出并以新用户身份重新登录以验证权限。用户现在应该在 **Jobs** 选项卡内具有对 `dev/batch/job1` 和 `dev/batch/job2` 的指定访问级别。例如，如果您以 **Alice** 身份登录，您只能看到 **jobs2**：

 ![Alice 作业查看](/cn/1.11/img/job-ex6.png)

 图 8. “Alice”的局限性查看
