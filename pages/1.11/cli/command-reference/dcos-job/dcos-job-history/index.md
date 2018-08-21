---
layout: layout.pug
navigationTitle:  dcos job history
title: dcos job history
menuWeight: 1
excerpt: Displaying the job run history

enterprise: false
---


# Description
The `dcos job history` command allows you to view your job run history.

# Usage

```bash
dcos job history <job-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--json`   |   Display JSON-formatted list. |
| `--show-failures`   |  Show the failure table and statistics for history. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<job-id>`   |   Specify the job ID.  You can view the job IDs with the `dcos job list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.11/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## View the history of a job

In this example, a job history is shown.

1.  List the jobs and find the ID:

    ```bash
    dcos job list
    ```

    Here is the output:

    ```bash
    ID                DESCRIPTION                      STATUS       LAST SUCCESFUL RUN  
    my-job            A job that sleeps                Unscheduled         N/A          
    my-scheduled-job  A job that sleeps on a schedule  Unscheduled         N/A
    ```

1.  View the job history for `my-scheduled-job`:

    ```bash
    dcos job history my-scheduled-job
    ```

    Here is the output:

    ```bash
    'my-scheduled-job'  Successful runs: 1 Last Success: 2017-02-17T23:18:33.842+0000
    ID                             STARTED                       FINISHED            
    20170217231831HkXNK  2017-02-17T23:18:31.651+0000  2017-02-17T23:18:33.843+0000
    ```

    **Note:** Be sure to specify the `--json` option to view the JSON app definition (for example, `dcos job history my-scheduled-job`).
