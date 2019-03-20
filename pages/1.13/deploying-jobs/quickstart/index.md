---
layout: layout.pug
navigationTitle:  Creating Jobs
title: Creating Jobs
menuWeight: 10
excerpt: Creating and administering jobs using the web interface, the CLI, or the API
beta: true
enterprise: false
---

You can create and administer jobs for the DC/OS cluster in any of the following ways:
- interactively with the DC/OS web-based administrative console GUI.
- interactively or programmatically with DC/OS command-line interface (CLI) programs.
- directly through calls to the DC/OS application programming interface (API) for job-related operations.

The DC/OS application programming interface (API) for job-related operations provides the underlying funtionality that you can access through the DC/OS web-based administrative console and command-line interface (CLI). In most cases, therefore, you would only use the API directly if you are integrating the functionality with a custom program or automation script.

# Managing jobs with the DC/OS web-based interface
You can manage the most common job-related activity interactively through the DC/OS web-based interface. For example, you can add, modify, run, and remove jobs directly from the **Jobs** tab in the web-based console. However, the DC/OS web-based interface only provides access to a subset of the job-related functionality provided through the `dcos job` CLI and Jobs API. For more advanced job configurations and activity, use the [`dcos job`](/1.13/cli/command-reference/dcos-job/) commands or the [Jobs API](/1.13/deploying-jobs/quickstart/#jobs-api).

## Add a job
1. Navigate to the URL for the DC/OS web-based console in a web browser.

1. Click **Jobs**, then click **Create a Job** to display the New Job settings. 

    ![Create JOB UI](/1.13/img/New-Job-General.png)

    You can configure the job using the fields displayed or click **JSON Editor** to edit the JSON directly.

1. Click **General** to edit the most basic job settings, such as the kob identifier, CPU, memory, and disk requirements.

    * **ID** - The ID of your job.
    * **Description** - A description of your job.
    * **CPUs** - The amount of CPU your job requires.
    * **Mem** - The amount of memory, in MB, your job requires.
    * **Disk space** - The amount of disk space, in MB, your job requires.
    * **Command** - The command your job will execute. Leave this blank if you will use a Docker image.

1. Click **Schedule**, then click **Run on a Schedule** to specify a schedule for when the job runs.

    After you select **Run on a Schedule**, you can use the following settings to define the schedule:
    - Select **Cron Schedule**  to specify the schedule in `cron` format. Use [this crontab generator](http://crontab.guru) for help.
    - Select **Time Zone**  to enter the time zone in [TZ format](http://www.timezoneconverter.com/cgi-bin/zonehelp), for example, America/New_York.
    - Select **Starting Deadline** to set the time, in seconds, to start the job if it misses its scheduled time for any reason. Missed job executions are counted as failed jobs.

1. Click **Docker Container** to specifiy the Docker image for the new job, if you are using one.

1. Click **Docker Parameters** to specify the Docker parameters for the new job, if applicable.

1. Click **Labels** to specify a **Label Name** and **Label Value** you want to attach as metadata to the new job. You can then use the job label to filter jobs. For more information about using labels, see [Labeling tasks and jobs](/1.13/tutorials/task-labels/).

## Add a job to a job group
You can add a job to a an existing job group or create a new job group when you create the job. Use dots in your job ID to nest the job in a group. For example, if you add a job using the job ID `marketing.myjob`, the new `myjob` is created in the `marketing` job group. In DC/OS Enterprise, you can use job groups to implement fine-grained user access. For more information about controlling access to jobs through job groups, see [Granting access to jobs](/1.13/deploying-jobs/job-groups/).

## Modify, view, or remove a job

From the **Jobs** tab, click the name of your job and then the menu on the upper right to modify or delete it. While the job is running you can click the job instance to drill down to **Details**, **Files**, and **Logs** data.

# Managing jobs with the DC/OS CLI

You can create and manage jobs from the DC/OS CLI using `dcos job` commands. To see a full list of available commands with usage information, run `dcos job --help`.

## Create a JSON file for a new job

1. Create a job file in JSON format. The `id` parameter is the job ID. You will use this ID later to manage your job. You can assign only one schedule to a job.

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
  
1. Add the job. You can choose any name for your job file.
    ```bash
    dcos job add <myjob>.json
    ```
  
1. Go to the **Jobs** tab of the DC/OS web interface to verify that you have added your job, or verify from the CLI:
    ```bash
    dcos job list
    ```

## Schedule-Only JSON

If you use the same schedule for more than one job, you can create a separate JSON file for the schedule. Use the `dcos job schedule add  <job-id> <schedule-file>` command to associate a job with the schedule.

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

## Run a job without a schedule
You can use the DC/OS command-line interface to run jobs with or without a schedule. Running a job without using a schedule is equivalent to clicking **Run now** when you are managing jobs using the web interface.

To run a job on-demand without using a schedule, run a command similar to the following:

```
dcos job run <job-id>
```

## Remove a job

1. Enter the following command on the DC/OS CLI:

    ```
    dcos job remove <job-id>
    ```

1. Go to the **Jobs** tab of the DC/OS web interface to verify that you have removed your job, or verify from the CLI:

    ```
    dcos job list
    ```

## Modify a job

To modify your job, update your JSON job file, then run

```
dcos job update <job-file>.json
```

### Modify a job's schedule

You can update the schedule of your job in two ways, depending if your job has a schedule specified in the `<job-file>.json` or if your job's schedule is kept in a separate file.

#### Modify a job with a schedule

Modify the `schedules` parameter of your `<job-file>.json`. Then run

```
dcos job update <job-file>.json
```

#### Modify a job with a separate schedule file

Modify `<schedule-file>.json`. Then, run one of the following commands:

```bash
dcos job schedule add <job-id> <schedule-file>.json
dcos job schedule remove <job-id> <schedule-id>
dcos job schedule update <job-id> <schedule-file>.json
```

## View job details

List all jobs:

```
dcos job list
```

List all previous runs of your job:

```
dcos job history <job-id>
```

To view details about your job, run:

```
dcos job show <job-id>
```

To view details about your job's schedule, run:

```
dcos job schedule show <job-id>
```

### View job logs

To view the log for your job:

```
dcos task log --completed <job-id>
```

To get the log for only a specific job run, use a job run ID from `dcos job history <job-id>`

```
dcos task log --completed <job-run-id>
```

# <a name="jobs-api"></a>Jobs API

You can also create and administer jobs using the DC/OS API. [View the full API here](http://dcos.github.io/metronome/docs/generated/api.html).

<p class="message--important"><strong>IMPORTANT: </strong>The DC/OS CLI and web interface support a combined JSON format (accessed via the <code>/v0</code> endpoint) that allows you to specify a schedule in the job descriptor. To schedule a job via the API, use two calls: one to add an unscheduled job, and another to associate a <code><schedule-file>.json</code> with the job.</p>

## Add a job

The following command adds a job called `myjob.json`.

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d@/Users/<your-username>/<myjob>.json
```

## Remove a job

The following command removes a job regardless of whether the job is running:
```
curl -X DELETE -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>?stopCurrentJobRuns=true
```

To remove a job only if it is not running, set `stopCurrentJobRuns` to `False`.

## Modify or view a job

The following command shows all jobs:

```
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs
```

The following command lists job runs:

```
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>/runs/"
```

Stop a run with the following command:

```
curl -X POST -H "Authorization: token=$(dcos config show core.dcos_acs_token)" "$(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>/runs/20160725212507ghwfZ/actions/stop"
```

<a name="add-sched"></a>
## Add a schedule to a job

The following command adds a schedule to a job:

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<job-id>/schedules -d@/Users/<your-username>/<schedule-file>.json
```

## Run a job without a schedule
You can use the DC/OS API to run jobs with or without a schedule. Running a job without using a schedule is equivalent to clicking **Run now** when you are managing jobs using the web interface.

To run a job on-demand without using a schedule, use a REST API call similar to the following:

```
curl -X POST -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/{jobId}/runs
```
