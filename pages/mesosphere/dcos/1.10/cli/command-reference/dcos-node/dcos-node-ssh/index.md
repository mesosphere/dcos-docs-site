---
layout: layout.pug
navigationTitle:  dcos node ssh
title: dcos node ssh
menuWeight: 6
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Establish an SSH connection to the master or agent nodes of your DC/OS cluster.

# Usage

```bash
dcos node ssh <command> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--config-file=<path>`   |             | Path to SSH configuration file. |
| `--leader`   |             |  The leading master. |
| `--master`   |             |  This option is deprecated and is replaced by `--leader`. |
| `--master-proxy`   |             | Proxy the SSH connection through a master node. This can be useful when accessing DC/OS from a separate network. For example, in the default AWS configuration, the private agents are unreachable from the public internet. You can access them using this option, which will proxy the SSH connection through the publicly reachable master. |
| `--option SSHOPT=VAL`   |             | The SSH options. For more information, enter `man ssh_config` in your terminal. |
| `--mesos-id=<mesos-id>`   |             | The agent ID of a node. |
| `--slave=<agent-id>`   |             | This option is deprecated and is replaced by `--mesos-id`. |
| `--user=<user>`   |   `core`   | The SSH user. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<command>`   |             | Command to execute on the DCOS cluster node. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/1.10/cli/command-reference/dcos-node/) | View DC/OS node information. | 

# Examples

For an example, see the [documentation](/mesosphere/dcos/1.10/administering-clusters/sshcluster/).
