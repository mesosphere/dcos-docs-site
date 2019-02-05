---
layout: layout.pug
navigationTitle:  Task Types
title: Task Types
menuWeight: 2
excerpt: Understanding Mesos tasks

enterprise: false
---

DC/OS can run many different kinds of workloads, which are composed of tasks. DC/OS tasks are [Mesos tasks](/1.13/overview/concepts/#mesos-task) that have been scheduled by either a DC/OS built-in scheduler or a scheduler service running on DC/OS.

# Executors

When the [scheduler](/1.13/overview/concepts/#mesos-scheduler) launches a task, it specifies a [Mesos Executor](/1.13/overview/concepts/#mesos-executor), which then executes the task. In Mesos, the scheduler and its executor(s) are called a [framework](/1.13/overview/concepts/#mesos-framework), but within the broader context of DC/OS we often use the terms "scheduler", "executor", and "task" explicitly.

### Built-in executors

Mesos includes built-in executors that are available to all schedulers, but schedulers can also use their own executors.

- Command Executor - execute shell commands or Docker containers
- Default Executor (Mesos 1.1) - execute a group of shell commands or Docker containers

For more on Mesos executors, see the [Mesos Framework Development Guide](https://mesos.apache.org/documentation/latest/app-framework-development-guide/)

## Schedulers

Because the task system is so generic, users generally do not create or interact with tasks directly. Instead, schedulers often provide higher level abstractions.

### Built-in schedulers

DC/OS has two built-in schedulers:

- The Marathon scheduler provides services (Apps and Pods), which run continuously and in parallel. For more on Marathon services, see the [Services docs](/1.13/deploying-services/) or the [Marathon docs](https://mesosphere.github.io/marathon/docs/).
- The Metronome scheduler provides jobs, which run immediately or on a defined schedule. For more on Metronome jobs, see the [Jobs docs](/1.13/deploying-jobs/).

### User space schedulers

Additional schedulers can be installed as [scheduler services](/1.13/overview/concepts/#dcos-scheduler-service) on Marathon, either from the [Mesosphere Universe](/1.13/overview/concepts/#mesosphere-universe) or directly through Marathon.

Example user space schedulers:

- The Kafka scheduler provides Kafka brokers, which run as lifecycle managed Kafka nodes.
- The Cassandra scheduler provides Cassandra nodes, which run as lifecycle managed Cassandra nodes.
- The Spark scheduler (dispatcher) provides Spark jobs, which are themselves schedulers for Spark tasks.

For a full list of installable schedulers (and other packages), see the [Mesosphere Universe package list](https://universe.dcos.io/#/).
