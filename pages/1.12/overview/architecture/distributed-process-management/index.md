---
layout: layout.pug
navigationTitle:  Distributed Process Management
title: Distributed Process Management
menuWeight: 5
excerpt: Understanding distributed process management in a DC/OS cluster
enterprise: false
---


This section describes the management of processes in a DC/OS cluster, from the resource allocation to the execution of a process. At a high level, this interaction takes place between the DC/OS components when you launch a process. Communication occurs between the different layers, such as the user interacting with the scheduler, and within a layer, for example, a master communicating with agents.

Figure 1. Distributed process management in DC/OS

*Figure 1 - Distributed process management in DC/OS*

Here is an example using the Marathon service and a user launching a container based on a Docker image:

![Example of distributed process management in DC/OS](/1.12/img/dcos-architecture-distributed-process-management-example.png)

*Figure 2 - Distributed process management in DC/OS using Marathon and Docker*

The chronological interaction between the above components looks like this. Notice that Executors and Task are folded into one block since in practice this is often the case:

![Sequence diagram for distributed process management in DC/OS](/1.12/img/dcos-architecture-distributed-process-management-seq-diagram.png)

*Figure 3 - Sequence of distributed process management in DC/OS*

In detail, here are the steps:

1. Client/Scheduler init. In this step, the Client needs to know how to connect to the Scheduler to launch a process, for example via Mesos-DNS or DC/OS CLI.
1. Mesos master sends resource offer to Scheduler; the resource offers are based on cluster resources managed through agents and the <a href="https://www.cs.berkeley.edu/~alig/papers/drf.pdf">DRF</a> algorithm in Mesos master.
1. Scheduler declines resource offers because no process requests from Clients are pending. As long as no clients have initiated a process, the scheduler will reject offers from the master.
1. Client initiates process launch. For example, this could be a user creating a Marathon app using the DC/OS [Services](/1.12/gui/services/) tab or via the HTTP endpoint `/v2/app`.
1. Mesos master sends the resource offers . For example, `cpus(*):1; mem(*):128; ports(*):[21452-21452]`.
1. If resource offer matches the requirements the Scheduler has for the process, it accepts the offer and sends a `launchTask` request to Mesos master.
1. Mesos master directs Mesos agents to launch tasks.
1. Mesos agent launches tasks via Executor.
1. Executor reports task status to Mesos agent.
1. Mesos agent reports task status to Mesos master.
1. Mesos master reports task status to scheduler.
1. Scheduler reports process status to client.


[auth]: /1.12/security/
[components]: /1.12/overview/architecture/components/
