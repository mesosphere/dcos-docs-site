---
layout: layout.pug
navigationTitle: Creating Jobs
title: Creating Jobs
menuWeight: 10
excerpt: Creating and administering jobs using the UI, the CLI, or the API
enterprise: false
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

You can create and administer jobs for the DC/OS cluster in any of the following ways:
- interactively with the [DC/OS UI](#managing-jobs)
- interactively or programmatically with the DC/OS [CLI](#cli)
- directly through calls to the DC/OS application programming interface ([API](#jobs-api) for job-related operations

The DC/OS UI only provides access to a subset of the job-related functionality provided through the `dcos job` CLI and Jobs API. For more advanced job configurations and activity, use the CLI [`dcos job`](/mesosphere/dcos/1.14/cli/command-reference/dcos-job/) commands or the [Jobs API](/mesosphere/dcos/1.14/deploying-jobs/quickstart/#jobs-api).

The DC/OS application programming interface (API) provides underlying functionality that you can access through the DC/OS UI and CLI. In most cases, you would only use the API directly if you are integrating the functionality with a custom program or automation script.

<a name="managing-jobs"></a>

# Managing jobs with the DC/OS UI
You can manage the most common job-related activity interactively through the DC/OS UI. For example, you can add, modify, run, and remove jobs directly from the **Jobs** tab in the UI. 

![Jobs](/mesosphere/dcos/1.14/img/GUI-Jobs-Main.png)

Figure 1 - Jobs tab and jobs list

### Split screen

Note that in all the **Jobs** UI configuration screens, you can choose to view the UI alone, or split the screen between the UI and a **JSON Editor** window. In the following discussion of the **Jobs** configuration options, we will show you the split screen so that you can see how they work together, but you may always choose to use the UI by itself. To invoke the **JSON Editor**, click on the **JSON Editor** toggle switch next to the **Submit** button. 

<!-- Where are JSON files created here stored? Can that location be configured? -->

Edits made to either interface will be immediately reflected in the other. For example, if you enter a value in any field in the left hand UI, it will be added to the JSON file on the right hand. 

To dismiss the **JSON Editor** screen, click the toggle again.

![Split Screen](/mesosphere/dcos/1.14/img/GUI-Jobs-Split-Screen.png)

Figure 2 - Split screen

## Add a job

There are two ways to create a job in the DC/OS UI.

- If you have no jobs configured, the Jobs screen will contain a notice that you have no active jobs, and will display a **Create a Job** button. 

![No active jobs](/mesosphere/dcos/1.14/img/GUI-Jobs-No-Active-Jobs.png)

Figure 3 - Create a Job button

-  Regardless of whether you have active jobs or not, you can always click on the **+** sign in the upper right corner to create a new job.

![Plus sign](/mesosphere/dcos/1.14/img/GUI-Jobs-Create-a-Job.png)

Figure 4 - Click on plus sign

A configuration screen for a new job will appear. Note that this screen is the same as that used for editing jobs. 

![Job configuration screen](/mesosphere/dcos/1.14/img/GUI-Jobs-New-Job.png)

Figure 5 - Job configuration screen

## Configuring a job

You will see eight tabs on the left hand side of the screen. These help you name, configure and manage your job:

| Name | Description |
|------|--------------|
| [General](#general) | Sets the most basic job settings, such as the job identifier, CPU, memory and disk requirements.|
| [Container Runtime](#container-runtime) | Specifies whether the job runs using the Universal Container Runtime or the Docker Engine. |
| [Schedule](#schedule) | Sets up a schedule for your job. You can use the `cron` format. |
| [Environment](#environment) | Specifies environment variables to be attached to each instance of your job.|
| [Volumes](#volumes) | Configures a stateful job by setting up a persistent volume.|
| [Placement](#placement) | Specifies the placement of agent nodes in regions and zones for high availability, or to expand capacity to new regions.|
| [Run Configuration](#run-configuration) | Advanced settings for the job. |
| [Secrets](#secrets) | Sets up a Secret Store to secure important values like private keys, API tokens, and so forth. |
    
Detailed information about the parameters and values for each of the configuration screens can be found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/) documentation. 

### General

Select **General** to edit the most basic job settings, such as the job identifier, CPU, memory, and disk requirements.

![Jobs](/mesosphere/dcos/1.14/img/GUI-Jobs-General.png)

Figure 6 - General configuration tab

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#general/) documentation of the UI.

<!-- * **Job ID** - Defines a unique identifier for the new job. The Job ID is a required field. You also use this setting to manage job operations.
* **Description** - Provides an optional description of the new job.
* **CPUs** - Specifies the number of CPU cores your job requires. This field is required for all jobs.
* **Mem** - Specifies the amount of memory, in MB, your job requires. This field is required for all jobs.
* **Disk** - Specifies the amount of disk space, in MB, your job requires. This field is required for all jobs.
* **GPUs** - Specifies the number of GPU (Graphics Processing Unit) cores to allocate for processing your job. This field is only applicable for jobs that run on nodes configured to use GPU (Graphics Processing Unit) cores and tasks that are launched using DC/OS [Universal Container Runtime](/mesosphere/dcos/1.14/deploying-services/containerizers/ucr/) containers. Support for GPU resources is are not available for Docker containers or images.

Select the appropriate Job Type to run one or more specific commands or a Docker container image.
* Select **Command Only** to specify one or more commands you want the new job to execute. 

    If you select **Command Only**, you must specify the command or command arguments to execute. When the command you specify is executed, it is automatically wrapped by the command `/bin/sh -c job.cmd`. You must include either `cmd` or `args` in the command to be executed. It is invalid to supply both `cmd` and `args` in the same job.

    If you select the **Command Only** option, none of the **Container Runtime** settings are applicable for the job. You can continue creating the job by defining **Schedule** settings, adding advanced **Run Configuration** options, or clicking **Submit**.

* Select **Container Image** to specify a container image for the new job. If you select this option, type the name of the container image you want to run. For example, you can type a container image name such as `ubuntu:14.04`. You can then use the **Command** field to specify the command and any additional runtime parameters available in the container for running the new job. 

    If you select the **Container Image** option, you can continue creating the job by:
    - Configuring **Container Runtime** settings for the job.
    - Defining a job **Schedule**, if applicable.
    - Adding advanced **Run Configuration** options, if applicable.
    - Clicking **Submit**. -->

### Container Runtime

Select **Container Runtime** to specify whether the container for the new job runs using the Universal Container Runtime or the Docker engine. We support the **Universal Container Runtime (UCR)** and the **Docker Engine**. 

### UCR

**Universal Container Runtime** uses the native Mesos engine and supports GPU resources. This is the recommended selection.

![Jobs](/mesosphere/dcos/1.14/img/GUI-Jobs-Container-Runtime.png)

Figure 7 - **Jobs > Container Runtime** tab

### Docker Engine

The **Docker Engine** is Docker's container runtime. It requires an image and does not support GPU resources.

![Jobs](/mesosphere/dcos/1.14/img/GUI-Jobs-Container-Runtime-2.png)

Figure 8 - **Jobs > Container Runtime > Docker Engine** tab

<!-- * If you select **Universal Container Runtime**, you can select Force Pull Image On Launch to automatically pull the latest image before launching each instance.

* If you select **Docker Engine**, you can select the following additional options:
    - Select **Force Pull Image On Launch** to automatically pull the latest image before launching each instance.
    - Select **Grant Runtime Privileges** to run the specified Docker image in privileged mode.
    - Click **Add Parameter** to specify additional Docker runtime parameter names and values for the new job, if applicable. You can add multiple parameter names and corresponding values by clicking **Add Parameter** for each parameter name and value you want to include.
    - Click **Add Arg** to specify additional command-line arguments for the new job, if applicable. You can add multiple arguments by clicking **Add Arg** for each argument you want to include. -->

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#container-runtime/) documentation of the UI.

### Schedule

You can set up jobs with a scheduler using the `cron` format. Select **Schedule** to specify a schedule for when the job runs.

![Schedule](/mesosphere/dcos/1.14/img/GUI-Jobs-Schedule.png)

Figure 9 - **Jobs > Schedule** tab

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#schedule/) documentation of the UI.

After you define the schedule, you can activate or deactivate it by selecting or deselecting the **Enable Schedule** option. You can also modify or remove the schedule when needed after you have submitted the new job definition.

### Environment

Select **Environment** to configure any environment values to be attached to each instance of your job that is launched.

![Environment](/mesosphere/dcos/1.14/img/GUI-Jobs-Environment.png)

Figure 10 - **Jobs > Environment** tab

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#environment/) documentation of the UI.


### Volumes

Select the **Volumes** tab to create a stateful job by configuring a persistent volume. Persistent volumes enable instances to be restarted without data loss.

![Volumes](/mesosphere/dcos/1.14/img/GUI-Jobs-Volumes.png)

Figure 11 - **Jobs > Volumes** tab

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#volumes/) documentation of the UI.

### Placement

You can configure the placement of agent nodes in regions and zones for high availability, or to expand capacity to new regions when necessary.

![Placement](/mesosphere/dcos/1.14/img/GUI-Jobs-Placement.png)

Figure 12 - **Jobs > Placement** tab

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#placement/) documentation of the UI.

### Run Configuration

Select **Run Configuration** to specify advanced settings for the new job.

![Run Config](/mesosphere/dcos/1.14/img/GUI-Jobs-Run-Configuration.png)

Figure 13 - **Jobs > Run Configuration** tab


<!-- 1. Click **Run Configuration** to specify advanced settings for the new job.

    - Set **Max Launch Delay**  to specify the maximum number of seconds to wait for a job to start running after it is launched by a scheduled job run or manually by a user. If the job does not start running within the maximum number of seconds allowed, the job is aborted.

    - Set **Kill Grace Period**  to configure the number of seconds between escalating from `SIGTERM` to `SIGKILL` when signalling tasks to terminate. During this grace period, tasks should perform an orderly shut down immediately upon receiving SIGTERM.

    - Set **User name** to identify the user account that runs the tasks on the agent.

    - Select **Add Artifact** to provide one or more artifact URIs you want passed to fetcher module and resolved at runtime and the action--Execute, Extract, or Cache--you want to perform for each URI.

        ![Adding an artifact URI and action for a job](/mesosphere/dcos/1.14/img/job-artifacts-uri.png)

        Figure 2. Add an artifact URI and action

    - Select a **Restart Policy** to determine the steps to take if a job fails. 
    
        - You can choose **Never** if you never want to attempt to restart a failed job. 
        
        - If you choose **On Failure**, you can set a time limit for attempting to restart the job using the **Keep Trying Time** field. For example, set the **Keep Trying Time** to 30 if you want to try restarting the job after waiting for 30 seconds. If no value is set for Keep Trying Time, DC/OS will continue attempting to restart the failed job indefinitely.

    - Click **Add Label** to specify a **Key** and **Value** that you want to attach as metadata to the new job. You can then use the job label to filter or expose information for labeled jobs. You can add multiple label key name/value pairs by clicking **Add Label** for each name/value pair you want to include. For more information about using labels, see [Labeling tasks and jobs](/mesosphere/dcos/1.14/tutorials/task-labels/). -->

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#run-configuration/) documentation of the UI.


### Secrets

Select the {{ model.productName }} Secret Store to secure important values like private keys, API tokens, and database passwords. 

![Secrets](/mesosphere/dcos/1.14/img/job-artifacts-uri.png)

Figure 14 - Secrets tab

The parameters for this tab and the values allowed are found in the [Jobs](/mesosphere/dcos/1.14/gui/jobs/#secrets/) documentation of the UI.

## Submit

1. Click **Submit** to create the job.

1. Verify that you have added the new job by clicking **Jobs**.

    ![Jobs List](/mesosphere/dcos/1.14/img/job-list-scheduled.png)

    Figure 15. Jobs list

## Add a job to a job group
You can add a job to a an existing job group or create a new job group when you create the job. Use periods in your job ID to nest the job in a group. For example, if you add a job using the job ID `marketing.myjob`, the new `myjob` is created in the `marketing` job group. In DC/OS Enterprise, you can use job groups to implement fine-grained user access. 

For more information about controlling access to jobs through job groups, see [Granting access to jobs](/mesosphere/dcos/1.14/deploying-jobs/job-groups/).

## View, modify, or remove a specific job
You can view and modify job-related information, including details about the run history and configuration settings interactively through the DC/OS UI. From the **Jobs** tab, click the name of your job. You can then use the menu on the upper right to edit, run, disable, or delete a selected job. 

![Viewing and modifying job details](/mesosphere/dcos/1.14/img/job-menu-options.png)

Figure 16. Viewing and modifying job details

While the job is running, you can click the job instance to drill down to **Details**, **Files**, and **Logs** data.

You can see that the **Edit Job** screen contains the same configuration tabs as the **New Job** screen:

![Jobs](/mesosphere/dcos/1.14/img/GUI-Jobs-General.png)

Figure 17 - General configuration tab in **Edit Job** screen

<a name="cli"></a>

# Managing jobs with the DC/OS CLI
You can create and manage jobs from the DC/OS CLI using `dcos job` commands. To see a full list of available commands with usage information, run `dcos job --help` or consult the [CLI documentation](/mesosphere/dcos/1.14/cli/command-reference/dcos-job/).

<a name="cli-add-job"></a>

## Create a JSON file for a new job
1. Open a new file in a text editor to create a job file in JSON format. 

1. In the new file, specify the basic parameters required to define the job, including the following:
    - the job `id` you use to manage the job
    - the specific command to run
    - the CPU, memory, and disk requirements
    - the job schedule

    For example, the JSON file for a new job might look similar to this:

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

1. Save the JSON file for the new job using an easily-identifiable file name. For example, you might save the job information as `mysleepjob.json`.

1. Add the job by running a command similar to the following:

    ```bash
    dcos job add <myjob>.json
    ```
    
    For example:

    ```bash
    dcos job add mysleepjob.json
    ```
1. Verify that you have added the new job by running a command similar to the following:

    ```bash
    dcos job list
    ```
    
    The command displays the list of jobs similar to the following:
    
    ```bash
        ID       STATUS    LAST RUN  
    mysleepjob  Scheduled  N/A       
    mypingjob   Running    N/A       
    ```

## Set a concurrency policy for scheduled jobs
If you use a schedule to start a job, you can define a concurrency policy for the job. A concurrency policy determines whether a new job run instance is triggered if there's already a job instance running. 

For example, assume you have a job scheduled to start every day at 3:00AM, and you have set the concurrency policy for the job set to FORBID. If there is an instance of that job already running at 3:00AM--either because a previously-triggered job run is still active or has been triggered manually outside of the schedule--the scheduled start time will not trigger a new job to run. If there are no jobs running at the next scheduled start time, a new job instance starts and runs as scheduled.

If you want to allow scheduled jobs to be triggered while  other instances of the same job are running, you can set the `concurrencyPolicy` to ALLOW. 

## Create a schedule-only JSON file
If you specify a schedule for a job in the JSON file for that job, you can assign only one schedule for the job to run under.

If you want to use the same schedule for more than one job, however, you can create a separate JSON file specifically for the schedule. You can then use the `dcos job schedule add <job-id> <schedule-file>` command to associate a job with the schedule.

1. Open a file in a text editor to [create a new job](#cli-add-job) file in JSON format, if necessary.

    You must use the job `id` you define for the job to associate a schedule JSON file with the job. To prevent schedule conflicts or unexpected job runs, you should not define schedule parameters for a job if you want to use the schedule-only JSON file to control when a job runs.

1. Open a new file in a text editor to create the schedule you want to use in JSON format.

    For example, the JSON file for a new schedule might look similar to this:

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

1. Save the JSON file for the new schedule using an easily-identifiable file name. For example, you might save the schedule information as `my-cron-def.json`.

1. Associate the job with the schedule by running a command similar to the following:

    ```bash
    dcos job schedule add <job-id> <schedule-file>
    ```

    For example:

    ```bash
    dcos job schedule add mytestjob my-cron-def.json
    ```

    If you attempt to add a schedule definition to a job that already has a schedule defined, the command displays an error similar to the following:

    ``` 
    Error: 409 - requirement failed: A schedule with id nightly already exists
    ```

1. Verify that you have added the new job schedule by running a command similar to the following:

    ```bash
    dcos job schedule show mytestjob
    ```

    This command displays schedule information for the specified job similar to the following:

    ```bash
    ID        CRON     ENABLED            NEXT RUN            CONCURRENCY POLICY  
    nightly  20 0 * * *  True     2019-04-11T00:20:00.000+0000  ALLOW
    ```

## Start a job from the command line
You can trigger a job to run:
- manually on-demand
- automatically based on a schedule you have defined 
- programmatically through automation with or without a schedule

You can use any of these approaches to start a job instance that is referred to as a job run. For example, you can use the DC/OS CLI to start jobs regardless of whether you have defined a schedule or not. Starting a job manually from the command-line is similar to starting a job by clicking **Run now** using the DC/OS UI.

To start a job run on-demand outside of any scheduled job activity, run a command similar to the following:

```bash
dcos job run <job-id>
```

For example, if the job id is `mytestjob`, run:

```bash
dcos job run mytestjob
```

Starting a job manually from the command-line or through the DC/OS UI triggers a new job run each time the command is executed. Jobs that are triggered manually on-demand ignore concurrency policy settings. 

If a schedule is used to start a job, however, the job's concurrency policy determines whether a new job run instance is triggered. Being able to control whether jobs run concurrently is one of the main differences between triggering a job to run manually or using a schedule.

## Remove a job from the command-line
You can remove a job using the command-line program [`dcos job remove <job-id>`](/mesosphere/dcos/1.14/cli/command-reference/dcos-job/dcos-job-remove/) as long as the job does not have any active job instances running. If a job has any currently active running instances, you must stop all of the currently-active jobs. After you stop all running job instances, you can remove the job using the `dcos job remove <job-id>` command. 

To remove a job:
1. Check the status of active jobs by running a command similar to the following:

    ```bash
    dcos job list
    ```

1. Stop all running job instances for the job you want to delete and remove the job by running the following command:

    ```bash
    dcos job remove <job-id> --stop-current-job-runs
    ```

1. Verify that you have removed the specified job by running the following command:

    ```
    dcos job list
    ```

## Modify a job from the command line
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
<a name="jobs-api"></a>

# Managing jobs with the DC/OS API

You can create and manage jobs through calls to the Jobs API endpoints. This section highlights the most common tasks you perform through job-related API calls. For more complete information about the Jobs API, see the  [Jobs API reference](http://dcos.github.io/metronome/docs/generated/api.html) information.

## Preparing to use API cals
The code examples in this section illustrate how to include Jobs API calls to perform job-related tasks with the client URL (cURL) program. For detailed information about using `curl` command, see the [`curl` man page](https://curl.haxx.se/docs/manpage.html). 

In addition, one important difference between using the DC/OS CLI or UI and the API is how you configure the job schedule. The DC/OS CLI and UI support a combined JSON format that allows you to specify a schedule in the job descriptor. To schedule a job using the Jobs API, you must use two separate calls: 
- Use one call to add an **unscheduled** job.
- Use a second call to associate a specific [schedule file](#add-sched) (`schedule-file.json`) with the job.

## Add a job using an API call
The following command adds a job called `myjob.json`.

```
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs -d@/Users/<your-username>/<myjob>.json
```

## Remove a job using an API call
The following command removes a job regardless of whether the job is running:
```
curl -X DELETE -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<myjob>?stopCurrentJobRuns=true
```

To remove a job only if it is not running, set `stopCurrentJobRuns` to `False`.

## Modify or view a job using an API call
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
curl -X POST -H "Content-Type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/<job-id>/schedules -d@<schedule-file>.json
```

## Start a job using an API call
You can use the DC/OS API to start jobs programmatically. Similar to starting a job using the UI or CLI, you must specify the job identifer in the call.

To trigger a job run to start you can use a REST API call similar to the following:

```
curl -X POST -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/service/metronome/v1/jobs/{jobId}/runs
```
