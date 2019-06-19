---
layout: layout.pug
navigationTitle:  Task Handling
title: Task Handling
menuWeight: 1
excerpt: Understanding Marathon task categories
enterprise: false
---

Marathon sorts tasks into three categories: initial, non-terminal, and terminal. Tasks within these categories may be in one of several states, as summarized in the diagram below. To learn the state of a task, you can consult the DC/OS logs or query the [events stream](http://mesosphere.github.io/marathon/docs/event-bus.html) of the [Marathon API](http://mesosphere.github.io/marathon/api-console/index.html) (/v2/events).

You can also [configure Marathon's behavior when a task is unreachable](/1.13/deploying-services/task-handling/configure-task-handling/).

![Task Handling Flow](/1.13/img/task-handling-corrected.png)

Figure 1. Task handling diagram

# Terminal states

```
case TASK_ERROR => Error
```
The task description contains an error. After Marathon marks the task as an error, it expunges the task and starts a new one.

```
case TASK_FAILED => Failed
```
The task failed to finish successfully. After Marathon marks the task as failed, it expunges the task and starts a new one.

```
case TASK_DROPPED => Dropped
```
The task failed to launch because of a transient error. The task's executor never started running. Unlike TASK_ERROR, the task description is valid -- attempting to launch the task again may be successful.

```
case TASK_GONE => Gone
```

The task was running on an agent that has been shutdown (e.g., the agent become partitioned, rebooted, and then reconnected to the master; any tasks running before the reboot will transition from UNREACHABLE to GONE). The task is no longer running. After Marathon marks the task as gone, it expunges the task and starts a new one.

```
case TASK_GONE_BY_OPERATOR => Gone
```
The task was running on an agent that the master cannot contact; the operator has asserted that the agent has been shutdown, but this has not been directly confirmed by the master. If the operator is correct, the task is not running and this is a terminal state; if the operator is mistaken, the task might still be running, and might return to the RUNNING state in the future. After Marathon marks the task as failed, it expunges the task and starts a new one.

If the task was configured to use [Local Persistent Volumes](/1.13/storage/persistent-volume), these will be abandoned given that the agent is considered to be gone and not able to offer those volumes. A new task will be created as a replacement, with new volumes for its use.

```
case TASK_FINISHED => Finished
```
The task finished successfully.

```
case TASK_UNKNOWN => Unknown
```
The master has no knowledge of the task. This is typically because either (a) the master never had knowledge of the task, or (b) the master forgot about the task because it garbage collected its metadata about the task. The task may or may not still be running. When Marathon receives the Unknown message, it expunges the task and starts a new one.

```
case TASK_KILLED => Killed
```
The task was killed by the executor.

# Non-terminal states

```
case TASK_STAGING => Staging
```
Initial state: task is staging.

```
case TASK_STARTING => Starting
```
The task is being launched by the executor.

```
case TASK_RUNNING => Running
```
Task is running.

```
case TASK_KILLING => Killing
```
The task is being killed by the executor.

```
case TASK_UNREACHABLE => Unreachable
```
The task was running on an agent that has lost contact with the master, typically due to a network failure or partition. The task may or may not still be running. When Marathon receives a "task unreachable" message, it starts a replacement task. If the time unreachable exceeds 15 minutes, Marathon marks the task as Unknown and then expunges the task.

