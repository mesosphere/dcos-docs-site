---
layout: layout.pug
navigationTitle:  dcos node ssh
title: dcos node ssh
menuWeight: 15
excerpt: Establishing an SSH connection to master or agent nodes
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos node ssh` command allows you to establish an SSH connection to the master or agent nodes of your DC/OS cluster.

# Usage

```bash
dcos node ssh (--leader | --mesos-id=<mesos-id> | --private-ip=<private-ip>) [--config-file=<path>]  [--user=<user>]  [--master-proxy]  [--option SSHOPT=VAL ...]  [--proxy-ip=<proxy-ip>]  [<command>]
```

# Options

| Name | Default | Description |
|---------|-------------|-------------|
| `--leader`   |             |  The leading master. |
| `--mesos-id=<mesos-id>`   |             | The agent ID of a node. |
| `--private-ip=<private-ip>` |  |  Agent node with the provided private IP. |
| `--config-file=<path>`   |             | Path to SSH configuration file. |
| `--user=<user>`   |   `core`   | The SSH user. |
| `--master-proxy`   |             | Proxy the SSH connection through a master node. This can be useful when accessing DC/OS from a separate network. For example, in the default AWS configuration, the private agents are unreachable from the public internet. You can access them using this option, which will proxy the SSH connection through the publicly reachable master. |
| `--option SSHOPT=VAL`   |             | The SSH options. For more information, enter `man ssh_config` in your terminal. |
| `--proxy-ip=<proxy-ip>`  |  | Proxy the SSH connection through a different IP address.  |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<command>`   | Command to execute on the DCOS cluster node. |


# Examples

For an example, see the [documentation](/1.14/administering-clusters/sshcluster/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |
