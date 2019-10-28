---
layout: layout.pug
navigationTitle:  Decommission Nodes
title: Decommission Nodes
menuWeight: 15
excerpt: Decommissioning nodes
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

In order to support cloud bursting by adding nodes, you also must support decomissioning nodes. Deleting a node involves two steps: telling DC/OS to mark the node as `GONE`, and stopping the corresponding Mesos slave `systemd` unit.

If your node has gone down in an unplanned way, you only have to [decommission the node](/mesosphere/dcos/2.0/administering-clusters/delete-node/#decommission-the-node/).

<p class="message--warning"><strong>WARNING: </strong>You should decommission a node only if the node will never be coming back (for example, the EC2 VM is destroyed). Once a node is decommissioned, the corresponding agent ID is marked as GONE internally and not allowed to come back and re-register with the master. Any tasks running on the node are transitioned to <code>TASK_GONE_BY_OPERATOR</code> state.</p>


# Shut down the node

1. [SSH to the agent node](/mesosphere/dcos/2.0/administering-clusters/sshcluster/) you wish to shut down.

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

When Mesos detects that a node has stopped, it puts the node in the `UNREACHABLE` state because Mesos does not know if the node is temporarily stopped and will come back online, or if it is permanently stopped. You can explicitly tell Mesos to put a node in the `GONE` state if you know a node will not come back.

You should decommission nodes in the following situations.

- You are deleting a node, especially if you are deleting multiple nodes. DC/OS is configured to only allow one node to be marked `UNREACHABLE` every 20 minutes, so if you do not explicity decommission nodes, it can take a long time for Mesos to mark your nodes as `UNREACHABLE` and allow services to reschedule tasks on another node.

- If you are working with stateful services, like the [DC/OS data services](/mesosphere/dcos/services/). It is expensive for stateful services to reschedule tasks, so the services need to know that an agent is not going to come back online before they reschedule.

- When a node has gone down in an unplanned way.

Enter the following command from the DC/OS CLI to identify the node that is to be decomissioned.

```
dcos node 
```

Enter the following command from the DC/OS CLI to tell Mesos to mark a node as `GONE`.

```
dcos node decommission <mesos-agent-id>
```

After the node has been decommissioned (this is equivalent to using the `MARK_AGENT_GONE` Mesos API), the node will be told to perform the following tasks:
- Shut down (kill) all executors (tasks) running on the agent node
- Stop the Mesos slave process (but it will get automatically re-started by `systemd`)


# Shut down the node

If the DC/OS node is still running, the Mesos slave process will continue to try to register (and be disallowed, due to the agent being marked gone).  You can stop these attempts by stopping the Mesos slave process, which is run as a `systemd` unit.

1. [SSH to the agent node](/mesosphere/dcos/2.0/administering-clusters/sshcluster/) you wish to shut down.

1. Enter the following commands to stop the node.

  -  **Private agent**

  ```bash
  sudo sh -c 'systemctl stop dcos-mesos-slave'
  ```
  -  **Public agent**

  ```bash
  ⁠⁠⁠⁠sudo sh -c 'systemctl stop dcos-mesos-slave-public'
  ```
