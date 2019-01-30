---
layout: layout.pug
navigationTitle:  Adding Agent Nodes
title: Adding Agent Nodes
menuWeight: 800
excerpt: Adding agent nodes to an existing DC/OS cluster
enterprise: false
---

Agent nodes are designated as [public](/latest/overview/concepts/#public-agent-node) or [private](/latest/overview/concepts/#private-agent-node) during installation. By default, they are designated as private during the GUI or CLI [installation](/latest/installing/evaluation/).

## Prerequisites:

*   DC/OS is installed using the [custom](/latest/installing/production/deploying-dcos/installation/) installation method.
*   The archived DC/OS installer file (`dcos-install.tar`) from your [installation](/latest/installing/evaluation/).
*   Available agent nodes that satisfy the [system requirements](/latest/installing/production/system-requirements/).
*   The CLI JSON processor [jq](https://github.com/stedolan/jq/wiki/Installation).
*   SSH installed and configured. This is required for accessing nodes in the DC/OS cluster.

## Install DC/OS agent nodes
Copy the archived DC/OS installer file (`dcos-install.tar`) to the agent node. This archive is created during the GUI or CLI [installation](/latest/installing/evaluation/#backup).

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

## Verify node type

You can verify the node type by running these commands from the DC/OS CLI.


-   Run this command to count the private agents.

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public == null) | .id' | wc -l
     ```
 
-   Run this command to count the public agents.

    ```bash
    dcos node --json | jq --raw-output '.[] | select(.reserved_resources.slave_public != null) | .id' | wc -l
     ```
 
 
