---
layout: layout.pug
navigationTitle:  dcos node
title: dcos node
menuWeight: 11
excerpt: Displaying DC/OS node information
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos node` commands allow you to view DC/OS node information.

**This command is deprecated since DC/OS 1.13, use `dcos node list` instead.**

# Usage

```bash
dcos node [OPTION]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |
| `--info`   |  Displays a short description of this subcommand. |
| `--json`   |    Displays JSON-formatted data. |
| `--version`   |  Displays version information. |


# Example

```bash
dcos node
Getting the list of nodes from `dcos node` is deprecated. Please use `dcos node list`.
   HOSTNAME        IP            PUBLIC IP(S)                       ID                            TYPE            REGION          ZONE
  10.0.2.221   10.0.2.221       213.61.89.166       02b1bdc8-2bac-44a0-81ff-65816936b97b-S1   agent            aws/us-west-2  aws/us-west-2a
  10.0.5.54    10.0.5.54        213.61.89.167       02b1bdc8-2bac-44a0-81ff-65816936b97b-S0   agent (public)   aws/us-west-2  aws/us-west-2a
master.mesos.  10.0.6.122       213.61.89.168       02b1bdc8-2bac-44a0-81ff-65816936b97b      master (leader)  aws/us-west-2  aws/us-west-2a
```

# Commands

