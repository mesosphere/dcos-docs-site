---
layout: layout.pug
navigationTitle:  Decommission Nodes
title: Decommission Nodes
menuWeight: 15
excerpt: How to decommission nodes
enterprise: false
---

In order to get cloud bursting by adding nodes, you need to decomission nodes. Deleting a node involves two general steps: stopping the node, and then telling DC/OS to mark the node as `GONE`.

If your node has gone down in an unplanned way, skip to the Decomission the Node section.

# Shut down the node

1. [SSH to the agent node](/1.11/administering-clusters/sshcluster/) you wish to shut down.

1. Enter the following commands to stop the node.

  -  **Private agent**

  ```bash
  sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
  ```
  -  **Public agent**

  ```bash
  ⁠⁠⁠⁠sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave-public && systemctl stop dcos-mesos-slave-public'
  ```

# Decommission the node

When Mesos detects that a node has stopped, it puts the node in the `UNREACHABLE` state because Mesos does not know if the node is temporarily stopped and will come back online, or if it is permanently stopped. You must explicitly tell Mesos to put a node in the `GONE` state if you know a node will not come back.

Decommission a node only *after* that node is completely gone (including its on-disk state) and never coming back (e.g., the EC2 VM destroyed). Once a node is decommissioned, the corresponding agent ID is marked as `GONE` internally and not allowed to come back and re-register with the master. Any tasks running on the node are transitioned to `TASK_GONE_BY_OPERATOR` state.

You should deommission nodes in the following situations:

- You are deleting a node, especially if you are deleting multiple nodes. DC/OS is configured to only allow one node to be marked `UNREACHABLE` every 20 minutes, so if you do not explicity decommission nodes, it can take a long time for Mesos to mark your nodes as `UNREACHABLE` and allow services to reschedule tasks on another node.

- If you are working with stateful services, like the [DC/OS data services](/services/). It is expensive for stateful services to reschedule tasks, so the services need to know that an agent is not going to come back online before they reschedule.

- When a node has gone down in an unplanned way.

Enter the following command from the DC/OS CLI to tell Mesos to mark a node as `GONE`.

```
dcos node decommission
```

**Note:** You should decommission a node only *after* that node is completely gone (including its on disk state) and never coming back (e.g., EC2 VM destroyed). Once a node is decommissioned, the corresponding agent ID is marked as `GONE` internally and not allowed to come back and re-register with the master. Any tasks running on the node are transitioned to `TASK_GONE_BY_OPERATOR` state.
