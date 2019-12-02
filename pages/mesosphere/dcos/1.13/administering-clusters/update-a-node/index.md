---
layout: layout.pug
navigationTitle:  Updating Nodes
title: Updating Nodes
menuWeight: 801
excerpt: Updating agent nodes in an active DC/OS cluster
enterprise: false
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---

You can update agent nodes in an active DC/OS cluster by using maintenance windows or by manually killing agents. Maintenance windows are the preferred method since this is generally more stable and less error prone.

These steps are useful if you are downsizing a cluster, reconfiguring agent nodes, or moving a node to a new IP. When you change Mesos attributes (`⁠⁠⁠⁠/var/lib/dcos/mesos-slave-common`⁠⁠⁠⁠) or resources (⁠⁠⁠⁠`/var/lib/dcos/mesos-resources`⁠⁠⁠⁠), you must remove the agent node and re-register it with the master node under a new UUID. The master will then recognize the new attributes and resources specification.

<p class="message--warning"><strong>WARNING: </strong>All tasks that are running on the agent will be killed, because you are changing agent attributes or resources. Mesos treats a re-registered agent as a new agent.</p>

### Prerequisites:

*   [SSH installed and configured](/mesosphere/dcos/1.13/administering-clusters/sshcluster/). This is required when removing nodes by manually killing agents.
*   Access to the [Admin Router permissions](/mesosphere/dcos/1.13/overview/architecture/components/#admin-router).

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

1.  Using that maintenance schedule JSON file, create the maintenance window. This script can be used to do so:

    ```shell
    #!/usr/bin/env bash
    
    set -o errexit -o nounset -o pipefail
    
    maintenance_json_file=$1
    
    # Set maintenance window to start five minutes from now
    unavailability_start=$(python -c \
        "import time; print(int(time.time()*1000000000)+60000000000)")
    
    machines=$(jq -e '[.windows[].machine_ids[].ip]' \
        "${maintenance_json_file}")
    echo "Setting a Maintenance Schedule for the following machines: ${machines}"
    
    # Substitute unavailability.start.nanoseconds from 1 to unavailability_start
    maintenance_json=$(jq -er \
        ".windows[].unavailability.start.nanoseconds=$unavailability_start" \
        "${maintenance_json_file}")
    echo "Maintenance Schedule: $maintenance_json"
    
    curl -skSL \
        -X POST \
        -d "${maintenance_json}" \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H "Content-Type: application/json" \
        "$(dcos config show core.dcos_url)/mesos/maintenance/schedule" | \
        jq -er '.'
    
    echo "Maintenance Status:"
    curl -skSL \
        -X GET \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H "Content-Type: application/json" \
        "$(dcos config show core.dcos_url)/mesos/maintenance/status" |\
        jq -er '.'
    ```

1.  Define a machine definition JSON file:

    ```json
    [
      { "hostname" : "10.0.2.107", "ip" : "10.0.2.107" },
      { "hostname" : "10.0.2.5", "ip" : "10.0.2.5" }
    ]
    ```

1.  Using that file, invoke the `machine/down` endpoint. This script can be used to do so:

    ```shell
    #!/usr/bin/env bash
    
    set -o errexit -o nounset -o pipefail
    
    machines_json_file=$1
    
    machines=$(jq -e '[.[].ip]' \
        "${machines_json_file}")
    
    echo "Taking down the following machines for maintenance: ${machines}"
    
    curl -skSL \
        -X POST \
        -d "@${machines_json_file}" \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H "Content-Type: application/json" \
        "$(dcos config show core.dcos_url)/mesos/machine/down" |\
        jq -er '.'
    ```

    <p class="message--important"><strong>IMPORTANT: </strong>Invoking <code>machine/down</code> sends a ⁠⁠⁠⁠TASK_LOST⁠⁠⁠⁠ message for any tasks that were running on the agent. Some DC/OS services, for example Marathon, will relocate tasks, but others will not, for example Kafka and Cassandra. For more information, see the DC/OS service guides and the Mesos maintenance primitives.</p>

1.  Perform your maintenance.

1.  Add the nodes back to your cluster by invoking the `machine/up` endpoint using the machine definition JSON file. This script can be used to do so:

    ```shell
    #!/usr/bin/env bash

    set -o errexit -o nounset -o pipefail

    machines_json_file=$1

    machines=$(jq -e '[.[].ip]' \
        "${machines_json_file}")

    echo "Bringing agents back up from maintenance: ${machines}"

    curl -skSL \
        -X POST \
        -d "@${machines_json_file}" \
        -H "Authorization: token=$(dcos config show core.dcos_acs_token)" \
        -H "Content-Type: application/json" \
        "$(dcos config show core.dcos_url)/mesos/machine/up" |\
        jq -er '.'
    ```

# Manually killing agents
Draining nodes by using the terminate signal, SIGUSR1, is easy to integrate with automation tools that can execute tasks on nodes in parallel, for example Ansible, Chef, and Puppet.

1. Open a secure shell [SSH](/mesosphere/dcos/1.13/administering-clusters/sshcluster/) on the agent nodes.

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
