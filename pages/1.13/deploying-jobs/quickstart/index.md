---
layout: layout.pug
navigationTitle:  Creating Jobs
title: Creating Jobs
menuWeight: 10
excerpt: Creating and administering jobs using the web interface, the CLI, or the API
beta: true
enterprise: false
---


You can create and administer jobs in the DC/OS web interface, from the DC/OS CLI, or via the API.

# DC/OS Web interface

<p class="message--note"><strong>NOTE: </strong>The DC/OS web interface provides a subset of the CLI and API functionality. For advanced job configurations, use the <a href="/1.12/cli/command-reference/dcos-job">dcos job</a> commands or the <a href="/1.12/deploying-jobs/quickstart/#jobs-api">Jobs API</a>.</p>

## Add a job

From the DC/OS web interface, click the **Jobs** tab, then the **Create a Job** button. Fill in the following fields, or toggle to JSON mode to edit the JSON directly.

![Create JOB UI](/1.13/img/GUI-Jobs-New_Job_Modal-1_12.png)

Figure 1. New job menu

### **General** Tab
* **ID** - The ID of your job
* **Description** - A description of your job
* **CPUs** - The amount of CPU your job requires
* **Mem** - The amount of memory, in MB, your job requires
* **Disk space** - The amount of disk space, in MB, your job requires
* **Command** - The command your job will execute. Leave this blank if you will use a Docker image.

### **Schedule** Tab
Check the **Run on a Schedule** to reveal the following fields.
* **Cron Schedule** - Specify the schedule in cron format. Use [this crontab generator](http://crontab.guru) for help.
* **Time Zone** - Enter the time zone in [TZ format](http://www.timezoneconverter.com/cgi-bin/zonehelp), for example, America/New_York.
* **Starting Deadline** - This is the time, in seconds, to start the job if it misses scheduled time for any reason. Missed jobs executions will be counted as failed ones.

### **Docker Container** Tab
* **Image** - Enter the Docker image you will use to specify the action of your job, if you are using one.

### **Labels**
**Label Name** and **Label Value** - Attach metadata to your jobs so you can filter them. [Learn more about labels](/1.13/tutorials/task-labels/).

## Job Groups
You can add a job to a an existing job group or create one when you create the job. Use dots in your job ID to nest the job in a group. For instance, if you enter job ID `marketing.myjob`, `myjob` will be created in the `marketing` group. In DC/OS Enterprise, you can [use job groups](/1.13/deploying-jobs/job-groups/) to implement fine-grained user access.

## Modify, view, or remove a job

From the **Jobs** tab, click the name of your job and then the menu on the upper right to modify or delete it. While the job is running you can click the job instance to drill down to **Details**, **Files**, and **Logs** data.

# DC/OS CLI

You can create and manage jobs from the DC/OS CLI using `dcos job` commands. To see a full list of available commands, run `dcos job --help`.

## Add a job

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

You can also create and administer jobs via the API. [View the full API here](http://dcos.github.io/metronome/docs/generated/api.html).

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
