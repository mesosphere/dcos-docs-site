---
layout: layout.pug
navigationTitle: Diagnostic Tools
title: Diagnostic Tools
menuWeight: 103
excerpt: Tools for diagnosing cluster problems
featureMaturity:
enterprise: false
---

# Diagnostic Tools

DC/OS clusters provide several tools for diagnosing problems with services running in the cluster. In addition, the SDK has its own endpoints that describe what the Scheduler is doing at any given time.

## Logging

The first step in diagnosing a problem is to take a look at the logs. Knowledge of the problem being diagnosed will help you to determine which task logs are relevant.

As of this writing, the best way to view and download logs is via the Mesos UI at `<dcos-url>/mesos`. On the Mesos front page you will see two lists: a list of currently running tasks and a list of completed tasks (whether successful or failed).

[<img src="../service/1_Logging_All_Tasks.png" alt="mesos frontpage showing all tasks in the cluster" width="1000"/>](../service/1_Logging_All_Tasks.png)

_Figure 1. - Mesos front page_

The Sandbox link for one of these tasks shows a list of files from within the task itself. For example, here’s a sandbox view of a `nifi-node-0` task from the list above:

[<img src="../service/2_Inside_Task.png" alt="inside task" width="1000"/>](../service/2_Inside_Task.png)

_Figure 2. - Task file list_

If the task is based on a Docker image, this list will only show the contents of `/mnt/sandbox`, and not the rest of the file system. If you need to see file system contents outside of this directory, you will need to use the commands `dcos task exec` or `nsenter`, as described below under Running commands within containers.

There are multiple services installed in the task list, resulting in a pretty large list. You can filter the list using the text box at the upper right, but there may be duplicate names across services. For example, there are two instances of `nifi` and each is running a `node-0`. As the cluster grows, this confusion gets proportionally worse. You need to limit the task list to those that are relevant to the service being diagnosed. To do this, click “Frameworks” on the upper left to see a list of all the installed frameworks (mapping to our services):

[<img src="../service/3_Active_Frameworks.png" alt="active frameworks" width="1000"/>](../service/3_Active_Frameworks.png)

_Figure 3. - Active frameworks_

You then need to decide which framework to select from this list. This depends on what task you want to view.

## Scheduler logs

If the problem is one of deployment or management, such as when a service is "stuck" in initial deployment, or a task that previously went down is not being brought back at all, then you can use the Scheduler logs to find out why.

From Mesos’s perspective, the Scheduler is being run as a Marathon app. Therefore you should pick Marathon from this list and then find the Scheduler in the list of tasks.

[<img src="../service/4_Scheduler.png" alt="scheduler" width="1000"/>](../service/4_Scheduler.png)

_Figure 4. - List of active tasks_

You can find Scheduler logs either via the main Mesos front page if your cluster is small (possibly using the filter box at the top right). If your cluster is large, you can also navigate into the list of tasks registered against the Marathon framework. In SDK services, the Scheduler is typically given the same name as the service; for example, a Nifi-dev service’s Scheduler would be named `nifi-dev`. Use the Sandbox link to view the Sandbox portion of the Scheduler file system, which contains files named `stdout` and `stderr`. These files receive the `stdout/stderr` output of the Scheduler process, and can be examined to see what the Scheduler is doing.

[<img src="../service/5_Stderr_out.png" alt="stdout and stderr" width="1000"/>](../service/5_Stderr_out.png)

_Figure 5. - Scheduler output_

## Task logs

When the problem being diagnosed has to do with service tasks, such as when a given task is crash looping, the task logs will  provide more information. The tasks being run as a part of a service are registered against a framework matching the service name. Therefore, you should pick `<service-name>` from this list to view tasks specific to that service.

[<img src="../service/6_Task.png" alt="task" width="1000"/>](../service/6_Task.png)
_Figure 6. - Tasks running in a framework_

In the list above, you can see separate lists of active and completed tasks:

   - Active tasks are still running. These give a picture of the current activity of the service.
   - Completed tasks have exited for some reason, whether successfully or due to a failure. These give a picture of recent activity of the service.

**Note:** Older completed tasks will be automatically deleted, and their data may no longer be available here.

Either or both of these lists may be useful, depending on the context. Click on the Sandbox link for one of these tasks and then start looking at sandbox content. Files named `stderr` and `stdout` contain logs produced by the SDK Executor process (a small wrapper around the service task), as well as any logs produced by the task itself. These files are automatically paginated at 2MB increments, so older logs may also be examined until they are automatically pruned.

[<img src="../service/7_Task_stderr_out.png" alt="task stderr and stdout" width="1000"/>](../service/7_Task_stderr_out.png)

_Figure 7. - Output of `Stderr` log file_

## Mesos Agent logs

Occasionally, it can also be useful to examine what a given Mesos Agent is doing. The Mesos Agent handles deployment of Mesos tasks to a given physical system in the cluster. One Mesos Agent runs on each system. These logs can be useful for determining if there is a problem at the system level that is causing alerts across multiple services on that system.

Navigate to the agent you want to view. You can either go directly from a task by clicking the “Agent” item in the breadcrumb when viewing a task (this will go directly to the agent hosting the task), or by navigating through the “Agents” menu at the top of the screen.

In Agent view, you will see a list of frameworks with a presence on that agent. In the left pane you will see a plain link named “LOG”. Click that link to view the agent logs.

[<img src="../service/8_MesosAgentLog.png" alt="mesos agent log" width="1000"/>](../service/8_MesosAgentLog.png)

_Figure 8. - Mesos Agent log_

## Logs via the CLI

You can also access logs via the DC/OS CLI using the `dcos task log` command. For example, see the following list of tasks in a cluster:

[<img src="../service/9_Dcos_task.png" alt="dcos task" width="1000"/>](../service/9_Dcos_task.png)

_Figure 9. - Output of command `dcos task log`_

## Running commands within containers

A useful tool for diagnosing the task state is the ability to run arbitrary commands within the task. The available tools for doing this are as follows:

DC/OS 1.9 introduced the task `exec command`, which can be used to run.

### Prerequisites

   - SSH keys for accessing your configured cluster (such as via `ssh-add`). SSH is used behind the scenes to get into the cluster.
   - A recent version of the [DC/OS CLI](https://docs.mesosphere.com/1.11/cli/) with support for the `task exec` command

### Using `dcos task exec`    

Once you are set up, running commands is very straightforward. For example, assume the list of tasks from the CLI logs section above. There are two `broker-0` tasks, one named `broker-0__81f56cc1-7b3d-4003-8c21-a9cd45ea6a21` and another named `broker-0__75bcf7fd-7831-4f70-9cb8-9cb6693f4237`. Unlike with task logs, you can only run `task exec` on one command at a time, so if two tasks match the task filter then you see the following error:

[<img src="../service/10_Multiple_task.png" alt="multiple task" width="1000"/>](../service/10_Multiple_task.png)

_Figure 10. - Multiple tasks error message_

Therefore you must be more specific:

[<img src="../service/11_dcos_task_specific.png" alt="task specific" width="1000"/>](../service/11_dcos_task_specific.png)

_Figure 11. - Output of command `dcos_task_specific`_

You can also run interactive commands using the `-it` flags (short for `--interactive --tty`):

[<img src="../service/12_Interactive_mode.png" alt="interactive mode" width="1000"/>](../service/12_Interactive_mode.png)

_Figure 12. - Interactive commands_

While you could technically change the container file system using `dcos task exec`, any changes will be destroyed if the container restarts.

## Querying the Scheduler

The Scheduler exposes several HTTP endpoints that provide information on any current deployment, as well as the Scheduler’s view of its tasks. For a full listing of HTTP endpoints, see the [API reference](https://mesosphere.github.io/dcos-commons/reference/swagger-api/). The Scheduler endpoints most useful to field diagnosis come from three sections:

  - Plan: Describes any work that the Scheduler is currently doing, and what work it’s about to do. These endpoints also allow you to manually trigger plan operations, or restart them if they are stuck.
  - Pods: Describes the tasks that the Scheduler has currently deployed. The full task info describing the task environment can be retrieved, as well as the last task status received from Mesos.
  - State: Provides access to other miscellaneous state information such as service-specific properties data.

For full documentation of each command, see the API Reference. Here is an example of invoking one of these commands against a service named `hello-world` via curl:

[<img src="../service/13_Curl_helloworld.png" alt="curl hello world" width="1000"/>](../service/13_Curl_helloworld.png)

_Figure 13. - Output of `hello-world`_

## ZooKeeper/Exhibitor

**Warning:** This option should only be used as a last resort. Modifying anything in ZooKeeper directly may cause your service to behave in unpredictable ways.

DC/OS comes with Exhibitor, a commonly used front-end for viewing ZooKeeper. Exhibitor may be accessed at `<dcos-url/exhibitor>`. A given SDK service will have a node named `dcos-service-<svcname>` visible here. This is where the Scheduler puts its state, so that it is not lost if the Scheduler is restarted. In practice, it is far easier to access this information via the Scheduler API (or via the service CLI) as described earlier, but direct access using Exhibitor can be useful in situations where the Scheduler itself is unavailable or otherwise unable to serve requests.

[<img src="../service/14_zookeeper_exhibitor.png" alt="zookeeper exhibitor" width="700"/>](../service/14_zookeeper_exhibitor.png)

_Figure 14. - Exhibitor for ZooKeeper directory_
