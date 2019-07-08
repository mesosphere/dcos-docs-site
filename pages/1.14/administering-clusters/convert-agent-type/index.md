---
layout: layout.pug
navigationTitle:  Converting Agent Node Types
title: Converting Agent Node Types
menuWeight: 700
excerpt: Converting agent nodes to public or private agent nodes.
enterprise: false
render: mustache
model: /1.14/data.yml
---

You can convert agent nodes to public or private for an existing DC/OS cluster.

Agent nodes are designated as [public](/1.14/overview/concepts/#public-agent-node) or [private](/1.14/overview/concepts/#private-agent-node) during installation. By default, they are designated as `private` during [GUI][1] or [CLI][2] installation.

### Prerequisites:
These steps must be performed on a machine that is configured as a DC/OS node. Any tasks that are running on the node will be terminated during this conversion process.

1.   Install DC/OS using the [custom](/1.14/installing/evaluation/) installation method. 
2.  Deploy at least one [master](/1.14/overview/concepts/#master) and one [private](/1.14/overview/concepts/#private-agent-node) agent node.
*   Retrieve the archived DC/OS installer file (`dcos-install.tar`) from your [installation](/1.14/installing/evaluation/#backup).     
*   Install the CLI JSON processor [jq](https://github.com/stedolan/jq/wiki/Installation).
*   Install and configure SSH. This is required to access nodes in the DC/OS cluster.

### Determine the node type
You can determine the node type by running this command from the DC/OS CLI.

-   Run this command to determine how many private agents are there in the cluster. A result of `0` indicates that there are no private agents.

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public == null) | .id' | wc -l
    ```

-   Run this command to determine how many public agents are there in the cluster. A result of `0` indicates that there are no public agents.

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public != null) | .id' | wc -l
    ```

### Uninstall the DC/OS private agent software

1.  Uninstall DC/OS on the agent node.

    ```bash
    sudo /opt/mesosphere/bin/dcos-shell
    sudo -i pkgpanda uninstall
    sudo systemctl stop dcos-mesos-slave
    sudo systemctl disable dcos-mesos-slave
    ```

1.  Remove the old directory structures on the agent node.

    ```bash
    sudo rm -rf /etc/mesosphere /opt/mesosphere /var/lib/mesos /var/lib/dcos
    ```

1.  Restart the machine.

    ```bash
    sudo reboot
    ```

### Install DC/OS and convert agent node

1. Copy the archived DC/OS installer file (`dcos-install.tar`) to the node that that is being converted. This archive is created during the GUI or CLI [installation](/1.14/installing/evaluation/) method.

1.  Copy the files to your agent node. For example, you can use Secure Copy (scp) to copy `dcos-install.tar` to your home directory:

    ```bash
    scp ~/dcos-install.tar $username@$node-ip:~/dcos-install.tar
    ```

2.  SSH to the machine:

    ```bash
    ssh $USER@$AGENT
    ```

1.  Create a directory for the installer files:

     ```bash
     sudo mkdir -p /opt/dcos_install_tmp
     ```

1.  Unpackage the `dcos-install.tar` file:

    ```bash
    sudo tar xf dcos-install.tar -C /opt/dcos_install_tmp
    ```

1.  Run this command to install DC/OS on your agent nodes. You must designate your agent nodes as public or private.

    Private agent nodes:

    ```bash
    sudo bash /opt/dcos_install_tmp/dcos_install.sh slave
    ```

    Public agent nodes:

    ```bash
    sudo bash /opt/dcos_install_tmp/dcos_install.sh slave_public
    ```

 [1]: /1.14/installing/evaluation/
 [2]: /1.14/installing/evaluation/
