---
layout: layout.pug
navigationTitle:  Updating Nodes
title: Updating Nodes
menuWeight: 801
excerpt: Updating agent nodes in an active DC/OS cluster
enterprise: false
render: mustache
model: ../../data.yml
---

You can update agent nodes in an active DC/OS cluster by using maintenance windows or by manually killing agents. Maintenance windows are the preferred method since this is generally more stable and less error prone.

These steps are useful if you are downsizing a cluster, reconfiguring agent nodes, or moving a node to a new IP. When you change Mesos attributes (`⁠⁠⁠⁠/var/lib/dcos/mesos-slave-common`⁠⁠⁠⁠) or resources (⁠⁠⁠⁠`/var/lib/dcos/mesos-resources`⁠⁠⁠⁠), you must remove the agent node and re-register it with the master node under a new UUID. The master will then recognize the new attributes and resources specification.

<p class="message--warning"><strong>WARNING: </strong>All tasks that are running on the agent will be killed, because you are changing agent attributes or resources. Mesos treats a re-registered agent as a new agent.</p>

### Prerequisites:

*   [SSH installed and configured](/1.13/administering-clusters/sshcluster/). This is required when removing nodes by manually killing agents.
*   Access to the [Admin Router permissions](/1.13/overview/architecture/components/#admin-router).

# Using maintenance windows
With maintenance windows you can drain multiple nodes at the same time from outside the cluster. SSH access is not required.

You can define a maintenance schedule to evacuate your tasks prior to changing agent attributes or resources.

1.  Define a maintenance schedule. For example, here is a basic maintenance schedule JSON file with the example machines  (`machine_ids`) and maintenance window (`unavailability`) specified:

    ```json
    {
      "windows" : [
        {
          "machine_ids" : [
            { "hostname" : "10.0.2.107", "ip" : "10.0.2.107" },
            { "hostname" : "10.0.2.5", "ip" : "10.0.2.5" }
          ],
          "unavailability" : {
            "start" : { "nanoseconds" : 1 },
            "duration" : { "nanoseconds" : 3600000000000 }
          }
        }
      ]
    }
    ```

    For a more complex example, see the [maintain-agents.sh](https://github.com/vishnu2kmohan/dcos-toolbox/blob/master/mesos/maintain-agents.sh) script.

1.  Invoke the `⁠⁠⁠⁠machine/down` endpoint with the machine JSON definition specified. For example, [here](https://github.com/vishnu2kmohan/dcos-toolbox/blob/master/mesos/down-agents.sh) is a script that calls `/machine/down/`.

    <p class="message--important"><strong>IMPORTANT: </strong>Invoking <code>machine/down</code> sends a ⁠⁠⁠⁠TASK_LOST⁠⁠⁠⁠ message for any tasks that were running on the agent. Some DC/OS services, for example Marathon, will relocate tasks, but others will not, for example Kafka and Cassandra. For more information, see the DC/OS service guides and the Mesos maintenance primitives.</p>

1.  Perform your maintenance.
1.  Add the nodes back to your cluster by invoking the `⁠⁠⁠⁠machine/up` endpoint with the add agents JSON definition specified. For example:

    ```json
    [
      { "hostname" : "10.0.2.107", "ip" : "10.0.2.107" },
      { "hostname" : "10.0.2.5", "ip" : "10.0.2.5" }
    ]
    ```

# Manually killing agents
Draining nodes by using the terminate signal, SIGUSR1, is easy to integrate with automation tools that can execute tasks on nodes in parallel, for example Ansible, Chef, and Puppet.

1. Open a secure shell [SSH](/1.13/administering-clusters/sshcluster/) on the agent nodes.

1. Stop the agents by running the appropriate command.
    - For **private agents**, run:

      ```bash
      sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
      ```

    - For **public agents**, run:

      ```bash
      ⁠⁠⁠⁠sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave-public && systemctl stop dcos-mesos-slave-public'
      ```

1. Perform your maintenance.

1. Add the nodes back to your cluster by reloading the `systemd` configuration.

    ```bash
    sudo systemctl daemon-reload
    ```

    If you are performing agent maintenance without changing agent attributes or resources, continue to the next step after reloading the `systemd` configuration. If you are changing agent attributes or resources as part of updating the node, however, you should delete the `latest` symbolic link on the agent node.

    To remove the `latest` metadata pointer on the agent node, run the following command on the private and public agent nodes where you are changing agent settings:

    ```bash
    ⁠⁠⁠⁠sudo rm /var/lib/mesos/slave/meta/slaves/latest
    ```
    Continue to the next step after removing the `latest` metadata symbolic link.

1. Restart agents by running the appropriate command.
    - For **private agents**, run:

      ```bash
      sudo systemctl start dcos-mesos-slave
      ```

    - For **public agents**, run:

      ```bash
      sudo systemctl start dcos-mesos-slave-public
      ```
      
1. Check the status of the change by running the following command:

    ```bash
    sudo systemctl status dcos-mesos-slave
    ```
