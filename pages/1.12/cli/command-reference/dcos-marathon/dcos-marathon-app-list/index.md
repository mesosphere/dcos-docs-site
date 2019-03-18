---
layout: layout.pug
navigationTitle:  dcos marathon app list
title: dcos marathon app list
menuWeight: 3
excerpt: Displaying all installed applications
enterprise: false
---


# Description

The `dcos marathon app list` will display a list of the installed applications.

# Usage

```bash
dcos marathon app list [OPTION]
```

# Options

| Name |  Description |
|---------|-------------|
| `--json`   |   Displays JSON-formatted data. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.12/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


# Example

```bash
dcos marathon app list
ID             MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/datastax-dse  1024   1     1/1    1/1       ---      False       N/A     export...      
/spark         1024   1     0/1    0/0      scale     False      DOCKER   /sbin/init.sh  
```